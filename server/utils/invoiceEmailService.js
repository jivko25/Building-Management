const { createEmail } = require("./email");
const translations = require("./translations/invoiceTranslations");

const formatInvoiceNumber = invoiceNumber => {
  const parts = invoiceNumber.split("/");
  if (parts.length !== 2) return invoiceNumber;

  const [firstPart, secondPart] = parts;
  const [weekPart, numberPart] = secondPart.split("-");

  if (!numberPart) return invoiceNumber;

  const formattedNumber = numberPart.padStart(3, "0");
  return `${firstPart}/${weekPart}-${formattedNumber}`;
};

const getLanguageCode = languageId => {
  const languageMap = {
    1: "en",
    2: "bg",
    3: "ro",
    4: "ru",
    5: "tr",
    6: "pl",
    7: "nl",
    8: "de"
  };

  console.log("Getting language code for ID:", languageId);
  return languageMap[languageId] || "en";
};

const sendInvoiceEmail = async (receiverEmail, pdfBuffer, invoiceNumber, languageId) => {
  console.log("Sending invoice email to:", receiverEmail);
  console.log("Using language ID:", languageId);

  try {
    const languageCode = getLanguageCode(languageId);
    const t = translations[languageCode];

    const formattedInvoiceNumber = formatInvoiceNumber(invoiceNumber);
    console.log("Formatted invoice number for email:", formattedInvoiceNumber);

    const subject = `${t.emailSubject} ${formattedInvoiceNumber}`;
    const text = t.emailBody.replace("{invoiceNumber}", formattedInvoiceNumber);

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
