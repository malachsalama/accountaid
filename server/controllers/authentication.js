const User = require("../models/user");
const bcrypt = require("bcrypt");
const { createToken } = require("../middleware/userAuth");

// Controller function to create a new user
async function userSignUp(req, res) {
  try {
    // Extract user data from the request body
    const {
      username,
      phone_no,
      department,
      designation,
      department_no,
      user_id,
      password,
    } = req.body;

    // Check if the user with the same user_id already exists
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with the same user_id already exists" });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const user = new User({
      username,
      phone_no,
      department,
      designation,
      department_no,
      user_id,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Respond with a success message or the created user object
    res.status(201).json({
      message: "User created successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function userLogin(req, res) {
  try {
    const { user_id, password } = req.body;

    // Find the user by user_id
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    // Create a token for the user
    const accessToken = await createToken(user);

    // Send the token in the response
    res.status(200).json({
      _id: user._id,
      accessToken,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  userSignUp,
  userLogin,
};
