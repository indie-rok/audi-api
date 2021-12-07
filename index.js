const express = require("express");
const app = express();

const csvParserController = require("./controllers/csvParser");

app.use(express.json());

app.use("/", csvParserController);

app.listen(5000, () => {
  console.log("Works");
});
