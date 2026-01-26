// login.js
import  Component  from "./Components.js"

export function Loginform(){
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
