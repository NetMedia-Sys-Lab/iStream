const fs = require("fs");
const fsExtra = require("fs-extra");
const experimentModel = require("../../models/experiment.model");
const writeToFile = require("../../utils/fileUtils");
var path = require("path");

module.exports.createNewExperiment = (req, res) => {
   const {
      experimentId,
      experimentName,
      experimentDescription,
      userId,
      username,
      networkComponentExistence,
      transcoderComponentExistence,
   } = req.body;

   const experimentDate = new Date(parseInt(experimentId)).toLocaleDateString();
   const experimentTime = new Date(parseInt(experimentId)).toLocaleTimeString();

   //update the experiments_list.json file for the user
   //get the file path where the users experiments are saved
   const userExperimentsListFile = `src/database/users/${username}/experiments_list.json`;

   fs.readFile(userExperimentsListFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in createNewExperiment: Couldn't read userExperimentsListFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      //Convert the experiments list into json object
      const jsonData = JSON.parse(data);
      //create a new experiment object
      const newExperiment = {
         experimentId: experimentId,
         experimentName: experimentName,
         description: experimentDescription,
         experimentDate: experimentDate,
         experimentTime: experimentTime,
         networkComponentExistence: networkComponentExistence,
         transcoderComponentExistence: transcoderComponentExistence,
      };

      //Add the new experiment to the existing experiments list.
      jsonData.unshift(newExperiment);
      const stringifyData = JSON.stringify(jsonData);

      writeToFile(userExperimentsListFile, stringifyData, "createNewExperiment");
   });

   //Create the new experiment folder in the users Experiment folder
   const ExperimentDirectoryName = `src/database/users/${username}/Experiments/${experimentId}`;
   const dependencyFilePath = `${ExperimentDirectoryName}/dependency.json`;
   const experimentConfigFilePath = `${ExperimentDirectoryName}/experimentConfig.json`;

   fs.mkdirSync(ExperimentDirectoryName);

   const stringifyExperimentData = JSON.stringify(experimentModel.experimentJSONData);
   const stringifyExperimentConfigData = JSON.stringify(experimentModel.experimentConfigJSONData);

   writeToFile(dependencyFilePath, stringifyExperimentData, "createNewExperiment");
   writeToFile(experimentConfigFilePath, stringifyExperimentConfigData, "createNewExperiment");

   res.status(200).send("New Experiment Created Successfully");
};

module.exports.getUserExperimentsList = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentsListFileName = `src/database/users/${username}/experiments_list.json`;
   fs.readFile(experimentsListFileName, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getUserExperimentsList: Couldn't read experimentsListFileName file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.send(data);
   });
};

module.exports.deleteExperiment = (req, res) => {
   const { userId, username, experimentId } = req.body;

   //Remove the folder whose experiment id is experimentID
   const deleteFolder = `src/database/users/${username}/Experiments/${experimentId}`;
   try {
      fs.rmSync(deleteFolder, {
         recursive: true,
      });
   } catch (err) {
      let errorMessage = "Something went wrong in deleteExperiment: Couldn't delete directory.";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   //Update the user experiment_list.json file
   const experimentsFilePath = `src/database/users/${username}/experiments_list.json`;
   fs.readFile(experimentsFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in deleteExperiment: Couldn't read experimentsList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      experimentList = JSON.parse(data);
      const updatedExperimentList = experimentList.filter((experiment) => experiment.experimentId != experimentId);

      writeToFile(experimentsFilePath, JSON.stringify(updatedExperimentList), "deleteExperiment");

      res.status(200).send("Experiment Deleted Successfully");
   });
};

