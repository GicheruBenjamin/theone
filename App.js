// App.js

import Image from "./Image.js";
import {
    HomePage,
    AboutPage,
    LoginPage
} from "./pages.js";

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

HomePage(app);
AboutPage(app); 
LoginPage(app);

