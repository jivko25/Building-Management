const db = require("../../data/index.js");
const { Invoice, Client } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");

const getPDFClientInvoiceById = async (req, res, next) => {
  console.log("Generating PDF for client invoice ID:", req.params.id);

  try {
    // Намираме фактурата с клиентската информация
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: false
      },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["invoice_language_id"]
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Client invoice not found"
      });
    }

    console.log("Found invoice:", invoice.invoice_number);

    // Генерираме PDF
    console.log("Generating PDF with language ID:", invoice.client.invoice_language_id);
    const pdfBuffer = await createInvoicePDF(invoice.id, invoice.client.invoice_language_id);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF generation failed - empty buffer");
    }

    console.log("PDF generated successfully. Size:", pdfBuffer.length, "bytes");

    // Форматираме името на файла правилно
    const fileName = `invoice-${invoice.invoice_number.replace(/\//g, "-")}.pdf`;
    console.log("Generated filename:", fileName);

    // Задаваме headers за download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Изпращаме PDF файла с res.end вместо res.send
    res.end(pdfBuffer);

    console.log("PDF sent successfully");
  } catch (error) {
    console.error("Error generating PDF for invoice:", error);
    res.status(400).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { getPDFClientInvoiceById };
