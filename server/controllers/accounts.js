const { Creditor, Logs } = require("../models/accounts");
const Company = require("../models/company");

// Adding a creditor to the system
async function createCreditor(req, res) {
  try {
    const { name, company, kra_pin, email, phone_no } = req.body;

    const acc_no = req.body.acc_no;
    const { user_id, username } = req.user;

    // Check if the Creditor name already exists
    const existingcompany = await Creditor.findOne({ company });

    const action = `${username} created an account for ${company}`;
    const doc_type = `New account`;
    const unique_id = acc_no;

    if (existingcompany) {
      return res.status(400).json({ error: "Company already exists" });
    }

    const newCreditor = new Creditor({
      name,
      company,
      kra_pin,
      email,
      phone_no,
      acc_no,
    });

    const logData = new Logs({
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();

    await newCreditor.save();

    res.status(201).json({ message: "Creditor added successfully" });
  } catch (error) {
    console.error("Error adding Creditor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAccountNo(req, res) {
  try {
    const result = await Creditor.findOne().sort({ acc_no: -1 }).exec();

    let max_no = result ? result.acc_no : 0;
    let cred_no;

    if (max_no === 0) {
      cred_no = "C0001";
    } else {
      let numericPart = parseInt(max_no.slice(1), 10);
      numericPart++;
      cred_no = "C" + numericPart.toString().padStart(4, "0");
    }
    res.status(200).json(cred_no);
  } catch (error) {
    console.error("Error getting account number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllCreditors(req, res) {
  try {
    const allCreditors = await Creditor.find({});
    res.status(200).json(allCreditors);
  } catch (error) {
    console.error("Error fetching creditors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function tbAccounts(req, res) {
  try {
    const { account_name, account_number, acc_no } = req.body;

    const { user_id, username } = req.user;
    const { company_no } = req.query;

    // Check if the Tb Account name already exists
    const existingAccount = await Company.findOne({
      company_no: company_no,
      "tbaccounts.account_name": account_name,
    });

    const existingAccountNumber = await Company.findOne({
      company_no: company_no,
      "tbaccounts.account_number": account_number,
    });

    const action = `${username} created an account for ${account_name}`;
    const doc_type = `New account`;
    const unique_id = account_number;

    if (existingAccount) {
      return res.status(400).json({ error: "TB Account name already exists" });
    }

    if (existingAccountNumber) {
      return res
        .status(400)
        .json({ error: "TB Account number already exists" });
    }

    const newTBAccount = {
      account_name,
      account_number,
      acc_no,
    };

    const logData = new Logs({
      company_no,
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();

    // Update the company document with the new TB Account
    await Company.updateOne(
      { company_no: company_no },
      { $push: { tbaccounts: newTBAccount } }
    );

    res.status(201).json({ message: "Creditor added successfully" });
  } catch (error) {}
}

async function fetchTbAccounts(req, res) {
  try {
    const { company_no } = req.query;

    //fetch company using company number
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const allTbAccounts = company.tbaccounts;
    res.json(allTbAccounts);
  } catch (error) {
    console.error("Error fetching Tb Accounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createCreditor,
  getAccountNo,
  getAllCreditors,
  tbAccounts,
  fetchTbAccounts,
};
