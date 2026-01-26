// Components.js

export default function Component(tag, props = {}) {
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






