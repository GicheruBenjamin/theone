// nav.js

/*
Handling navigtion
1. Link
2. useRouter(route)
3. Router(app)
*/

import { Component } from "./Components.js"

export function Link(to, component){
}

function useRouter(route){
}

function Router(app, routes){
}

const appRoutes = [
    {
      layout: HomeLayout,
      routes: [
        { path: "/", component: Home },
        { path: "/about", component: About },
        { path: "/login", component: Login }
      ]
    },
    {
      layout: DashboardLayout,
      routes: [
        { path: "/user/:id", component: Overview },
        { path: "/user/:id/posts", component: Posts },
        { path: "/user/:id/todos", component: Todos },
        { path: "/user/:id/albums", component: Albums },
        { path: "/logout", component: Logout }
      ]
    }
  ];
  