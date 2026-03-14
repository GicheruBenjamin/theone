// Component.js

export default function Component(tag, props = {}) {
    const element = document.createElement(tag);

    // Text
    if (props.text !== undefined) {
        element.textContent = props.text;
    }

    // Properties
    if (props.props) {
        Object.assign(element, props.props);
    }

    // Styles
    if (props.styles) {
        Object.assign(element.style, props.styles);
    }

    // Class (string or array)
    if (props.className) {
        if (Array.isArray(props.className)) {
            element.classList.add(...props.className);
        } else {
            element.className = props.className;
        }
    }

    // Dataset
    if (props.dataset) {
        Object.assign(element.dataset, props.dataset);
    }

    // Attributes
    if (props.attributes) {
        Object.entries(props.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    // Events (with options)
    if (props.events) {
        Object.entries(props.events).forEach(([event, value]) => {
            if (typeof value === "function") {
                element.addEventListener(event, value);
            } else {
                element.addEventListener(event, value.handler, value.options);
            }
        });
    }

    // Children
    if (props.children) {
        props.children.forEach(child => {
            element.append(
                typeof child === "string"
                    ? document.createTextNode(child)
                    : child
            );
        });
    }

    // Ref (escape hatch)
    if (props.ref && typeof props.ref === "function") {
        props.ref(element);
    }

    return element;
}
