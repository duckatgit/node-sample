/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("gender_identity").then(function () {
    // Inserts seed entries
    return knex("gender_identity").insert([
      {
        name: "Transgender Female",
        value: "transgender-female",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Transgender Male",
        value: "transgender-male",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Non-Binary",
        value: "non-binary",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Female",
        value: "female",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Other",
        value: "other",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Does not wish to disclose",
        value: "non-disclose",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
