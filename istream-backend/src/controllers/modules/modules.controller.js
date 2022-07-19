const fs = require("fs");
const decompress = require("decompress");
const writeToFile = require("../../utils/fileUtils");
const modulesConfigModel = require("../../models/modulesConfig.model");
const experimentModel = require("../../models/experiment.model");

module.exports.getDefaultModules = (req, res) => {
   const componentName = req.query.componentName;
   const modulesDirectoryPath = `src/database/supportedModules/${componentName}`;
   let moduleList = [];
   try {
      if (fs.existsSync(modulesDirectoryPath)) moduleList = fs.readdirSync(modulesDirectoryPath);
   } catch (e) {
      let errorMessage = "Something went wrong in getDefaultModules";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }
   res.send(moduleList);
};

module.exports.getUserModules = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const modulesDirectoryPath = `src/database/users/${username}/Modules/${componentName}`;
   let moduleList = [];
   try {
      if (fs.existsSync(modulesDirectoryPath)) moduleList = fs.readdirSync(modulesDirectoryPath);
   } catch (e) {
      let errorMessage = "Something went wrong in getUserModules";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }
   res.send(moduleList);
};

module.exports.create = (req, res) => {
   const { userId, username, componentName, moduleName, moduleDescription } = req.body;
   const file = req.files.moduleFile;
   const zipFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}.zip`;
   const destinationFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}`;
   const configFileDirectory = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;

   file.mv(zipFilePath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in Create new Module: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      fs.mkdirSync(destinationFilePath);

      decompress(zipFilePath, destinationFilePath).then((err) => {
         try {
            fs.unlinkSync(zipFilePath);
            fs.mkdirSync(configFileDirectory);
            res.status(200).send("New Module Added Successfully");
         } catch {
            let errorMessage = "Something went wrong in Create new Module: couldn't unzip the file";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });
};

module.exports.addNewConfig = (req, res) => {
   const { userId, username, isUserModule, componentName, moduleName, configName } = req.body;
   const file = req.files.configFile;
   let filePath = "";
   if (isUserModule === "true") {
      filePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs/${configName}.${file.name.split(".")[1]}`;
   } else {
      const configFileDirectory = `src/database/users/${username}/CustomModuleConfigs/${componentName}/${moduleName}`;
      fs.mkdirSync(configFileDirectory, { recursive: true });
      filePath = `src/database/users/${username}/CustomModuleConfigs/${componentName}/${moduleName}/${configName}.${
         file.name.split(".")[1]
      }`;
   }

   file.mv(filePath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in add New Config: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Config File Added Successfully");
      }
   });
};

module.exports.getConfigFiles = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleName = req.query.moduleName;
   const isUserModule = req.query.isUserModule;
   let configFilesDirectoryPath = "";
   if (isUserModule === "true") {
      configFilesDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;
   } else {
      configFilesDirectoryPath = `src/database/users/${username}/CustomModuleConfigs/${componentName}/${moduleName}`;
   }
   let configFilesList = [];
   try {
      if (fs.existsSync(configFilesDirectoryPath)) configFilesList = fs.readdirSync(configFilesDirectoryPath);
   } catch (e) {
      let errorMessage = "Something went wrong in getUserModules";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }
   res.send(configFilesList);
};

module.exports.addNewVideo = (req, res) => {
   const { userId, username, componentName, resolution, frameRate, codec, bitRate } = req.body;
   const file = req.files.video;
   const videoName = file.name;
   const videoID = Date.now().toString();
   const videoPath = `src/database/users/${username}/Videos/${videoID}`;

   const videosListFilePath = `src/database/users/${username}/Videos/videos_list.json`;

   fs.readFile(videosListFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewVideo";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const newVideo = {
         id: videoID,
         isDataset: false,
         name: videoName,
         resolution: resolution,
         frameRate: frameRate,
         bitRate: bitRate,
         codec: codec,
      };

      //Add the new experiment to the existing experiments list.
      jsonData.unshift(newVideo);
      let stringifyData = JSON.stringify(jsonData);

      fs.writeFile(videosListFilePath, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in addNewVideo";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });

   file.mv(videoPath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in add New Video: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Video Saved Successfully");
      }
   });
};

module.exports.addNewVideoDataset = (req, res) => {
   const { userId, username, componentName, datasetName } = req.body;
   const dataset = req.files.dataset;
   const name = dataset.name;
   const datasetID = Date.now().toString();
   const datasetPath = `src/database/users/${username}/Videos/${datasetID}`;

   const videosListFilePath = `src/database/users/${username}/Videos/videos_list.json`;

   fs.readFile(videosListFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewVideoDataset";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const newVideo = {
         id: datasetID,
         isDataset: true,
         name: `${datasetName}.${name.split(".")[1]}`,
      };

      //Add the new experiment to the existing experiments list.
      jsonData.unshift(newVideo);
      let stringifyData = JSON.stringify(jsonData);

      fs.writeFile(videosListFilePath, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in addNewVideoDataset";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });

   dataset.mv(datasetPath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in add New Dataset: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Dataset Saved Successfully");
      }
   });
};

module.exports.getVideosList = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const videosListPath = `src/database/users/${username}/Videos/videos_list.json`;
   fs.readFile(videosListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getVideosList: Couldn't read videosList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.send(data);
   });
};

module.exports.saveModuleData = (req, res) => {
   const { userId, username, componentName, experimentId, selectedModuleType, selectedModule, selectedConfigFile } = req.body;
   let iStreamNetworkManualConfig;
   if (componentName === "Network") {
      iStreamNetworkManualConfig = req.body.iStreamNetworkManualConfig;
   }

   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in saveModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);

      jsonData[componentName].name = selectedModule;
      jsonData[componentName].config = selectedConfigFile;
      jsonData[componentName].type = selectedModuleType;
      if (componentName == "Network") {
         jsonData[componentName].manualConfig = iStreamNetworkManualConfig.toString();
         if (iStreamNetworkManualConfig == false) jsonData[componentName].config = "";
      }

      if (componentName == "Client" && selectedModule == "Dash.js") {
         jsonData[componentName].machineID = "0";
      }

      stringifyData = JSON.stringify(jsonData);

      fs.writeFile(dependencyFile, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in saveModuleData: Couldn't write on dependency file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });

   res.status(200).send("Configuration Saved Successfully");
};

module.exports.getModuleData = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const experimentId = req.query.experimentId;
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   const userMachinesListPath = `src/database/users/${username}/machine_list.json`;
   let machineList = JSON.parse(fs.readFileSync(userMachinesListPath, "utf8"));

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);
      const moduleData = jsonData[componentName];

      if (moduleData.machineID !== "" && moduleData.machineID !== "0") {
         moduleData.machineID = machineList.find((machine) => machine.machineID === moduleData.machineID)["machineIp"];
      }

      res.status(200).send(moduleData);
   });
};

module.exports.getNetworkConfiguration = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const networkConfigFile = `src/database/users/${username}/Experiments/${experimentId}/networkConfig.json`;

   if (!fs.existsSync(networkConfigFile)) {
      const stringifyNetworkConfigData = JSON.stringify(modulesConfigModel.networkConfigJSONData);
      writeToFile(networkConfigFile, stringifyNetworkConfigData, "setNetworkConfiguration");
   }

   fs.readFile(networkConfigFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getNetworkConfiguration: Couldn't read networkConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      res.status(200).send(jsonData);
   });
};

module.exports.setNetworkConfiguration = (req, res) => {
   const { userId, username, experimentId, port, delay, packetLoss, corruptPacket, bandwidth } = req.body;
   const networkConfigFile = `src/database/users/${username}/Experiments/${experimentId}/networkConfig.json`;

   if (!fs.existsSync(networkConfigFile)) {
      const stringifyNetworkConfigData = JSON.stringify(modulesConfigModel.networkConfigJSONData);
      writeToFile(networkConfigFile, stringifyNetworkConfigData, "setNetworkConfiguration");
   }

   const networkConfigData = {
      port: port,
      delay: delay,
      packetLoss: packetLoss,
      corruptPacket: corruptPacket,
      bandwidth: bandwidth,
   };

   const stringifyNetworkConfig = JSON.stringify(networkConfigData);

   fs.writeFile(networkConfigFile, stringifyNetworkConfig, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in setNetworkConfiguration: Couldn't write in networkConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
   });

   res.status(200).send("Successfully saved network configuration");
};

module.exports.getServerConfiguration = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const serverConfigFile = `src/database/users/${username}/Experiments/${experimentId}/serverConfig.json`;

   if (!fs.existsSync(serverConfigFile)) {
      const stringifyServerConfigData = JSON.stringify(modulesConfigModel.serverConfigJSONData);
      writeToFile(serverConfigFile, stringifyServerConfigData, "setServerConfiguration");
   }

   fs.readFile(serverConfigFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getServerConfiguration: Couldn't read serverConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      res.status(200).send(jsonData);
   });
};

module.exports.setServerConfiguration = (req, res) => {
   const { userId, username, experimentId, serverPort } = req.body;
   const serverConfigFile = `src/database/users/${username}/Experiments/${experimentId}/serverConfig.json`;

   if (!fs.existsSync(serverConfigFile)) {
      const stringifyServerConfigData = JSON.stringify(modulesConfigModel.serverConfigJSONData);
      writeToFile(serverConfigFile, stringifyServerConfigData, "setServerConfiguration");
   }

   const serverConfigData = {
      port: serverPort,
   };

   const stringifyServerConfig = JSON.stringify(serverConfigData);

   fs.writeFile(serverConfigFile, stringifyServerConfig, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in setServerConfiguration: Couldn't write in ServerConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
   });

   res.status(200).send("Successfully saved server configuration");
};

module.exports.saveVideoModuleData = (req, res) => {
   const { userId, username, componentName, experimentId, videoList } = req.body;
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in saveVideoModuleData: Couldn't read in dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      //Convert the dependencies data into json object
      const jsonData = JSON.parse(data);
      jsonData[componentName].id = videoList;
      stringifyData = JSON.stringify(jsonData);

      fs.writeFile(dependencyFile, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in saveVideoModuleData: Couldn't write in dependency file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
         res.status(200).send("Video Data Saved Successfully");
      });
   });
};

module.exports.getVideoModuleData = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const experimentId = req.query.experimentId;

   const userMachinesListPath = `src/database/users/${username}/machine_list.json`;
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;

   let machineList = JSON.parse(fs.readFileSync(userMachinesListPath, "utf8"));

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getVideoModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const videosData = jsonData[componentName];

      if (videosData.machineID !== "" && videosData.machineID !== "0") {
         videosData.machineID = machineList.find((machine) => machine.machineID === videosData.machineID)["machineIp"];
      }

      res.status(200).send(videosData);
   });
};

module.exports.getConfigFileData = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleName = req.query.moduleName;
   const configFileName = req.query.configFileName;
   const isUserModule = req.query.isUserModule;

   let filePath = "";
   if (isUserModule === "true") {
      filePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs/${configFileName}`;
   } else {
      filePath = `src/database/users/${username}/CustomModuleConfigs/${componentName}/${moduleName}/${configFileName}`;
   }

   fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getConfigFileData: Couldn't read config file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      //Convert the data to string so that object response is also converted to string
      data = JSON.stringify(data);
      res.status(200).send(data);
   });
};

