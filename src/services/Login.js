import getApiData from "./Api.js";

export default async function Login(username, email) {
    const usersresult = await getApiData("users");
  
    if (!usersresult.ok) {
      return {
        ok: false,
        message: usersresult.message,
        data: null
      };
    }
  
    const users = usersresult.data;
  
    // Find matching user
    const user = users.find(
      u => u.username === username && u.email === email
    );
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    
      return {
        ok: true,
        message: "User exists",
        data: user
      };
    }
    
    return {
      ok: false,
      message: "User does not exist",
      data: null
    };
  }