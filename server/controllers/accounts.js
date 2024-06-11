const Company = require("../models/company");
const Logs = require("../models/logs");

// Adding a creditor to the system
async function createCreditor(req, res) {
  try {
    const { acc_no, name, creditor_name, kra_pin, email, phone_no } = req.body;
    const { user_id } = req.user;
    const { company_no, username } = req.query.userData;

    // Check if the Creditor name already exists
    const existingCompany = await Company.findOne({ company_no });

    const action = `${username} created an account for ${creditor_name}`;
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
      creditor_name,
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

async function updateCreditorLedger(req, res) {
  try {
    const { company_no, newInvoice } = req.body;
    const { creditor_name } = req.params;

    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const creditor = company.creditors.find(
      (cred) => cred.creditor_name === creditor_name
    );

    if (!creditor) {
      return res.status(404).json({ error: "Creditor not found" });
    }

    // Update creditor's ledger
    creditor.ledger.invoices.push(newInvoice);

    await company.save();
    res.status(200).json({ message: "Creditor ledger updated successfully" });
  } catch (error) {
    console.error("Error updating creditor's ledger:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get an account number OR the next available account number for a creditor
async function getAccountNo(req, res) {
  try {
    const { company_no, account_name } = req.query.userData;

    // Check if both company_no and account_name are provided
    if (company_no && account_name) {
      const company = await Company.findOne({ company_no });

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const creditor = company.creditors.find(
        (creditor) => creditor.name === account_name
      );
      if (!creditor) {
        return res.status(404).json({
          error: "Creditor not found for the provided company and account name",
        });
      }

      const accountNo = creditor.acc_no;
      return res.status(200).json(accountNo);
    }

    // If only company_no is provided or none are provided, proceed with the existing logic
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

// Function to get the next GRN number
async function getGRNNo(req, res) {
  const { company_no } = req.query;

  try {
    // Find the company by company_no
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Extract the lpos array and find the max grn_no
    const lpos = company.lpos || [];
    let max_no = "GRN-0000";

    if (lpos.length > 0) {
      max_no =
        lpos
          .map((lpo) => lpo.grn_no)
          .filter((grn_no) => grn_no) // Ensure grn_no is not undefined or null
          .sort((a, b) => {
            const numA = parseInt(a.substring(4));
            const numB = parseInt(b.substring(4));
            return numB - numA;
          })[0] || "GRN-0000";
    }

    let grnNo;

    if (max_no === "GRN-0000") {
      grnNo = "GRN-0001";
    } else {
      let numericPart = parseInt(max_no.substring(4));
      numericPart++;
      grnNo = "GRN-" + numericPart.toString().padStart(4, "0");
    }

    res.status(200).json(grnNo);
  } catch (error) {
    console.error("Error getting GRN number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all creditors or a single creditor
async function getCreditors(req, res) {
  try {
    const { company_no, cred_id } = req.query.userData;
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (cred_id) {
      const creditor = company.creditors._id(cred_id);
      if (!creditor) {
        return res.status(404).json({ error: "Creditor not found" });
      }
      res.status(200).json(creditor);
    } else {
      const allCreditors = company.creditors;
      res.status(200).json(allCreditors);
    }
  } catch (error) {
    console.error("Error fetching creditors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getCreditors };

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

// Fetch all TB accounts for a company or multiple TB accounts by acc_no
async function fetchTbAccounts(req, res) {
  try {
    const { company_no } = req.query.userData;
    const { account_id, acc_no } = req.query;

    // Fetch company using company number
    const company = await Company.findOne({ company_no });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Check if a specific TB account ID is provided
    if (account_id) {
      // Find the TB account with the specified ID
      const account = company.tbaccounts.find(
        (acc) => acc._id.toString() === account_id
      );

      if (!account) {
        return res.status(404).json({ error: "TB account not found" });
      }

      // Return the found TB account
      return res.json(account);
    }

    // Fetch all TB accounts, optionally filtered by multiple acc_no values
    let allTbAccounts = company.tbaccounts;
    if (acc_no) {
      // Convert acc_no to an array if it's not already
      const accNos = Array.isArray(acc_no) ? acc_no : [acc_no];
      const accNosInt = accNos.map((no) => parseInt(no, 10));
      allTbAccounts = allTbAccounts.filter((acc) =>
        accNosInt.includes(acc.acc_no)
      );
    }

    // Return the filtered or unfiltered TB accounts
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
  updateCreditorLedger,
  getAccountNo,
  getGRNNo,
  getCreditors,
  tbAccounts,
  fetchTbAccounts,
  deleteCreditor,
  deleteTbAccount,
};
