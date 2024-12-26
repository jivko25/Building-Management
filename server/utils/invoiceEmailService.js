const { createEmail } = require("./email");

const sendInvoiceEmail = async (receiverEmail, pdfBuffer, invoiceNumber) => {
  console.log("Sending invoice email to:", receiverEmail);

  // Форматиране на номера на фактурата
  const invoiceNumberParts = invoiceNumber.split("-");
  const lastPart = invoiceNumberParts[invoiceNumberParts.length - 1];
  const formattedLastPart = lastPart.padStart(3, "0");
  const formattedInvoiceNumber = invoiceNumber.replace(lastPart, formattedLastPart);

  console.log("Formatted invoice number for email:", formattedInvoiceNumber);

  const subject = `Фактура ${formattedInvoiceNumber}`;
  const text = `Уважаеми клиент,\n\nПрикачена е фактура ${formattedInvoiceNumber}.\n\nПоздрави,\nВашият екип`;

  try {
    const attachments = [
      {
        filename: `invoice-${formattedInvoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ];

    await createEmail(receiverEmail, subject, text, attachments);
    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};

module.exports = {
  sendInvoiceEmail
};
