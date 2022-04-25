const fs = require("fs");
const decompress = require("decompress");

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
   const destinationFilePath = `src/database/users/${username}/Modules/${componentName}`;
   const configFileDirectory = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;

   file.mv(zipFilePath, (err) => {
      if (err) {
         let errorMessage = "Something went wrong in Create new Module: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      decompress(zipFilePath, destinationFilePath, {
         map: (file) => {
            file.path = file.path.replace(file.path.split("/")[0], moduleName);
            return file;
         },
      }).then((err) => {
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
   const { userId, username, componentName, moduleName, configName } = req.body;
   const file = req.files.configFile;
   const filePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs/${configName}.${
      file.name.split(".")[1]
   }`;

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
   const configFilesDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/Configs`;
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
   const videoPath = `src/database/Videos/${videoID}.${videoName.split(".")[1]}`;

   const videosListFilePath = `src/database/Videos/videos_list.json`;

   fs.readFile(videosListFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewVideo";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const newVideo = {
         videoId: videoID,
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
         let errorMessage = "Something went wrong in add New Config: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Video Saved Successfully");
      }
   });
};

module.exports.getVideosList = (req, res) => {
   const videosListPath = `src/database/Videos/videos_list.json`;
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
      // if (componentName == "Network") {
      //    console.log("here");
      //    jsonData[componentName].manualConfig = manualConfig.toString();
      // }

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

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }
      const jsonData = JSON.parse(data);
      const moduleData = jsonData[componentName];

      res.status(200).send(moduleData);
   });
};

module.exports.getNetworkConfiguration = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const experimentId = req.query.experimentId;
   const networkConfigFile = `src/database/users/${username}/Experiments/${experimentId}/networkConfig.json`;

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
   const { userId, username, experimentId, delay, packetLoss, corruptPacket, bandwidth } = req.body;
   const networkConfigFile = `src/database/users/${username}/Experiments/${experimentId}/networkConfig.json`;

   const networkConfigData = {
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
   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getVideoModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const videosList = jsonData[componentName].id;
      res.status(200).send(videosList);
   });
};
