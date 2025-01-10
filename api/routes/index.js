const express = require("express");
const {
  createDatabaseSchemaTables,
  updateDatabaseSchemaTables,
} = require("../controllers/databaseController");
const router = express.Router();
const auth = require("./authRoute");
const schedule = require("./scheduleRoutes");

// DATABASE SCHEMA ROUTES
router.get("/create-database-schema-tables", createDatabaseSchemaTables);
router.get("/update-database-schema-tables", updateDatabaseSchemaTables);

// API ROUTES
router.use("/auth", auth);
router.use("/schedule", schedule);

module.exports = router;
