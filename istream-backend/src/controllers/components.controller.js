const fs = require("fs");
const decompress = require("decompress");
const { moduleDataModel, moduleInfoModel } = require("../models/module.model");
const dockerModel = require("../models/dockerConfig.model");

module.exports.getModules = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;

   const defaultModulesListPath = `src/database/defaultModules/default_modules_list.json`;
   const userModulesListPath = `src/database/users/${username}/modules_list.json`;
   let modulesList = { iStream: [], user: [] };

   try {
      if (fs.existsSync(defaultModulesListPath)) {
         modulesList["iStream"] = JSON.parse(fs.readFileSync(defaultModulesListPath))[componentName];
      }
      if (fs.existsSync(userModulesListPath)) {
         modulesList["user"] = JSON.parse(fs.readFileSync(userModulesListPath))[componentName];
      }
   } catch (e) {
      let errorMessage = "Something went wrong in getModules for component";
      console.log(errorMessage);
      res.status(500).send(errorMessage);
   }

   res.send(modulesList);
};

module.exports.getComponentData = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const experimentId = req.query.experimentId;

   //For avoiding shallow copy
   let moduleData = JSON.parse(JSON.stringify(moduleDataModel));

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

      if (jsonData[componentName].name !== "") {
         moduleData.type = jsonData[componentName].type;
         moduleData.name = jsonData[componentName].name;
         moduleData.advanceConfiguration = jsonData[componentName].advanceConfig;
         moduleData.advanceConfig.selected = jsonData[componentName].configName;
         moduleData.machineID = jsonData[componentName].machineID;
         moduleData.advanceConfigurationExist = true;

         if (moduleData.type === "iStream") {
            const defaultModulesListPath = `src/database/defaultModules/default_modules_list.json`;
            allModules = JSON.parse(fs.readFileSync(defaultModulesListPath))[componentName];
            moduleData.id = allModules.find((module) => module.name === moduleData.name).id;
         } else if (moduleData.type === "Custom") {
            const userModulesListPath = `src/database/users/${username}/modules_list.json`;
            allModules = JSON.parse(fs.readFileSync(userModulesListPath))[componentName];
            moduleData.id = allModules.find((module) => module.name === moduleData.name).id;
         }

         if (moduleData.machineID !== "" && moduleData.machineID !== "0") {
            moduleData.machineID = machineList.find((machine) => machine.machineID === moduleData.machineID)["machineIp"];
         }

         if (moduleData.advanceConfiguration === false) {
            const moduleConfigFilePath = `src/database/users/${username}/Experiments/${experimentId}/${componentName}Config.json`;
            moduleData.simpleConfig.values = JSON.parse(fs.readFileSync(moduleConfigFilePath));
         }

         let moduleConfigsDirectoryPath = "";
         let moduleParametersDirectoryPath = "";
         let moduleParametersUISchemaDirectoryPath = "";
         const moduleName = moduleData.name;

         if (moduleData.type === "Custom") {
            moduleConfigsDirectoryPath = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}`;
            moduleParametersDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/configParameters.json`;
            moduleParametersUISchemaDirectoryPath = `src/database/users/${username}/Modules/${componentName}/${moduleName}/parametersUISchema.json`;
         } else {
            moduleConfigsDirectoryPath = `src/database/users/${username}/ModulesConfigs/iStream/${componentName}/${moduleName}`;
            moduleParametersDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/configParameters.json`;
            moduleParametersUISchemaDirectoryPath = `src/database/defaultModules/${componentName}/${moduleName}/parametersUISchema.json`;
         }

         try {
            if (fs.existsSync(moduleConfigsDirectoryPath)) moduleData.advanceConfig.names = fs.readdirSync(moduleConfigsDirectoryPath);
         } catch (e) {
            let errorMessage = "Something went wrong in reading module configs directory";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }

         try {
            if (fs.existsSync(moduleParametersDirectoryPath)) {
               let moduleParameterData = JSON.parse(fs.readFileSync(moduleParametersDirectoryPath));
               moduleData.simpleConfig.parameters = moduleParameterData.parameters;
               moduleData.advanceConfigurationExist = moduleParameterData.advancedConfiguration;
            }
            if (fs.existsSync(moduleParametersUISchemaDirectoryPath))
               moduleData.simpleConfig.uiSchema = JSON.parse(fs.readFileSync(moduleParametersUISchemaDirectoryPath));
         } catch (e) {
            let errorMessage = "Something went wrong in reading module parameters file. Probably the Parameters file didn't define well";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      }
      res.status(200).send(moduleData);
   });
};

module.exports.addNewModule = (req, res) => {
   const { userId, username, componentName, moduleName, moduleDescription } = req.body;
   const file = req.files.moduleFile;
   const zipFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}.zip`;
   const destinationFilePath = `src/database/users/${username}/Modules/${componentName}/${moduleName}`;
   const configsFileDirectory = `src/database/users/${username}/ModulesConfigs/User/${componentName}/${moduleName}`;
   const modulesListPath = `src/database/users/${username}/modules_list.json`;

   let newModuleInfo = moduleInfoModel;
   newModuleInfo.id = Date.now().toString();
   newModuleInfo.name = moduleName;
   newModuleInfo.description = moduleDescription;

   fs.readFile(modulesListPath, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in addNewModule: Couldn't read modules list file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      let modulesList = JSON.parse(data);
      if (modulesList[componentName].find((module) => module.name === newModuleInfo.name)) {
         let errorMessage = "This module name already exists. Select another name.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
         return;
      }

      modulesList[componentName].push(newModuleInfo);
      stringifyModulesList = JSON.stringify(modulesList);

      fs.writeFileSync(modulesListPath, stringifyModulesList);

      fs.mkdirSync(destinationFilePath);

      file.mv(zipFilePath, (err) => {
         if (err) {
            let errorMessage = "Something went wrong in Create new Module: couldn't write file into server";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }

         decompress(zipFilePath, destinationFilePath).then((err) => {
            try {
               fs.unlinkSync(zipFilePath);
               fs.mkdirSync(configsFileDirectory, { recursive: true });
               res.status(200).send("New Module Added Successfully");
            } catch {
               let errorMessage = "Something went wrong in Create new Module: couldn't unzip the file";
               console.log(errorMessage);
               res.status(500).send(errorMessage);
            }
         });
      });
   });
};

