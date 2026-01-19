// pages.js

import { Component } from "./Components.js"
import { renderLoginform } from "./login.js"


export function renderHomepage(){
    // Create a homepage
    const Home = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                className : "pageheader",
                text : "TheOne"
            }),
            Component("p",{
                className : "pagedescription",
                text : "Welcome to TheOne."
            })
        ]
    })
    return Home
}

export function renderAboutpage(){
    // Create a about page
    const About = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                className : "pageheader",
                text : "About"
            }),
            Component("p",{
                className : "pagedescription",
                text : "You are TheOne because u can access some data."
            })
        ]
    })
    return About
}

export function renderLoginpage(){
    // Create a login page
    const Login = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                text : "Login"
            }),
            Component("p",{
                text : "Be TheOne."
            },),
            renderLoginform()
        ]
    })
    return Login
}