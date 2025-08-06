import axios from "axios";

const isServer = typeof window === "undefined";

const baseURL = isServer ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL;

export default axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});
