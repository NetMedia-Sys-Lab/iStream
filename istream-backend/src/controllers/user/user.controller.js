const fs = require("fs");

//USER REGISTRATION CONTROLLER
module.exports.userRegistration = (req, res) => {
   try {
      const { username, email, comment } = req.body;
      const registeredUsersFilePath = `src/database/usersInfo/registered_users.json`;

      fs.readFile(registeredUsersFilePath, "utf8", function (err, data) {
         if (err) {
            let errorMessage =
               "Something went wrong in addNewUser: Couldn't read registered users file.";
            console.log(errorMessage);
            return res.status(500).json({
               error: errorMessage,
            });
         }

         //Convert the experiments list into json object
         const allUsers = JSON.parse(data);

         let lastRegisteredId = 0;
         if (allUsers.length > 0)
            lastRegisteredId = allUsers[allUsers.length - 1].userId;

         //create a new user object
         const newUser = {
            userId: lastRegisteredId + 1,
            userName: username,
            userEmail: email,
            comments: comment,
         };

         //Add the new user to the existing users list.
         allUsers.push(newUser);
         let stringifyData = JSON.stringify(allUsers);

         fs.writeFile(registeredUsersFilePath, stringifyData, function (err) {
            if (err) {
               let errorMessage =
                  "Something went wrong in addNewUser: Couldn't write to registered users file.";
               console.log(errorMessage);
               return res.status(500).json({
                  error: errorMessage,
               });
            }
         });
      });

      res.send("successfully");
   } catch (err) {
      console.log(err);
      res.status(500).json({
         error: err.message,
      });
   }
};

// app.post("/newUserRegistration", function (req, res) {
// 	console.log(req.body);
// 	//Parse the body
// 	const bodyData = req.body;
// 	const userName = bodyData.userName;
// 	const userEmail = bodyData.email;
// 	const comments = bodyData.comments

// 	//update the registerd_users.json file to add the new user
// 	//get the file path for registerd_users.json
// 	const registeredUsersFile = `./Database/UserInfo/registered_users.json`
// 	//fetch the data from the file
// 	fs.readFile(registeredUsersFile, 'utf8', function (err, data) {
// 		if (err) {
// 			console.log('Something went wrong. Please check the paths and try again');
// 			res.status(500)
// 			res.send('Error occured');
// 		}
// 		//Convert the experiments list into json object
// 		const jsonData = JSON.parse(data);

// 		//get the userId of the last registered user
// 		const lastRegisteredId = jsonData[jsonData.length - 1].userId;
// 		//create a new user object
// 		const newUser = {
// 			userId: lastRegisteredId + 1,
// 			userName: userName,
// 			userEmail: userEmail,
// 			comments: comments
// 		}

// 		//Add the new user to the existing users list.
// 		jsonData.push(newUser);
// 		//Stringify the json Data and write to the users file

// 		stringifyData = JSON.stringify(jsonData);

// 		fs.writeFile(registeredUsersFile, stringifyData, function (err) {
// 			if (err) {
// 				console.log('Something went wrong. Please check the paths and try again');
// 				res.status(500)
// 				res.send('Error occured');
// 			}
// 		});
// 	});

// 	//create the folder hierarchy for the new user
// 	const dirName = `./Database/Users/${userName}`;
// 	fs.mkdirSync(dirName);
// 	const dirNameExperiments = `./Database/Users/${userName}/Experiments`;
// 	fs.mkdirSync(dirNameExperiments);

// 	//create the experimentListFile for the new user. Initilize the file as an empty list
// 	const experimentListFile = `./Database/Users/${userName}/experiment_list.json`
// 	fs.writeFile(experimentListFile, JSON.stringify([]), function (err) {
// 		if (err) {
// 			console.log('Something went wrong. Please check the paths and try again');
// 			res.status(500)
// 			res.send('Error occured');
// 		}
// 	});

// 	//create the machine List  for the new user. Initilize the file as an empty list. It will be a list of objects where each object is denotes a ssh dependencies
// 	const sshMachinesListFile = `./Database/Users/${userName}/machine_list.json`
// 	fs.writeFile(sshMachinesListFile, JSON.stringify([]), function (err) {
// 		if (err) {
// 			console.log('Something went wrong. Please check the paths and try again');
// 			res.status(500)
// 			res.send('Error occured');
// 		}
// 	});

// 	//Create the folder where the ssh keys would be saved
// 	const sshKeysFolder = `./Database/Users/${userName}/SSHKeys`
// 	fs.mkdirSync(sshKeysFolder);

// 	//create the modules folder for the new user
// 	const modulesDirName = `./Database/Users/${userName}/Modules`;
// 	fs.mkdirSync(modulesDirName);
// 	fs.mkdirSync(`${modulesDirName}/Transcoder`);
// 	fs.mkdirSync(`${modulesDirName}/Server`);
// 	fs.mkdirSync(`${modulesDirName}/Network`);
// 	fs.mkdirSync(`${modulesDirName}/Client`);
// 	fs.mkdirSync(`${modulesDirName}/Input`);

// 	res.send('Success');
// })

//USER LOGIN CONTROLLER

// module.exports.user_login = async (req, res) => {
//    try {
//       //1. destructure the user details
//       const { email, password } = req.body;

//       //1. Get the user from the database
//       const user = await pool.query("SELECT * FROM users WHERE email=$1", [
//          email,
//       ]);

//       //2. check if user does not exist and return an error else login the user
//       if (user.rows.length === 0) {
//          res.status(404).json({
//             error: "Sorry! An account with that email doesn't exist!",
//          });
//       } else {
//          //check if the password entered matches the one in the database
//          bcrypt.compare(
//             password,
//             user.rows[0].password,
//             (err, validPassword) => {
//                if (err) {
//                   res.status(401).json({
//                      error: "Sorry! Email or password is incorrect",
//                   });
//                } else if (validPassword) {
//                   //generate a token
//                   const token = jwtGenerator(user.rows[0].user_id);

//                   res.json({
//                      message: "Login successfully!",
//                      token,
//                   });
//                } else {
//                   res.status(401).json({
//                      error: "Sorry! Email or password is incorrect",
//                   });
//                }
//             }
//          );
//       }
//    } catch (err) {
//       console.log(err.message);
//       res.status(500).json({
//          error: err.message,
//       });
//    }
// };

// //USER TOKEN VERIFY

// module.exports.user_token_verify = async (req, res) => {
//    try {
//       //return response if authorization is met else return an error
//       res.status(200).json({ authorized: true });
//    } catch (err) {
//       res.status(500).json({
//          error: err.message,
//       });
//    }
// };
