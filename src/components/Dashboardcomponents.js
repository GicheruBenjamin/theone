// Dashboardcomponents.js

import {
    getUserOverview,
    getUserPostsandComments,
    getUserTodos,
    getUserAlbumsandPhotos
} from "./services.js";

import Component from "./Components.js";

export function UserOverview(user){
    const uid = user.id;
    const uores = getUserOverview(uid);

    if (!uores.ok) {
        return Component("div", {
            text: uores.message
        });
    }

    const overview = uores.data;

    return Component("div", {
        children: [
            Component("h2", {
                text: "User Overview"
            }),
            Component("p", {
                text: `User ID: ${overview.id}`
            }),
            Component("p", {
                text: `Posts: ${overview.postscount}`
            }),
            Component("p", {
                text: `Comments: ${overview.commentscount}`
            }),
            Component("p", {
                text: `Todos: ${overview.todoscount}`
            }),
            Component("p", {
                text: `Albums: ${overview.albumscount}`
            }),
            Component("p", {
                text: `Photos: ${overview.photoscount}`
            })
        ]
    });
}

export function UserPostsandComments(user){
    const uid = user.id;
    const upcores = getUserPostsandComments(uid);

    if (!upcores.ok) {
        return Component("div", {
            text: upcores.message
        });
    }

    const posts = upcores.data;

    return Component("div", {
        children: [
            Component("h2", {
                text: "User Posts and Comments"
            }),
            Component("p", {
                text: `Posts: ${posts.length}`
            }),
            Component("p", {
                text: `Comments: ${posts.reduce((acc, post) => acc + post.comments.length, 0)}`
            })
        ]
    });
}

export function UserTodos(user){
    const uid = user.id;
    const utores = getUserTodos(uid);

    if (!utores.ok) {
        return Component("div", {
            text: utores.message
        });
    }

    const todos = utores.data;

    return Component("div", {
        children: [
            Component("h2", {
                text: "User Todos"
            }),
            Component("p", {
                text: `Todos: ${todos.length}`
            })
        ]
    });
}

export function UserAlbumsandPhotos(user){
    const uid = user.id;
    const uaores = getUserAlbumsandPhotos(uid);

    if (!uaores.ok) {
        return Component("div", {
            text: uaores.message
        });
    }

    const albums = uaores.data;

    return Component("div", {
        children: [
            Component("h2", {
                text: "User Albums and Photos"
            }),
            Component("p", {
                text: `Albums: ${albums.length}`
            }),
            Component("p", {
                text: `Photos: ${albums.reduce((acc, album) => acc + album.photos.length, 0)}`
            })
        ]
    });
}