const { Creditor, Logs } = require("../models/accounts");
const Lpo = require("../models/lpoDetails");
const Supplier = require("../models/retail");

// Adding a product to  the list
async function createLpo(req, res) {
  try {
    const { user_id } = req.user;
    const { unique_id, company_no, description, quantity, price } = req.body;

    const newProduct = new Lpo({
      user_id,
      unique_id,
      company_no,
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

    // Save the lpo to the database
    await newProduct.save();

    res.status(201).json({ message: "Lpo added successfully" });
  } catch (error) {
    console.error("Error adding Lpo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const fetchLpoData = async (req, res) => {
  try {
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const lpoItems = await Lpo.find({ user_id, status: 1 });

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
    const { user_id, username } = req.user;
    const {
      supplier,
      supplierName,
      company_no,
      kra_pin,
      usd_rate,
      lpo_no,
      date_created,
      vat,
    } = req.body;

    const action = `${username} created an LPO for ${supplier}`;
    const unique_id = lpo_no;
    const doc_type = "LPO";

    let netTotal = 0;

    if (vat === "Inc") {
      const lpoItems = await Lpo.find({ user_id, status: 1 });

      for (const lpoItem of lpoItems) {
        newPrice = (lpoItem.price / 1.16) * lpoItem.quantity;

        netTotal += newPrice;
        netTotal = (netTotal * 1.16).toFixed(2);

        await Lpo.updateOne(
          { _id: lpoItem._id },
          { $set: { price: newPrice } }
        );
      }
    } else if (vat === "Exc") {
      const lpoItems = await Lpo.find({ user_id, status: 1 });

      for (const lpoItem of lpoItems) {
        newPrice = lpoItem.price * lpoItem.quantity;

        netTotal += newPrice;
        netTotal = (netTotal * 1.16).toFixed(2);
      }
    } else if (vat === "N/A") {
      const lpoItems = await Lpo.find({ user_id, status: 1 });

      for (const lpoItem of lpoItems) {
        newPrice = lpoItem.price * lpoItem.quantity;

        netTotal += newPrice;
        netTotal = netTotal.toFixed(2);
      }
    }

    const newLpo = new Supplier({
      supplier,
      supplierName,
      company_no,
      kra_pin,
      usd_rate,
      lpo_no,
      netTotal,
      date_created,
      session: user_id,
    });

    // Validate the request data
    const validationErrors = newLpo.validateSync();
    if (validationErrors) {
      // Return validation errors to the client
      return res.status(400).json({ errors: validationErrors.errors });
    }

    // Update lpo_items to status 2 for a specific user

    const filter = { user_id: user_id, status: 1 };
    const update = { $set: { status: 2, lpo_no: lpo_no } };

    await Lpo.updateMany(filter, update);

    // save log data for the creator of the lpo to the db
    const logData = new Logs({
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();

    // Save the new Lpo to the database
    await newLpo.save();

    res.status(201).json({ message: "Lpo generated successfully" });
  } catch (error) {
    console.error("Error generating Lpo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllLposByCompany(req, res) {
  const { company_no } = req.params;

  try {
    const lpos = await Supplier.find({ company_no });
    res.status(200).json(lpos);
  } catch (error) {
    console.error("Error fetching LPOs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const fetchLpoDataForReceive = async (req, res) => {
  try {
    const lpo_no = req.query.lpo_no;
    const company_no = req.query.userData;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!lpo_no) {
      return res.status(401).json({ error: "Lpo not found" });
    }
    const lpoItems = await Lpo.find({ lpo_no, company_no });

    res.json(lpoItems);
  } catch (error) {
    console.error("Error fetching lpos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createLpo,
  fetchLpoData,
  autocomplete,
  getLpoNo,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
};
