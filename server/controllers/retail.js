const Supplier = require("../models/retail");
const Company = require("../models/company");
const Logs = require("../models/logs");

const fetchLpoData = async (req, res) => {
  try {
    const { user_id } = req.user;
    const latestLpoNo = await getLatestLpoNo(req, res);
    const lpo_no = latestLpoNo;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const lpoItems = await Supplier.findOne({ lpo_no, status: 1 });

    res.json(lpoItems);
  } catch (error) {
    console.error("Error fetching lpo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

    return lpoNo;
  } catch (error) {
    console.error("Error getting LPO number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getLatestLpoNo(req, res) {
  try {
    const result = await Supplier.findOne().sort({ lpo_no: -1 }).exec();

    let max_no = result ? result.lpo_no : 0;
    const lpoNo = max_no;

    return lpoNo;
  } catch (error) {
    console.error("Error getting LPO number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const autocomplete = async (req, res) => {
  try {
    const query = req.query.q;
    const { company_no } = req.query.userData;

    const regex = new RegExp(query.trim(), "i");

    // Find the company by company_no
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Filter creditors of the specified company that match the query
    const results = company.creditors.filter((creditor) =>
      creditor.creditor_name.match(regex)
    );

    // Return the complete creditor data objects
    res.json(results);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching suggestions" });
  }
};

async function generateLpo(req, res) {
  try {
    const latestLpoNo = await getLpoNo(req, res);
    const lpo_no = latestLpoNo;
    const { user_id } = req.user;
    const { username } = req.query.userData;
    const {
      supplier,
      supplierName,
      company_no,
      kra_pin,
      usd_rate,
      date_created,
      vat,
    } = req.body;

    // Fetch the company object based on company number
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Access the variables directly from the company object
    const vatVariable = 1 + company.variables[0].vat / 100;

    const action = `${username} created an LPO for ${supplier}`;
    const unique_id = lpo_no;
    const doc_type = "LPO";

    const newLpo = new Supplier({
      supplier,
      supplierName,
      company_no,
      kra_pin,
      usd_rate,
      lpo_no,
      date_created,
      session: user_id,
      vat,
      vatVariable,
      status: 1,
    });

    const logData = new Logs({
      company_no,
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();
    await newLpo.save();

    res.status(201).json({ message: "Lpo generated successfully" });
  } catch (error) {
    console.error("Error generating Lpo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Check for existing invoice number in the company's creditors
const checkInvoiceNumber = async (req, res) => {
  const { invoice_no, company_no } = req.query;

  try {
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const invoiceExists = company.creditors.some((creditor) =>
      creditor.ledger.invoices.some(
        (invoice) => invoice.invoice_no === invoice_no
      )
    );

    if (invoiceExists) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking invoice number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update LPO
const updateLpo = async (req, res) => {
  const { lpo_no } = req.params;
  const updatedData = req.body;

  try {
    const lpo = await Supplier.findOneAndUpdate({ lpo_no }, updatedData, {
      new: true,
    });

    if (!lpo) {
      return res.status(404).json({ error: "LPO not found" });
    }

    res.json(lpo);
  } catch (error) {
    console.error("Error updating LPO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function postLpoDetails(req, res) {
  try {
    const { user_id } = req.user;
    const { unique_id, company_no, description, quantity, price } = req.body;
    const { lpoUnNo } = req.query;
    const lpo_no = lpoUnNo;
    let priceAfterVatCheck;

    const existingLpo = await Supplier.findOne({
      company_no,
      lpo_no,
      status: 1,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "LPO not found" });
    }

    if (existingLpo.vat == "Inc") {
      priceAfterVatCheck = price / existingLpo.vatVariable;
    } else {
      priceAfterVatCheck = price;
    }

    const newProduct = {
      user_id,
      unique_id,
      company_no,
      description,
      quantity,
      price: priceAfterVatCheck,
    };

    existingLpo.products.push(newProduct);

    await existingLpo.save();

    res.status(201).json({ message: "product added successfully" });
  } catch (error) {
    console.error("Error adding Product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function closeLpo(req, res) {
  const { lpoUnNo, userData } = req.body;
  const { company_no, username, user_id } = userData;
  const lpo_no = lpoUnNo;
  let netTotal = 0;
  const unique_id = lpo_no;
  const doc_type = "LPO";
  const heading = "LPO APPROVAL";
  const today = new Date();
  const department = "Admin";

  try {
    const existingLpo = await Supplier.findOne({
      company_no,
      lpo_no,
      status: 1,
    });

    const company = await Company.findOne({
      company_no,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "Problem with Lpo" });
    }

    if (!company) {
      return res
        .status(400)
        .json({ error: "Problem with finding the company" });
    }

    const supplier = existingLpo.supplier;

    const action = `${username} created LPO number ${lpo_no} for ${supplier}`;

    existingLpo.products.forEach((product) => {
      netTotal += product.quantity * product.price;
    });

    netTotal = netTotal.toFixed(2);

    existingLpo.netTotal = netTotal;
    existingLpo.status = 2;

    if (existingLpo.vat == "Inc") {
      existingLpo.vat = "Exc";
    }

    const logData = new Logs({
      company_no,
      user_id,
      action,
      unique_id,
      doc_type,
    });

    const newNotification = {
      user_id,
      username,
      heading,
      body: action,
      date: today,
      status: 1,
      type: doc_type,
      unique_id: lpo_no,
      department,
    };

    company.notifications.push(newNotification);

    await logData.save();
    await company.save();
    await existingLpo.save();

    res.json("Lpo closed");
  } catch (error) {
    console.error("Error closing LPO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllLposByCompany(req, res) {
  const { company_no } = req.params;

  try {
    const lpos = await Supplier.find({ company_no, status: { $in: [2, 3] } });
    res.status(200).json(lpos);
  } catch (error) {
    console.error("Error fetching LPOs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const fetchLpoDataForReceive = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { lpo_no, company_no } = req.query;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!lpo_no) {
      return res.status(401).json({ error: "Lpo not found" });
    }
    const lpo = await Supplier.find({ lpo_no, company_no });

    res.json(lpo);
  } catch (error) {
    console.error("Error fetching lpos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the stock
async function updateStockAndEntries(req, res) {
  try {
    const { stock, entries } = req.body;
    const { company_no } = req.query;

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Add the new stock items to the company's stock array
    company.stock.push(...stock);

    // Add the new entries to the company's entries array
    company.entries.push(...entries);

    await company.save();

    res
      .status(200)
      .json({ message: "Stock and entries updated successfully!" });
  } catch (error) {
    console.error("Error updating stock and entries:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/// Delete an Lpo from the system
async function deleteLpo(req, res) {
  try {
    const { lpoId } = req.params;

    const deletedLpo = await Supplier.findOneAndDelete({ _id: lpoId });

    if (!deletedLpo) {
      return res.status(404).json({ error: "LPO not found" });
    }

    res.status(200).json({ message: "LPO deleted successfully" });
  } catch (error) {
    console.error("Error deleting LPO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function fetchStock(req, res) {
  const { company_no } = req.query;
  try {
    const company = await Company.findOne({ company_no });

    if (!company) {
      res.status(200).json("Company not Found");
    }

    const stock = company.stock;

    res.status(200).json(stock);
  } catch (error) {
    console.error("Error accessing Company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  fetchLpoData,
  autocomplete,
  getLpoNo,
  getLatestLpoNo,
  checkInvoiceNumber,
  generateLpo,
  updateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  postLpoDetails,
  closeLpo,
  updateStockAndEntries,
  deleteLpo,
  fetchStock,
};
