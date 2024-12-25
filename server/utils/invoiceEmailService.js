const { createEmail } = require("./email");

const sendInvoiceEmail = async (receiverEmail, pdfBuffer, invoiceNumber) => {
  console.log("Sending invoice email to:", receiverEmail);

  const subject = `Фактура ${invoiceNumber}`;
  const text = `Уважаеми клиент,\n\nПрикачена е фактура ${invoiceNumber}.\n\nПоздрави,\nВашият екип`;

  try {
    const attachments = [
      {
        filename: `invoice-${invoiceNumber}.pdf`,
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
