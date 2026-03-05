export function extractAndStoreToken(){

    if(typeof window === "undefined") return;

    const params=new URLSearchParams(window.location.search);
    const token=params.get("token");

    console.log("this is your token ",token);
    

    if(token){
        document.cookie=`token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`
    }
    
    window.history.replaceState({},"",window.location.pathname);
}