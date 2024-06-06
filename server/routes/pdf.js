const express = require("express");
const router = express.Router();

const pdfLpo = require("../controllers/pdfs/pdflpo");

router.get("/pdflpo", pdfLpo);

module.exports = router;
