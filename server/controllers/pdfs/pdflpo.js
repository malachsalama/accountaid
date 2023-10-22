const PDFLpo = require("../../services/PDFLpo");
const Supplier = require("../../models/retail");
const Lpo = require("../../models/lpoDetails");

async function pdfLpo(req, res) {
  const { lpo_no } = req.query;

  try {
    // Fetch the specific item details based on lpo_no
    const lpoHeader = await Supplier.findOne({ lpo_no });
    const lpoDetails = await Lpo.find({ lpo_no: lpo_no });

    if (!lpoHeader || !lpoDetails) {
      return res.status(404).send("Item not found");
    }

    // Generate a PDF with the fetched details
    const pdfBuffer = await PDFLpo.generatePDF(lpoHeader, lpoDetails);

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
