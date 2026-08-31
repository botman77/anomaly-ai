"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);


  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-950
      via-blue-950
      to-indigo-950
      relative
      overflow-hidden
      p-6
    ">


      {/* Background effects */}

      <div className="
        absolute
        w-[500px]
        h-[500px]
        bg-blue-500/30
        rounded-full
        blur-[120px]
        -top-40
        -left-40
      "/>


      <div className="
        absolute
        w-[450px]
        h-[450px]
        bg-purple-500/20
        rounded-full
        blur-[120px]
        bottom-0
        right-0
      "/>




      <div className="
        w-full
        max-w-5xl
        grid
        lg:grid-cols-2
        gap-10
        items-center
        relative
        z-10
      ">



        {/* LEFT */}

        <section className="hidden lg:block text-white">


          <div className="
            inline-flex
            items-center
            gap-3
            bg-white/10
            backdrop-blur-xl
            px-5
            py-3
            rounded-full
          ">

            <Database className="text-blue-400"/>

            <span className="font-semibold">
              Report Consolidation
            </span>

          </div>



          <h1 className="
            text-6xl
            font-bold
            mt-10
            leading-tight
          ">

            One place.
            <br/>

            <span className="text-blue-400">
              Every report.
            </span>

          </h1>



          <p className="
            mt-6
            text-lg
            text-slate-300
            max-w-lg
          ">

            Manage, analyze and consolidate
            your organization's reports
            faster with intelligent tools.

          </p>



          <div className="
            mt-12
            grid
            grid-cols-2
            gap-5
          ">


            <div className="
              bg-white/10
              backdrop-blur-xl
              rounded-2xl
              p-5
            ">

              <Sparkles className="text-blue-400"/>

              <h3 className="text-3xl font-bold mt-3">
                99%
              </h3>

              <p className="text-slate-300">
                Accuracy
              </p>

            </div>



            <div className="
              bg-white/10
              backdrop-blur-xl
              rounded-2xl
              p-5
            ">

              <ShieldCheck className="text-green-400"/>

              <h3 className="text-3xl font-bold mt-3">
                Secure
              </h3>

              <p className="text-slate-300">
                Data Protection
              </p>

            </div>


          </div>



        </section>







        {/* LOGIN CARD */}


        <section className="
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-10
        ">



          <div className="text-center text-white">


            <div className="
              w-20
              h-20
              mx-auto
              rounded-2xl
              bg-blue-500
              flex
              items-center
              justify-center
            ">

              <Database size={38}/>

            </div>



            <h2 className="
              text-3xl
              font-bold
              mt-6
            ">

              Welcome Back

            </h2>


            <p className="text-slate-300 mt-2">

              Login to your dashboard

            </p>


          </div>





          <form className="mt-8 space-y-5">



            {/* EMAIL */}

            <div>

              <label className="text-white">
                Email
              </label>


              <div className="relative mt-2">


                <Mail
                  className="
                  absolute
                  left-4
                  top-4
                  text-slate-400
                  "
                />


                <input

                  type="email"

                  placeholder="example@email.com"

                  className="
                    w-full
                    bg-white/10
                    border
                    border-white/20
                    text-white
                    placeholder:text-slate-400
                    rounded-xl
                    py-4
                    pl-12
                    outline-none
                    focus:ring-2
                    focus:ring-blue-400
                  "

                />


              </div>

            </div>






            {/* PASSWORD */}


            <div>


              <label className="text-white">
                Password
              </label>


              <div className="relative mt-2">


                <Lock
                  className="
                  absolute
                  left-4
                  top-4
                  text-slate-400
                  "
                />



                <input

                  type={
                    showPassword
                    ? "text"
                    : "password"
                  }

                  placeholder="••••••••"

                  className="
                  w-full
                  bg-white/10
                  border
                  border-white/20
                  text-white
                  rounded-xl
                  py-4
                  pl-12
                  pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  "

                />



                <button

                  type="button"

                  onClick={() =>
                    setShowPassword(!showPassword)
                  }

                  className="
                  absolute
                  right-4
                  top-4
                  text-slate-400
                  "

                >

                  {
                    showPassword
                    ?
                    <EyeOff/>
                    :
                    <Eye/>
                  }


                </button>


              </div>


            </div>





            <div className="
              flex
              justify-between
              text-sm
              text-slate-300
            ">


              <label>

                <input
                  type="checkbox"
                  className="mr-2"
                />

                Remember me

              </label>


              <span className="text-blue-300 cursor-pointer">

                Forgot password?

              </span>


            </div>







            <button className="
              w-full
              py-4
              rounded-xl
              bg-blue-500
              hover:bg-blue-600
              text-white
              font-semibold
              transition
            ">

              Sign In

            </button>





            <p className="
              text-center
              text-slate-300
            ">


              Don't have an account?

              <span className="
                text-blue-300
                ml-2
              ">

                Create account

              </span>


            </p>



          </form>



        </section>



      </div>


    </main>

  );
}