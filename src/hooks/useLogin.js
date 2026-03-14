// useLogin.js

async function Login(username, email) {
    const usersresult = await getApiData("users");
  
    if (!usersresult.ok) {
      return {
        ok: false,
        message: usersresult.message,
        data: null
      };
    }
}