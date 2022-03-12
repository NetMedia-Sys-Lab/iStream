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
