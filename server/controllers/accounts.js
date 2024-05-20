const Company = require("../models/company");
const Logs = require("../models/logs");

// Adding a creditor to the system
async function createCreditor(req, res) {
  try {
    const { acc_no, name, company, kra_pin, email, phone_no } = req.body;
    const { user_id } = req.user;
    const { company_no, username } = req.query.userData;

    // Check if the Creditor name already exists
    const existingCompany = await Company.findOne({ company_no });

    const action = `${username} created an account for ${company}`;
    const doc_type = `New account`;
    const unique_id = acc_no;

    if (!existingCompany) {
      return res.status(400).json({ error: "Company does not exist" });
    }

    // Check if the Creditor already exists
    const existingCreditor = existingCompany.creditors.find(
      (creditor) => creditor.name === name
    );

    if (existingCreditor) {
      return res.status(400).json({ error: "Creditor already exists" });
    }

    const newCreditor = {
      name,
      company,
      kra_pin,
      email,
      phone_no,
      acc_no,
    };

    existingCompany.creditors.push(newCreditor);

    const logData = new Logs({
      user_id,
      action,
      unique_id,
      doc_type,
    });

    await logData.save();
    await existingCompany.save();

    res.status(201).json({ message: "Creditor added successfully" });
  } catch (error) {
    console.error("Error adding Creditor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get the next available account number for a creditor
async function getAccountNo(req, res) {
  try {
    const { company_no } = req.query.userData;

    const maxAccount = await Company.findOne({ company_no })
      .select("creditors.acc_no")
      .sort({ "creditors.acc_no": -1 })
      .limit(1);

    let maxNo = 0;
    if (maxAccount && maxAccount.creditors && maxAccount.creditors.length > 0) {
      for (const creditor of maxAccount.creditors) {
        const currentNo = parseInt(creditor.acc_no.slice(1), 10);
        maxNo = Math.max(maxNo, currentNo);
      }
    }

    maxNo++;
    const cred_no = "C" + maxNo.toString().padStart(4, "0");

    res.status(200).json(cred_no);
  } catch (error) {
    console.error("Error getting account number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all creditors
async function getAllCreditors(req, res) {
  try {
    const { company_no } = req.query.userData;
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const allCreditors = company.creditors;
    res.status(200).json(allCreditors);
  } catch (error) {
    console.error("Error fetching creditors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Add a new TB account
async function tbAccounts(req, res) {
  try {
    const { account_name, account_number, acc_no } = req.body;
    const { user_id } = req.user;
    const { company_no, username } = req.query.userData;

    // Check if the TB Account name or number already exists
    const existingAccount = await Company.findOne({
      company_no,
      $or: [
        { "tbaccounts.account_name": account_name },
        { "tbaccounts.account_number": account_number },
      ],
    });

    const action = `${username} created an account for ${account_name}`;
    const doc_type = `New account`;
    const unique_id = account_number;

    if (existingAccount) {
      return res
        .status(400)
        .json({ error: "TB Account name or number already exists" });
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
      { company_no },
      { $push: { tbaccounts: newTBAccount } }
    );

    res.status(201).json({ message: "TB Account added successfully" });
  } catch (error) {
    console.error("Error adding TB Account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch all TB accounts for a company
async function fetchTbAccounts(req, res) {
  try {
    const { company_no } = req.query.userData;

    // Fetch company using company number
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const allTbAccounts = company.tbaccounts;
    res.json(allTbAccounts);
  } catch (error) {
    console.error("Error fetching TB Accounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/// Delete a creditor from the system
async function deleteCreditor(req, res) {
  try {
    const { creditorId } = req.params;
    const { company_no } = req.query.userData;

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Remove the creditor from the creditors array
    company.creditors = company.creditors.filter(
      (creditor) => creditor._id.toString() !== creditorId
    );

    // Save the updated company document
    await company.save();

    res.status(200).json({ message: "Creditor deleted successfully" });
  } catch (error) {
    console.error("Error deleting creditor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/// Delete a TBAccount from the system
async function deleteTbAccount(req, res) {
  try {
    const { tbaccountId } = req.params;
    const { company_no } = req.query.userData;

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Remove the TBAccount from the tbaccounts array
    company.tbaccounts = company.tbaccounts.filter(
      (tbaccount) => tbaccount._id.toString() !== tbaccountId
    );

    // Save the updated company document
    await company.save();

    res.status(200).json({ message: "TBAccount deleted successfully" });
  } catch (error) {
    console.error("Error deleting TBAccount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createCreditor,
  getAccountNo,
  getAllCreditors,
  tbAccounts,
  fetchTbAccounts,
  deleteCreditor,
  deleteTbAccount,
};
