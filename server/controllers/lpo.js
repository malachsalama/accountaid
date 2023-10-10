const Lpo = require("../models/lpo");

// Adding a product to  the list
async function createLpo(req, res) {
  try {
    const { unique_id, description, quantity, price } = req.body;

    const newProduct = new Lpo({
      unique_id,
      description,
      quantity,
      price,
    });

    // Save the department to the database
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createLpo };
