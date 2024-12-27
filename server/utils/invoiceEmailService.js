const { createEmail } = require("./email");

const formatInvoiceNumber = invoiceNumber => {
  const parts = invoiceNumber.split("/");
  if (parts.length !== 2) return invoiceNumber;

  const [firstPart, secondPart] = parts;
  const [weekPart, numberPart] = secondPart.split("-");

  if (!numberPart) return invoiceNumber;

  const formattedNumber = numberPart.padStart(3, "0");
  return `${firstPart}/${weekPart}-${formattedNumber}`;
};

const sendInvoiceEmail = async (receiverEmail, pdfBuffer, invoiceNumber) => {
  console.log("Sending invoice email to:", receiverEmail);

  const formattedInvoiceNumber = formatInvoiceNumber(invoiceNumber);
  console.log("Formatted invoice number for email:", formattedInvoiceNumber);

  const subject = `Invoice ${formattedInvoiceNumber}`;
  const text = `Dear client,\n\nAttached is invoice ${formattedInvoiceNumber}.\n\nRegards,\nYour team`;

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
