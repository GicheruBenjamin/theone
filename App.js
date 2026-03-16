// App.js
import Component from "./lib/Component.js";
import Loginform from "./src/components/login.js";

const app = document.getElementById("app");

const Home = Component("div", {
    text: "Home",
    className: "page"
});

app.append(Home);
app.append(Loginform());
