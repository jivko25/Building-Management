const puppeteer = require("puppeteer");
const { TemplateHandler } = require("easy-template-x");
const db = require("../data/index.js");
const { Invoice, Company, InvoiceItem, Activity, Measure, Project } = db;
const fs = require("fs").promises;
const path = require("path");

const createInvoicePDF = async invoiceId => {
  console.log("Generating PDF for invoice:", invoiceId);

  // Зареждане на данните за фактурата
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      {
        model: Company,
        as: "company",
        attributes: ["name", "address", "vat_number", "iban", "logo_url"]
      },
      {
        model: Company,
        as: "clientCompany",
        attributes: ["name", "address"]
      },
      {
        model: InvoiceItem,
        as: "items",
        include: [
          {
            model: Activity,
            as: "activity",
            attributes: ["id", "name", "status"]
          },
          {
            model: Measure,
            as: "measure",
            attributes: ["id", "name"]
          },
          {
            model: Project,
            as: "project",
            attributes: ["id", "name", "address"]
          }
        ]
      }
    ]
  });

  // Зареждане на шаблона
  const templatePath = path.join(__dirname, "../templates/Invoice-templat.docx");
  const template = await fs.readFile(templatePath);

  // Подготовка на данните за шаблона
  const data = {
    invoiceNumber: invoice.invoice_number,
    date: invoice.invoice_date.toLocaleDateString(),
    dueDate: invoice.due_date.toLocaleDateString(),
    companyName: invoice.company.name,
    companyAddress: invoice.company.address,
    companyVat: invoice.company.vat_number,
    companyIban: invoice.company.iban,
    clientName: invoice.clientCompany.name,
    clientAddress: invoice.clientCompany.address,
    items: invoice.items.map(item => ({
      activity: item.activity.name,
      measure: item.measure.name,
      location: item.project.address,
      quantity: item.quantity,
      price: item.price_per_unit,
      total: item.total_price
    })),
    totalAmount: invoice.total_amount
  };

  // Генериране на документа
  const handler = new TemplateHandler();
  const doc = await handler.process(template, data);

  // Конвертиране в PDF
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000 // Увеличаваме таймаута до 60 секунди
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000); // Увеличаваме таймаута за навигация
  await page.setDefaultTimeout(60000); // Увеличаваме общия таймаут

  console.log("Loading document content...");
  await page.setContent(doc.toString(), {
    waitUntil: ["load", "networkidle0"],
    timeout: 60000
  });

  console.log("Generating PDF...");
  const pdf = await page.pdf({
    format: "A4",
    timeout: 60000
  });

  console.log("Closing browser...");
  await browser.close();

  console.log("PDF generated successfully");
  return pdf;
};

module.exports = {
  createInvoicePDF
};
