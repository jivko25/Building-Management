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

// Функция за изчисляване на номера на седмицата от дата
const getWeekNumber = date => {
  const currentDate = new Date(date);
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);

  // Връщаме числото директно, без водеща нула
  return weekNumber;
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
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails", "client_company_vat_number", "due_date", "postal_code"]
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

      return `${year}-${week}`;
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
      clientPostalCode: invoice.client.postal_code,
      items: invoice.items.map(item => ({
        activity: item.activity.name,
        project_location: item.project.location,
        project_address: item.project.address,
        project_name: item.project.name,
        measure: item.measure.name,
        quantity: parseFloat(item.quantity),
        price_per_unit: parseFloat(item.price_per_unit),
        total: parseFloat(item.total_price)
      })),
      totalAmount: parseFloat(invoice.total_amount)
    };

    const groupItemsByProjectAndActivity = items => {
      return items.reduce((groups, item) => {
        // Създаваме уникален ключ за проекта
        const projectKey = `${item.project_location} - ${item.project_name}`;

        if (!groups[projectKey]) {
          groups[projectKey] = {
            location: item.project_location,
            name: item.project_name,
            activities: {}
          };
        }

        // Преобразуваме стойностите в числа и форматираме до 2 десетични знака
        const quantity = parseFloat(item.quantity) || 0;
        const pricePerUnit = parseFloat(item.price_per_unit) || 0;
        
        // Форматираме цената за ключа с 2 десетични знака
        const formattedPrice = pricePerUnit.toFixed(2);
        const activityKey = `${item.activity}_${formattedPrice}`;

        // Групираме по име на активност и форматирана цена за единица
        if (!groups[projectKey].activities[activityKey]) {
          groups[projectKey].activities[activityKey] = {
            name: item.activity,
            quantity: 0,
            price_per_unit: pricePerUnit,
            total: 0
          };
        }

        // Сумираме количествата
        groups[projectKey].activities[activityKey].quantity += quantity;
        
        // Преизчисляваме общата сума и форматираме до 2 десетични знака
        groups[projectKey].activities[activityKey].total = 
          parseFloat((groups[projectKey].activities[activityKey].quantity * pricePerUnit).toFixed(2));

        return groups;
      }, {});
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
            min-height: 100vh;
            position: relative;
            padding-bottom: 100px; /* място за payment-instructions */
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
            margin-bottom: 30px;
            font-size: 10pt;
          }
          .client-info {
            flex: 1;
            text-align: left;
          }
          .company-info {
            flex: 1;
            text-align: right;
          }
          .info-row {
            margin-bottom: 4px;
            line-height: 1.2;
          }
          .info-label {
            font-weight: bold;
            display: inline-block;
            margin-right: 8px;
          }
          .reference-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .company-info, .client-info {
            padding: 0;
            border: none;
            border-radius: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10pt;
          }
          table tr {
            border-bottom: 2px solid #e0e0e0;
            line-height: 1.2;
          }
          table tr:last-child {
            border-bottom: none;
          }
          th, td {
            border: none;
            padding: 6px 8px;
            text-align: left;
            vertical-align: middle;
          }
          td.amount, th.amount {
            text-align: right;
          }
          /* Специален стил за клетки с две линии текст */
          td.multiline {
            line-height: 1.4;
            padding: 8px;
          }
          .header-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .company-main-info {
            text-align: left;
          }
          .company-main-info .name {
            font-weight: bold;
            margin-bottom: 4px;
          }

          .bolded {
            font-weight: bold;
          }

          .vat-info {
            margin: 20px 0;
          }

          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .invoice-left {
            text-align: left;
          }
          .invoice-right {
            text-align: right;
          }
          .project-header {
            font-weight: bold;
            padding-top: 16px;
          }
          .activity-row {
            padding-left: 20px;
          }
          tr:first-child .project-header {
            padding-top: 8px;
          }
          /* Премахваме абсолютното позициониране на футъра */
          .footer-container {
            width: 100%;
            margin-top: 40px; /* Разстояние от таблицата */
            padding: 20px 0;
          }
          /* Стилове за VAT таблицата */
          .vat-table {
            width: 95%;
            margin-left: 0;
            border: none;
            font-size: 10pt;
          }
          .vat-table td {
            border: none;
            padding: 4px 8px;
          }
          .vat-table .total-row td {
            border-top: 1px solid black;
          }
          /* Стилове за текста под таблицата */
          .payment-instructions {
            position: fixed;
            bottom: 50px;
            left: 20px;
            right: 20px;
            padding: 10px 0;
            background-color: white;
          }
          .payment-instructions p {
            margin: 4px 0;
          }
          .width-full {
            width: 100%;
          }
          .vat-section {
            margin-top: 50px;
            margin-bottom: 50px;
          }
          .payment-instructions {
            position: fixed;
            bottom: 40px;
            left: 40px;
            right: 40px;
            padding: 10px 0;
            background-color: white;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>

        <div class="header-section">
          <div class="company-main-info">
            <div class="name">${data.clientCompanyName}</div>
            <div class="info-row">${data.clientAddress}</div>
            <div class="info-row">${data.clientPostalCode}</div>
            <div class="info-row">
              <span class="info-label">${t.vatNumber}</span>
              <span>${data.clientVATNumber}</span>
            </div>
          </div>
          <div class="company-logo">
            ${data.companyLogo ? `<img class="logo" src="${data.companyLogo}" alt="Company Logo">` : ""}
          </div>
        </div>

        <div class="invoice-details">
          <div class="invoice-left">
            <div class="info-row">
              <span class="info-label">${t.invoice}: ${data.invoiceNumber}</span> 
            </div>
            <div class="info-row">
              <span class="info-label">${t.dateOfIssue}:</span> ${data.date}
            </div>
            <div class="info-row">
              <span class="info-label">${t.dueDate}:</span> ${data.dueDate}
            </div>
            <div class="info-row">
              <span class="info-label">${t.reference}:</span> Week ${getWeekNumber(data.date)}
            </div>
          </div>

          <div class="invoice-right">
            <div class="info-row bolded">${data.companyName}</div>
            <div class="info-row">${data.companyAddress}</div>
            <div class="info-row">${data.companyPhone}</div>
            <div class="info-row">${data.companyRegNumber}</div>
            <div class="info-row">${data.companyVAT}</div>
            <div class="info-row">${data.companyIBAN}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${t.description}</th>
              <th class="amount">${t.quantity}</th>
              <th class="amount">${t.pricePerUnit}</th>
              <th class="amount">Total</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(groupItemsByProjectAndActivity(data.items))
              .map(
                ([projectKey, project]) => `
                <tr>
                  <td class="project-header">
                    ${t.location}: ${projectKey}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                ${Object.values(project.activities)
                  .map(
                    activity => `
                    <tr>
                      <td class="activity-row">${activity.name}</td>
                      <td class="amount">${activity.quantity.toFixed(2)}</td>
                      <td class="amount">${activity.price_per_unit.toFixed(2)} €</td>
                      <td class="amount">${activity.total.toFixed(2)} €</td>
                    </tr>
                  `
                  )
                  .join("")}
              `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Footer container -->
        <div class="footer-container width-full">
          <!-- VAT Breakdown Table -->
          <div class="vat-section">
            <table class="vat-table width-full">
              <tr>
                <td style="text-align: left"><strong>Total excl. VAT</strong></td>
                <td style="text-align: center"><strong>VAT%</strong></td>
                <td style="text-align: center"><strong>Over</strong></td>
                <td style="text-align: right">${data.totalAmount.toFixed(2)} €</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">0%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">9%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">21%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">Shifted</td>
                <td style="text-align: center">${data.totalAmount.toFixed(2)} €</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: left">Total</td>
                <td style="text-align: right">${data.totalAmount.toFixed(2)} €</td>
              </tr>
            </table>
          </div>

          <!-- Fixed Payment instructions -->
          <div class="payment-instructions">
            <p>* ${t.paymentInstructions} <span class="bolded">${data.totalAmount.toFixed(2)} €</span> ${t.byDate} <span class="bolded">${data.dueDate}</span></p>
            <p style="margin-left: 10px;">${t.specifyInvoiceNumber}</p>
          </div>
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

const createArtisanInvoicePDF = async (invoiceId, languageId = 1) => {
  let browser;
  try {
    console.log("Starting PDF generation for artisan invoice:", invoiceId);
    const languageCode = getLanguageCode(languageId);
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
            },
            {
              model: Project,
              as: "project",
              attributes: ["name", "location"]
            }
          ]
        }
      ]
    });

    if (!invoice) throw new Error("Invoice not found");
    if (!invoice.items || invoice.items.length === 0) throw new Error("No items in invoice");

    const formatPrice = price => {
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      return numPrice ? numPrice.toFixed(2) : "0.00";
    };
    const t = translations[languageCode];

    const groupItemsByProjectAndActivity = items => {
      return items.reduce((groups, item) => {
        const project = item.project || {};
        const projectKey = `${project.location || "N/A"} - ${project.name || "N/A"}`;

        if (!groups[projectKey]) {
          groups[projectKey] = {
            location: project.location,
            name: project.name,
            activities: {}
          };
        }

        // Създаваме уникален ключ за активността, включващ цената
        const activityName = item.activity?.name || "Unknown Activity";
        const pricePerUnit = parseFloat(item.price_per_unit) || 0;
        const activityPriceKey = `${activityName}_${pricePerUnit.toFixed(2)}`;

        // Използваме комбинирания ключ за групиране
        if (!groups[projectKey].activities[activityPriceKey]) {
          groups[projectKey].activities[activityPriceKey] = {
            name: activityName,
            quantity: 0,
            price_per_unit: pricePerUnit,
            total: 0
          };
        }

        const quantity = parseFloat(item.quantity) || 0;
        groups[projectKey].activities[activityPriceKey].quantity += quantity;
        groups[projectKey].activities[activityPriceKey].total = 
          parseFloat((groups[projectKey].activities[activityPriceKey].quantity * pricePerUnit).toFixed(2));

        return groups;
      }, {});
    };

    const formatDate = dateString => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-GB");
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              text-indent: 0;
              font-family: Arial, sans-serif;
            }
            
            body { 
              padding: 40px;
              font-size: 10pt;
            }

            .header-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }

            .company-main-info {
              text-align: left;
            }

            .company-main-info .name {
              font-weight: bold;
              margin-bottom: 4px;
            }

            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin: 30px 0;
              gap: 100px;
            }

            .invoice-left {
              flex: 1;
              text-align: left;
            }

            .invoice-right {
              flex: 1;
              text-align: right;
            }

            .info-row {
              margin-bottom: 4px;
              line-height: 1.2;
            }

            .info-label {
              font-weight: bold;
              margin-right: 8px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 9pt;  /* намален размер на шрифта */
            }

            table tr {
              border-bottom: 2px solid #e0e0e0;
            }

            table tr:last-child {
              border-bottom: none;
            }

            th, td {
              border: none;  /* премахнати всички бордери */
              padding: 6px 8px;
              text-align: left;
              vertical-align: middle;
            }

            td.amount, th.amount {
              text-align: right;
            }

            .project-header {
              font-weight: bold;
              padding-top: 16px;
            }

            .activity-row {
              padding-left: 20px;
            }

            tr:first-child .project-header {
              padding-top: 8px;
            }

            tfoot tr {
              border-top: 2px solid #e0e0e0;  /* добавен бордер за total реда */
              border-bottom: none;
            }

            tfoot td {
              padding-top: 12px;
            }

                      .payment-instructions {
            position: fixed;
            bottom: 50px;
            left: 20px;
            right: 20px;
            padding: 10px 0;
            background-color: white;
          }

          .vat-section {
          margin-top: 40px}
          </style>
        </head>
        <body>
          <div class="header-section">
            <div class="company-main-info">
              <div class="name">${invoice.company.name}</div>
              <div class="info-row">${invoice.company.address || ""}</div>
              <div class="info-row">
                <span class="info-label">VAT Number</span>
                <span>${invoice.company.vat_number || ""}</span>
              </div>
            </div>
            <div class="company-logo">
              ${invoice.company.logo_url ? `<img class="logo" src="${invoice.company.logo_url}" alt="Company Logo">` : ""}
            </div>
          </div>

          <div class="invoice-details">
            <div class="invoice-left">
              <div class="info-row">
                          <div class="info-row">
              <span class="info-label">${t.invoice}: ${invoice.invoice_number}</span> 
            </div>

              <span class="info-label">${t.dateOfIssue}:</span> ${formatDate(invoice.invoice_date)}
            </div>
            <div class="info-row">
              <span class="info-label">${t.dueDate}:</span> ${formatDate(invoice.due_date)}
            </div>
            <div class="info-row">
              <span class="info-label">${t.reference}:</span> Week ${getWeekNumber(invoice.invoice_date)}

            </div>
            </div>

            <div class="invoice-right">
              <div class="info-row">${invoice.artisan.name || ""}</div>
              <div class="info-row">${invoice.artisan.email || ""}</div>
              <div class="info-row">${invoice.artisan.number || ""}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${t.description}</th>
                <th class="amount">${t.quantity}</th>
                <th class="amount">${t.pricePerUnit}</th>
                <th class="amount">${t.total}</th>

              </tr>
            </thead>
            <tbody>
              ${Object.values(groupItemsByProjectAndActivity(invoice.items))
                .map(
                  project => `
                    <tr>
                      <td class="project-header">
                        ${t.location}: ${project.location || "N/A"} - ${project.name || "N/A"}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>

                    </tr>
                    ${Object.values(project.activities)
                      .map(
                        activity => `
                          <tr>
                            <td class="activity-row">${activity.name}</td>
                            <td class="amount">${parseFloat(activity.quantity).toFixed(2)}</td>
                            <td class="amount">${parseFloat(activity.price_per_unit).toFixed(2)} €</td>
                            <td class="amount">${parseFloat(activity.total).toFixed(2)} €</td>
                          </tr>
                        `
                      )
                      .join("")}
                  `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total excl. VAT</td>
                <td class="amount" style="font-weight: bold;">${parseFloat(invoice.total_amount).toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          <!-- VAT Table -->
          <div class="vat-section">
            <table class="vat-table">
              <tr>
                <td></td>
                <td style="text-align: center">VAT%</td>
                <td style="text-align: center">Over</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">0%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">9%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">21%</td>
                <td style="text-align: center">-</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: center">Shifted</td>
                <td style="text-align: center">${parseFloat(invoice.total_amount).toFixed(2)} €</td>
                <td style="text-align: right">-</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: left">Total</td>
                <td style="text-align: right">${parseFloat(invoice.total_amount).toFixed(2)} €</td>
              </tr>
            </table>
          </div>

          <!-- Fixed Payment instructions -->
          <div class="payment-instructions">
            <p>* ${t.paymentInstructions} <span class="bolded">${parseFloat(invoice.total_amount).toFixed(2)} €</span> ${t.byDate} <span class="bolded">${formatDate(invoice.due_date)}</span></p>
            <p style="margin-left: 10px;">${t.specifyInvoiceNumber}</p>
          </div>

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
