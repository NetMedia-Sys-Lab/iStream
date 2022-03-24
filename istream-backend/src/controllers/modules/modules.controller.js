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
         let errorMessage =
            "Something went wrong in Create new Module: couldn't write file into server";
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
         let errorMessage =
            "Something went wrong in add New Config: couldn't write file into server";
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
      if (fs.existsSync(configFilesDirectoryPath))
         configFilesList = fs.readdirSync(configFilesDirectoryPath);
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
   const videoPath = `src/database/Videos/${videoName.split(".")[0]}_${resolution}.${
      videoName.split(".")[1]
   }`;

   const videosListFilePath = `src/database/Videos/videos_list.json`;

   fs.readFile(videosListFilePath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewVideo";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const newVideo = {
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
         let errorMessage =
            "Something went wrong in add New Config: couldn't write file into server";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      } else {
         res.status(200).send("New Video Saved Successfully");
      }
   });
};
