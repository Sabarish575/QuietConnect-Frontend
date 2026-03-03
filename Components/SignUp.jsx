"use client"

// components/GoogleSignInButton.jsx
export default function SignUp() {
  const handleGoogleSignIn = () => {
    window.location.href = "https://quietconnect-backend.onrender.com/oauth2/authorization/google";
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-center space-y-4">
        <h1 className="text-4xl">Quiet-Connect</h1>
        <button
        onClick={handleGoogleSignIn}
        className="bg-black text-white text-xl p-2 border-2 border-white rounded-2xl cursor-pointer"
        >
        Sign up with Google
        </button>
    </div>
  );
}
