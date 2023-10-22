const PDFDocument = require("pdfkit");

function generatePDF(header, details) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.fontSize(25).text("Lpo Details Pdf - Header");
    doc.text(`Supplier: ${header.supplier}`);
    doc.text(`Supplier Name: ${header.supplierName}`);
    doc.text(`KRA PIN: ${header.kra_pin}`);
    doc.text(`USD Rate: ${header.usd_rate}`);
    doc.text(`LPO Number: ${header.lpo_no}`);
    doc.text(`Net Total: ${header.netTotal}`);
    doc.moveDown();

    doc.fontSize(25).text("Lpo Details Pdf - Details");
    details.forEach((detail, index) => {
      doc.text(`Item: ${detail.unique_id}`);
      doc.text(`Description: ${detail.description}`);
      doc.text(`Quantity: ${detail.quantity}`);
      doc.text(`Price: ${detail.price}`);
      doc.text(`Total Net: ${detail.price * detail.quantity}`);
      doc.moveDown();
    });

    doc.end();
  });
}

module.exports = { generatePDF };
