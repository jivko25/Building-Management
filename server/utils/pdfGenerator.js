const puppeteer = require("puppeteer");
const db = require("../data/index.js");
const { Invoice, Company, InvoiceItem, Activity, Measure, Project, Client } = db;

const createInvoicePDF = async invoiceId => {
  console.log("Generating PDF for invoice:", invoiceId);

  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "vat_number", "iban", "logo_url"]
        },
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails"]
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
      companyLogo: invoice.company.logo_url,
      clientCompanyName: invoice.client.client_company_name,
      clientName: invoice.client.client_name,
      clientAddress: invoice.client.client_company_address,
      clientIBAN: invoice.client.client_company_iban,
      clientEmails: Array.isArray(invoice.client.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client.client_emails,
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              text-indent: 0;
            }
            body { 
              font-family: Calibri, sans-serif;
              padding: 20px;
            }
            h1, h2, h3 { 
              color: black;
              font-style: normal;
              font-weight: bold;
              text-decoration: none;
            }
            h1 { font-size: 12pt; }
            h2 { font-size: 11pt; }
            h3 { font-size: 10pt; }
            .p, p { 
              color: black;
              font-style: normal;
              font-weight: normal;
              font-size: 11pt;
              margin: 0pt;
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
              font-size: 10pt;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 226px;
              max-height: 98px;
            }
            .company-info {
              margin-bottom: 20px;
            }
            .client-info {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${data.companyLogo ? `<img class="logo" src="${data.companyLogo}" alt="Company Logo">` : ""}
            <div>
              <h1>Фактура ${data.invoiceNumber}</h1>
              <p>Дата на издаване: ${data.date}</p>
              <p>Краен срок: ${data.dueDate}</p>
            </div>
          </div>
          
          <div class="company-info">
            <h3>Строителна фирма:</h3>
            <p>${data.companyName}</p>
            <p>${data.companyAddress}</p>
            <p>ДДС №: ${data.companyVAT || "Няма"}</p>
            <p>IBAN: ${data.companyIBAN || "Няма"}</p>
          </div>

          <div class="client-info">
            <h3>Клиент:</h3>
            <p>Фирма: ${data.clientCompanyName || "Няма"}</p>
            <p>Лице за контакт: ${data.clientName}</p>
            <p>Адрес: ${data.clientAddress || "Няма"}</p>
            <p>IBAN: ${data.clientIBAN || "Няма"}</p>
            <p>Имейли: ${data.clientEmails || "Няма"}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Дейност</th>
                <th>Мярка</th>
                <th>Количество</th>
                <th>Ед. цена</th>
                <th>Общо</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  item => `
                <tr>
                  <td>${item.activity}</td>
                  <td>${item.measure}</td>
                  <td style="text-align: right">${item.quantity.toFixed(2)}</td>
                  <td style="text-align: right">${item.price_per_unit.toFixed(2)} лв.</td>
                  <td style="text-align: right">${item.total.toFixed(2)} лв.</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div style="text-align: right">
            <h3>Обща сума: ${data.totalAmount.toFixed(2)} лв.</h3>
          </div>
        </body>
      </html>
    `;

    console.log("HTML content generated");

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
