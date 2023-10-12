const Supplier  = require("../models/accounts");

// Adding a creditor to the system
async function createSupplier(req, res) { 
  console.log("req") 
  try {
   
    const { name, company, kra_pin, email, phone_no } = req.body;

    // Check if the supplier name already exists
    const existingcompany = await Supplier.findOne({ company });

    if (existingcompany) {
      return res.status(400).json({ error: "Company already exists" });
    }

    const newSupplier = new Supplier({
      name,
      company,
      kra_pin,
      email,
      phone_no,
    });

    // Save the department to the database
    await newSupplier.save();

    res.status(201).json({ message: "Supplier added successfully" });
  } catch (error) {
    console.error("Error adding Supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createSupplier,
};
