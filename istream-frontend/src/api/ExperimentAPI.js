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
