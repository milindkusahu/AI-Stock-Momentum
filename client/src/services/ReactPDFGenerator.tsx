import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Circle,
  Svg,
} from "@react-pdf/renderer";
import type { AnalysisResult } from "../types";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#2c3e50",
    padding: 20,
    color: "white",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#cccccc",
  },
  summaryCard: {
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderTopWidth: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 5,
    fontWeight: "bold",
  },
  metricGrid: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metricCard: {
    margin: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eeeeee",
    width: "47%",
  },
  metricTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: "#3498db",
    fontWeight: "bold",
  },
  metricValue: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  metricDescription: {
    fontSize: 10,
    color: "#555555",
  },
  bollingerCard: {
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#777777",
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
  },
  valueGreen: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  valueRed: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F44336",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    marginTop: 10,
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 10,
    color: "#555555",
  },
  aiPredictionHeader: {
    backgroundColor: "#3498db",
    padding: 10,
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    borderRadius: 3,
  },
  predictionText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 5,
    position: "relative",
  },
  confidenceFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 8,
    backgroundColor: "#3498db",
    borderRadius: 4,
  },
  confidenceLabel: {
    fontSize: 9,
    marginBottom: 10,
  },
  factorSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  factorTitle: {
    fontSize: 11,
    marginBottom: 5,
  },
  factorList: {
    marginLeft: 10,
  },
  factorItem: {
    fontSize: 9,
    marginBottom: 5,
    flexDirection: "row",
  },
  bullet: {
    width: 10,
  },
  factorText: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 8,
    color: "#777777",
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: "#777777",
  },
  symbolText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  recommendationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  recommendationColumn: {
    width: "48%",
    alignItems: "center",
  },
  columnTitle: {
    fontSize: 10,
    color: "#777777",
    marginBottom: 5,
  },
  columnValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerAlign: {
    textAlign: "center",
  },
});

