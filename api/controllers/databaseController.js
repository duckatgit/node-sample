const { failAction, successAction } = require("../utils/response");
const {
  createDatabaseAllSchemaTables,
  updateDatabaseAllSchemaTables,
} = require("../services/dbService");

// Function to update database schema
exports.createDatabaseSchemaTables = async function (req, res) {
  try {
    const data = await createDatabaseAllSchemaTables();
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update database schema
exports.updateDatabaseSchemaTables = async function (req, res) {
  try {
    const data = await updateDatabaseAllSchemaTables();
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
