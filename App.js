// App.js
import  getPhotoUrl  from "./Photos.js";
import Component from "./Components.js";

const app = document.getElementById("app");

function renderImg(url, alt, width, height) {
    return Component("img", {
        className: "img-fluid",
        attributes: {
            src: url,
            alt,
            width,
            height
        }
    });
}

function renderImages(container) {
    const dimensions = [
        { width: 100, height: 100 },
        { width: 200, height: 200 },
        { width: 300, height: 300 },
        { width: 400, height: 400 },
        { width: 500, height: 500 },
        { width: 600, height: 600 }
    ];

    dimensions.forEach(({ width, height }, index) => {
        const res = getPhotoUrl(width, height, index);
        if (!res.ok) return;

        const img = renderImg(
            res.data,
            `Random image ${width}x${height}`,
            width,
            height
        );

        container.appendChild(img);
    });
}

renderImages(app);