module.exports.getDockerConfig = (req, res) => {
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

module.exports.saveComponentData = (req, res) => {
   const { userId, username, componentName, experimentId, selectedModuleData, dockerConfig } = req.body;

   let selectedModule = selectedModuleData.name;
   let selectedModuleType = selectedModuleData.type;
   let advanceConfig = selectedModuleData.advanceConfiguration;
   let selectedConfigFileName = selectedModuleData.advanceConfig.selected;
   let simpleConfigValues = selectedModuleData.simpleConfig.values;
   console.log(simpleConfigValues);

   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;
   const dockerConfigPath = `src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json`;

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in saveComponentData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);

      jsonData[componentName].name = selectedModule;
      jsonData[componentName].type = selectedModuleType;
      jsonData[componentName].advanceConfig = advanceConfig;

      const componentConfigFilePath = `src/database/users/${username}/Experiments/${experimentId}/${componentName}Config.json`;

      if (advanceConfig) {
         if (fs.existsSync(componentConfigFilePath)) fs.rmSync(componentConfigFilePath);
         jsonData[componentName].configName = selectedConfigFileName;
      } else {
         jsonData[componentName].configName = "";
         fs.writeFileSync(componentConfigFilePath, JSON.stringify(simpleConfigValues));
      }

      if (componentName == "Client" && selectedModule == "Dash.js") {
         jsonData[componentName].machineID = "0";
      }

      stringifyData = JSON.stringify(jsonData);

      fs.writeFile(dependencyFile, stringifyData, function (err) {
         if (err) {
            let errorMessage = "Something went wrong in saveComponentData: Couldn't write on dependency file.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });

      let componentsDockerConfig = JSON.parse(fs.readFileSync(dockerConfigPath));
      componentsDockerConfig[componentName] = dockerConfig.newValues;
      fs.writeFileSync(dockerConfigPath, JSON.stringify(componentsDockerConfig));
      res.status(200).send("Configuration Saved Successfully");
   });
};

module.exports.deleteUserModule = (req, res) => {
   const { username } = JSON.parse(req.query.user);
   const componentName = req.query.componentName;
   const moduleId = req.query.moduleId;

   const userModulesPath = `src/database/users/${username}/modules_list.json`;
   let allUserModules = JSON.parse(fs.readFileSync(userModulesPath, "utf8"));
   let selectedModule = allUserModules[componentName].find((module) => module.id === moduleId);
   allUserModules[componentName] = allUserModules[componentName].filter((module) => module.id !== moduleId);

   fs.writeFileSync(userModulesPath, JSON.stringify(allUserModules));
   const userExperimentsPath = `src/database/users/${username}/Experiments`;

   let allExperiments = fs.readdirSync(userExperimentsPath);
   allExperiments.forEach((experimentID) => {
      const experimentDependencyFilePath = userExperimentsPath + `/${experimentID}/dependency.json`;
      if (fs.existsSync(experimentDependencyFilePath)) {
         let dependencyFile = JSON.parse(fs.readFileSync(experimentDependencyFilePath, "utf8"));

         if (dependencyFile[componentName]["name"] === selectedModule.name) {
            dependencyFile[componentName] = experimentModel.experimentJSONData[componentName];
            const stringifyDependencyFile = JSON.stringify(dependencyFile);
            fs.writeFileSync(experimentDependencyFilePath, stringifyDependencyFile);
         }
      }
   });

   const modulePath = `src/database/users/${username}/Modules/${componentName}/${selectedModule.name}`;

   fs.rm(modulePath, { recursive: true }, function (err) {
      if (err) {
         let errorMessage = "Something went wrong in deleteUserModule: Couldn't delete in modulePath directory.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      res.status(200).send("Successfully delete user's module");
   });
};
