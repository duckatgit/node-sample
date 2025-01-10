// ## LOCAL ###
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "treo",
      user: "postgres",
      password: "duck@123",
    },
  },
};

// ### DEVELOPMENT ###
// module.exports = {
//   production: {
//     client: "postgresql",
//     connection: {
//       host: "",
//       database: "treodb",
//       user: "",
//       password: "",
//       ssl: true,
//     },
//   },
// };
