const fs = require("fs");

fs.readFile("temp_data_quotation.txt", "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  // Modify the data to add a backslash (\) before the quotation mark when within the "completion" section
  const modifiedData = data.replace(/"completion": "([^"]*)"/g, (match, p1) => {
    return `"completion": "${p1.replace(/"/g, '\\"')}"`;
  });

  fs.writeFile(
    "modified_file_without_quotation.txt",
    modifiedData,
    "utf8",
    (err) => {
      if (err) {
        throw err;
      }
      console.log("The file has been saved!");
    }
  );
});
