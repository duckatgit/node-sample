/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("gender").then(function () {
    // Inserts seed entries
    return knex("gender").insert([
      {
        name: "Indeterminate",
        value: "I",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Female",
        value: "F",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Intersex",
        value: "4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Male",
        value: "M",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Not Stated/ Inadequately Described",
        value: "9",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Not Specified",
        value: "NSP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
