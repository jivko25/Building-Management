//server/utils/pdfGenerator.js
const puppeteer = require("puppeteer");
const db = require("../data/index.js");
const { Invoice, Company, InvoiceItem, Activity, Measure, Project, Client, Task, Artisan, User } = db;
const translations = require("./translations/invoiceTranslations");

const getLanguageCode = languageId => {
  const languageMap = {
    1: "en", // English
    2: "bg", // Bulgarian
    3: "ro", // Romanian
    4: "ru", // Russian
    5: "tr", // Turkish
    6: "pl", // Polish
    7: "nl", // Dutch
    8: "de" // German
  };

  console.log("Getting language code for ID:", languageId);
  return languageMap[languageId] || "en"; // default to English if invalid ID
};

const createInvoicePDF = async (invoiceId, languageId) => {
  let browser;
  try {
    console.log("Starting PDF generation for invoice:", invoiceId);
    const invoice = await Invoice.findOne({
      where: { id: invoiceId },
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "vat_number", "iban", "logo_url", "phone", "registration_number", "email", "mol"]
        },
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails", "client_company_vat_number", "due_date"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity"
            },
            {
              model: Measure,
              as: "measure"
            },
            {
              model: Project,
              as: "project"
            }
          ]
        }
      ]
    });

    if (!invoice) {
      console.error("Invoice not found with ID:", invoiceId);
      throw new Error("Invoice not found");
    }

    console.log("Found invoice:", {
      id: invoice.id,
      number: invoice.invoice_number,
      itemsCount: invoice.items?.length
    });

    // Get language code
    const languageCode = getLanguageCode(languageId);
    console.log("Using language code:", languageCode);

    // Get translations
    const t = translations[languageCode];

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

    // Formatting the date
    const dateLocaleMap = {
      bg: "bg-BG",
      en: "en-US",
      ro: "ro-RO",
      ru: "ru-RU",
      tr: "tr-TR",
      pl: "pl-PL",
      nl: "nl-NL",
      de: "de-DE"
    };

    // Calculate due date based on invoice date and due_date_weeks
    const dueDate = new Date(invoice.invoice_date);
    dueDate.setDate(dueDate.getDate() + invoice.due_date_weeks * 7);

    // Preparing the data for the template
    const data = {
      invoiceNumber: formattedInvoiceNumber,
      date: invoice.invoice_date.toLocaleDateString(dateLocaleMap[languageCode]),
      dueDate: dueDate.toLocaleDateString(dateLocaleMap[languageCode]),
      dueDateWeeks: invoice.due_date_weeks,
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
      clientVATNumber: invoice.client.client_company_vat_number,
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
            <h1>${t.invoice} ${data.invoiceNumber}</h1>
            <p>${t.dateOfIssue}: ${data.date}</p>
            <p>${t.dueDate}: ${data.dueDate}</p>
          </div>
          <div class="company-logo">
            ${data.companyLogo ? `<img class="logo" src="${data.companyLogo}" alt="Company Logo">` : ""}
          </div>
        </div>
        
        <div class="info-container">
          <div class="client-info">
            <p>${t.clientCompany}: ${data.clientCompanyName || "No"}</p>
            <p>${t.address}: ${data.clientAddress || "No"}</p>
            <p>${t.vatNumber}: ${data.clientVATNumber || "No"}</p>
          </div>

          <div class="company-info">
            <p>${t.company}: ${data.companyName}</p>
            <p>${t.address}: ${data.companyAddress}</p>
            <p>${t.regNumber}: ${data.companyRegNumber || "No"}</p>
            <p>${t.vatNumber}: ${data.companyVAT || "No"}</p>
            <p>${t.phone}: ${data.companyPhone || "No"}</p>
            <p>${t.email}: ${data.companyEmail || "No"}</p>
            <p>${t.iban}: ${data.companyIBAN || "No"}</p>
            <p>${t.forContact}: ${data.companyMol || "No"}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${t.activity}</th>
              <th>${t.quantity}</th>
              <th>${t.pricePerUnit}</th>
              <th>${t.total}</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                item => `
              <tr>
                <td>${t.location}: ${item.project_location} <br>${item.activity}</td>
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
          <h3>Total Amount: ${data.totalAmount.toFixed(2)} €</h3>
        </div>

        <!-- Payment instructions footer -->
        <div style="text-align: left; margin-top: 50px; font-size: 10pt; position: absolute; bottom: 20px; width: 100%">
          <p>* All prices include VAT.</p>
          <p>* Please transfer the amount of ${data.totalAmount.toFixed(2)} € by date ${data.dueDate} to IBAN ${data.companyIBAN} by specifying the invoice number.</p>
        </div>
      </body>
    </html>
  `;

    // Подобрени настройки за Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-accelerated-2d-canvas", "--disable-gpu", "--window-size=1920x1080"],
      timeout: 60000 // увеличаваме timeout-а до 60 секунди
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); // увеличаваме navigation timeout-а

    // Задаваме viewport
    await page.setViewport({
      width: 1920,
      height: 1080
    });

    console.log("Setting page content...");
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 60000
    });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px"
      }
    });

    console.log("PDF generated successfully");
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
    }
  }
};

const createArtisanInvoicePDF = async invoiceId => {
  let browser;
  try {
    console.log("Starting PDF generation for artisan invoice:", invoiceId);
    const invoice = await Invoice.findOne({
      where: { id: invoiceId },
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "vat_number", "iban", "logo_url", "phone", "registration_number", "email", "mol"]
        },
        {
          model: Artisan,
          as: "artisan",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["full_name", "email"]
            }
          ],
          attributes: ["name", "email", "number"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity"
            },
            {
              model: Measure,
              as: "measure"
            }
          ]
        }
      ]
    });

    const formatPrice = price => {
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      return numPrice ? numPrice.toFixed(2) : "0.00";
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 200px;
              max-height: 100px;
              order: 2;
            }
            .invoice-details {
              margin-bottom: 30px;
              order: 1;
            }
            .details-container {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .recipient-info, .issuer-info {
              width: 48%;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              clear: both;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .total {
              text-align: right;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-details">
              <h2>Invoice № ${invoice.invoice_number}</h2>
              <p>Date: ${new Date(invoice.invoice_date).toLocaleDateString("bg-BG")}</p>
              <p>Due date: ${new Date(invoice.due_date).toLocaleDateString("bg-BG")}</p>
            </div>
            ${invoice.company.logo_url ? `<img src="${invoice.company.logo_url}" class="logo" />` : ""}
          </div>

          <div class="details-container">
            <div class="recipient-info">
              <h3>Recipient:</h3>
              <p>Name: ${invoice.artisan.user.full_name}</p>
              <p>Email: ${invoice.artisan.user.email}</p>
            </div>

            <div class="issuer-info">
              <h3>Issuer:</h3>
              <p>Name: ${invoice.artisan.name}</p>
              <p>Email: ${invoice.artisan.email}</p>
              <p>Phone: ${invoice.artisan.number || "N/A"}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Activity</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.activity?.name || "N/A"}</td>
                  <td>${item.quantity} ${item.measure?.name || ""}</td>
                  <td>${formatPrice(item.price_per_unit)} €</td>
                  <td>${formatPrice(item.total_price)} €</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${formatPrice(invoice.total_amount)} €</strong></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px"
      }
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating artisan PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  createInvoicePDF,
  createArtisanInvoicePDF
};
