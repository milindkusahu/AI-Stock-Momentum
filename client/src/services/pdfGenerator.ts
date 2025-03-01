import jsPDF from "jspdf";
import type { AnalysisResult } from "../types";

export const generatePDF = (result: AnalysisResult) => {
  // Create PDF with better initial settings
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const { stockData, analysis, recommendation } = result;

  // Document dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Use "Rs" instead of rupee symbol to avoid encoding issues
  const currencySymbol = "Rs ";

  let yPosition = 15;

  // Helper function to check and add new page if needed
  const checkAndAddPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 25) {
      doc.addPage();
      yPosition = 15;
      addPageHeader();
      return true;
    }
    return false;
  };

  // Function to add page header on each page
  function addPageHeader() {
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(
      `${
        stockData.symbol
      } Analysis - Generated on ${new Date().toLocaleDateString()}`,
      margin,
      8
    );
    yPosition = 15;
  }

  // Cover Page
  addCoverPage();

  // Add page header to all subsequent pages
  doc.addPage();
  addPageHeader();

  // Technical Indicators Summary
  addTechnicalSummary();

  // Detailed Analysis Section
  addDetailedAnalysis();

  // AI Prediction Section
  if (analysis.aiPrediction) {
    addAIPredictionSection();
  }

  // Add footer to all pages
  const totalPages = doc.internal.pages.length;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the PDF
  doc.save(
    `${stockData.symbol}_Analysis_${new Date().toISOString().split("T")[0]}.pdf`
  );

  // Helper function for creating the cover page
  function addCoverPage() {
    // Header with gradient effect
    const headerHeight = 70;
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // Add logo or branding element (circular shape with stock symbol)
    doc.setFillColor(52, 152, 219);
    doc.circle(pageWidth / 2, 40, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stockData.symbol, pageWidth / 2, 45, { align: "center" });

    // Title
    yPosition = headerHeight + 20;
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(24);
    doc.text("Stock Momentum Analysis", pageWidth / 2, yPosition, {
      align: "center",
    });

    // Subtitle with date
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );

    // Summary card
    yPosition += 25;
    const cardHeight = 80;

    // Card background
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPosition, contentWidth, cardHeight, 3, 3, "F");

    // Top border with color based on recommendation
    const recommendationColors = {
      Buy: [46, 204, 113],
      Sell: [231, 76, 60],
      Hold: [243, 156, 18],
    };

    const recColor = recommendationColors[
      recommendation as keyof typeof recommendationColors
    ] || [44, 62, 80];
    doc.setFillColor(recColor[0], recColor[1], recColor[2]);
    doc.rect(margin, yPosition, contentWidth, 5, "F");

    // Stock info
    yPosition += 20;
    doc.setFontSize(28);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text(stockData.symbol, pageWidth / 2, yPosition, { align: "center" });

    // Price and recommendation in two columns
    yPosition += 15;
    const colWidth = contentWidth / 2;

    // Current Price - Left column
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Current Price", margin + colWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 10;
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${currencySymbol}${stockData.currentPrice.toFixed(2)}`,
      margin + colWidth / 2,
      yPosition,
      { align: "center" }
    );

    // Recommendation - Right column
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Recommendation",
      margin + colWidth + colWidth / 2,
      yPosition - 10,
      {
        align: "center",
      }
    );

    doc.setFontSize(18);
    doc.setTextColor(recColor[0], recColor[1], recColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(recommendation, margin + colWidth + colWidth / 2, yPosition, {
      align: "center",
    });

    // Overview summary at the bottom of the cover
    yPosition += 35;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");

    const summaryText = `This report provides a comprehensive technical analysis of ${stockData.symbol} stock based on multiple indicators including RSI, MACD, Moving Averages, Volume analysis, and Bollinger Bands. Additionally, it includes AI-powered price prediction and risk assessment.`;

    const textLines = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(textLines, pageWidth / 2, yPosition, { align: "center" });
  }

  // Helper function to add technical summary without autoTable
  function addTechnicalSummary() {
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Indicators at a Glance", margin, yPosition);

    yPosition += 5;
    doc.setDrawColor(44, 62, 80);
    doc.line(margin, yPosition, margin + 60, yPosition);

    yPosition += 15;

    // Create a custom table for summary
    const cellHeight = 10;
    const cellPadding = 3;

    // Table header
    doc.setFillColor(44, 62, 80);
    doc.rect(margin, yPosition, contentWidth, cellHeight, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    // Column widths
    const col1Width = 40;
    const col2Width = 40;
    const col3Width = contentWidth - col1Width - col2Width;

    // Draw header cells
    doc.text("Indicator", margin + cellPadding, yPosition + 7);
    doc.text("Value", margin + col1Width + cellPadding, yPosition + 7);
    doc.text(
      "Signal",
      margin + col1Width + col2Width + cellPadding,
      yPosition + 7
    );

    yPosition += cellHeight;

    // Table rows
    const indicators = [
      {
        name: "RSI",
        value: stockData.rsi.toFixed(2),
        signal: getSignalText(analysis.rsiAnalysis),
      },
      {
        name: "MACD",
        value: stockData.macd.toFixed(2),
        signal: getSignalText(analysis.macdAnalysis),
      },
      {
        name: "Moving Avg (50d)",
        value: `${currencySymbol}${stockData.movingAverage50.toFixed(2)}`,
        signal: getSignalText(analysis.maAnalysis),
      },
      {
        name: "Volume",
        value: stockData.volume.toLocaleString(),
        signal: getSignalText(analysis.volumeAnalysis),
      },
      {
        name: "Bollinger",
        value: `Mid: ${currencySymbol}${stockData.bollingerBands.middle.toFixed(
          2
        )}`,
        signal: getSignalText(analysis.bollingerAnalysis),
      },
    ];

    // Draw rows
    let isAlternate = false;
    indicators.forEach((indicator) => {
      // Alternate row coloring
      if (isAlternate) {
        doc.setFillColor(248, 249, 250);
        doc.rect(margin, yPosition, contentWidth, cellHeight, "F");
      }
      isAlternate = !isAlternate;

      // Set text color
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Draw cells
      doc.text(indicator.name, margin + cellPadding, yPosition + 7);
      doc.text(
        indicator.value,
        margin + col1Width + cellPadding,
        yPosition + 7
      );

      // Set color for signal
      if (indicator.signal === "BULLISH") {
        doc.setTextColor(46, 204, 113);
      } else if (indicator.signal === "BEARISH") {
        doc.setTextColor(231, 76, 60);
      } else {
        doc.setTextColor(243, 156, 18);
      }

      doc.text(
        indicator.signal,
        margin + col1Width + col2Width + cellPadding,
        yPosition + 7
      );

      yPosition += cellHeight;
    });

    // Reset text color
    doc.setTextColor(44, 62, 80);

    // Add space after table
    yPosition += 15;

    function getSignalText(analysis: string) {
      if (
        analysis.toLowerCase().includes("bullish") ||
        analysis.toLowerCase().includes("positive")
      ) {
        return "BULLISH";
      } else if (
        analysis.toLowerCase().includes("bearish") ||
        analysis.toLowerCase().includes("negative")
      ) {
        return "BEARISH";
      } else {
        return "NEUTRAL";
      }
    }
  }

  // Helper function to add detailed analysis
  function addDetailedAnalysis() {
    checkAndAddPage(50);

    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Technical Analysis", margin, yPosition);

    yPosition += 5;
    doc.setDrawColor(44, 62, 80);
    doc.line(margin, yPosition, margin + 60, yPosition);

    yPosition += 15;

    // Add each technical indicator with improved design
    addIndicatorCard(
      "RSI (Relative Strength Index)",
      `Value: ${stockData.rsi.toFixed(2)}`,
      analysis.rsiAnalysis
    );

    addIndicatorCard(
      "MACD",
      `MACD: ${stockData.macd.toFixed(
        2
      )} | Signal: ${stockData.signalLine.toFixed(2)}`,
      analysis.macdAnalysis
    );

    addIndicatorCard(
      "Moving Average (50-day)",
      `${currencySymbol}${stockData.movingAverage50.toFixed(2)}`,
      analysis.maAnalysis
    );

    addIndicatorCard(
      "Volume Analysis",
      `Current: ${stockData.volume.toLocaleString()} | Average: ${stockData.averageVolume.toLocaleString()}`,
      analysis.volumeAnalysis
    );

    addIndicatorCard(
      "Bollinger Bands",
      `Upper: ${currencySymbol}${stockData.bollingerBands.upper.toFixed(
        2
      )} | Middle: ${currencySymbol}${stockData.bollingerBands.middle.toFixed(
        2
      )} | Lower: ${currencySymbol}${stockData.bollingerBands.lower.toFixed(
        2
      )}`,
      analysis.bollingerAnalysis
    );
  }

  // Helper function to add indicator card
  function addIndicatorCard(
    title: string,
    value: string,
    analysisText: string
  ) {
    checkAndAddPage(70);

    // Card background
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPosition, contentWidth, 60, 3, 3, "F");

    // Indicator title with colored marker
    doc.setFillColor(52, 152, 219);
    doc.rect(margin, yPosition, 5, 15, "F");

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 10, yPosition + 10);

    // Value
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 10, yPosition + 25);

    // Analysis text
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const analysisLines = doc.splitTextToSize(analysisText, contentWidth - 20);
    doc.text(analysisLines, margin + 10, yPosition + 40);

    yPosition += 70;
  }

  // Helper function to add AI prediction section
  function addAIPredictionSection() {
    checkAndAddPage(120);

    // Section header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, yPosition, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Prediction Analysis", margin, yPosition + 10);

    yPosition += 25;

    // Prediction box
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(margin, yPosition, contentWidth, 70, 3, 3, "F");

    // Main prediction
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const predictionLines = doc.splitTextToSize(
      analysis.aiPrediction!.prediction,
      contentWidth - 20
    );
    doc.text(predictionLines, margin + 10, yPosition + 15);

    // Confidence bar
    yPosition += 35;
    const barWidth = 120;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 10, yPosition, barWidth, 8, 4, 4, "F");

    const confidenceWidth =
      barWidth * (analysis.aiPrediction!.confidence / 100);
    doc.setFillColor(41, 128, 185);
    doc.roundedRect(margin + 10, yPosition, confidenceWidth, 8, 4, 4, "F");

    doc.setFontSize(10);
    doc.text(
      `Confidence: ${analysis.aiPrediction!.confidence}%`,
      margin + barWidth + 15,
      yPosition + 6
    );

    // Target price if available
    if (analysis.aiPrediction!.shortTermTarget) {
      yPosition += 15;
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text(
        `Target Price: ${currencySymbol}${analysis.aiPrediction!.shortTermTarget.toFixed(
          2
        )}`,
        margin + 10,
        yPosition
      );
    }

    yPosition += 30;

    // Supporting factors
    addFactorsList(
      "Supporting Factors",
      analysis.aiPrediction!.supportingFactors,
      [46, 204, 113]
    );

    // Risk factors
    addFactorsList("Risk Factors", analysis.aiPrediction!.risks, [231, 76, 60]);
  }

  // Helper function to add factors list
  function addFactorsList(title: string, factors: string[], color: number[]) {
    checkAndAddPage(25 + factors.length * 15);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(margin, yPosition, 30, 5, "F");

    doc.setTextColor(44, 62, 80);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, yPosition + 15);

    yPosition += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    factors.forEach((factor) => {
      const bulletPoint = "• ";
      const factorLines = doc.splitTextToSize(factor, contentWidth - 15);

      doc.text(bulletPoint, margin, yPosition);
      doc.text(factorLines, margin + 5, yPosition);

      // Calculate height based on number of lines
      const textHeight = 10 * 0.3528 * factorLines.length;
      yPosition += textHeight + 5;
    });

    yPosition += 10;
  }

  // Helper function to add footer on all pages
  function addFooter(currentPage: number, totalPages: number) {
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Disclaimer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      "DISCLAIMER: This analysis is for informational purposes only. Always conduct your own research before making investment decisions.",
      margin,
      pageHeight - 10
    );

    // Page number
    doc.text(
      `Page ${currentPage} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }
};
