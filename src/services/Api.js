// Api.js  :  Responsible for fetching data from jsonplaceholder.typicode.com
const url = "https://jsonplaceholder.typicode.com";

const labels = ["users", "posts", "comments", "albums", "todos", "photos"];

export default async function getApiData(label) {
    try {

        //Check if the label is valid
        if (!label) {
            return {
                ok: false,
                message: "Label is required",
                data: null
            };
        }

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