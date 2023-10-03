const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// App init
const app = express();

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

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
