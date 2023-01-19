//it removes break line and blank spaces from a data file

const fs = require("fs");

fs.readFile("temp_data_space.txt", "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  // Escape quotation marks within "completion" section
  const modifiedCode = data.replace(/"completion": "(.*?)"/g, (match, p1) => {
    return `"completion": "${p1.replace(/"/g, '\\"')}"`;
  });

  // remove all duplicated whitespace
  const finalCode = modifiedCode.replace(/\s+/g, " ");

  fs.writeFile("modified_file_without_space.txt", finalCode, "utf8", (err) => {
    if (err) {
      throw err;
    }
    console.log("The file has been saved!");
  });
});
