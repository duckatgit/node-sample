const knex = require("../config/db");

module.exports = {
  createStaffTable,
  updateStaffTable,
  createScheduleTable,
  updateScheduleTable,
  createPatientsTable,
  updatePatientsTable,
  createAppointmentsTable,
  updateAppointmentsTable,
  createTagsTable,
  updateTagsTable,
  createDocumentsTable,
  updateDocumentsTable,
  createNotesTable,
  updateNotesTable,
};

// Function to create staff table for particular schema
async function createStaffTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("staff", function (table) {
          table.increments("id").primary();
          table.string("name", 100);
          table.string("email", 100);
          table.string("phone", 100);
          table.timestamps();
          table.bigInteger("providerNumber");
          table.string("treoAccess", 100);
          table.boolean("dailyScheduleSms");
          table.boolean("dailyScheduleEmail");
          table.boolean("appointmentsConfirmationSms");
          table.boolean("appointmentsConfirmationEmail");
          table.integer("userId", 2147483647);
          table.string("type", 100);
          table.boolean("isVerified");
          table.string("password", 255);
          table.boolean("isDeleted");
          table.string("status", 100);
          table.string("color", 100);
          table.integer("timeout", 2147483647);
          table.integer("verificationCode", 2147483647);
          table.boolean("isResetPassword").defaultTo(false);
          table.boolean("isCodeTimeout").defaultTo(false);
          table.string("instantMeetingLink", 255);
          table.string("image");
          table.string("colorClass", 100);
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update staff table for particular schema
async function updateStaffTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("staff", function (table) {
          table.string("colorClass", 100);
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create schedule table for particular schema
async function createScheduleTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("schedule", function (table) {
          table.increments("id").primary();
          table.string("type", 100);
          table.integer("patientId", 2147483647);
          table.boolean("isPatientNotifyViaSms");
          table.integer("staffId", 2147483647);
          table.boolean("isPractitionerNotifyViaSms");
          table.boolean("isPractitionerNotifyViaEmail");
          table.string("scheduleDate", 100);
          table.string("scheduleTime", 100);
          table.integer("duration", 2147483647);
          table.text("procedures");
          table.text("notes");
          table.boolean("isDeleted");
          table.timestamps();
          table.string("title", 100);
          table.string("meetingLink", 255);
          table.string("streamId", 255);
          table.string("roomId", 255);
          table.string("status", 255);
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update schedule table for particular schema
async function updateScheduleTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("schedule", function (table) {
          table.dropColumn("patientName");
          table.dropColumn("patientEmail");
          table.dropColumn("patientPhone");
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create Patients table for particular schema
async function createPatientsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("patients", function (table) {
          table.increments("id").primary();
          table.string("name", 100);
          table.string("email", 100);
          table.string("phone", 100);
          table.boolean("isDeleted");
          table.timestamps();
          table.string("title", 100);
          table.string("firstName", 100);
          table.string("dob", 100);
          table.string("sex", 100);
          table.string("gender", 100);
          table.string("pronouns", 100);
          table.string("indigenousStatus", 255);
          table.string("alternatePhone", 100);
          table.string("addressLine1", 255);
          table.string("addressLine2", 255);
          table.string("country", 100);
          table.string("timeZone", 100);
          table.string("state", 100);
          table.string("city", 100);
          table.bigInteger("postCode");
          table.bigInteger("medicareNumber");
          table.string("referenceNumber");
          table.string("expiryDate", 100);
          table.boolean("isPrivateInsurance");
          table.string("policyNumber");
          table.string("funds", 255);
          table.string("insuranceLevel", 255);
          table.string("referralType", 100);
          table.string("openingBalance", 255);
          table.string("concessionType", 100);
          table.string("invoiceTo", 100);
          table.string("emailInvoiceTo", 100);
          table.string("invoiceExtraInfo", 255);
          table.integer("currentStep", 10);
          table.bigInteger("mrn");
          table.string("status", 100);
          table.string("bloodGroup", 100);
          table.boolean("highBp");
          table.boolean("onInsulin");
          table.boolean("fracture");
          table.text("alergies");
          table.text("observation");
          table.boolean("isEmergency");
          table.string("emergencyName", 100);
          table.string("emergencyEmail", 100);
          table.string("emergencyPhone", 100);
          table.string("emergencyRelation", 100);
          table.text("emergencyAddress");
          table.string("image");
          table.specificType("medicalHistory", "text ARRAY");
          table.string("lastName", 255);
          table.json("vitalsThresholds");
          table.text("notes");
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update Patients table for particular schema
async function updatePatientsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("patients", function (table) {
          // table.text("documents");
        });

      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create appointement table for particular schema
async function createAppointmentsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("appointments", function (table) {
          table.increments("id").primary();
          table.integer("scheduleId", 2147483647);
          table.integer("patientId", 2147483647);
          table.integer("staffId", 2147483647);
          table.string("scheduleDate", 100);
          table.string("scheduleTime", 100);
          table.integer("duration", 2147483647);
          table.boolean("isDeleted").defaultTo(false);
          table.boolean("isVitalSigns").defaultTo(false);
          table.decimal("weight");
          table.string("bp", 100);
          table.integer("hr", 10);
          table.integer("spo2", 10);
          table.integer("rr", 10);
          table.decimal("temp");
          table.boolean("isClinicalNotes").defaultTo(false);
          table.text("presentation");
          table.text("observation");
          table.text("diagnoses");
          table.text("notes");
          table.timestamps();
          table.string("status", 255);
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update appointement table for particular schema
async function updateAppointmentsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("appointments", function (table) {
          table.decimal("weight");
          table.decimal("temp");
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create tags table for particular schema
async function createTagsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("tags", function (table) {
          table.increments("id").primary();
          table.string("name", 255);
          table.string("type", 255);
          table.boolean("isActive").defaultTo(true);
          table.boolean("isDeleted").defaultTo(false);
          table.timestamps();
          table.string("color", 100);
          table.string("textColor", 100);
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update staff table for particular schema
async function updateTagsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("tags", function (table) {
          table.string("textColor", 100);
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create documents table for particular schema
async function createDocumentsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("documents", function (table) {
          table.increments("id").primary();
          table.integer("patientId", 2147483647);
          table.string("name", 255);
          table.text("reason");
          table.boolean("isDeleted").defaultTo(false);
          table.timestamps();
          table.text("type");
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update documents table for particular schema
async function updateDocumentsTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("documents", function (table) {
          table.text("type");
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}

// Function to create notes table for particular schema
async function createNotesTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .createTable("notes", function (table) {
          table.increments("id").primary();
          table.integer("patientId", 2147483647);
          table.string("title", 255);
          table.text("notes");
          table.boolean("isDeleted").defaultTo(false);
          table.timestamps();
        });
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update notes table for particular schema
async function updateNotesTable(schemaName) {
  return new Promise(async function (resolve, reject) {
    try {
      await knex.schema
        .withSchema(schemaName)
        .alterTable("notes", function (table) {
          // table.string("textColor", 100);
        });
      return resolve(true);
    } catch (error) {
      return resolve(error);
    }
  });
}
