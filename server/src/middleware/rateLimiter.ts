import { Request, Response, NextFunction } from "express";

interface RequestTracker {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RequestTracker> = new Map();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 5; // 5 requests per minute

  cleanup(): void {
    const now = Date.now();
    for (const [key, tracker] of this.requests.entries()) {
      if (now > tracker.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  middleware = (req: Request, res: Response, next: NextFunction): void => {
    // Ensure we have an IP address
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const tracker = this.requests.get(key);

    // Clean up expired entry if exists
    if (tracker && now > tracker.resetTime) {
      this.requests.delete(key);
    }

    // If no tracker exists or was just cleaned up, create new one
    if (!this.requests.has(key)) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return next();
    }

    // Get the existing tracker
    const currentTracker = this.requests.get(key);

    if (!currentTracker) {
      return next();
    }

    // Check if limit is reached
    if (currentTracker.count >= this.MAX_REQUESTS) {
      const remainingTime = Math.ceil((currentTracker.resetTime - now) / 1000);
      res.status(429).json({
        error: "Too many requests",
        message: `Rate limit exceeded. Please try again in ${remainingTime} seconds`,
        resetTime: currentTracker.resetTime,
      });
      return;
    }

    // Increment counter and proceed
    currentTracker.count++;
    next();
  };
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
