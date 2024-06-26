const fs = require("fs");

module.exports.getModuleConfigsAndParameters = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleName = req.query.moduleName;
   const isUserModule = req.query.isUserModule;

   let moduleConfigsDirectoryPath = "";
   let moduleParametersDirectoryPath = "";

   if (isUserModule === "true") {
      moduleConfigsDirectoryPath = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}`;
      moduleParametersDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/configParameters.json`;
      moduleParametersUISchemaDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/parametersUISchema.json`;
   } else {
      moduleConfigsDirectoryPath = `src/database/users/${username}/ModulesConfigs/iStream/${componentName}/${moduleName}`;
      moduleParametersDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/configParameters.json`;
      moduleParametersUISchemaDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/parametersUISchema.json`;
   }

   let moduleConfigsList = [];
   let moduleParameters = {};
   let advanceConfigurationExist = true;
   let parametersUISchema = {};

   try {
      if (fs.existsSync(moduleConfigsDirectoryPath)) moduleConfigsList = fs.readdirSync(moduleConfigsDirectoryPath);
   } catch (e) {
      let errorMessage = "Something went wrong in reading module configs directory";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   try {
      if (fs.existsSync(moduleParametersDirectoryPath)) {
         let moduleParametersData = JSON.parse(fs.readFileSync(moduleParametersDirectoryPath));
         advanceConfigurationExist = moduleParametersData.advancedConfiguration;
         moduleParameters = moduleParametersData.parameters;
      }
      if (fs.existsSync(moduleParametersUISchemaDirectoryPath))
         parametersUISchema = JSON.parse(fs.readFileSync(moduleParametersUISchemaDirectoryPath));
   } catch (e) {
      let errorMessage = "Something went wrong in reading module parameters file. Probably the Parameters file didn't define well";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   res.send({
      allConfigs: moduleConfigsList,
      advanceConfigurationExist: advanceConfigurationExist,
      parameters: moduleParameters,
      parametersUISchema: parametersUISchema,
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
      filePath = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}/${configFileName}`;
   } else {
      filePath = `src/database/users/${username}/ModulesConfigs/iStream/${componentName}/${moduleName}/${configFileName}`;
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
      filePath = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}/${configName}`;
   } else {
      filePath = `src/database/users/${username}/ModulesConfigs/iStream/${componentName}/${moduleName}/${configName}`;
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

   let scriptFileDirectory = "";

   if (isUserModule === "true") scriptFileDirectory = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}`;
   else scriptFileDirectory = `src/database/users/${username}/ModulesConfigs/iStream/${componentName}/${moduleName}`;

   fs.mkdirSync(scriptFileDirectory, { recursive: true });
   let filePath = `${scriptFileDirectory}/${configFileName}.${file.name.split(".")[1]}`;

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
