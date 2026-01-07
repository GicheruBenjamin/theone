// App.js
import { getapidata } from "./services.js";

const app = document.getElementById("app");

async function renderusers(){
    let usersres = await getapidata("users");
    if(!usersres.ok){
        const errp = document.createElement("p");
        errp.textContent = usersres.message;
        app.appendChild(errp);
    }
    else{
        let users = usersres.data;
        users.forEach(user => {
            let userp = document.createElement("p");
            userp.textContent = user.name;
            app.appendChild(userp);
        })
    }
}

renderusers();