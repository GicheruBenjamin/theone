// App.js

import Image from "./Image.js";
import {
    HomePage,
    AboutPage,
    LoginPage
} from "./pages.js";
import { UserOverview } from "./Dashboardcomponents.js";

const app = document.getElementById("app");

app.append(
    Image({
        width: 100,
        height: 100,
        seed: 1,
        alt: "Lorem Picsum",
        className: "image"
    })
);

LoginPage(app);

const user = JSON.parse(localStorage.getItem("user"));

console.log(user);

