const fs = require('fs');

// Load the data from the .jsonl file
let data = fs.readFileSync('./example-test.jsonl').toString();

// Split the data by line breaks to get an array of json objects
let jsonObjects = data.split('\n');

// Use a for loop to iterate over the json objects
for (let i = 0; i < jsonObjects.length; i++) {
    let jsonObject = JSON.parse(jsonObjects[i]);

    // Use regular expressions to find and replace all instances of " with \“
    jsonObject.prompt = jsonObject.prompt.replace(/"/g, '\\"');
    jsonObject.completion = jsonObject.completion.replace(/"/g, '\\"');

    // Remove excessive spaces except line breaks
    jsonObject.prompt = jsonObject.prompt.replace(/[\t ]+/g, ' ');
    jsonObject.completion = jsonObject.completion.replace(/[\t ]+/g, ' ');

    // Convert the json object back to string format
    jsonObjects[i] = JSON.stringify(jsonObject);
}

// Join the json objects by line breaks
let modifiedData = jsonObjects.join('\n');

// Save the modified data to a new .jsonl file
fs.writeFileSync('./example-test
