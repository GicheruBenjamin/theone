// Button.js

import Component from "../../../lib/Component.js";

export default function Button(label, type, onClick) {
    const btn = Component("button", {
        text: label,
        props: {
            type: type
        },
        events: {
            click: onClick
        }
    });
    return btn;
}