// Create Document Component
const StockAnalysisPDF = ({ result }: { result: AnalysisResult }) => {
  const { recommendation, stockData, analysis } = result;

  // Function to get recommendation color
  const getRecommendationColor = () => {
    switch (recommendation) {
      case "Buy":
        return "#4CAF50";
      case "Sell":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  // Format price with Rs prefix
  const formatPrice = (price: number) => `Rs ${price.toFixed(2)}`;

  // Format date for the report
  const formatDate = () => {
    const date = new Date();
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  // Clean prediction text of any unwanted characters
  const cleanPredictionText = (text: string) => {
    return text.replace(/'(\d+\.\d+)/g, "$1");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Svg width={60} height={60}>
              <Circle cx={30} cy={30} r={25} fill="#3498db" />
              <Text style={styles.symbolText} x={30} y={35} textAnchor="middle">
                {stockData.symbol}
              </Text>
            </Svg>
          </View>
          <Text style={styles.title}>Stock Momentum Analysis</Text>
          <Text style={styles.subtitle}>
            Report generated on {formatDate()}
          </Text>
        </View>

        {/* Summary Card */}
        <View
          style={{
            ...styles.summaryCard,
            borderTopColor: getRecommendationColor(),
          }}
        >
          <Text style={{ ...styles.title, color: "#2c3e50" }}>
            {stockData.symbol}
          </Text>

          <View style={styles.recommendationCard}>
            <View style={styles.recommendationColumn}>
              <Text style={styles.columnTitle}>Current Price</Text>
              <Text style={styles.columnValue}>
                {formatPrice(stockData.currentPrice)}
              </Text>
            </View>

            <View style={styles.recommendationColumn}>
              <Text style={styles.columnTitle}>Recommendation</Text>
              <Text
                style={{
                  ...styles.columnValue,
                  color: getRecommendationColor(),
                }}
              >
                {recommendation}
              </Text>
            </View>
          </View>
        </View>

        {/* Technical Indicators */}
        <Text style={styles.sectionTitle}>Technical Indicators</Text>

        <View style={styles.metricGrid}>
          {/* RSI */}
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>RSI Analysis</Text>
            <Text style={styles.metricValue}>{stockData.rsi.toFixed(2)}</Text>
            <Text style={styles.metricDescription}>{analysis.rsiAnalysis}</Text>
          </View>

          {/* MACD */}
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>MACD Analysis</Text>
            <Text style={styles.metricValue}>{stockData.macd.toFixed(2)}</Text>
            <Text style={styles.metricDescription}>
              {analysis.macdAnalysis}
            </Text>
          </View>

          {/* Price Analysis */}
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Price Analysis</Text>
            <Text style={styles.metricValue}>
              {formatPrice(stockData.currentPrice)}
            </Text>
            <Text style={styles.metricDescription}>{analysis.maAnalysis}</Text>
          </View>

          {/* Volume Analysis */}
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Volume Analysis</Text>
            <Text style={styles.metricValue}>
              {(stockData.volume / stockData.averageVolume).toFixed(2)}x
            </Text>
            <Text style={styles.metricDescription}>
              {analysis.volumeAnalysis}
            </Text>
          </View>
        </View>

        {/* Bollinger Bands */}
        <View style={styles.bollingerCard}>
          <Text style={styles.metricTitle}>Bollinger Bands Analysis</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Upper Band</Text>
            <Text style={styles.valueGreen}>
              {formatPrice(stockData.bollingerBands.upper)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Current Price</Text>
            <Text style={styles.value}>
              {formatPrice(stockData.currentPrice)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Lower Band</Text>
            <Text style={styles.valueRed}>
              {formatPrice(stockData.bollingerBands.lower)}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.analysisText}>{analysis.bollingerAnalysis}</Text>
        </View>

        {/* AI Prediction */}
        {analysis.aiPrediction && (
          <>
            <Text style={styles.aiPredictionHeader}>
              AI Prediction Analysis
            </Text>

            <View style={styles.bollingerCard}>
              <Text style={styles.predictionText}>
                {cleanPredictionText(analysis.aiPrediction.prediction)}
              </Text>

              <View style={styles.rowBetween}>
                <View style={{ width: "70%" }}>
                  <View style={styles.confidenceBar}>
                    <View
                      style={{
                        ...styles.confidenceFill,
                        width: `${analysis.aiPrediction.confidence}%`,
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.confidenceLabel}>
                  Confidence: {analysis.aiPrediction.confidence}%
                </Text>
              </View>

              {analysis.aiPrediction.shortTermTarget && (
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>Target Price</Text>
                  <Text style={styles.value}>
                    {formatPrice(analysis.aiPrediction.shortTermTarget)}
                  </Text>
                </View>
              )}

              {/* Supporting Factors */}
              <View style={styles.factorSection}>
                <Text style={{ ...styles.factorTitle, color: "#4CAF50" }}>
                  Supporting Factors
                </Text>
                <View style={styles.factorList}>
                  {analysis.aiPrediction.supportingFactors.map(
                    (factor, index) => (
                      <View key={index} style={styles.factorItem}>
                        <Text style={styles.bullet}>• </Text>
                        <Text style={styles.factorText}>{factor}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* Risk Factors */}
              <View style={styles.factorSection}>
                <Text style={{ ...styles.factorTitle, color: "#F44336" }}>
                  Risk Factors
                </Text>
                <View style={styles.factorList}>
                  {analysis.aiPrediction.risks.map((risk, index) => (
                    <View key={index} style={styles.factorItem}>
                      <Text style={styles.bullet}>• </Text>
                      <Text style={styles.factorText}>{risk}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            DISCLAIMER: This analysis is for informational purposes only. Always
            conduct your own research before making investment decisions.
          </Text>
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber}>1</Text>
      </Page>
    </Document>
  );
};

const PDFDownloadButton: React.FC<{ result: AnalysisResult }> = ({
  result,
}) => {
  return (
    <PDFDownloadLink
      document={<StockAnalysisPDF result={result} />}
      fileName={`${result.stockData.symbol}_Analysis_${
        new Date().toISOString().split("T")[0]
      }.pdf`}
      style={{
        textDecoration: "none",
      }}
    >
      {({ loading }) => (
        <button
          type="button"
          disabled={loading}
          className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {loading ? "Generating PDF..." : "Download Report"}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export { PDFDownloadButton };
