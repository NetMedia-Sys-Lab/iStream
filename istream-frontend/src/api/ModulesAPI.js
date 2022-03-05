import API from "./API";

export const getDefaultModules = (moduleName) => {
   return API.get("/modules/getDefaultModules", {
      params: {
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

export const getUserModules = (user, moduleName) => {
   return API.get("/modules/getUserModules", {
      params: {
         user,
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
