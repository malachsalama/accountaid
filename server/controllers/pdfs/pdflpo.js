const PDFLpo = require("../../services/PDFLpo");
const Company = require("../../models/company");

async function pdfLpo(req, res) {
  const { lpo_no, company_no } = req.query;

  try {
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Find the LPO within the company's LPOs
    const lpo = company.lpos.find((lpo) => lpo.lpo_no === lpo_no);

    if (!lpo) {
      return res.status(404).send("LPO not found");
    }

    // Generate a PDF with the fetched LPO details
    const pdfBuffer = await PDFLpo.generatePDF(lpo, lpo.products);

    // Send the generated PDF as a response to the client
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=lpo.pdf",
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = pdfLpo;
