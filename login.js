// login.js

import getApiData from "./Api.js";
import Component  from "./Components.js";

async function Login(username, email) {
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


export default function Loginform() {
    const container = Component("div", {
      className: "login-container"
    });
  
    const usernameInput = Component("input", {
      props: {
        type: "text",
        placeholder: "Username"
      }
    });
  
    const emailInput = Component("input", {
      props: {
        type: "email",
        placeholder: "Email"
      }
    });
  
    const loginform = Component("form", {
      className: "login-form",
      events: {
        submit: async e => {
          e.preventDefault();
  
          const username = usernameInput.value;
          const email = emailInput.value;
  
          if (!username || !email) {
            alert("Username and email required");
            return;
          }
  
          const result = await Login(username, email);
          alert(result.message);
        }
      },
      children: [
        usernameInput,
        emailInput,
        Component("button", {
          text: "Login",
          props: { type: "submit" }
        })
      ]
    });
  
    container.append(loginform);
    return container;
  }
  