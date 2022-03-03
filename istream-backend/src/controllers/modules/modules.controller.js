const fs = require("fs");

module.exports.getDefaultModules = (req, res) => {
   const moduleName = req.query.moduleName;
   const modulesDirectoryPath = `src/database/supportedModules/${moduleName}`;
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
   const moduleName = req.query.moduleName;
   const modulesDirectoryPath = `src/database/users/${username}/Modules/${moduleName}`;
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
