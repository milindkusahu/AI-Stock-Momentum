import jsPDF from "jspdf";
import type { AnalysisResult } from "../types";

export const generatePDF = (result: AnalysisResult) => {
  const doc = new jsPDF();
  const { stockData, analysis, recommendation } = result;

  let yPosition = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = pageWidth - 2 * margin;

  // Helper function to check and add new page if needed
  const checkAndAddPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Header box
  addBox(0, 60, [44, 62, 80]);

  // Title Section
  addText("Stock Momentum Analysis", 28, {
    isBold: true,
    align: "center",
    color: [255, 255, 255],
  });

  addText(
    "Report generated on " +
      new Date().toLocaleDateString() +
      " at " +
      new Date().toLocaleTimeString(),
    12,
    { align: "center", color: [255, 255, 255] }
  );

  // Stock Information Section
  addBox(yPosition - 10, 80, [248, 249, 250]);

  // Stock Symbol
  addText(stockData.symbol, 32, {
    isBold: true,
    align: "center",
    color: [44, 62, 80],
  });

  // Current Price
  addText("Current Price", 14, {
    color: [127, 140, 141],
  });
  addText("Rs " + stockData.currentPrice.toFixed(2), 20, {
    isBold: true,
    color: [44, 62, 80],
  });

  // Recommendation
  addText("Recommendation", 14, {
    color: [127, 140, 141],
  });

  const recommendationColors: Record<
    string,
    readonly [number, number, number]
  > = {
    Buy: [46, 204, 113] as const,
    Sell: [231, 76, 60] as const,
    Hold: [243, 156, 18] as const,
  };

  addText(recommendation, 20, {
    isBold: true,
    color:
      recommendationColors[recommendation as keyof typeof recommendationColors],
  });

  addDivider();

  // Technical Analysis Section
  addSectionTitle("Technical Analysis");

  // RSI Analysis
  addIndicatorBox(
    "RSI (Relative Strength Index)",
    "Value: " + stockData.rsi.toFixed(2),
    analysis.rsiAnalysis
  );

  // MACD Analysis
  addIndicatorBox(
    "MACD",
    "MACD: " +
      stockData.macd.toFixed(2) +
      " | Signal: " +
      stockData.signalLine.toFixed(2),
    analysis.macdAnalysis
  );

  // Moving Average
  addIndicatorBox(
    "Moving Average (50-day)",
    "Rs " + stockData.movingAverage50.toFixed(2),
    analysis.maAnalysis
  );

  // Volume Analysis
  addIndicatorBox(
    "Volume Analysis",
    "Current: " +
      stockData.volume.toLocaleString() +
      " | Average: " +
      stockData.averageVolume.toLocaleString(),
    analysis.volumeAnalysis
  );

  // Bollinger Bands
  addIndicatorBox(
    "Bollinger Bands",
    "Upper: Rs " +
      stockData.bollingerBands.upper.toFixed(2) +
      " | Middle: Rs " +
      stockData.bollingerBands.middle.toFixed(2) +
      " | Lower: Rs " +
      stockData.bollingerBands.lower.toFixed(2),
    analysis.bollingerAnalysis
  );

  addDivider();

  // AI Analysis Section
  if (analysis.aiPrediction) {
    addSectionTitle("AI Prediction Analysis");

    addText(analysis.aiPrediction.prediction, 14, {
      isBold: true,
      color: [44, 62, 80],
    });

    // Confidence Bar
    const confidenceBarY = yPosition;
    yPosition += 30;

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, confidenceBarY, 150, 10, "F");
    doc.setFillColor(41, 128, 185);
    doc.rect(
      margin,
      confidenceBarY,
      150 * (analysis.aiPrediction.confidence / 100),
      10,
      "F"
    );

    addText("Confidence: " + analysis.aiPrediction.confidence + "%", 12, {
      color: [127, 140, 141],
    });

    if (analysis.aiPrediction.shortTermTarget) {
      addText(
        "Target Price: Rs " + analysis.aiPrediction.shortTermTarget.toFixed(2),
        14,
        {
          color: [44, 62, 80],
          isBold: true,
        }
      );
    }

    // Supporting Factors and Risks
    addText("Supporting Factors", 14, {
      isBold: true,
      color: [44, 62, 80],
    });

    analysis.aiPrediction.supportingFactors.forEach((factor) => {
      addText("• " + factor, 12, { color: [127, 140, 141] });
    });

    addText("Risk Factors", 14, {
      isBold: true,
      color: [44, 62, 80],
    });

    analysis.aiPrediction.risks.forEach((risk) => {
      addText("• " + risk, 12, { color: [127, 140, 141] });
    });
  }

  // Footer
  doc.setPage(doc.internal.pages.length - 1);
  addFooter();

  // Save the PDF
  doc.save(
    stockData.symbol +
      "_Analysis_" +
      new Date().toISOString().split("T")[0] +
      ".pdf"
  );

  // Helper functions
  function addBox(
    y: number,
    height: number,
    color: readonly [number, number, number]
  ) {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(0, y, pageWidth, height, "F");
  }

  function addText(
    text: string,
    fontSize: number,
    options: {
      isBold?: boolean;
      color?: readonly [number, number, number];
      align?: "left" | "center" | "right";
    }
  ) {
    checkAndAddPage(fontSize + 10);

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", options.isBold ? "bold" : "normal");

    if (options.color) {
      doc.setTextColor(options.color[0], options.color[1], options.color[2]);
    }

    const textLines = doc.splitTextToSize(text, textWidth);
    const textHeight = fontSize * 0.3528 * textLines.length;

    let xPosition = margin;
    if (options.align === "center") xPosition = pageWidth / 2;
    else if (options.align === "right") xPosition = pageWidth - margin;

    doc.text(textLines, xPosition, yPosition, {
      align: options.align || "left",
    });
    yPosition += textHeight + 8;
  }

  function addDivider() {
    checkAndAddPage(20);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 20;
  }

  function addSectionTitle(title: string) {
    checkAndAddPage(40);
    addText(title, 22, {
      isBold: true,
      color: [41, 128, 185],
    });
    doc.line(margin, yPosition - 15, margin + 80, yPosition - 10);
  }

  function addIndicatorBox(title: string, value: string, analysis: string) {
    checkAndAddPage(80);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 60, "F");

    addText(title, 16, {
      isBold: true,
      color: [44, 62, 80],
    });

    addText(value, 14, {
      color: [44, 62, 80],
    });

    addText(analysis, 12, {
      color: [127, 140, 141],
    });

    yPosition += 10;
  }

  function addFooter() {
    const footerText =
      "DISCLAIMER: This analysis is for informational purposes only. Always conduct your own research before making investment decisions.";
    doc.setFillColor(44, 62, 80);
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
  }
};
