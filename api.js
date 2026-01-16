// api.js  

// Responsible of Api interaction.

const url = "https://jsonplaceholder.typicode.com";

export async function getapidata(label) {
    try {

        //Check if the label is valid
        if (!label) {
            return {
                ok: false,
                message: "Label is required",
                data: null
            };
        }
        
        const labels = ["users", "posts", "comments", "albums", "todos"];
        if (!labels.includes(label)) {
            return {
                ok: false,
                message: `Invalid label ${label}`,
                data: null
            };
        }
        
        const res = await fetch(`${url}/${label}`);

        if (!res.ok) {
            return {
                ok: false,
                message: `Fetching ${label} failed (${res.status} ${res.statusText})`,
                data: null
            };
        }

        const data = await res.json();

        return {
            ok: true,
            message: `Fetched ${label} successfully`,
            data
        };

    } catch (e) {
        return {
            ok: false,
            message: `Fetching ${label} failed with error: ${e.message}`,
            data: null
        };
    }
}