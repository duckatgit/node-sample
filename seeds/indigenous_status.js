/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("indigenous_status").then(function () {
    // Inserts seed entries
    return knex("indigenous_status").insert([
      {
        name: "Aboriginal",
        value: "5",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "BOTH Aboriginal & TSI",
        value: "7",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Patient refused to answer",
        value: "9",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "NOT Aboriginal or TSI",
        value: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Not Stated/inadequately described",
        value: "NSID",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Question unable to be asked",
        value: "8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Torres Strait Islander",
        value: "6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Did not meet client/could not ascretain",
        value: "DMC",
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
