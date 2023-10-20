const { Creditor } = require("../models/accounts");
const Lpo = require("../models/lpoDetails");
const Supplier = require("../models/retail");

// Adding a product to  the list
async function createLpo(req, res) {
  try {
    const { user_id } = req.user;
    const { unique_id, description, quantity, price } = req.body;

    const newProduct = new Lpo({
      user_id,
      unique_id,
      description,
      quantity,
      price,
    });

    // Validate the request data
    const validationErrors = newProduct.validateSync();
    if (validationErrors) {
      // Return validation errors to the client
      return res.status(400).json({ errors: validationErrors.errors });
    }

    // Save the department to the database
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const fetchLpoData = async (req, res) => {
  try {
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const lpoItems = await LpoDetails.find({ user_id, status: 1 });

    res.json(lpoItems);
  } catch (error) {
    console.error("Error fetching lpos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//fetch the largest lpo number and increment it by 1
async function getLpoNo(req, res) {
  try {
    const result = await Supplier.findOne().sort({ lpo_no: -1 }).exec();

    let max_no = result ? result.lpo_no : 0;
    let lpoNo;

    if (max_no === 0) {
      lpoNo = "LPO-0001";
    } else {
      let numericPart = max_no.substring(4);

      numericPart++;
      lpoNo = "LPO-" + numericPart.toString().padStart(4, "0");
    }

    res.status(200).json(lpoNo);
  } catch (error) {
    console.error("Error getting account number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const autocomplete = async (req, res) => {
  try {
    const query = req.query.q;

    const regex = new RegExp(query, "i");

    const results = await Creditor.find({ company: { $regex: regex } });

    const suggestionList = results.map((item) => item);

    res.json(suggestionList);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching suggestions" });
  }
};

async function generateLpo(req, res) {
  try {
    const { user_id } = req.user;
    const { supplier, supplierName, kra_pin, usd_rate, lpo_no, netTotal } =
      req.body;

    const newLpo = new Supplier({
      supplier,
      supplierName,
      kra_pin,
      usd_rate,
      lpo_no,
      netTotal,
      session: user_id,
    });

    // Validate the request data
    const validationErrors = newLpo.validateSync();
    if (validationErrors) {
      // Return validation errors to the client
      return res.status(400).json({ errors: validationErrors.errors });
    }

    // Save the department to the database
    await newLpo.save();

    res.status(201).json({ message: "Lpo generated successfully" });
  } catch (error) {
    console.error("Error generating Lpo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createLpo,
  fetchLpoData,
  autocomplete,
  getLpoNo,
  generateLpo,
};
