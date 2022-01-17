const fs = require("fs");

function writeToFile(path, data, functionName) {
   fs.writeFile(path, data, function (err) {
      if (err) {
         console.log(`Something went wrong in ${functionName}`);
      }
   });
}

module.exports = writeToFile;
