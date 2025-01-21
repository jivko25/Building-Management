//server\index.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");
const measuresRoutes = require("./routes/measuresRoutes");
const projectRoutes = require("./routes/projectRoutes");
const artisansRoutes = require("./routes/artisansRoutes");
const companyRoutes = require("./routes/companyRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const workItemRoutes = require("./routes/workItemRoutes");
const mailRoutes = require("./routes/emailRoutes.js");
const imageRoutes = require("./routes/imageRoutes");
const defaultPricingRoutes = require("./routes/defaultPricingRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const invoiceClientRoutes = require("./routes/invoiceClientRoutes");
const invoiceArtisanRoutes = require("./routes/invoiceArtisanRoutes");
const clientRoutes = require("./routes/clientRoutes");
const languageRoutes = require("./routes/languageRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigins = [process.env.API_CORS, "http://localhost"];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use("/auth", authRoutes);
app.use("/", homeRoutes);
app.use("/", userRoutes);
app.use("/", activityRoutes);
app.use("/", measuresRoutes);
app.use("/", projectRoutes);
app.use("/", artisansRoutes);
app.use("/", companyRoutes);
app.use("/", taskRoutes);
app.use("/", workItemRoutes);
app.use("/", mailRoutes);
app.use("/", imageRoutes);
app.use("/", defaultPricingRoutes);
app.use("/clients", clientRoutes);
app.use("/languages", languageRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/invoices-client", invoiceClientRoutes);
app.use("/invoices-artisan", invoiceArtisanRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
