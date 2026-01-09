
// router.js

import {
    renderHomepage,
    renderAboutpage,
    renderLoginpage,
    renderHomelayout,
    renderDashboardlayout
} from "./Components.js";

import { getapidata } from "./services.js";

import {
    loginuser,
    getuserpostsandcomments,
    getusertodos,
    getuseralbumsandphotos
} from "./dataprocessing.js";

/* ===================== APP STATE ===================== */

const state = {
    user: null,
    users: [],
    posts: [],
    comments: [],
    todos: [],
    albums: [],
    photos: []
};

/* ===================== ROUTES ===================== */

const publicRoutes = {
    "/": renderHomepage,
    "/about": renderAboutpage,
    "/login": renderLoginpage
};

const privateRoutes = {
    "/user": renderDashboardOverview,
    "/user/posts": renderUserPosts,
    "/user/todos": renderUserTodos,
    "/user/albums": renderUserAlbums
};

/* ===================== CORE ===================== */

let appRoot;

export async function initRouter(app) {
    appRoot = app;

    // preload all data once
    const labels = ["users", "posts", "comments", "todos", "albums", "photos"];
    for (const label of labels) {
        const res = await getapidata(label);
        if (res.ok) state[label] = res.data;
    }

    interceptLinks();
    window.addEventListener("popstate", route);

    route(); // initial render
}

function route() {
    const path = window.location.pathname;

    appRoot.innerHTML = "";

    // PRIVATE ROUTES
    if (path.startsWith("/user")) {
        if (!state.user) {
            navigate("/login");
            return;
        }

        const { layout, slot } = renderDashboardlayout();
        appRoot.appendChild(layout);

        const render = privateRoutes[path];
        slot.appendChild(render ? render() : notFound());

        return;
    }

    // PUBLIC ROUTES
    const { layout, slot } = renderHomelayout();
    appRoot.appendChild(layout);

    const render = publicRoutes[path];
    slot.appendChild(render ? render() : notFound());

    if (path === "/login") attachLoginHandler();
}

/* ===================== NAVIGATION ===================== */

function navigate(path) {
    history.pushState({}, "", path);
    route();
}

function interceptLinks() {
    document.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || !href.startsWith("/")) return;

        e.preventDefault();
        navigate(href);
    });
}

/* ===================== LOGIN ===================== */

function attachLoginHandler() {
    const form = document.querySelector(".loginform");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const data = new FormData(form);
        const username = data.get("username");
        const email = data.get("email");

        const result = loginuser({ username, email }, state.users);

        if (result.ok) {
            state.user = result.data;
            navigate("/user");
        } else {
            alert("Login failed");
        }
    });
}

/* ===================== DASHBOARD PAGES ===================== */

function renderDashboardOverview() {
    const div = document.createElement("div");
    div.className = "page";
    div.innerHTML = `
        <h1>Welcome ${state.user.username}</h1>
        <p>Email: ${state.user.email}</p>
    `;
    return div;
}

function renderUserPosts() {
    const res = getuserpostsandcomments(
        state.user.id,
        state.posts,
        state.comments
    );

    if (!res.ok) return page("No posts");

    const div = page("Your Posts");

    res.data.forEach(post => {
        const p = document.createElement("div");
        p.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
        div.appendChild(p);
    });

    return div;
}

function renderUserTodos() {
    const res = getusertodos(state.user.id, state.todos);
    if (!res.ok) return page("No todos");

    const div = page("Your Todos");

    res.data.forEach(todo => {
        const p = document.createElement("p");
        p.textContent = `${todo.completed ? "✅" : "❌"} ${todo.title}`;
        div.appendChild(p);
    });

    return div;
}

function renderUserAlbums() {
    const res = getuseralbumsandphotos(
        state.user.id,
        state.albums,
        state.photos
    );

    if (!res.ok) return page("No albums");

    const div = page("Your Albums");

    res.data.forEach(album => {
        const h = document.createElement("h3");
        h.textContent = album.title;
        div.appendChild(h);
    });

    return div;
}

/* ===================== HELPERS ===================== */

function page(title) {
    const div = document.createElement("div");
    div.className = "page";
    div.innerHTML = `<h1>${title}</h1>`;
    return div;
}

function notFound() {
    return page("404 - Page Not Found");
}
