const Company = require("../models/company");
const Logs = require("../models/logs");

const fetchLpoData = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { company_no } = req.query;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const lpo_no = await getLatestLpoNo(company_no);

    if (!lpo_no) {
      return res.status(404).json({ error: "LPO number not found" });
    }

    const company = await Company.findOne({
      "lpos.lpo_no": lpo_no,
      "lpos.status": 1,
      "lpos.session": user_id,
      company_no,
    });

    if (!company) {
      return res.status(204).send(); // No content
    }

    const lpoItems = company.lpos.find(
      (lpo) => lpo.lpo_no === lpo_no && lpo.status === 1
    );

    return res.json(lpoItems);
  } catch (error) {
    console.error("Error fetching LPO:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

async function getLpoNo(company_no) {
  try {
    const company = await Company.findOne({ company_no }).exec();

    if (!company || !company.lpos.length) {
      return "LPO-0001";
    }

    let max_no = company.lpos
      .map((lpo) => lpo.lpo_no)
      .sort()
      .pop();

    let lpoNo;
    if (max_no === "LPO-0000" || !max_no) {
      lpoNo = "LPO-0001";
    } else {
      let numericPart = parseInt(max_no.substring(4));
      numericPart++;
      lpoNo = "LPO-" + numericPart.toString().padStart(4, "0");
    }

    return lpoNo;
  } catch (error) {
    console.error("Error getting LPO number:", error);
    throw new Error("Internal server error");
  }
}

async function getLatestLpoNo(company_no) {
  try {
    const company = await Company.findOne({ company_no }).exec();

    if (!company || !company.lpos.length) {
      return "LPO-0000";
    }

    let max_no = company.lpos
      .map((lpo) => lpo.lpo_no)
      .sort()
      .pop();

    return max_no || "LPO-0000";
  } catch (error) {
    console.error("Error getting latest LPO number:", error);
    throw new Error("Internal server error");
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
    const { supplier, supplierName, kra_pin, usd_rate, date_created, vat } =
      req.body;
    const { user_id } = req.user;
    const { username, company_no } = req.query.userData;

    const lpo_no = await getLpoNo(company_no);
    if (!lpo_no) {
      return res.status(400).json({ error: "Unable to generate LPO number" });
    }

    const company = await Company.findOne({ company_no });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const vatVariable = 1 + company.variables[0].vat / 100;

    const action = `${username} created an LPO for ${supplier}`;
    const unique_id = lpo_no;
    const doc_type = "LPO";

    const newLpo = {
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
      products: [],
    };

    company.lpos.push(newLpo);

    const logData = new Logs({
      company_no,
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();
    await company.save();

    res.status(201).json({ message: "LPO generated successfully" });
  } catch (error) {
    console.error("Error generating LPO:", error);
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
  const { company_no } = req.query;
  const { lpo_no } = req.params;
  const updatedFields = req.body;

  try {
    // Find the existing LPO document
    const company = await Company.findOne({
      company_no,
      "lpos.lpo_no": lpo_no,
    });

    if (!company) {
      return res.status(404).json({ error: "LPO or Company not found" });
    }

    // Find the LPO to update
    const lpoIndex = company.lpos.findIndex((lpo) => lpo.lpo_no === lpo_no);

    if (lpoIndex === -1) {
      return res.status(404).json({ error: "LPO not found" });
    }

    // Update the specific fields of the LPO
    Object.keys(updatedFields).forEach((field) => {
      company.lpos[lpoIndex][field] = updatedFields[field];
    });

    // Save the updated company document
    await company.save();

    // Respond with the updated LPO
    const updatedLpo = company.lpos[lpoIndex];
    res.json(updatedLpo);
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

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const existingLpo = company.lpos.find(
      (lpo) => lpo.lpo_no === lpo_no && lpo.status === 1
    );

    if (!existingLpo) {
      return res.status(400).json({ error: "LPO not found" });
    }

    if (existingLpo.vat === "Inc") {
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

    await company.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
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
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const existingLpo = company.lpos.find(
      (lpo) => lpo.lpo_no === lpo_no && lpo.status === 1
    );

    if (!existingLpo) {
      return res.status(400).json({ error: "Problem with LPO" });
    }

    const supplier = existingLpo.supplier;

    const action = `${username} created LPO number ${lpo_no} for ${supplier}`;

    existingLpo.products.forEach((product) => {
      netTotal += product.quantity * product.price;
    });

    netTotal = netTotal.toFixed(2);

    existingLpo.netTotal = netTotal;
    existingLpo.status = 2;

    if (existingLpo.vat === "Inc") {
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

    res.json("LPO closed");
  } catch (error) {
    console.error("Error closing LPO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllLposByCompany(req, res) {
  const { company_no } = req.params;

  try {
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const lpos = company.lpos.filter(
      (lpo) => lpo.status === 2 || lpo.status === 3
    );

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
      return res.status(401).json({ error: "LPO not found" });
    }

    const company = await Company.findOne({
      "lpos.lpo_no": lpo_no,
      company_no,
    });

    if (!company) {
      return res.status(404).json({ error: "LPO not found" });
    }

    const lpo = company.lpos.filter((lpo) => lpo.lpo_no === lpo_no);

    res.json(lpo);
  } catch (error) {
    console.error("Error fetching LPOs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the stock
async function updateStock(req, res) {
  try {
    const { stock } = req.body;
    const { company_no } = req.query;

    // Fetch the company data including variables
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Extract variables for the company
    const { markup_price, costing } = company.variables[0];

    stock.forEach((newStockItem) => {
      const existingStockItem = company.stock.find(
        (item) => item.unique_id === newStockItem.unique_id
      );

      if (existingStockItem) {
        const currentAverageCost = existingStockItem.average_cost;

        const newAverageCost = (
          (currentAverageCost + newStockItem.price) /
          2
        ).toFixed(2);

        existingStockItem.quantity += newStockItem.quantity;
        existingStockItem.cost = newStockItem.price;
        existingStockItem.average_cost = newAverageCost;

        // Determine the price based on the company's costing method
        if (costing === "Latest Cost") {
          existingStockItem.price = (newStockItem.price * markup_price).toFixed(
            2
          );
        } else if (costing === "Average Cost") {
          existingStockItem.price = (newAverageCost * markup_price).toFixed(2);
        }
      } else {
        // For new stock items, set the price based on the costing method
        newStockItem.cost = newStockItem.price.toFixed(2);
        newStockItem.average_cost = newStockItem.price.toFixed(2);
        if (costing === "Latest Cost") {
          newStockItem.price = (newStockItem.price * markup_price).toFixed(2);
        } else if (costing === "Average Cost") {
          newStockItem.price = (newStockItem.price * markup_price).toFixed(2);
        }
        // Ensure new stock items have the cost field set
        company.stock.push(newStockItem);
      }
    });

    await company.save();

    res.status(200).json({ message: "Stock updated successfully!" });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update the entries
async function updateEntries(req, res) {
  try {
    const { entries } = req.body;
    const { company_no } = req.query;

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Add the new entries to the company's entries array
    company.entries.push(...entries);

    await company.save();

    res.status(200).json({ message: "Entries updated successfully!" });
  } catch (error) {
    console.error("Error updating entries:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/// Delete an Lpo from the system
const deleteLpo = async (req, res) => {
  const { lpoId } = req.params;
  const { company_no } = req.query;

  try {
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const lpoIndex = company.lpos.findIndex(
      (lpo) => lpo._id.toString() === lpoId
    );

    if (lpoIndex === -1) {
      return res.status(404).json({ error: "LPO not found" });
    }

    // Remove the LPO from the array
    company.lpos.splice(lpoIndex, 1);

    await company.save();

    res.status(200).json({ message: "LPO deleted successfully" });
  } catch (error) {
    console.error("Error deleting LPO:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
  checkInvoiceNumber,
  generateLpo,
  updateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  updateStock,
  updateEntries,
  postLpoDetails,
  closeLpo,
  deleteLpo,
  fetchStock,
};
