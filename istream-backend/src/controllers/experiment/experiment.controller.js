const fs = require("fs");
const fsExtra = require("fs-extra");
const experimentModel = require("../../models/experiment.model");
const writeToFile = require("../../utils/fileUtils");

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
         let errorMessage =
            "Something went wrong in createNewExperiment: Couldn't read userExperimentsListFile file.";
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
   const networkConfigFilePath = `${ExperimentDirectoryName}/networkConfig.json`;
   const experimentConfigFilePath = `${ExperimentDirectoryName}/experimentConfig.json`;

   fs.mkdirSync(ExperimentDirectoryName);
   //Make folders for the various module configuration files. The config file for a module goes inside these folders.
   const folderList = ["Transcoder", "Network", "Server", "Client"];
   for (let i = 0; i < folderList.length; i++) {
      fs.mkdirSync(`${ExperimentDirectoryName}/${folderList[i]}`);
   }

   const stringifyExperimentData = JSON.stringify(experimentModel.experimentJSONData);
   const stringifyNetworkConfigData = JSON.stringify(experimentModel.networkConfigJSONData);
   const stringifyExperimentConfigData = JSON.stringify(experimentModel.experimentConfigJSONData);

   writeToFile(dependencyFilePath, stringifyExperimentData, "createNewExperiment");
   writeToFile(networkConfigFilePath, stringifyNetworkConfigData, "createNewExperiment");
   writeToFile(experimentConfigFilePath, stringifyExperimentConfigData, "createNewExperiment");

   res.status(200).send("New Experiment Created Successfully");
};

module.exports.getUserExperimentsList = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentsListFileName = `src/database/users/${username}/experiments_list.json`;
   fs.readFile(experimentsListFileName, "utf8", function (err, data) {
      if (err) {
         let errorMessage =
            "Something went wrong in getUserExperimentsList: Couldn't read experimentsListFileName file.";
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
         let errorMessage =
            "Something went wrong in deleteExperiment: Couldn't read experimentsList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      experimentList = JSON.parse(data);
      const updatedExperimentList = experimentList.filter(
         (experiment) => experiment.experimentId != experimentId
      );

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
      let errorMessage =
         "Something went wrong in duplicateExperiment: Couldn't copy experiment directory.";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   const userExperimentsListFile = `src/database/users/${username}/experiments_list.json`;
   //fetch the data from the file
   fs.readFile(userExperimentsListFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage =
            "Something went wrong in duplicateExperiment: Couldn't read experimentsList file.";
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
