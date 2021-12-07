function loadCSV() {
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
}

module.exports = loadCSV;
