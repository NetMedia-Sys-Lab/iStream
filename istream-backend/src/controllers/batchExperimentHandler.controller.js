const fs = require("fs");
const spawn = require("child_process").spawn;

function buildScript(component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/build.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
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

async function build(experimentInfo) {
   const experimentConfigPath = `src/database/users/${experimentInfo.username}/Experiments/${experimentInfo.experimentId}/experimentConfig.json`;
   let experimentConfigData = JSON.parse(fs.readFileSync(experimentConfigPath));
   buildPromises = [];
   const serverPromise = buildScript("Server", experimentInfo);
   buildPromises.push(serverPromise);
   if (experimentConfigData.componentExistence.network === true) {
      const networkPromise = buildScript("Network", experimentInfo);
      buildPromises.push(networkPromise);
   }
   if (experimentConfigData.componentExistence.client === true) {
      const clientPromise = buildScript("Client", experimentInfo);
      buildPromises.push(clientPromise);
   }
   await Promise.all(buildPromises).catch((error) => {
      console.error(error.message);
   });
}

function runScript(component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/run.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

      child.stdout.on("data", (data) => {
         try {
         } catch (e) {
            child.kill();
         }
      });

      child.stderr.on("data", (err) => {
         try {
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

function prepareRunScript(component, userInfo) {
   return new Promise((resolve, reject) => {
      const child = spawn("bash", [`src/database/scripts/${component}/prepareForRun.sh`, userInfo.username, userInfo.experimentId, "2>&1"]);

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");

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

      child.on("exit", (code) => {
         if (code === 0) {
            resolve();
         } else {
            reject(`Create result script exited with code ${code}`);
         }
      });
   });
}

async function run(experimentInfo) {
   const experimentConfigPath = `src/database/users/${experimentInfo.username}/Experiments/${experimentInfo.experimentId}/experimentConfig.json`;
   let numberOfRepetition = Number(experimentInfo.repetition);
   let experimentConfigData = JSON.parse(fs.readFileSync(experimentConfigPath));

   let preparePromises = [];
   const prepareServerPromise = prepareRunScript("Server", experimentInfo);
   preparePromises.push(prepareServerPromise);
   if (experimentConfigData.componentExistence.network === true) {
      const prepareNetworkPromise = prepareRunScript("Network", experimentInfo);
      preparePromises.push(prepareNetworkPromise);
   }
   if (experimentConfigData.componentExistence.client === true) {
      const prepareClientPromise = prepareRunScript("Client", experimentInfo);
      preparePromises.push(prepareClientPromise);
   }
   await Promise.all(preparePromises).catch((error) => {
      console.error(error.message);
   });

   for (let i = 0; i < numberOfRepetition; i++) {
      let runPromises = [];

      const serverPromise = runScript("Server", experimentInfo);
      runPromises.push(serverPromise);
      if (experimentConfigData.componentExistence.network === true) {
         const networkPromise = runScript("Network", experimentInfo);
         runPromises.push(networkPromise);
      }
      if (experimentConfigData.componentExistence.client === true) {
         const clientPromise = runScript("Client", experimentInfo);
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
}

module.exports.runBatchOfExperiments = async (req, res) => {
   const { userId, username, selectedExperiments } = req.body;
   console.log("Batch of Experiments starts for:", username,"\nList of Experiments are: ", selectedExperiments);

   res.status(200).send("Experiment batch has been started to run, come back later for results\n");
   for (let index in selectedExperiments) {
      let experimentInfo = {
         username: username,
         experimentId: selectedExperiments[index].experimentId,
         repetition: selectedExperiments[index].repetition,
      };
      await build(experimentInfo);
      await run(experimentInfo);
   }
};
