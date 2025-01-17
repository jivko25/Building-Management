const db = require("../../../data/index.js");
const { Invoice, Artisan } = db;
const { createArtisanInvoicePDF } = require("../../../utils/pdfGenerator.js");

const getPDFArtisanInvoiceById = async (req, res, next) => {
  console.log("Generating PDF for artisan invoice ID:", req.params.id);

  try {
    // Намираме фактурата със занаятчийската информация
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
      },
      include: [
        {
          model: Artisan,
          as: "artisan",
          attributes: ["id", "name", "email", "number"]
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Artisan invoice not found"
      });
    }

    console.log("Found invoice:", invoice.invoice_number);

    // Генерираме PDF
    console.log("Generating PDF for artisan invoice");
    const pdfBuffer = await createArtisanInvoicePDF(invoice.id);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF generation failed - empty buffer");
    }

    console.log("PDF generated successfully. Size:", pdfBuffer.length, "bytes");

    // Форматираме името на файла правилно
    const fileName = `artisan-invoice-${invoice.invoice_number.replace(/\//g, "-")}.pdf`;
    console.log("Generated filename:", fileName);

    // Задаваме headers за download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Изпращаме PDF файла
    res.end(pdfBuffer);

    console.log("PDF sent successfully");
  } catch (error) {
    console.error("Error generating PDF for artisan invoice:", error);
    res.status(400).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { getPDFArtisanInvoiceById };
