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

   res.send("Success");
};
