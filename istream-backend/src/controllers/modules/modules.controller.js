const fs = require("fs");
const decompress = require("decompress");

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

module.exports.create = (req, res) => {
   const { userId, username, moduleType, moduleName, moduleDescription } = req.body;
   const file = req.files.moduleFile;
   const zipFilePath = `src/database/users/${username}/Modules/${moduleType}/${moduleName}.zip`;
   const destinationFilePath = `src/database/users/${username}/Modules/${moduleType}`;

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
            res.status(200).send("New Module Added Successfully");
         } catch {
            let errorMessage = "Something went wrong in Create new Module: couldn't unzip the file";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }
      });
   });
};
