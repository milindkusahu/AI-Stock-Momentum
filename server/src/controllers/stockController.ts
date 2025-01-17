import { Request, Response } from "express";
import { StockAnalysisService } from "../services/StockAnalysisService";

export class StockController {
  private stockAnalysisService: StockAnalysisService;

  constructor() {
    this.stockAnalysisService = new StockAnalysisService();
  }

  public analyzeStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symbol } = req.params;

      if (!symbol) {
        res.status(400).json({ error: "Stock symbol is required" });
        return;
      }

      // Clean the symbol
      const cleanSymbol = symbol.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      console.log(`Processing request for symbol: ${cleanSymbol}`);

      try {
        const analysis = await this.stockAnalysisService.analyzeStock(
          cleanSymbol
        );
        res.json(analysis);
      } catch (error: any) {
        if (error.message.includes("API Rate Limit")) {
          res.status(429).json({
            error: "Rate Limit Exceeded",
            message: error.message,
            retryAfter: 60, // Suggest retry after 60 seconds
          });
        } else if (error.message.includes("No data available")) {
          res.status(404).json({
            error: "Not Found",
            message: `No data available for symbol: ${cleanSymbol}`,
          });
        } else {
          throw error; // Re-throw other errors to be caught by the outer catch
        }
      }
    } catch (error: any) {
      console.error("Controller Error:", {
        symbol: req.params.symbol,
        message: error.message,
        stack: error.stack,
      });

      res.status(500).json({
        error: "Failed to analyze stock",
        message: error.message,
      });
    }
  };
}
