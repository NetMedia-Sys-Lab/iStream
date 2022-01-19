import API from "./API";

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