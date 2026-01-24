// nav.js

/*
Handling navigtion
1. Link
2. useRouter(route)
*/

import { Component } from "./Components.js"

export function Link(to, component){
    return Component("a",
        {
            text : component.text,
            className : component.className,
            attributes : {
                href : to
            }
        }
    )
}

function useRouter(route){
    const url = new URL(window.location);
    const path = url.pathname;
    if (path in route) {
        route[path]();
    }
}
