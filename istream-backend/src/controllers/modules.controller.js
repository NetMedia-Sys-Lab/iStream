const fs = require("fs");
const decompress = require("decompress");

const dockerModel = require("../models/dockerConfig.model");

module.exports.getDefaultModules = (req, res) => {
   const componentName = req.query.componentName;
   const modulesDirectoryPath = `src/database/defaultModules/${componentName}`;
   let moduleList = [];
   try {
      if (fs.existsSync(modulesDirectoryPath)) {
         moduleList = fs
            .readdirSync(modulesDirectoryPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
      }
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
      if (fs.existsSync(modulesDirectoryPath)) {
         moduleList = fs
            .readdirSync(modulesDirectoryPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
      }
   } catch (e) {
      let errorMessage = "Something went wrong in getUserModules";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }
   res.send(moduleList);
};

module.exports.getModuleConfigsAndParameters = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleName = req.query.moduleName;
   const isUserModule = req.query.isUserModule;

   let moduleConfigsDirectoryPath = "";
   let moduleParametersDirectoryPath = "";

   if (isUserModule === "true") {
      moduleConfigsDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;
      moduleParametersDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/configParameters.json`;
      moduleParametersUISchemaDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/parametersUISchema.json`;
   } else {
      moduleConfigsDirectoryPath = `src/database/users/${username}/iStreamModulesConfigs/${componentName}/${moduleName}`;
      moduleParametersDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/configParameters.json`;
      moduleParametersUISchemaDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/parametersUISchema.json`;
   }

   let moduleConfigsList = [];
   let moduleParameters = {};
   let parametersUISchema = {};

   try {
      if (fs.existsSync(moduleConfigsDirectoryPath)) moduleConfigsList = fs.readdirSync(moduleConfigsDirectoryPath);
   } catch (e) {
      let errorMessage = "Something went wrong in reading module configs directory";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   try {
      if (fs.existsSync(moduleParametersDirectoryPath)) moduleParameters = JSON.parse(fs.readFileSync(moduleParametersDirectoryPath));
      if (fs.existsSync(moduleParametersUISchemaDirectoryPath))
         parametersUISchema = JSON.parse(fs.readFileSync(moduleParametersUISchemaDirectoryPath));
   } catch (e) {
      let errorMessage = "Something went wrong in reading module parameters file. Probably the Parameters file didn't define well";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   res.send({ allConfigs: moduleConfigsList, parameters: moduleParameters, parametersUISchema: parametersUISchema });
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
      moduleData["defaultConfigParameters"] = {};

      if (moduleData.customConfig === false) {
         const moduleConfigFilePath = `src/database/users/${username}/Experiments/${experimentId}/${componentName}Config.json`;
         moduleData["defaultConfigParameters"] = JSON.parse(fs.readFileSync(moduleConfigFilePath));
      }

      if (moduleData.machineID !== "" && moduleData.machineID !== "0") {
         moduleData.machineID = machineList.find((machine) => machine.machineID === moduleData.machineID)["machineIp"];
      }

      res.status(200).send(moduleData);
   });
};

module.exports.getModuleDockerConfig = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const experimentId = req.query.experimentId;
   const dockerConfigPath = `src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json`;
   const dockerConfigForm = dockerModel.dockerConfigForm;

   fs.readFile(dockerConfigPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getModuleDockerData: Couldn't read dockerConfig file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);
      let moduleDockerData = {};
      moduleDockerData["values"] = jsonData[componentName];
      moduleDockerData["parameters"] = dockerConfigForm;

      res.status(200).send(moduleDockerData);
   });
};

module.exports.create = (req, res) => {
   const { userId, username, componentName, moduleName, moduleDescription } = req.body;
   const file = req.files.moduleFile;
   const zipFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}.zip`;
   const destinationFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}`;
   const configsFileDirectory = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;

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
            fs.mkdirSync(configsFileDirectory);
            res.status(200).send("New Module Added Successfully");
         } catch {
            let errorMessage = "Something went wrong in Create new Module: couldn't unzip the file";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
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
      filePath = `src/database/users/${username}/iStreamModulesConfigs/${componentName}/${moduleName}/${configFileName}`;
   }

   fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getConfigFileData: Couldn't read config file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

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
      filePath = `src/database/users/${username}/iStreamModulesConfigs/${componentName}/${moduleName}/${configName}`;
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

module.exports.addNewConfigFile = (req, res) => {
   const { userId, username, isUserModule, componentName, moduleName, configFileName } = req.body;
   const file = req.files.configFile;

   let filePath = "";
   if (isUserModule === "true") {
      filePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs/${configFileName}.${
         file.name.split(".")[1]
      }`;
   } else {
      const scriptsFileDirectory = `src/database/users/${username}/iStreamModulesConfigs/${componentName}/${moduleName}`;
      fs.mkdirSync(scriptsFileDirectory, { recursive: true });
      filePath = `src/database/users/${username}/iStreamModulesConfigs/${componentName}/${moduleName}/${configFileName}.${
         file.name.split(".")[1]
      }`;
   }

   file.mv(filePath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in add New Scripts: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Script File Added Successfully");
      }
   });
};

module.exports.getUserVideosList = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const videosListPath = `src/database/users/${username}/Videos/videos_list.json`;
   fs.readFile(videosListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getUserVideosList: Couldn't read videosList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.send(data);
   });
};

module.exports.addNewVideo = (req, res) => {
   const { userId, username, resolution, frameRate, codec, bitRate } = req.body;
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
   const { userId, username, datasetName } = req.body;
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

module.exports.getDefaultVideosList = (req, res) => {
   const defaultVideosListPath = `src/database/defaultVideos/default_videos_list.json`;
   fs.readFile(defaultVideosListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getDefaultVideosList: Couldn't read defaultVideosList file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.send(data);
   });
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

module.exports.saveModuleData = (req, res) => {
   const { userId, username, componentName, experimentId, selectedModuleType, selectedModule, customConfig } = req.body;
   let selectedConfigFileName;
   let defaultConfigParameters;
   if (customConfig) {
      selectedConfigFileName = req.body.selectedConfigFileName;
   } else {
      defaultConfigParameters = req.body.defaultConfigParameters;
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
      jsonData[componentName].type = selectedModuleType;
      jsonData[componentName].customConfig = customConfig;

      const componentConfigFilePath = `src/database/users/${username}/Experiments/${experimentId}/${componentName}Config.json`;

      if (customConfig) {
         if (fs.existsSync(componentConfigFilePath)) fs.rmSync(componentConfigFilePath);
         jsonData[componentName].configName = selectedConfigFileName;
      } else {
         jsonData[componentName].configName = "";
         fs.writeFileSync(componentConfigFilePath, JSON.stringify(defaultConfigParameters));
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
