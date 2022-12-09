import { API } from "./API";

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


