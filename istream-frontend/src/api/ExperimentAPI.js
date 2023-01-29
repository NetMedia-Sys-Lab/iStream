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

export function subscribeToBuildExperiment(userInfo, cb) {
   const SOCKET = openSocket(DOMAIN + "build");
   SOCKET.on("getExperiment‌BuildInfo", (data) => {
      cb(null, data);
   });
   SOCKET.emit("subscribeToBuildExperiment", userInfo);
}

export function runExperiment(experimentInfo, serverCb, clientCb, networkCb) {
   const socket = openSocket(DOMAIN + "runExperiment");
   socket.emit("experimentInfo", experimentInfo);

   socket.on("getServerOfExperimentInfo", (err, data) => serverCb(err, data));
   socket.on("getClientOfExperimentInfo", (err, data) => clientCb(err, data));
   socket.on("getNetworkOfExperimentInfo", (err, data) => networkCb(err, data));
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

// export function deleteResult(user, experimentId, resultName) {
//    return API.get("/experiment/deleteResult", {
//       params: {
//          user,
//          experimentId,
//          resultName,
//       },
//    }).then(
//       (response) => {
//          return response.data;
//       },
//       (error) => {
//          throw error.response;
//       }
//    );
// }

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