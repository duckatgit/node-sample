const knex = require("../config/db");
const { SCHEMA_TABLES } = require("../constants/dbConstant");
const {
  createStaffTable,
  createScheduleTable,
  createPatientsTable,
  createAppointmentsTable,
  createTagsTable,
  createDocumentsTable,
  createNotesTable,
  updateDocumentsTable,
} = require("./dbTableService");

module.exports = {
  isUserExist,
  selectFirstData,
  selectAllData,
  selectAllDataCondition,
  selectAllDataJoin,
  selectAllDataMultipleJoin,
  insertData,
  updateData,
  deleteData,
  createSchema,
  createTenantTables,
  createDatabaseAllSchemaTables,
  updateDatabaseAllSchemaTables,
};

// Function to select first data from db
async function isUserExist(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      const userExist = await knex("tenants")
        .where({
          id: userId,
        })
        .select("*")
        .first();
      if (userExist) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select first data from db
async function selectFirstData(schema, fields, from, where) {
  return new Promise(async function (resolve, reject) {
    try {
      const data = await knex
        .withSchema(schema)
        .select(fields)
        .from(from)
        .where(where)
        .first();
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data from db
async function selectAllData(schema, fields, from, where = {}) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex
          .withSchema(schema)
          .select(fields)
          .from(from)
          .where(where);
      } else {
        data = await knex.withSchema(schema).select(fields).from(from);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select data from db with condition
async function selectAllDataCondition(schema, fields, from, where = []) {
  let columnName;
  let operator;
  let condition;

  if (where.length > 0) {
    columnName = where[0];
    operator = where[1];
    condition = where[2];
  }

  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where.length > 0) {
        data = await knex
          .withSchema(schema)
          .select(fields)
          .from(from)
          .where(columnName, operator, condition);
      } else {
        data = await knex.withSchema(schema).select(fields).from(from);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data with join from db
async function selectAllDataJoin(
  schema,
  joinTable,
  firstCond,
  operator,
  secondCond,
  firstField,
  secondField,
  from,
  where = {}
) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex
          .withSchema(schema)
          .join(joinTable, firstCond, operator, secondCond)
          .select(firstField, secondField)
          .from(from)
          .where(where);
      } else {
        data = await knex
          .withSchema(schema)
          .join(joinTable, firstCond, operator, secondCond)
          .select(firstField, secondField)
          .from(from);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to select all data with join from db
async function selectAllDataMultipleJoin(
  schema,
  joinTable1,
  firstCond,
  operator,
  secondCond,
  joinTable2,
  thirdCond,
  secondOperator,
  fourthCond,
  firstField,
  rawExpression1,
  rawExpression2,
  from,
  where = {}
) {
  return new Promise(async function (resolve, reject) {
    try {
      let data;
      if (where) {
        data = await knex
          .withSchema(schema)
          .select(firstField, rawExpression1, rawExpression2)
          .from(from)
          .leftJoin(joinTable1, function () {
            this.on(firstCond, operator, secondCond);
          })
          .leftJoin(joinTable2, function () {
            this.on(thirdCond, secondOperator, fourthCond);
          })
          .where(where);
      } else {
        data = await knex
          .withSchema(schema)
          .select(firstField, rawExpression1, rawExpression2)
          .from(from)
          .join(joinTable1, function () {
            this.on(firstCond, operator, secondCond);
          })
          .join(joinTable2, function () {
            this.on(thirdCond, secondOperator, fourthCond);
          });
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to insert data in db
async function insertData(schema, data, fields, table) {
  return new Promise(async function (resolve, reject) {
    try {
      const result = await knex
        .withSchema(schema)
        .insert(data, fields)
        .into(table);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to insert data in db
async function updateData(schema, data, fields, table, where) {
  return new Promise(async function (resolve, reject) {
    try {
      const result = await knex
        .withSchema(schema)
        .update(data, fields)
        .into(table)
        .where(where);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete data from db
async function deleteData(schema, table, where) {
  return new Promise(async function (resolve, reject) {
    try {
      const result = await knex
        .withSchema(schema)
        .from(table)
        .where(where)
        .del();
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to create schema in db
async function createSchema(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      const result = await knex.schema.raw(`CREATE SCHEMA ${schemaName};`);
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to create tables in particular schema
async function createTenantTables(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await createStaffTable(schemaName);
      await createScheduleTable(schemaName);
      await createPatientsTable(schemaName);
      await createAppointmentsTable(schemaName);
      await createTagsTable(schemaName);
      await createDocumentsTable(schemaName);
      await createNotesTable(schemaName);
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update database all schema with table
async function createDatabaseAllSchemaTables() {
  return new Promise(async function (resolve, reject) {
    try {
      const tableCreated = [];
      const tableList = SCHEMA_TABLES;
      const tenantData = await knex("tenants").select("*");
      for (let item of tenantData) {
        const schemaName = item.practiceLink.toLowerCase();
        for (let table of tableList) {
          const result = await knex.schema
            .withSchema(schemaName)
            .hasTable(table);
          if (!result) {
            let isTableCreated;
            if (table === "staff") {
              isTableCreated = await createStaffTable(schemaName);
            }
            if (table === "schedule") {
              isTableCreated = await createScheduleTable(schemaName);
            }
            if (table === "patients") {
              isTableCreated = await createPatientsTable(schemaName);
            }
            if (table === "appointments") {
              isTableCreated = await createAppointmentsTable(schemaName);
            }
            if (table === "tags") {
              isTableCreated = await createTagsTable(schemaName);
            }
            if (table === "documents") {
              isTableCreated = await createDocumentsTable(schemaName);
            }
            if (table === "notes") {
              isTableCreated = await createNotesTable(schemaName);
            }
            if (isTableCreated) {
              const tableResult = `Table "${table}" is created in schema "${schemaName}"`;
              tableCreated.push(tableResult);
            }
          }
        }
      }
      console.log("tableCreated =>", tableCreated);
      return resolve(tableCreated);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update database all schema with table
async function updateDatabaseAllSchemaTables() {
  return new Promise(async function (resolve, reject) {
    try {
      const tableUpdated = [];
      const tenantData = await knex("tenants").select("*");
      for (let item of tenantData) {
        const schemaName = item.practiceLink.toLowerCase();
        const isTableUpdated = await updateDocumentsTable(schemaName);
        if (isTableUpdated === true) {
          const tableResult = `Table ==> Updated ==> Schema "${schemaName}"`;
          tableUpdated.push(tableResult);
        } else {
          const tableResult = `Error ==========> Schema ==========> "${schemaName}"`;
          tableUpdated.push(tableResult);
        }
      }
      console.log("tableUpdated =>", tableUpdated);
      return resolve(tableUpdated);
    } catch (error) {
      return reject(error);
    }
  });
}
