const fs = require("fs");
const { resolve } = require("path");
const spawn = require("child_process").spawn;

module.exports.build = (endpoint, socket) => {
   socket.on("subscribeToBuildExperiment", (userInfo) => {
      const child = spawn("bash", ["src/database/scripts/build.sh", userInfo.username, userInfo.experimentId]);

      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (data) => {
         try {
            endpoint.emit("getExperiment‌BuildInfo", data.split("\n"));
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (data) => {
         try {
            console.log(data);
         } catch (e) {
            child.kill();
         }
      });

      child.on("close", function (code) {
         endpoint.emit("getExperiment‌BuildInfo", "SOCKET_CLOSED");
         socket.disconnect();
      });
   });
};

function runScript(endpoint, channel, component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/run.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
            endpoint.emit(channel, "", data.toString().split("\n"));
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
            endpoint.emit(channel, "", err.toString().split("\n"));
            console.log(err);
         } catch (e) {
            child.kill();
         }
      });
      child.on("exit", (code) => {
         if (code === 0) {
            endpoint.emit(channel, "", [`----- The ${component} component ran successfully -----`]);
            endpoint.emit(channel, "", "SOCKET_CLOSED");
            resolve();
         } else {
            endpoint.emit(channel, "", [`------ The ${component} run script exited with code ${code} -----`]);
            endpoint.emit(channel, "", "SOCKET_CLOSED");
            reject(`Script ${component} exited with code ${code}`);
         }
      });
   });
}

function prepareRunScript(endpoint, channel, component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/prepareForRun.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
            endpoint.emit(channel, "", data.toString().split("\n"));
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
            endpoint.emit(channel, "", err.toString().split("\n"));
            console.log(err);
         } catch (e) {
            child.kill();
         }
      });
      child.on("exit", (code) => {
         if (code === 0) {
            resolve();
         } else {
            reject(`Script ${component} exited with code ${code}`);
         }
      });
   });
}

function runCleanUpScript(userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/cleanUp.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
            // endpoint.emit(channel, "", data.toString().split("\n"));
            console.log(data);
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
            // endpoint.emit(channel, "", err.toString().split("\n"));
            console.log(err);
         } catch (e) {
            child.kill();
         }
      });
      child.on("exit", (code) => {
         if (code === 0) {
            resolve();
         } else {
            reject(`Cleanup script exited with code ${code}`);
         }
      });
   });
}

function createResult(userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/getResults.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
            // endpoint.emit(channel, "", data.toString().split("\n"));
            console.log(data);
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
            // endpoint.emit(channel, "", err.toString().split("\n"));
            console.log(err);
         } catch (e) {
            child.kill();
         }
      });
      child.on("exit", (code) => {
         if (code === 0) {
            resolve();
         } else {
            reject(`Cleanup script exited with code ${code}`);
         }
      });
   });
}

module.exports.run = async (endpoint, socket) => {
   socket.on("experimentInfo", async (experimentInfo) => {
      const experimentConfigPath = `src/database/users/${experimentInfo.username}/Experiments/${experimentInfo.experimentId}/experimentConfig.json`;
      let numberOfRepetition = Number(experimentInfo.numberOfRepetition);
      let experimentConfigData = JSON.parse(fs.readFileSync(experimentConfigPath));
      experimentConfigData["repetition"] = numberOfRepetition;
      experimentConfigData["runningInXterm"] = experimentInfo.runningInXterm;

      fs.writeFileSync(experimentConfigPath, JSON.stringify(experimentConfigData));

      for (let i = 0; i < numberOfRepetition; i++) {
         if (i === 0) {
            let preparePromises = [];
            const prepareServerPromise = prepareRunScript(endpoint, "getServerOfExperimentInfo", "Server", experimentInfo);
            preparePromises.push(prepareServerPromise);
            if (experimentConfigData.componentExistence.network === true) {
               const prepareNetworkPromise = prepareRunScript(endpoint, "getNetworkOfExperimentInfo", "Network", experimentInfo);
               preparePromises.push(prepareNetworkPromise);
            }
            if (experimentConfigData.componentExistence.client === true) {
               const prepareClientPromise = prepareRunScript(endpoint, "getClientOfExperimentInfo", "Client", experimentInfo);
               preparePromises.push(prepareClientPromise);
            }
            await Promise.all(preparePromises);
         }

         let runPromises = [];

         const serverPromise = runScript(endpoint, "getServerOfExperimentInfo", "Server", experimentInfo);
         runPromises.push(serverPromise);
         if (experimentConfigData.componentExistence.network === true) {
            const networkPromise = runScript(endpoint, "getNetworkOfExperimentInfo", "Network", experimentInfo);
            runPromises.push(networkPromise);
         }
         if (experimentConfigData.componentExistence.client === true) {
            const clientPromise = runScript(endpoint, "getClientOfExperimentInfo", "Client", experimentInfo);
            runPromises.push(clientPromise);
         }
         await Promise.all(runPromises);
         await createResult(experimentInfo);
      }

      runCleanUpScript(experimentInfo);
   });
};
