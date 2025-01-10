/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("insurance_level").then(function () {
    // Inserts seed entries
    return knex("insurance_level").insert([
      {
        levelName: "Basic Hospital Cover",
        levelCode: "BASIC",
        levelValue: "BASIC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "DVA Entitlement Other",
        levelCode: "DEO",
        levelValue: "DV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Extras Only",
        levelCode: "EO",
        levelValue: "EO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Insured - Level Unknown",
        levelCode: "IUNKN",
        levelValue: "IUNKN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Intermediate Hospital Cover",
        levelCode: "INTER",
        levelValue: "INTER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "No DVA Entitlement",
        levelCode: "NDE",
        levelValue: "NDE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Not Applicable",
        levelCode: "NA",
        levelValue: "NA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Not Specified",
        levelCode: "NSP",
        levelValue: "NSP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Not Stated/Inadequately Described",
        levelCode: "9",
        levelValue: "9",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Top Hospital Cover",
        levelCode: "TOP",
        levelValue: "TOP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Overseas Student",
        levelCode: "OSS",
        levelValue: "OVSS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Overseas Vistor",
        levelCode: "OSV",
        levelValue: "OVSV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "DVA Gold Card",
        levelCode: "DVAG",
        levelValue: "DVG",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "DVA White Card",
        levelCode: "DVAW",
        levelValue: "DVW",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "DVA Orange Card",
        levelCode: "RPBC",
        levelValue: "DVO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Pensionner Concession Card",
        levelCode: "PCC",
        levelValue: "NA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Commonwealth Seniors Healthcare Card",
        levelCode: "CSHC",
        levelValue: "NA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Hospital Insurance Status Unknown",
        levelCode: "HISU",
        levelValue: "IUNKN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Gold Cover",
        levelCode: "GOLD",
        levelValue: "GOLD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Silver Cover",
        levelCode: "SILV",
        levelValue: "SILV",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Silver Plus Cover",
        levelCode: "SILVP",
        levelValue: "SILVP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Bronze Cover",
        levelCode: "BRNZ",
        levelValue: "BRNZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Bronze Plus Cover",
        levelCode: "BRNZP",
        levelValue: "BRNZP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        levelName: "Basic Plus Cover",
        levelCode: "BASCP",
        levelValue: "BASCP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