module.exports.updateConfigFileData = (req, res) => {
   const { username, componentName, isUserModule, moduleName, configName, data } = req.body;

   let filePath = "";
   if (isUserModule === true) {
      filePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs/${configName}`;
   } else {
      filePath = `src/database/users/${username}/CustomModuleConfigs/${componentName}/${moduleName}/${configName}`;
   }

   fs.writeFile(filePath, data, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in updateConfigFileData: Couldn't write in config file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      res.status(200).send("Config File Saved Successfully");
   });
};

module.exports.getHeadlessPlayerConfiguration = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const headlessPlayerConfigFile = `src/database/users/${username}/Experiments/${experimentId}/headlessPlayerConfig.json`;

   if (!fs.existsSync(headlessPlayerConfigFile)) {
      const stringifyHeadlessPlayerConfigData = JSON.stringify(modulesConfigModel.headlessPlayerJSONData);
      writeToFile(headlessPlayerConfigFile, stringifyHeadlessPlayerConfigData, "setHeadlessPlayerConfiguration");
   }

   fs.readFile(headlessPlayerConfigFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getHeadlessPlayerConfiguration: Couldn't read headlessPlayerConfigFile file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      res.status(200).send(jsonData);
   });
};

module.exports.setHeadlessPlayerConfiguration = (req, res) => {
   const { userId, username, experimentId, adaptationAlgorithm, mpdFileName, connectingPort } = req.body;
   const headlessPlayerConfigFile = `src/database/users/${username}/Experiments/${experimentId}/headlessPlayerConfig.json`;

   if (!fs.existsSync(headlessPlayerConfigFile)) {
      const stringifyHeadlessPlayerConfigData = JSON.stringify(modulesConfigModel.headlessPlayerJSONData);
      writeToFile(headlessPlayerConfigFile, stringifyHeadlessPlayerConfigData, "setHeadlessPlayerConfiguration");
   }

   const headlessPlayerConfigData = {
      adaptationAlgorithm: adaptationAlgorithm,
      mpdFileName: mpdFileName,
      connectingPort: connectingPort,
   };

   const stringifyHeadlessPlayerConfig = JSON.stringify(headlessPlayerConfigData);

   fs.writeFile(headlessPlayerConfigFile, stringifyHeadlessPlayerConfig, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in setHeadlessPlayerConfiguration: Couldn't write in HeadlessPlayerConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
   });

   res.status(200).send("Successfully saved HeadlessPlayer configuration");
};

module.exports.deleteUserModule = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleName = req.query.moduleName;

   const userExperimentsPath = `src/database/users/${username}/Experiments`;

   let allExperiments = fs.readdirSync(userExperimentsPath);
   allExperiments.forEach((experimentID) => {
      const experimentDependencyFilePath = userExperimentsPath + `/${experimentID}/dependency.json`;
      if (fs.existsSync(experimentDependencyFilePath)) {
         let dependencyFile = JSON.parse(fs.readFileSync(experimentDependencyFilePath, "utf8"));

         if (dependencyFile[componentName]["name"] === moduleName) {
            dependencyFile[componentName] = experimentModel.experimentJSONData[componentName];
            const stringifyDependencyFile = JSON.stringify(dependencyFile);
            fs.writeFileSync(experimentDependencyFilePath, stringifyDependencyFile);
         }
      }
   });

   const modulePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}`;

   fs.rm(modulePath, { recursive: true }, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in deleteUserModule: Couldn't delete in modulePath directory.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.status(200).send("Successfully delete user's module");
   });
};

