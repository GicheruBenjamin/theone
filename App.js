// App.js
import { Component } from "./Components.js";

/* =========================
   SERVICES
========================= */

const API_URL = "https://jsonplaceholder.typicode.com";

async function getapidata(label) {
    try {
        const res = await fetch(`${API_URL}/${label}`);
        if (!res.ok) {
            return { ok: false, message: res.statusText, data: null };
        }
        return { ok: true, message: "Success", data: await res.json() };
    } catch (e) {
        return { ok: false, message: e.message, data: null };
    }
}

/* =========================
   RENDER FUNCTIONS
========================= */

function renderUserOverview(user) {
    return Component("div", {
        className: "useroverview",
        children: [
            Component("h1", { text: "User Overview" }),
            Component("p", { text: `Username: ${user.username}` }),
            Component("p", { text: `Email: ${user.email}` }),

            Component("h3", { text: "Address" }),
            Component("p", { text: user.address.street }),
            Component("p", { text: user.address.suite }),
            Component("p", { text: user.address.city }),

            Component("h3", { text: "Contact" }),
            Component("p", { text: user.phone }),
            Component("p", { text: user.website }),

            Component("h3", { text: "Company" }),
            Component("p", { text: user.company.name }),
            Component("p", { text: user.company.catchPhrase }),
            Component("p", { text: user.company.bs })
        ]
    });
}

function renderUserPosts(userId, posts, comments) {
    const userPosts = posts
        .filter(p => p.userId === userId)
        .map(post => ({
            ...post,
            comments: comments.filter(c => c.postId === post.id)
        }));

    return Component("div", {
        children: [
            Component("h1", { text: "Posts" }),
            ...userPosts.map(post =>
                Component("div", {
                    className: "userpost",
                    children: [
                        Component("h2", { text: post.title }),
                        Component("p", { text: post.body }),
                        ...post.comments.map(c =>
                            Component("p", { text: `💬 ${c.body}` })
                        )
                    ]
                })
            )
        ]
    });
}

function renderUserTodos(userId, todos) {
    return Component("div", {
        children: [
            Component("h1", { text: "Todos" }),
            ...todos
                .filter(t => t.userId === userId)
                .map(todo =>
                    Component("p", {
                        text: `${todo.completed ? "✅" : "❌"} ${todo.title}`
                    })
                )
        ]
    });
}

function renderUserAlbums(userId, albums, photos) {
    const userAlbums = albums
        .filter(a => a.userId === userId)
        .map(album => ({
            ...album,
            photos: photos.filter(p => p.albumId === album.id)
        }));

    return Component("div", {
        children: [
            Component("h1", { text: "Albums" }),
            ...userAlbums.map(album =>
                Component("div", {
                    children: [
                        Component("h2", { text: album.title }),
                        ...album.photos.map(photo =>
                            Component("img", {
                                attributes: { src: photo.thumbnailUrl }
                            })
                        )
                    ]
                })
            )
        ]
    });
}

/* =========================
   APP BOOTSTRAP
========================= */

async function startApp() {
    const app = document.getElementById("app");

    const [
        usersRes,
        postsRes,
        commentsRes,
        todosRes,
        albumsRes,
        photosRes
    ] = await Promise.all([
        getapidata("users"),
        getapidata("posts"),
        getapidata("comments"),
        getapidata("todos"),
        getapidata("albums"),
        getapidata("photos")
    ]);

    if (!usersRes.ok) {
        app.appendChild(Component("p", { text: "Failed to load data" }));
        return;
    }

    const userId = 1; // demo user
    const user = usersRes.data.find(u => u.id === userId);

    app.appendChild(renderUserOverview(user));
    app.appendChild(renderUserPosts(userId, postsRes.data, commentsRes.data));
    app.appendChild(renderUserTodos(userId, todosRes.data));
    app.appendChild(renderUserAlbums(userId, albumsRes.data, photosRes.data));
}

startApp();
