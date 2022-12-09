import { API } from "./API";

export const getModules = (user, componentName) => {
   return API.get("/components/getModules", {
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

export const getComponentData = (user, experimentId, componentName) => {
   return API.get("/components/getComponentData", {
      params: {
         user,
         experimentId,
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

export const getDockerConfig = (user, componentName, experimentId) => {
   return API.get("/components/getDockerConfig", {
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

export const addNewModule = (request) => {
   return API.post("/components/addNewModule", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const saveComponentData = (data) => {
   return API.post("/components/saveComponentData", data).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};