//server/utils/pdfGenerator.js
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
          attributes: ["name", "address", "vat_number", "iban", "logo_url", "phone", "registration_number", "email", "mol"]
        },
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails", "client_company_vat_number"]
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
              attributes: ["id", "name", "company_name", "email", "address", "location"]
            }
          ]
        }
      ]
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    console.log("Invoice data loaded successfully");

    // Formatting the invoice number
    const formatInvoiceNumber = invoiceNumber => {
      const parts = invoiceNumber.split("/");
      if (parts.length !== 2) return invoiceNumber;

      const [yearWeek, sequencePart] = parts;
      const [year, week] = yearWeek.split("-");

      return `${year}-week-${week}/${week}`;
    };

    const formattedInvoiceNumber = formatInvoiceNumber(invoice.invoice_number);
    console.log("Formatted invoice number:", formattedInvoiceNumber);

    // Preparing the data for the template
    const data = {
      invoiceNumber: formattedInvoiceNumber,
      date: invoice.invoice_date.toLocaleDateString("bg-BG"),
      dueDate: invoice.due_date.toLocaleDateString("bg-BG"),
      companyName: invoice.company.name,
      companyAddress: invoice.company.address,
      companyVAT: invoice.company.vat_number,
      companyIBAN: invoice.company.iban,
      companyLogo: invoice.company.logo_url,
      companyPhone: invoice.company.phone,
      companyRegNumber: invoice.company.registration_number,
      companyEmail: invoice.company.email,
      companyMol: invoice.company.mol,
      clientCompanyName: invoice.client.client_company_name,
      clientName: invoice.client.client_name,
      clientAddress: invoice.client.client_company_address,
      clientCompanyVATNumber: invoice.client.client_company_vat_number,
      clientIBAN: invoice.client.client_company_iban,
      clientEmails: Array.isArray(invoice.client.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client.client_emails,
      items: invoice.items.map(item => ({
        activity: item.activity.name,
        project_location: item.project.location,
        project_address: item.project.address,
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
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .invoice-info {
              flex: 1;
            }
            .company-logo {
              text-align: right;
            }
            .logo {
              max-width: 226px;
              max-height: 98px;
            }
            .info-container {
              display: flex;
              justify-content: space-between;
              gap: 40px;
              margin-bottom: 30px;
            }
            .company-info, .client-info {
              flex: 1;
              padding: 20px;
              border: 1px solid #eee;
              border-radius: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 9pt;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
              font-size: 10pt;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-info">
              <h1>Invoice ${data.invoiceNumber}</h1>
              <p>Date of issue: ${data.date}</p>
              <p>Due date: ${data.dueDate}</p>
            </div>
            <div class="company-logo">
              ${data.companyLogo ? `<img class="logo" src="${data.companyLogo}" alt="Company Logo">` : ""}
            </div>
          </div>
          
          <div class="info-container">
            <div class="client-info">
              <p>Company: ${data.clientCompanyName || "No"}</p>
              <p>Address: ${data.clientAddress || "No"}</p>
              <p>VAT number: ${data.clientCompanyVATNumber || "No"}</p>
            </div>

            <div class="company-info">
              <p>Company: ${data.companyName}</p>
              <p>Address: ${data.companyAddress}</p>
              <p>Reg. number: ${data.companyRegNumber || "No"}</p>
              <p>VAT number: ${data.companyVAT || "No"}</p>
              <p>Phone: ${data.companyPhone || "No"}</p>
              <p>${data.companyEmail || "No"}</p>
              <p>IBAN: ${data.companyIBAN || "No"}</p>
              <p>For Contact: ${data.companyMol || "No"}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items
                .map(
                  item => `
                <tr>
                  <td>Location: ${item.project_location} <br>${item.activity}</td>
                  <td style="text-align: right">${item.quantity.toFixed(2)}</td>
                  <td style="text-align: right">${item.price_per_unit.toFixed(2)} €</td>
                  <td style="text-align: right">${item.total.toFixed(2)} €</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div style="text-align: right">
            <h3>Total amount: ${data.totalAmount.toFixed(2)} €</h3>
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
