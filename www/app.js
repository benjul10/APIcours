const { startServer } = require("../server");
const config = require("../config");

startServer(config.port, () => {
  console.log("app running");
});
