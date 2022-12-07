import { API } from "./API";

export const getDefaultModules = (componentName) => {
   return API.get("/modules/getDefaultModules", {
      params: {
         componentName,
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

export const getUserModules = (user, componentName) => {
   return API.get("/modules/getUserModules", {
      params: {
         user,
         componentName,
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

export const createNewModule = (request) => {
   return API.post("/modules/create", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const addNewScript = (request) => {
   return API.post("/modules/addNewScript", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getModuleScripts = (user, componentName, moduleName, isUserModule) => {
   return API.get("/modules/getModuleScripts", {
      params: {
         user,
         componentName,
         moduleName,
         isUserModule,
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

export const getModuleParameters = (user, componentName, moduleName, isUserModule) => {
   return API.get("/modules/getModuleParameters", {
      params: {
         user,
         componentName,
         moduleName,
         isUserModule,
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

export const AddNewVideo = (request) => {
   return API.post("/modules/addNewVideo", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const AddNewVideoDataset = (request) => {
   return API.post("/modules/addNewVideoDataset", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getVideosList = (user) => {
   return API.get("/modules/getVideosList", {
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

export const saveExperimentModuleData = (data) => {
   return API.post("/modules/saveModuleData", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getModuleData = (user, componentName, experimentId) => {
   return API.get("/modules/getModuleData", {
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
         throw error.response;
      }
   );
};

export const getNetworkConfiguration = (user, experimentId) => {
   return API.get("/modules/getNetworkConfiguration", {
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
};

export const setNetworkConfiguration = (data) => {
   return API.post("/modules/setNetworkConfiguration", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getServerConfiguration = (user, experimentId) => {
   return API.get("/modules/getServerConfiguration", {
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
};

export const setServerConfiguration = (data) => {
   return API.post("/modules/setServerConfiguration", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const saveVideoModuleData = (data) => {
   return API.post("/modules/saveVideoModuleData", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getVideoModuleData = (user, componentName, experimentId) => {
   return API.get("/modules/getVideoModuleData", {
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
         throw error.response;
      }
   );
};

export const getConfigFileData = (user, componentName, moduleName, configFileName, isUserModule) => {
   return API.get("/modules/getConfigFileData", {
      params: {
         user,
         componentName,
         moduleName,
         configFileName,
         isUserModule,
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

export const updateConfigFileData = (data) => {
   return API.post("/modules/updateConfigFileData", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getHeadlessPlayerConfiguration = (user, experimentId) => {
   return API.get("/modules/getHeadlessPlayerConfiguration", {
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
};

export const setHeadlessPlayerConfiguration = (data) => {
   return API.post("/modules/setHeadlessPlayerConfiguration", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const deleteUserModule = (user, componentName, moduleName) => {
   return API.delete("/modules/userModule", {
      params: {
         user,
         componentName,
         moduleName,
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

export const deleteUserVideo = (user, videoID) => {
   return API.delete("/modules/userVideo", {
      params: {
         user,
         videoID,
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
