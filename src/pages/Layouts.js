// Layouts.js

import { Component } from "./Components.js"


function Link(to){
}

function Header(){
    return Component("header",
        {
            className : "header",
            children : [
                Component("h1",
                    {
                        text : "TheOne",
                        className : "headertitle"
                    }
                ),
                Component("nav",
                    {
                        className : "headernav",
                        children : [
                            Component("a",
                                {
                                    text : "Home",
                                    className : "headernavitem",
                                    attributes : {
                                        href : "/"
                                    }
                                }
                            ),
                            Component("a",
                                {
                                    text : "About",
                                    className : "headernavitem",
                                    attributes : {
                                        href : "/about"
                                    }
                                }
                            ),
                            Component("a",
                                {
                                    text : "Login",
                                    className : "headernavitem",
                                    attributes : {
                                        href : "/login"
                                    }
                                }
                            )                        
                        ]
                    }
                )
            ]
        }
    )
}

function createSlot(){
    const Slot = Component("div",{
        className : "slot",
        attributes : {
            id : "slot"
        }
    })
    return Slot
}


export function Homelayout(){
    const Slot = createSlot()
    const Homelayout = Component("div",{
        className : "homelayout",
        children : [
            renderheader(),
            Slot,
        ]
    })
    return Homelayout
}

function Dashboardsidebar(){
    return Component("div",{
            className : "dashbordsidebar",
            // Buttons for the dashboard Overview , posts , todos and albums
            children : [
                Component("h3",{
                    text : "TheOne",
                    className: "headertitle"
                }),
                Component("div",
                    {
                        className : "dashbordsidebarbuttons",
                        children : [
                            Component("a",
                                {
                                    text : "Overview",
                                    className : "dashbordsidebarbutton",
                                    attributes : {
                                        href : "/user"
                                    }
                                }
                            ),
                            Component("a",
                                {
                                    text : "Posts",
                                    className : "dashbordsidebarbutton",
                                    attributes : {
                                        href : "/user/posts"
                                    }
                                }
                            ),
                            Component("a",
                                {
                                    text : "Todos",
                                    className : "dashbordsidebarbutton",
                                    attributes : {
                                        href : "/user/todos"
                                    }
                                }
                            ),
                            Component("a",
                                {
                                    text : "Albums",
                                    className : "dashbordsidebarbutton",
                                    attributes : {
                                        href : "/user/albums"
                                    }
                                }
                            ),
                            Component("button",
                                {
                                    text : "Logout",
                                    className : "dashbordsidebarbutton",
                                    attributes : {
                                        href : "/"
                                    }
                                }
                            )
                        ]
                    }
                )
            ]
        }
    )
}

export function Dashboardlayout(){
    const Slot = createSlot()
    const DashboardLayout = Component("div",{
        className : "dashboardlayout",
        children : [
            Dashboardsidebar(),
            Slot,
        ]
    })
    return DashboardLayout
}