module.exports.duplicateExperiment = (req, res) => {
   const { userId, username, oldExperimentId, experimentName, newExperimentId } = req.body;

   const newExperimentDate = new Date(parseInt(newExperimentId)).toLocaleDateString();
   const newExperimentTime = new Date(parseInt(newExperimentId)).toLocaleTimeString();
   const folderToCopy = `src/database/users/${username}/Experiments/${oldExperimentId}`;
   const copyToFolder = `src/database/users/${username}/Experiments/${newExperimentId}`;

   try {
      fs.mkdirSync(copyToFolder);
      fsExtra.copySync(folderToCopy, copyToFolder);
   } catch (err) {
      let errorMessage = "Something went wrong in duplicateExperiment: Couldn't copy experiment directory.";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   const userExperimentsListFile = `src/database/users/${username}/experiments_list.json`;
   //fetch the data from the file
   fs.readFile(userExperimentsListFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in duplicateExperiment: Couldn't read experimentsList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const oldExperiment = jsonData.find((exp) => exp.experimentId == oldExperimentId);

      const newExperiment = {
         experimentId: newExperimentId,
         experimentName: experimentName,
         description: oldExperiment.description,
         experimentDate: newExperimentDate,
         experimentTime: newExperimentTime,
         networkComponentExistence: oldExperiment.networkComponentExistence,
         transcoderComponentExistence: oldExperiment.transcoderComponentExistence,
      };

      //Add the new experiment to the existing experiments list.
      jsonData.unshift(newExperiment);

      writeToFile(userExperimentsListFile, JSON.stringify(jsonData), "duplicateExperiment");

      res.status(200).send("Experiment duplicated Successfully");
   });
};

module.exports.getExperimentConfig = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;

   const userExperimentsListFile = `src/database/users/${username}/experiments_list.json`;

   fs.readFile(userExperimentsListFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getExperimentConfig: Couldn't read userExperimentsListFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);

      res.status(200).send(jsonData.filter((data) => data.experimentId === experimentId)[0]);
   });
};

module.exports.getExperimentData = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getExperimentData: Couldn't read dependencyFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);

      res.status(200).send(jsonData);
   });
};

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

function arrayBuffer2str(buf) {
   return String.fromCharCode.apply(null, new Uint16Array(buf));
}

module.exports.build = (endpoint, socket) => {
   socket.on("subscribeToBuildExperiment", (userInfo) => {
      const spawn = require("child_process").spawn;
      const child = spawn("bash", ["src/database/scripts/build.sh", userInfo.username, userInfo.experimentId]);
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (data) => {
         try {
            endpoint.emit("getExperiment‌BuildInfo", data.toString().split("\n"));
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (data) => {
         try {
            console.log(arrayBuffer2str(data));
         } catch (e) {
            child.kill();
         }
      });

      child.on("close", function (code) {
         endpoint.emit("getExperiment‌BuildInfo", "SOCKET_CLOSED");
         socket.disconnect();
      });
   });
};

module.exports.run = (endpoint, socket) => {
   socket.on("subscribeToRunExperiment", (userInfo) => {
      const experimentConfig = `src/database/users/${userInfo.username}/Experiments/${userInfo.experimentId}/experimentConfig.json`;

      const experimentConfigData = {
         repetition: userInfo.numberOfRepetition,
      };

      const stringifyExperimentConfig = JSON.stringify(experimentConfigData);

      fs.writeFile(experimentConfig, stringifyExperimentConfig, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in setServerConfiguration: Couldn't write in ServerConfig file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });

      const spawn = require("child_process").spawn;
      const child = spawn("bash", ["src/database/scripts/run.sh", userInfo.username, userInfo.experimentId]);

      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (data) => {
         try {
            endpoint.emit("getExperiment‌RunInfo", data.toString().split("\n"));
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (data) => {
         try {
            console.log(arrayBuffer2str(data));
         } catch (e) {
            child.kill();
         }
      });

      child.on("close", function (code) {
         endpoint.emit("getExperiment‌RunInfo", "SOCKET_CLOSED");
         socket.disconnect();
      });
   });
};

module.exports.downloadExperimentResult = async (req, res) => {
   const username = req.query.username;
   const experimentId = req.query.experimentId;

   const spawnSync = require("child_process").spawnSync;
   spawnSync("bash", ["src/database/scripts/downloadResults.sh", username, experimentId]);
   var file = fs.readFileSync(path.resolve(`src/database/users/${username}/Experiments/${experimentId}/Results.zip`), "base64");

   res.send(file);
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
         let components = ["Video", "Server", "Transcoder", "Network", "Client"];

         components.forEach((componentName) => {
            if (dependencyFile[componentName]["machineID"] === machineID) {
               dependencyFile[componentName] = experimentModel.experimentJSONData[componentName];
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
