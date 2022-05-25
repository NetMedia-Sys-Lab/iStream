const fs = require("fs");
const writeToFile = require("../../utils/fileUtils");

//USER REGISTRATION CONTROLLER
module.exports.userRegistration = (req, res) => {
   try {
      const { username, email, comments } = req.body;
      const registeredUsersFilePath = `src/database/usersInfo/registered_users.json`;

      let registeredUsersFile = fs.readFileSync(registeredUsersFilePath, "utf-8");

      //Convert the experiments list into json object
      const allUsers = JSON.parse(registeredUsersFile);

      if (Object.keys(allUsers).find((user) => allUsers[user].username === username)) {
         res.status(409).send("This username already exists. Select another username please.");
         return;
      }

      let lastRegisteredId = 0;
      if (allUsers.length > 0) lastRegisteredId = allUsers[allUsers.length - 1].userId;

      //create a new user object
      const newUser = {
         userId: lastRegisteredId + 1,
         username: username,
         email: email,
         comments: comments,
      };

      //Add the new user to the existing users list.
      allUsers.push(newUser);
      let stringifyData = JSON.stringify(allUsers);
      writeToFile(registeredUsersFilePath, stringifyData, "userRegistration");

      //create the folder hierarchy for the new user
      const dirName = `src/database/users/${username}`;
      fs.mkdirSync(dirName);
      const dirNameExperiments = `src/database/users/${username}/Experiments`;
      fs.mkdirSync(dirNameExperiments);

      //create the experimentListFile for the new user. Initilize the file as an empty list
      const experimentListFile = `src/database/users/${username}/experiments_list.json`;
      writeToFile(experimentListFile, JSON.stringify([]), "userRegistration");

      //create the machine List  for the new user. Initilize the file as an empty list. It will be a list of objects where each object is denotes a ssh dependencies
      const sshMachinesListFile = `src/database/users/${username}/machine_list.json`;
      writeToFile(sshMachinesListFile, JSON.stringify([]), "userRegistration");

      // Create the folder where the ssh keys would be saved
      const sshKeysFolder = `src/database/users/${username}/SSHKeys`;
      fs.mkdirSync(sshKeysFolder);

      // Create the folder where the videos would be saved
      const videosFolder = `src/database/users/${username}/Videos`;
      fs.mkdirSync(videosFolder);

      const videosListFile = `src/database/users/${username}/Videos/videos_list.json`;
      writeToFile(videosListFile, JSON.stringify([]), "userRegistration");

      //create the modules folder for the new user
      const modulesDirName = `src/database/users/${username}/Modules`;
      fs.mkdirSync(modulesDirName);
      fs.mkdirSync(`${modulesDirName}/Transcoder`);
      fs.mkdirSync(`${modulesDirName}/Server`);
      fs.mkdirSync(`${modulesDirName}/Network`);
      fs.mkdirSync(`${modulesDirName}/Client`);
      fs.mkdirSync(`${modulesDirName}/Videos`);

      res.status(200).send("New User Created Successfully");
   } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
   }
};

module.exports.getAllUser = (req, res) => {
   try {
      const registeredUsersFilePath = `src/database/usersInfo/registered_users.json`;

      fs.readFile(registeredUsersFilePath, "utf8", function (err, data) {
         if (err) {
            let errorMessage = "Something went wrong in getAllUser.";
            console.log(errorMessage);
            res.status(500).send(errorMessage);
         }

         res.status(200).send(data);
      });
   } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
   }
};
