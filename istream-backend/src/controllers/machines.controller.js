const fs = require("fs");
const experimentModel = require("../models/experiment.model");

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

module.exports.deleteUserMachine = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const machineID = req.query.machineID;

   const userExperimentsPath = `src/database/users/${username}/Experiments`;

   let allExperiments = fs.readdirSync(userExperimentsPath);
   allExperiments.forEach((experimentID) => {
      const experimentDependencyFilePath = userExperimentsPath + `/${experimentID}/dependency.json`;
      if (fs.existsSync(experimentDependencyFilePath)) {
         let dependencyFile = JSON.parse(fs.readFileSync(experimentDependencyFilePath, "utf8"));
         let components = ["Server", "Network", "Client"];

         components.forEach((componentName) => {
            if (dependencyFile[componentName]["machineID"] === machineID) {
               dependencyFile[componentName] = experimentModel.experimentDataModel[componentName];
               const stringifyDependencyFile = JSON.stringify(dependencyFile);
               fs.writeFileSync(experimentDependencyFilePath, stringifyDependencyFile);
            }
         });
      }
   });

   const machineListPath = `src/database/users/${username}/machine_list.json`;
   const sshKeyPath = `src/database/users/${username}/SSHKeys/${machineID}`;

   fs.rmSync(sshKeyPath);

   fs.readFile(machineListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in deleteUserMachine: Couldn't read machineListPath file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      let machineList = JSON.parse(data);

      machineList = machineList.filter((obj) => {
         return obj.machineID != machineID.toString();
      });

      const stringifyMachineList = JSON.stringify(machineList);

      fs.writeFile(machineListPath, stringifyMachineList, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in deleteUserMachine: Couldn't write in machineListPath file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });

      res.status(200).send("Successfully delete user's machine.");
   });
};
