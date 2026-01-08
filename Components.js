// Components.js

function Component(tag, props = {}) {
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


function renderHome(){
    // Create a homepage
    const Home = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                text : "TheOne"
            }),
            Component("p",{
                text : "Welcome to TheOne"
            })
        ]
    })
    return Home
}

function renderAbout(){
    // Create a about page
    const About = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                text : "About"
            }),
            Component("p",{
                text : "You are the one because u can access some data"
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
                className : "loginformlabel"
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
                className : "loginformlabel"
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

function renderLogin(){
    // Create a login page
    const Login = Component("div",{
        className : "page",
        children : [
            Component("h1",{
                text : "Login"
            }),
            Component("p",{
                text : "You are the one because u can access some data"
            },),
            renderLoginform()
        ]
    })
    return Login
}

const header = Component("header",
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

const Slot = Component("div",{
    className : "slot",
})

const Homelayout = Component("div",{
    className : "homelayout",
    children : [
        header,
        Slot,
    ]
})

const Dashbordsidebar = Component("div",{
    className : "dashbordsidebar",
    // Buttons for the dashboard Overview , posts , todos and albums
    children : [
        Component("div",
            {
                className : "dashbordsidebarbuttons",
                children : [
                    Component("a",
                        {
                            text : "Overview",
                            className : "dashbordsidebarbutton",
                            attributes : {
                                href : "/dashboard"
                            }
                        }
                    ),
                    Component("a",
                        {
                            text : "Posts",
                            className : "dashbordsidebarbutton",
                            attributes : {
                                href : "/dashboard/posts"
                            }
                        }
                    ),
                    Component("a",
                        {
                            text : "Todos",
                            className : "dashbordsidebarbutton",
                            attributes : {
                                href : "/dashboard/todos"
                            }
                        }
                    ),
                    Component("a",
                        {
                            text : "Albums",
                            className : "dashbordsidebarbutton",
                            attributes : {
                                href : "/dashboard/albums"
                            }
                        }
                    )
                ]
            }
        )
    ]
})


const DashboardLayout = Component("div",{
    className : "dashboardlayout",
    children : [
        Dashbordsidebar,
        Slot,
    ]
})

function renderPage(layout, component){

}