const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const { countDecimals } = require("../helpers/csvParser");

const router = express.Router();

let csvResult = [];

try {
  fs.createReadStream("./events.csv")
    .pipe(csv())
    .on("data", (data) => csvResult.push(data))
    .on("end", () => {
      console.log("csv ready");
    });
} catch (err) {
  console.error("CSV parsing error", err);
}

router.get("/parse", (req, res) => {
  try {
    let result = {};

    const posts = req.body;

    if (!Array.isArray(posts)) {
      return res.status(400).send({ error: "Invalid Data Provided" });
    }

    posts.forEach((pointOfInterest) => {
      const { lat, lon, name } = pointOfInterest;
      const numberOfDecimalsLat = countDecimals(lat);
      const numberOfDecimalsLon = countDecimals(lon);
      let histogram = { imp: 0, click: 0 };

      csvResult.forEach((event) => {
        const correctNumberLat = parseFloat(event.lat).toFixed(
          numberOfDecimalsLat
        );

        const correctNumberLon = parseFloat(event.lon).toFixed(
          numberOfDecimalsLon
        );

        if (correctNumberLat == lat && correctNumberLon == lon) {
          histogram[event.event_type] += 1;
        }
      });

      result[name] = { lat, lon, name, ...histogram };
    });

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status.send({ error: "There was an error processing your request" });
  }
});

module.exports = router;
