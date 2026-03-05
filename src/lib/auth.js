export function extractAndStoreToken(){

    if(typeof window === "undefined") return;

    const params=new URLSearchParams(window.location.search);
    const token=params.get("token");



    if(token){
        sessionStorage.setItem("pending_token",token);
        document.cookie=`token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;
        window.history.replaceState({},"",window.location.pathname);
    }
}

export function getToken() {

    if(typeof window==="undefined") return;

    const cookie=document.cookie.split("; ").find(r=>r.startsWith("token="))?.split("=")[1];

    if(cookie) return cookie;

    return sessionStorage.getItem("pending_token");
    
}