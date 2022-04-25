import API from "./API";

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

export const addNewConfig = (request) => {
   return API.post("/modules/addNewConfig", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getConfigFiles = (user, componentName, moduleName) => {
   return API.get("/modules/getConfigFiles", {
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

export const getVideosList = () => {
   return API.get("/modules/getVideosList").then(
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
