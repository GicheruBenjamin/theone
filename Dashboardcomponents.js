// dashboardview.js

/*
1. Dashboardoverview()
2. Dashboardpostsandcomments()
3. Dashboardtodos()
4. Dashboardalbumsandphotos()
*/

import { Component } from "./Components.js"

export function Dashboardoverview(user){
    return Component("div",{
        className : "dashboardoverview",
        children : [
            Component("h1",{
                text : "Dashboard Overview"
            }),
            Component("p",{
                text : "Welcome to your dashboard"
            }),
            Component("div",{
                className : "userprofile",
                // User profile :name, username, email, address{street, suite, city, zipcode, geo{lat, lng}},phone, website, company{name, catchPhrase, bs}
                children : [
                    Component("h2",{
                        text : user.name
                    }),
                    Component("p",{
                        text : user.email
                    }),
                    Component("div",{
                        className : "userprofileaddress",
                        children : [
                            Component("p",{
                                text : user.address.street
                            }),
                            Component("p",{
                                text : user.address.suite
                            }),
                            Component("p",{
                                text : user.address.city
                            }),
                            Component("p",{
                                text : user.address.zipcode
                            }),
                            Component("a",{
                                text : user.address.geo.lat
                            }),
                            Component("a",{
                                text : user.address.geo.lng
                            })
                        ],
                    }),
                    Component("p",{
                        text : user.phone
                    }),
                    Component("p",{
                        text : user.website
                    }),
                    Component("div",{
                        className : "userprofilecompany",
                        children : [
                            Component("p",{
                                text : user.company.name
                            }),
                            Component("p",{
                                text : user.company.catchPhrase
                            }),
                            Component("p",{
                                text : user.company.bs
                            })
                        ]
                    })
                ]
            })
        ]
    })
}