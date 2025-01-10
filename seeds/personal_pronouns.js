/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("personal_pronouns").then(function () {
    // Inserts seed entries
    return knex("personal_pronouns").insert([
      {
        name: "he/him/his/his/himself",
        value: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "she/her/her/hers/herself",
        value: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "they/them/their/theirs/themselves",
        value: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ze/zir/zir/zirs/zirself",
        value: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'xie/hir ("here")/hir/hirs/hirself',
        value: "4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "co/co/cos/cos/coself",
        value: "5",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "en/en/ens/ens/enself",
        value: "6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "en/en/ens/ens/enself",
        value: "6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ey/em/eir/eirs/emself",
        value: "7",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "yo/yo/yos/yos/yoself",
        value: "8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ve/vis/ver/ver/verself",
        value: "9",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
