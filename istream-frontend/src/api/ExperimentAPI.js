// import  from "./API";
import { API, DOMAIN } from "./API";

import openSocket from "socket.io-client";

export const createNewExperiment = (request) => {
   return API.post("/experiment/create", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getUserExperimentsList = (user) => {
   return API.get("/experiment/getUserExperimentsList", {
      params: {
         user,
      },
   }).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const deleteExperiment = (request) => {
   return API.post("/experiment/deleteExperiment", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
};

export const duplicateExperiment = (request) => {
   return API.post("/experiment/duplicateExperiment", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         return error.response;
      }
   );
};

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
         return error.response;
      }
   );
}

export function getExperimentData(user, experimentId) {
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
         return error.response;
      }
   );
}

export function addNewMachine(data) {
   return API.post("/experiment/addNewMachine", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getUserMachineList(user) {
   return API.get("/experiment/getUserMachineList", {
      params: {
         user,
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

export function saveComponentMachineInfo(data) {
   return API.post("/experiment/saveComponentMachineInfo", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
}

export function getComponentSelectedMachine(user, componentName, experimentId) {
   return API.get("/experiment/getComponentSelectedMachine", {
      params: {
         user,
         componentName,
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

export function subscribeToBuildExperiment(userInfo, cb) {
   const SOCKET = openSocket(DOMAIN + "build");
   SOCKET.on("getExperiment‌BuildInfo", (data) => {
      cb(null, data);
   });
   SOCKET.emit("subscribeToBuildExperiment", userInfo);
}

export function subscribeToRunExperiment(userInfo, cb) {
   const SOCKET = openSocket(DOMAIN + "run");
   SOCKET.on("getExperiment‌RunInfo", (data) => cb(null, data));
   SOCKET.emit("subscribeToRunExperiment", userInfo);
}

export function downloadExperimentResult(username, experimentId) {
   return API.get("/experiment/downloadExperimentResult", {
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

export function deleteUserMachine(user, machineID) {
   return API.delete("/experiment/userMachine", {
      params: {
         user,
         machineID,
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
