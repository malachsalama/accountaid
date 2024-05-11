const { Creditor, Logs } = require("../models/accounts");
const Lpo = require("../models/lpoDetails");
const Supplier = require("../models/retail");
const Variables = require("../models/variables");

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

    // res.status(200).json(lpoNo);
    return lpoNo;
  } catch (error) {
    console.error("Error getting account number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//fetch the largest lpo number
async function getLatestLpoNo(req, res) {
  try {
    const result = await Supplier.findOne().sort({ lpo_no: -1 }).exec();

    let max_no = result ? result.lpo_no : 0;
    const lpoNo = max_no;

    // res.status(200).json(lpoNo);
    return lpoNo;
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

//fetch variables as per company no
async function fetchVariables(req, res) {
  try {
    let company_no;
    if (!req.body.company_no) {
      company_no = req.query.subCompanyNo;

      const result = await Variables.findOne({ company_no });
      res.json(result);
    } else {
      company_no = req.body.company_no;

      const result = await Variables.findOne({ company_no });
      return result;
    }
  } catch (error) {
    console.error("Error fetching variables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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

    // Fetch VAT variable from Variables collection
    const result = await fetchVariables(req, res);
    const vatVariable = 1 + result.vat / 100;

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

    // Validate the request data
    const validationErrors = newLpo.validateSync();
    if (validationErrors) {
      // Return validation errors to the client
      return res.status(400).json({ errors: validationErrors.errors });
    }
    // save log data for the creator of the lpo to the db
    const logData = new Logs({
      company_no,
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

// Adding details to the lpo created
async function postLpoDetails(req, res) {
  try {
    const { user_id } = req.user;
    const { unique_id, company_no, description, quantity, price } = req.body;
    const { lpoUnNo } = req.query;
    const lpo_no = lpoUnNo;

    // Check if the department name already exists for the given company
    const existingLpo = await Supplier.findOne({
      company_no: company_no,
      lpo_no: lpo_no,
      status: 1,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "LPO not found" });
    }

    // Create a product object
    const newProduct = {
      user_id,
      unique_id,
      company_no,
      description,
      quantity,
      price,
    };

    // Update the company document with the new department
    await Supplier.updateOne(
      { company_no: company_no, lpo_no: lpo_no, status: 1 },
      { $push: { products: newProduct } }
    );

    res.status(201).json({ message: "product added successfully" });
  } catch (error) {
    console.error("Error adding Product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//close lpo from adding more parts by updating the status to 2
async function closeLpo(req, res) {
  const { lpoUnNo, company_no } = req.body;
  const lpo_no = lpoUnNo;
  let netTotal = 0;

  try {
    // Check if the department name already exists for the given company
    const existingLpo = await Supplier.findOne({
      company_no: company_no,
      lpo_no: lpo_no,
      status: 1,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "Problem with Lpo" });
    }

    const extractedProducts = existingLpo.products;

    extractedProducts.forEach((product) => {
      netTotal += product.quantity * product.price;
    });

    netTotal = netTotal.toFixed(2);

    // Update the netTotal and status
    await Supplier.updateMany(
      { company_no: company_no, lpo_no: lpo_no },
      {
        $set: {
          netTotal: netTotal,
          status: 2,
        },
      }
    );
    res.json("Lpo closed");
  } catch (error) {}
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
    const lpo = await Supplier.find({ lpo_no, company_no });
    const variables = await Variables.find({ company_no });

    // Create an object containing both variables
    const lpoData = {
      lpoItems,
      lpo,
      variables,
    };

    res.json(lpoData);
  } catch (error) {
    console.error("Error fetching lpos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchLpoData,
  autocomplete,
  getLpoNo,
  getLatestLpoNo,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  fetchVariables,
  postLpoDetails,
  closeLpo,
};
