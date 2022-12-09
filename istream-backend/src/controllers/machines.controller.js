const fs = require("fs");

module.exports.addNewMachine = (req, res) => {
   const { userId, username, machineIp, sshUsername } = req.body;
   const privateKeyFile = req.files.privateKey;
   const privateKeyName = privateKeyFile.name;
   const machineID = Date.now().toString();

   //Saving the private key with unique ID in order to let user have same name for private keys.
   const privateKeyPath = `src/database/users/${username}/SSHKeys/${machineID}`;
   const userMachinesListPath = `src/database/users/${username}/machine_list.json`;

   fs.readFile(userMachinesListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewMachine: Couldn't read userMachinesList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      //Convert the fetched data into a list
      const jsonData = JSON.parse(data);

      const newMachine = {
         machineID,
         sshUsername,
         machineIp,
         privateKeyName,
      };

      jsonData.push(newMachine);
      stringifyData = JSON.stringify(jsonData);

      fs.writeFile(userMachinesListPath, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in addNewMachine: Couldn't write into userMachinesList file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });

   privateKeyFile.mv(privateKeyPath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in addNewMachine: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         fs.chmodSync(privateKeyPath, 0o600);
         res.status(200).send("Machine Added Successfully");
      }
   });
};

module.exports.getUserMachineList = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const sshMachinesFilePath = `src/database/users/${username}/machine_list.json`;
   fs.readFile(sshMachinesFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getUserMachineList: Couldn't read userMachinesListFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);
      res.status(200).send(jsonData);
   });
};

module.exports.saveComponentMachineInfo = (req, res) => {
   const { userId, username, componentName, experimentId, machineID } = req.body;
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in saveComponentMachineInfo: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);

      jsonData[componentName].machineID = machineID;

      stringifyData = JSON.stringify(jsonData);

      fs.writeFile(dependencyFile, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in saveComponentMachineInfo: Couldn't write on dependency file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });

      res.status(200).send("Machine Configuration Saved Successfully");
   });
};

module.exports.getComponentSelectedMachine = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const experimentId = req.query.experimentId;

   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in saveComponentMachineInfo: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const machineID = jsonData[componentName].machineID;

      res.status(200).send(machineID);
   });
};