import api from "./api/axios.js";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ1c2VyYUB0ZXN0LmNvbSIsImlhdCI6MTc5MTA0ODczOSwiZXhwIjoxNzkxMTM1MTM5fQ.RenI6_1Q0qttAhQ6Fk5PJ-lDCAGVz5Egz_NQiXhTCLk";

//   const content="could you tell me most demanded techs from them on upwork"

  const response=await api.get('/conversations/3/message',{
    headers:{
        Authorization:`Bearer ${token}`
    }
  })
  console.log(response.data)
