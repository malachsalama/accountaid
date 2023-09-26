const User = require("../models/user");

// Controller function to create a new user
exports.createUser = async (req, res) => {
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

    // Create a new user instance
    const user = new User({
      username,
      phone_no,
      department,
      designation,
      department_no,
      user_id,
      password,
    });

    // Save the user to the database
    await user.save();

    // Respond with a success message or the created user object
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
