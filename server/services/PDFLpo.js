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
    doc.text('LOCAL PURCHASE ORDER', 50, 10, { align: "center", width: 500 });    
    
    doc.fontSize(15).text("Account Aid", 50, 20, { align: "center", width: 500 });

    doc.fontSize(15).text("Mombasa road, PO Box 974-00100", 50, 35, { align: "center", width: 500 });

    doc.fontSize(10).text(`To: ${header.supplier}`, 10, 55, { width: 200 });
    doc.fontSize(10).text(`LPO.No: ${header.lpo_no}`, 480, 55, { width: 200 });

    doc.fontSize(10).text(`Name: ${header.supplierName}`, 10, 70, { width: 200 });
    doc.fontSize(10).text(`Date: 2023-01-01`, 480, 70, { width: 200 });

    doc.fontSize(10).text(`Rep.No: ${header.session}`, 480, 80, { width: 200 });

    doc.fontSize(10).text(`Note:`, 10, 90, { width: 200 });
    doc.fontSize(10).underline(10, 110, 150, 1.0).text(`Request for the following goods`, 10, 100, { width: 200 });

    doc.fontSize(10).rect(10, 120, 120, 10).stroke().text(`ID`, 12, 120, { width: 100 });
    doc.fontSize(10).rect(131, 120, 170, 10).stroke().text(`Description:`, 132, 120, { width: 200 });
    doc.fontSize(10).rect(301, 120, 100, 10).stroke().text(`Qty`, 301, 120, { width: 100 });
    doc.fontSize(10).rect(401, 120, 100, 10).stroke().text(`Price`, 401, 120, { width: 100 });
    doc.fontSize(10).rect(501, 120, 100, 10).stroke().text(`Total`, 501, 120, { width: 100 });     

    height = 135;
    netTotal = 0;
    details.forEach((detail, index) => {      

      doc.fontSize(10).rect(10, 120, 120, 10).stroke().text(`${detail.unique_id}`, 12, height, { width: 100 });
      doc.fontSize(10).rect(131, 120, 170, 10).stroke().text(`${detail.description}:`, 132, height, { width: 200 });
      doc.fontSize(10).rect(301, 120, 100, 10).stroke().text(`${detail.quantity}`, 301, height, { width: 100 });
      doc.fontSize(10).rect(401, 120, 100, 10).stroke().text(`${detail.price}`, 401, height, { width: 100 });
      doc.fontSize(10).rect(501, 120, 100, 10).stroke().text(`${detail.price * detail.quantity}`, 501, height, { width: 100 }); 
      height += 10;
      
      const total = detail.price * detail.quantity;

      netTotal += total;
    });
    y = 680;

    vat = (netTotal * 0.16).toFixed(2);
    grand_total = (parseFloat(vat) + parseFloat(netTotal)).toFixed(2);

    doc.text("NET", 20, y);
    doc.text(netTotal, 200, y, { width: 40, align: "right" });
    y += 10;

    doc.text("VAT", 20, y);
    doc.text(vat, 200, y, { width: 40, align: "right" });
    y += 10;

    doc.text("GRAND TOTAL", 20, y);
    doc.text(grand_total, 200, y, { width: 40, align: "right" });

    

    doc.rect(5, 5, 600, 780).stroke();

    doc.end();
  });
}

module.exports = { generatePDF };
