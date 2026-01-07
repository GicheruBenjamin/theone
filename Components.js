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

const Home = Component("div", {
    className : "homepage",
    children : [
        Component("h1",
            {
                text : "Welcome to theone",
                className: "hero",
            }
        )
    ]
})

const About = Component("div",{
    className : "aboutpage",
    children : [
        Component("h1",
            {
                text : "Here one is allowed to have access to some data",
                className : "hero"
            }
        )
    ]
})

const Login = Component("div",{
    className : "loginpage",
    children : [
        Component("h1",
            {
                text : "Login",
                className : "hero"
            }
        ),
        Component("form",
            {
                className : "loginform",
                events : {
                    "submit" : (e) => {
                        e.preventDefault();
                        console.log("Login submitted");
                    }
                },
                children : [
                    Component("input",
                        {
                            className : "inputusername",
                            attributes : {
                                name : "username",
                                required : true,
                                type : "text",
                                placeholder : "Username"
                            }
                        }
                    ),
                    Component("input",
                        {
                            className : "inputemail",
                            attributes : {
                                name : "email",
                                required : true,
                                type : "email",
                                placeholder : "Email"
                            }
                        }
                    )
                ]
            }
        )
    ]
})

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

const Homelayout = Component("div",{
    className : "homelayout",
    children : [
        header,
        Component("div",
            {
                className : "slot",
                children : [
                    Component("div",
                        {
                            className : "slotcontent",
                        }
                    )
                ]
            }
        )
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
        Component("div",
            {
                className : "slot",
                children : [
                    Component("div",
                        {
                            className : "slotcontent",
                            children : [
                                Component("div",
                                    {
                                        className : "dashboardcontent",
                                        children : [
                                            Dashbordsidebar,
                                            Component("div",
                                                {
                                                    className : "dashbaordmaincontent",
                                                    children : []
                                                }
                                            )
                                        ]    
                                    }
                                )
                            ]
                        }
                    )
                ]
            }
        )
    ]
})

