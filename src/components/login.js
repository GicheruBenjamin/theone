// login.js

import Login from "../services/Login.js";
import Component  from "../../lib/Component.js";



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
  