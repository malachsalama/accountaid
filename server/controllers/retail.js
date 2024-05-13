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
      creditor.company.match(regex)
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
    const vatVariable = 1 + company.variables.vat / 100;

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

async function postLpoDetails(req, res) {
  try {
    const { user_id } = req.user;
    const { unique_id, company_no, description, quantity, price } = req.body;
    const { lpoUnNo } = req.query;
    const lpo_no = lpoUnNo;

    const existingLpo = await Supplier.findOne({
      company_no,
      lpo_no,
      status: 1,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "LPO not found" });
    }

    const newProduct = {
      user_id,
      unique_id,
      company_no,
      description,
      quantity,
      price,
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
  const { lpoUnNo, company_no } = req.body;
  const lpo_no = lpoUnNo;
  let netTotal = 0;

  try {
    const existingLpo = await Supplier.findOne({
      company_no,
      lpo_no,
      status: 1,
    });

    if (!existingLpo) {
      return res.status(400).json({ error: "Problem with Lpo" });
    }

    existingLpo.products.forEach((product) => {
      netTotal += product.quantity * product.price;
    });

    netTotal = netTotal.toFixed(2);

    existingLpo.netTotal = netTotal;
    existingLpo.status = 2;

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
    const lpos = await Supplier.find({ company_no, status: 2 });
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

module.exports = {
  fetchLpoData,
  autocomplete,
  getLpoNo,
  getLatestLpoNo,
  generateLpo,
  getAllLposByCompany,
  fetchLpoDataForReceive,
  postLpoDetails,
  closeLpo,
};
