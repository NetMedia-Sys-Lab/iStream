const fs = require("fs");

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

   const dependencyFile = `src/database/users/${username}/Experiments/${experimentId}/dependency.json`;

   fs.readFile(dependencyFile, "utf8", function (err, data) {
      if (err) {
         let errorMessage = "Something went wrong in getVideoModuleData: Couldn't read dependency file.";
         console.log(errorMessage);
         res.status(500).send(errorMessage);
      }

      const jsonData = JSON.parse(data);
      const videosData = jsonData[componentName];

      res.status(200).send(videosData);
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
