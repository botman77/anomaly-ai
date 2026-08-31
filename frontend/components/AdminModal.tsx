"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaThLarge } from "react-icons/fa";
import { getApiUrl } from "@/lib/api";

export default function AdminModal() {

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const handleLogin = async () => {
    try {
      // const API_URL = await getApiUrl();
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user,
          password,
        }),
      });


      if (!res.ok) {
        throw new Error("Login failed");
      }


      const data = await res.json();


      console.log("LOGIN RESPONSE:", data);



      if (data.success === true) {


        // SAVE LOGIN SESSION
        localStorage.setItem(
          "authenticated",
          "true"
        );


        // SAVE USER (optional)
        localStorage.setItem(
          "user",
          user
        );


        // clear inputs
        setUser("");
        setPassword("");


        // close modal
        setOpen(false);


        // redirect
        router.push("/download");


      } else {

        alert("Invalid username or password");

      }


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        "Invalid username or password"
      );

    }
  };


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
        flex items-center gap-3 
        px-3 py-2 rounded-lg 
        text-[14px] text-gray-700 
        hover:bg-gray-50 
        hover:text-gray-900 
        transition w-full cursor-pointer"
      >

        <FaThLarge />

        Admin Panel

      </button>


      {open && (

        <div className="
          fixed inset-0 
          z-[9999] 
          bg-gray-100 
          overflow-auto
        ">


          <div className="
            min-h-screen 
            flex 
            items-center 
            justify-center 
            p-6
          ">


            <div className="w-full max-w-md">


              <div className="text-center mb-4">

                <p className="
                  text-sm 
                  font-semibold 
                  text-gray-700
                ">
                  Sign in to access your account
                </p>

              </div>



              <div className="
                relative
                bg-gray-50/70
                backdrop-blur-xl
                border border-gray-200
                rounded-3xl
                p-8
                shadow-xl
              ">



                <form className="space-y-5">


                  <div>

                    <label className="text-sm text-gray-700">
                      User
                    </label>


                    <input
                      type="text"
                      value={user}
                      onChange={(e)=>setUser(e.target.value)}
                      className="
                      mt-2 w-full 
                      rounded-xl 
                      bg-white/60 
                      border border-gray-300 
                      px-4 py-3 
                      outline-none"
                      placeholder="Enter your user"
                    />

                  </div>



                  <div>

                    <label className="text-sm text-gray-700">
                      Password
                    </label>


                    <input
                      type="password"
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      className="
                      mt-2 w-full 
                      rounded-xl 
                      bg-white/60 
                      border border-gray-300 
                      px-4 py-3 
                      outline-none"
                      placeholder="••••••••"
                    />

                  </div>



                  <button
                    type="button"
                    onClick={handleLogin}
                    className="
                    w-full py-3 
                    rounded-xl 
                    bg-gray-900 
                    text-white 
                    font-semibold 
                    hover:bg-gray-800"
                  >
                    Sign In
                  </button>


                </form>



                <button
                  onClick={()=>setOpen(false)}
                  className="
                  absolute top-4 right-4 
                  text-gray-500 
                  hover:text-black"
                >
                  ✕
                </button>


              </div>


            </div>


          </div>


        </div>

      )}

    </>
  );
}