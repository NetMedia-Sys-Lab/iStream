const fs = require("fs");
const fsExtra = require("fs-extra");
const admZip = require("adm-zip");
const path = require("path");

const experimentModel = require("../models/experiment.model");
const dockerModel = require("../models/dockerConfig.model");

const writeToFile = require("../utils/fileUtils");

module.exports.createNewExperiment = (req, res) => {
   const { experimentId, experimentName, experimentDescription, userId, username, componentExistence } = req.body;

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
   const dockerConfigPath = `${ExperimentDirectoryName}/dockerConfig.json`;

   fs.mkdirSync(ExperimentDirectoryName);

   const stringifyExperimentData = JSON.stringify(experimentModel.experimentDataModel);

   let experimentConfigData = experimentModel.experimentConfigJSONData;
   experimentConfigData.componentExistence = componentExistence;
   // experimentConfigData.transcoderComponentExistence = transcoderComponentExistence;
   const stringifyExperimentConfigData = JSON.stringify(experimentConfigData);

   const stringifyExperimentDockerConfig = JSON.stringify(dockerModel.modulesDockerConfigModel);

   writeToFile(dependencyFilePath, stringifyExperimentData, "createNewExperiment");
   writeToFile(experimentConfigFilePath, stringifyExperimentConfigData, "createNewExperiment");
   writeToFile(dockerConfigPath, stringifyExperimentDockerConfig, "createNewExperiment");

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

   const userExperimentsListPath = `src/database/users/${username}/experiments_list.json`;

   fs.readFile(userExperimentsListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getExperimentConfig: Couldn't read userExperimentsListFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);
      let experimentData = jsonData.find((exp) => exp.experimentId == experimentId);

      if (experimentData == undefined) {
         res.status(400);
         res.send("This experiment doesn't exist for the user");
         return;
      } else {
         const experimentConfig = `src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json`;

         fs.readFile(experimentConfig, "utf8", function (err, data) {
            if (err) {
               let errorMessage = "Something went wrong in getExperimentConfig: Couldn't read experimentConfig file.";
               console.log(errorMessage);
               res.status(500).send(errorMessage);
            }
            const jsonData = JSON.parse(data);

            res.status(200).send(jsonData);
         });
      }
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

module.exports.downloadExperimentResults = async (req, res) => {
   const username = req.query.username;
   const experimentId = req.query.experimentId;

   const resultPath = `src/database/users/${username}/Experiments/${experimentId}/Results`;
   const pathToZip = `src/database/users/${username}/Experiments/${experimentId}/Results.zip`;

   var zip = new admZip();
   zip.addLocalFolder(resultPath);
   zip.writeZip(pathToZip);

   var file = fs.readFileSync(path.resolve(pathToZip), "base64");
   fs.rmSync(pathToZip);

   res.send(file);
};

module.exports.getExperimentResults = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;

   const resultsDirectory = `src/database/users/${username}/Experiments/${experimentId}/Results`;
   let resultsName = [];

   if (fs.existsSync(resultsDirectory)) {
      resultsName = fs.readdirSync(resultsDirectory);
   }

   res.status(200).send(resultsName);
};

module.exports.downloadResult = async (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const resultName = req.query.resultName;
   const resultPath = `src/database/users/${username}/Experiments/${experimentId}/Results/${resultName}`;
   const pathToZip = `src/database/users/${username}/Experiments/${experimentId}/Results/${resultName}.zip`;

   var zip = new admZip();
   zip.addLocalFolder(resultPath);
   zip.writeZip(pathToZip);

   var file = fs.readFileSync(path.resolve(pathToZip), "base64");
   fs.rmSync(pathToZip);

   res.send(file);
};

module.exports.deleteResult = (req, res) => {
   const { userId, username, experimentId, resultName } = req.body;

   const resultPath = `src/database/users/${username}/Experiments/${experimentId}/Results/${resultName}`;
   try {
      fs.rmSync(resultPath, {
         recursive: true,
      });
      res.status(200).send("Result deleted successfully");
   } catch (err) {
      let errorMessage = "Something went wrong in deleteExperiment: Couldn't delete directory.";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }
};

