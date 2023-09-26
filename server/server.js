const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");

require("dotenv").config();
const port = process.env.PORT || 3000;

// App init
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
