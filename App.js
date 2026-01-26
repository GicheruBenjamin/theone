// App.js

import getApiData from "./Api.js"
import { Dashboardoverview } from "./Dashboardcomponents.js";
import Component from "./Components.js";

const app = document.getElementById("app");

function renderUsersview(app){
    // Get the user data
    const usersres = getApiData("users")
    if(!usersres.ok){
        const error = Component("div",{
            className : "error",
            text : usersres.message
        })
        app.appendChild(error)
    }
    else{
        const user = usersres.data[0]
        const Dashboard = Dashboardoverview(user)
        app.appendChild(Dashboard)
    }
}

renderUsersview(app)