// App.js

import { renderHomepage, renderAboutpage, renderLoginpage } from "./pages.js"

const app = document.getElementById("app");

app.appendChild(renderHomepage());
