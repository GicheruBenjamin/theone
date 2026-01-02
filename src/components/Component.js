// src/components/Component.js


//A function component that takes element and props as parameters

function Component(el, props = {}) {
    try {
        // Validate that `el` is a string representing a valid HTML tag name
        if (typeof el !== "string") {
            throw new Error("The 'el' parameter must be a string representing an HTML element tag.");
        }

        // Create a new element
        const element = document.createElement(el);

        // Apply className if provided
        if (props.className) {
            element.className = props.className;
        }

        // Apply id if provided
        if (props.id) {
            element.id = props.id;
        }

        // Apply inline styles if provided (as an object)
        if (props.style && typeof props.style === "object") {
            Object.assign(element.style, props.style);
        }

        // Handle children
        if (props.children) {
            if (typeof props.children === "string") {
                // If children is a string, set it as text content
                element.textContent = props.children;
            } else if (Array.isArray(props.children)) {
                // If children is an array, append each child
                props.children.forEach((child) => {
                    if (child instanceof HTMLElement) {
                        element.appendChild(child);
                    } else {
                        throw new Error("Children array elements must be valid DOM nodes.");
                    }
                });
            } else if (props.children instanceof HTMLElement) {
                // If children is a single DOM node, append it
                element.appendChild(props.children);
            } else {
                throw new Error("Invalid type for 'children'. It must be a string, DOM node, or array of DOM nodes.");
            }
        }

        // Apply attributes if provided (as an object)
        if (props.attributes && typeof props.attributes === "object") {
            for (const [key, value] of Object.entries(props.attributes)) {
                element.setAttribute(key, value);
            }
        }

        // Add event listeners if provided (as an object)
        if (props.events && typeof props.events === "object") {
            for (const [event, handler] of Object.entries(props.events)) {
                if (typeof handler === "function") {
                    element.addEventListener(event, handler);
                } else {
                    throw new Error(`Event handler for '${event}' must be a function.`);
                }
            }
        }

        // Return the created and configured element
        return element;

    } catch (error) {
        console.error("Error in App function:", error.message);
        alert("Something is wrong: " + error.message);
        return null; // Return null on failure
    }
}
