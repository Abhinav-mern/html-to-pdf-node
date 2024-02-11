const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    res.render(
      "MyComponent",
      { username: "John" },
      async (err, htmlContent) => {
        if (err) {
          console.error("Error rendering EJS:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("about:blank", { waitUntil: "networkidle2" });
        await page.setContent(htmlContent);

        const pdf = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        res.set("Content-Type", "application/pdf");
        res.send(pdf);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
