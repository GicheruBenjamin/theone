// Image.js
import Component from "./Components.js";
import getPhotoUrl from "./Photos.js";

const CACHE_KEY = "image-cache";

function getCache() {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
}

function setCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export default function Image({
    width,
    height,
    seed,
    alt = "",
    className = ""
}) {
    const cache = getCache();
    const cacheId = `${width}x${height}-${seed}`;

    let src = cache[cacheId];

    if (!src) {
        const res = getPhotoUrl(width, height, seed);
        if (!res.ok) return null;

        src = res.data;
        cache[cacheId] = src;
        setCache(cache);
    }

    const img = Component("img", {
        className,
        attributes: {
            alt,
            width,
            height,
            "data-src": src
        }
    });

    const observer = new IntersectionObserver(
        ([entry], obs) => {
            if (entry.isIntersecting) {
                img.src = img.dataset.src;
                obs.disconnect();
            }
        },
        { rootMargin: "100px" }
    );

    observer.observe(img);

    return img;
}
