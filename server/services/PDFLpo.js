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

    doc.moveDown(4);
    
    
    doc.text('', { width: 500 });
    doc.text('LOCAL PURCHASE ORDER', 50, 20, { align: "center", width: 500 });    
    
    doc.fontSize(15).text("Account Aid", 50, 40, { align: "center", width: 500 });

    doc.fontSize(11).text("Mombasa road, PO Box 974-00100", 50, 60, { align: "center", width: 500 });

    doc.fontSize(10).text(`To: ${header.supplier}`, 10, 80, { width: 200 });
    doc.fontSize(10).text(`LPO.No: ${header.lpo_no}`, 480, 80, { width: 200 });

    doc.fontSize(10).text(`Name: ${header.supplierName}`, 10, 100, { width: 200 });
    doc.fontSize(10).text(`Date: 2023-01-01`, 480, 100, { width: 200 });

    doc.fontSize(10).text(`Rep.No: ${header.session}`, 480, 120, { width: 200 });

    doc.fontSize(10).text(`Note:`, 10, 140, { width: 200 });
    doc.fontSize(10).underline(10, 170, 150, 1.0).text(`Request for the following goods`, 10, 160, { width: 200 });

    doc.fontSize(10).rect(10, 180, 120, 15).stroke().text(`ID`, 12, 183, { width: 100 });
    doc.fontSize(10).rect(131, 180, 170, 15).stroke().text(`Description:`, 133, 183, { width: 200 });
    doc.fontSize(10).rect(301, 180, 100, 15).stroke().text(`Qty`, 303, 183, { width: 100 });
    doc.fontSize(10).rect(401, 180, 100, 15).stroke().text(`Price`, 403, 183, { width: 100 });
    doc.fontSize(10).rect(501, 180, 100, 15).stroke().text(`Total`, 503, 183, { width: 100 });     

    height = 200;
    netTotal = 0.00;
    details.forEach((detail, index) => {      

      doc.fontSize(10).text(`${detail.unique_id}`, 12, height, { width: 100 });
      doc.fontSize(10).text(`${detail.description}:`, 133, height, { width: 200 });
      doc.fontSize(10).text(`${detail.quantity}`, 303, height, { width: 100 });
      doc.fontSize(10).text(`${detail.price}`, 403, height, { width: 100 });
      doc.fontSize(10).text(`${detail.price * detail.quantity}`, 503, height, { width: 100 }); 
      height += 15;
      
      total =parseFloat(detail.price * detail.quantity).toFixed(2);

      netTotal += parseFloat(total);
    });
    y = 680;

    vat = (netTotal * 0.16).toFixed(2);
    grand_total = (parseFloat(vat) + parseFloat(netTotal)).toFixed(2);

    doc.text("NET", 400, y);
    doc.text(netTotal, 480, y, { width: 100, align: "right" });
    y += 10;

    doc.text("VAT", 400, y);
    doc.text(vat, 480, y, { width: 100, align: "right" });
    y += 10;

    doc.text("GRAND TOTAL", 400, y);
    doc.text(grand_total, 480, y, { width: 100, align: "right" });

    

    doc.rect(5, 5, 600, 780).stroke();

    doc.end();
  });
}

module.exports = { generatePDF };
