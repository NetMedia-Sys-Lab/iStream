const fs = require("fs");
const spawn = require("child_process").spawn;

function buildScript(endpoint, channel, component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/build.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

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

module.exports.build = async (endpoint, socket) => {
   socket.on("buildExperimentInfo", async (experimentInfo) => {
      const experimentConfigPath = `src/database/users/${experimentInfo.username}/Experiments/${experimentInfo.experimentId}/experimentConfig.json`;
      let experimentConfigData = JSON.parse(fs.readFileSync(experimentConfigPath));

      buildPromises = [];
      const serverPromise = buildScript(endpoint, "getServerComponentBuildInfo", "Server", experimentInfo);
      buildPromises.push(serverPromise);
      if (experimentConfigData.componentExistence.network === true) {
         const networkPromise = buildScript(endpoint, "getNetworkComponentBuildInfo", "Network", experimentInfo);
         buildPromises.push(networkPromise);
      }
      if (experimentConfigData.componentExistence.client === true) {
         const clientPromise = buildScript(endpoint, "getClientComponentBuildInfo", "Client", experimentInfo);
         buildPromises.push(clientPromise);
      }
      await Promise.all(buildPromises).catch((error) => {
         console.error(error.message);
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
            reject(`Create result script exited with code ${code}`);
         }
      });
   });
}

module.exports.run = async (endpoint, socket) => {
   socket.on("runExperimentInfo", async (experimentInfo) => {
      const experimentConfigPath = `src/database/users/${experimentInfo.username}/Experiments/${experimentInfo.experimentId}/experimentConfig.json`;
      let numberOfRepetition = Number(experimentInfo.numberOfRepetition);
      let experimentConfigData = JSON.parse(fs.readFileSync(experimentConfigPath));
      experimentConfigData["repetition"] = numberOfRepetition;
      experimentConfigData["runningInXterm"] = experimentInfo.runningInXterm;

      fs.writeFileSync(experimentConfigPath, JSON.stringify(experimentConfigData));

      let preparePromises = [];
      const prepareServerPromise = prepareRunScript(endpoint, "getServerComponentRunInfo", "Server", experimentInfo);
      preparePromises.push(prepareServerPromise);
      if (experimentConfigData.componentExistence.network === true) {
         const prepareNetworkPromise = prepareRunScript(endpoint, "getNetworkComponentRunInfo", "Network", experimentInfo);
         preparePromises.push(prepareNetworkPromise);
      }
      if (experimentConfigData.componentExistence.client === true) {
         const prepareClientPromise = prepareRunScript(endpoint, "getClientComponentRunInfo", "Client", experimentInfo);
         preparePromises.push(prepareClientPromise);
      }
      await Promise.all(preparePromises).catch((error) => {
         console.error(error.message);
      });

      for (let i = 0; i < numberOfRepetition; i++) {
         let runPromises = [];

         const serverPromise = runScript(endpoint, "getServerComponentRunInfo", "Server", experimentInfo);
         runPromises.push(serverPromise);
         if (experimentConfigData.componentExistence.network === true) {
            const networkPromise = runScript(endpoint, "getNetworkComponentRunInfo", "Network", experimentInfo);
            runPromises.push(networkPromise);
         }
         if (experimentConfigData.componentExistence.client === true) {
            const clientPromise = runScript(endpoint, "getClientComponentRunInfo", "Client", experimentInfo);
            runPromises.push(clientPromise);
         }
         await Promise.all(runPromises).catch((error) => {
            console.error(error.message);
         });
         await createResult(experimentInfo).catch((error) => {
            console.error(error.message);
         });
      }

      await runCleanUpScript(experimentInfo).catch((error) => {
         console.error(error.message);
      });
   });
};
