const puppeteer = require("puppeteer");
const { TemplateHandler } = require("easy-template-x");
const db = require("../data/index.js");
const { Invoice, Company, InvoiceItem, Activity, Measure, Project } = db;
const fs = require("fs").promises;
const path = require("path");

const createInvoicePDF = async invoiceId => {
  console.log("Generating PDF for invoice:", invoiceId);

  try {
    // Зареждане на данните за фактурата с модифицирани атрибути
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
              attributes: ["id", "name", "company_name", "email", "address"]
            }
          ]
        }
      ]
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    console.log("Invoice data loaded successfully");

    // Подготовка на данните за шаблона
    const data = {
      invoiceNumber: invoice.invoice_number,
      date: invoice.invoice_date.toLocaleDateString("bg-BG"),
      dueDate: invoice.due_date.toLocaleDateString("bg-BG"),
      companyName: invoice.company.name,
      companyAddress: invoice.company.address,
      companyVAT: invoice.company.vat_number,
      companyIBAN: invoice.company.iban,
      clientName: invoice.clientCompany.name,
      clientAddress: invoice.clientCompany.address,
      items: invoice.items.map(item => ({
        activity: item.activity.name,
        measure: item.measure.name,
        quantity: parseFloat(item.quantity),
        price_per_unit: parseFloat(item.price_per_unit),
        total: parseFloat(item.total_price)
      })),
      totalAmount: parseFloat(invoice.total_amount)
    };

    console.log("Data prepared for template:", data);

    // Генериране на HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td { 
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            .header {
              margin-bottom: 30px;
            }
            .company-info {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Фактура ${data.invoiceNumber}</h1>
            <div>Дата: ${data.date}</div>
            <div>Краен срок: ${data.dueDate}</div>
          </div>
          
          <div class="company-info">
            <h3>От:</h3>
            <p>${data.companyName}</p>
            <p>${data.companyAddress}</p>
            <p>ДДС №: ${data.companyVAT || "Няма"}</p>
            <p>IBAN: ${data.companyIBAN || "Няма"}</p>
          </div>

          <div class="company-info">
            <h3>До:</h3>
            <p>${data.clientName}</p>
            <p>${data.clientAddress}</p>
          </div>

          <table>
            <tr>
              <th>Дейност</th>
              <th>Мярка</th>
              <th>Количество</th>
              <th>Ед. цена</th>
              <th>Общо</th>
            </tr>
            ${data.items
              .map(
                item => `
              <tr>
                <td>${item.activity}</td>
                <td>${item.measure}</td>
                <td>${item.quantity.toFixed(2)}</td>
                <td>${item.price_per_unit.toFixed(2)} лв.</td>
                <td>${item.total.toFixed(2)} лв.</td>
              </tr>
            `
              )
              .join("")}
          </table>

          <h3>Обща сума: ${data.totalAmount.toFixed(2)} лв.</h3>
        </body>
      </html>
    `;

    console.log("HTML content generated");

    // Генериране на PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm"
      }
    });

    await browser.close();

    console.log("PDF generated successfully");
    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

module.exports = {
  createInvoicePDF
};
