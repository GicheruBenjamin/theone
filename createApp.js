// createApp.js

import {
    renderHomelayout,
    renderHomepage,
    renderAboutpage,
    renderLoginpage,
} from "./Components.js";

export function createApp(app){
    const hl = renderHomelayout();
    const slot = document.querySelector("#slot");
    app.appendChild(hl);

    function renderPage(page){
        slot.innerHTML = "";
        slot.appendChild(page);
    }

    const routes = {
        "/": renderPage(renderHomepage()),
        "/about": renderPage(renderAboutpage()),
        "/login": renderPage(renderLoginpage())
    }

    window.addEventListener("popstate", e => {
        const url = new URL(window.location);
        const path = url.pathname;
        if (path in routes) {
            routes[path]();
        }
    });

    window.history.pushState({}, "", "/");
    renderPage(renderHomepage());
}

