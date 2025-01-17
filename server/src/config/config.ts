import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
  apiBaseUrl: "https://www.alphavantage.co/query",
  environment: process.env.NODE_ENV || "development",
};