module.exports.deleteUserVideo = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const videoID = req.query.videoID;

   const userExperimentsPath = `src/database/users/${username}/Experiments`;

   let allExperiments = fs.readdirSync(userExperimentsPath);
   allExperiments.forEach((experimentID) => {
      const experimentDependencyFilePath = userExperimentsPath + `/${experimentID}/dependency.json`;
      if (fs.existsSync(experimentDependencyFilePath)) {
         let dependencyFile = JSON.parse(fs.readFileSync(experimentDependencyFilePath, "utf8"));

         if (dependencyFile["Video"]["id"].includes(videoID)) {
            dependencyFile["Video"]["id"] = dependencyFile["Video"]["id"].filter((id) => {
               return id != videoID;
            });
            const stringifyDependencyFile = JSON.stringify(dependencyFile);
            fs.writeFileSync(experimentDependencyFilePath, stringifyDependencyFile);
         }
      }
   });

   const videosListPath = `src/database/users/${username}/Videos/videos_list.json`;
   const videoPath = `src/database/users/${username}/Videos/${videoID}`;

   fs.rmSync(videoPath);

   fs.readFile(videosListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in deleteUserVideo: Couldn't read videosListPath file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      let videosList = JSON.parse(data);

      videosList = videosList.filter((obj) => {
         return obj.id != videoID.toString();
      });

      const stringifyVideosList = JSON.stringify(videosList);

      fs.writeFile(videosListPath, stringifyVideosList, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in deleteUserVideo: Couldn't write in videosListPath file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });

      res.status(200).send("Successfully delete user's video.");
   });
};
