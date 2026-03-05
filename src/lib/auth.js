export function extractAndStoreToken(){

    if(typeof window === "undefined") return;

    const params=new URLSearchParams(window.location.search);
    const token=params.get("token");

    if(token){
        localStorage.setItem("jwt",token);
        window.history.replaceState({},"",window.location.pathname);
    }
}

export function getToken() {
    if(typeof window==="undefined") return;
    return localStorage.getItem("jwt");
}

export function clearToken() {
    localStorage.removeItem("jwt");
}