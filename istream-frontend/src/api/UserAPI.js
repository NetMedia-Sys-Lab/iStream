import API from "./API";

export const userRegistration = (request) => {
   return API.post("/auth/register", request).then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};

export const getAllUsers = () => {
   return API.get("/auth/getAllUsers").then(
      (response) => {
         return response.data;
      },
      (error) => {
         throw error.response;
      }
   );
};
