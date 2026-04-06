// routes.js

export const homeRoutes = [
    {
        path: "/",
        page : Home
    },
    {
        path: "/about",
        page : About
    },
    {
        path: "/login",
        page : Login
    },
]

export const dashboardRoutes = [
    {
        path: "/user/:id",
        page : UserOverview
    },
    {
        path: "/user/:id/posts",
        page : UserPostsandComments
    },
    {
        path: "/user/:id/todos",
        page : UserTodos
    },
    {
        path: "/user/:id/albums",
        page : UserAlbumsandPhotos
    }
]