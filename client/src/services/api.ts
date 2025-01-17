import { AnalysisResult } from "../types";

const API_URL = "https://ai-stock-momentum.vercel.app/api";

export const analyzeStock = async (symbol: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_URL}/stock/${symbol}`);

    if (!response.ok) {
      if (response.status === 429) {
        const error = await response.json();
        throw new Error(error.message);
      }
      throw new Error("Failed to analyze stock");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
