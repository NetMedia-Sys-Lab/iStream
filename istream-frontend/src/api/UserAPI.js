import API from "./API";

export const userRegistration = (request) => {
   console.log(request);
   return API.post('/auth/register', request);
   // return API.post("/auth/register", request).then(
   //    (response) => {
   //       return response.data;
   //    },
   //    (error) => {
   //       console.log(error);
   //    }
   // );
};
