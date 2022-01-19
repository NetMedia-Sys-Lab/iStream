const fs = require("fs");
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
      fs.rmdirSync(deleteFolder, {
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

      //Write the updated file again
      writeToFile(experimentsFilePath, JSON.stringify(updatedExperimentList), "deleteExperiment");

      res.status(200).send("Experiment Deleted Successfully");
   });
};

module.exports.duplicateExperiment = (req, res) => {
   
};
