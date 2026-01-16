// Components.js

export function Component(tag, props = {}) {
    const element = document.createElement(tag);

    // Text
    if (props.text !== undefined) {
        element.textContent = props.text;
    }

    // Properties (value, id, checked, etc.)
    if (props.props) {
        Object.assign(element, props.props);
    }

    // Styles
    if (props.styles) {
        Object.assign(element.style, props.styles);
    }

    // Class
    if (props.className) {
        element.className = props.className;
    }

    // Attributes
    if (props.attributes) {
        Object.entries(props.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    // Events
    if (props.events) {
        Object.entries(props.events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    // Children
    if (props.children) {
        props.children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }

    return element;
}


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

function renderLoginform(){
    let Loginform = Component("form",{
        className : "loginform",
        children : [
            Component("label",{
                text : "Username",
                className : "loginformlabel",
                attributes : {
                    for : "username"
                }
            }),
            Component("input",{
                className : "loginforminput",
                attributes : {
                    type : "text",
                    name : "username",
                    placeholder : "Username"
                }
            }),
            Component("label",{
                text : "Email",
                className : "loginformlabel",
                attributes : {
                    for : "email"
                }
            }),
            Component("input",{
                className : "loginforminput",
                attributes : {
                    type : "email",
                    name : "email",
                    placeholder : "Email"
                }
            }),
            Component("button",{
                text : "Login",
                className : "loginformbutton",
                attributes : {
                    type : "submit"
                }
            })
        ]})
        return Loginform
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

function renderheader(){
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
    })
    return Slot
}


export function renderHomelayout(){
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

function renderDashboardsidebar(){
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

export function renderDashboardlayout(){
    const Slot = createSlot()
    const DashboardLayout = Component("div",{
        className : "dashboardlayout",
        children : [
            renderDashboardsidebar(),
            Slot,
        ]
    })
    return DashboardLayout
}

