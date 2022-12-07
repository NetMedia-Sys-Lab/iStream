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

export const getModuleConfigsAndParameters = (user, componentName, moduleName, isUserModule) => {
   return API.get("/modules/getModuleConfigsAndParameters", {
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

export const addNewConfig = (request) => {
   return API.post("/modules/addNewConfigFile", request).then(
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

export const getDefaultVideosList = () => {
   return API.get("/modules/getDefaultVideosList").then(
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

export const saveModuleData = (data) => {
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

export const getModuleDockerConfig = (user, componentName, experimentId) => {
   return API.get("/modules/getModuleDockerConfig", {
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