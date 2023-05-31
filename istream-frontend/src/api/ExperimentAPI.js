import { API, DOMAIN } from "./API";

import openSocket from "socket.io-client";

export function getExperimentConfig(user, experimentId) {
   return API.get("/experiment/getExperimentConfig", {
      params: {
         user,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getExperimentDependency(user, experimentId) {
   return API.get("/experiment/getExperimentData", {
      params: {
         user,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function buildExperiment(experimentInfo, serverCb, clientCb, networkCb) {
   const socket = openSocket(DOMAIN + "buildExperiment");
   socket.emit("buildExperimentInfo", experimentInfo);

   socket.on("getServerComponentBuildInfo", (err, data) => serverCb(err, data));
   socket.on("getClientComponentBuildInfo", (err, data) => clientCb(err, data));
   socket.on("getNetworkComponentBuildInfo", (err, data) => networkCb(err, data));
}

export function runExperiment(experimentInfo, serverCb, clientCb, networkCb) {
   const socket = openSocket(DOMAIN + "runExperiment");
   socket.emit("runExperimentInfo", experimentInfo);

   socket.on("getServerComponentRunInfo", (err, data) => serverCb(err, data));
   socket.on("getClientComponentRunInfo", (err, data) => clientCb(err, data));
   socket.on("getNetworkComponentRunInfo", (err, data) => networkCb(err, data));
}

export function downloadExperimentResults(username, experimentId) {
   return API.get("/experiment/downloadExperimentResults", {
      params: {
         username,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
}

export function getExperimentResults(user, experimentId) {
   return API.get("/experiment/getExperimentResults", {
      params: {
         user,
         experimentId,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function downloadResult(user, experimentId, resultName) {
   return API.get("/experiment/downloadResult", {
      params: {
         user,
         experimentId,
         resultName,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export const deleteResult = (request) => {
   return API.post("/experiment/deleteResult", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
};

export const runBatchOfExperiments = (experimentsList) => {
   return API.post("/experiment/runBatchOfExperiments", experimentsList).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
};
