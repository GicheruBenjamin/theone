// App.js
import {
    renderHomepage,
    renderAboutpage,
    renderLoginpage,
    renderHomelayout,
} from "./Components.js";

const app = document.getElementById("app");
console.log(location.pathname);

function createApp(app) {
    // home layout
    const homelayout = renderHomelayout();
    app.appendChild(homelayout);
}

createApp(app);
