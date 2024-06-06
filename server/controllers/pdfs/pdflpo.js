const PDFLpo = require("../../services/PDFLpo");
const Supplier = require("../../models/retail");

async function pdfLpo(req, res) {
  const { lpo_no } = req.query;

  try {
    // Fetch the specific LPO details based on lpo_no
    const lpo = await Supplier.findOne({ lpo_no });

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
