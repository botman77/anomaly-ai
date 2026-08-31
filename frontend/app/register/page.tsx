
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    BrainCircuit,
    ShieldAlert,
    Activity,
    Radar,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Building2,
} from "lucide-react";

export default function RegisterPage() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullName, setFullName] = useState("");
    const [institution, setInstitution] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordStrength = () => {

        if (password.length === 0) {
            return {
                text: "",
                color: "bg-gray-300",
                width: "w-0",
            };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2)
            return {
                text: "Weak",
                color: "bg-red-500",
                width: "w-1/3",
            };

        if (score <= 4)
            return {
                text: "Medium",
                color: "bg-yellow-500",
                width: "w-2/3",
            };

        return {
            text: "Strong",
            color: "bg-green-500",
            width: "w-full",
        };
    };




  async function handleRegister(
          e: React.FormEvent
      ) {

          e.preventDefault();

          setError("");

          if (
              password !== confirmPassword
          ) {

              setError(
                  "Passwords do not match."
              );

              return;

          }

          setLoading(true);

          try {

            //   const response = await fetch(
            //       "http://localhost:8000/auth/register",
            //       {
            //           method: "POST",

            //           headers: {
            //               "Content-Type":
            //                   "application/json",
            //           },

            //           body: JSON.stringify({

            //               full_name: fullName,

            //               institution,

            //               email,

            //               password,

            //           }),
            //       }
            //   );




            const response = await fetch(
                "/auth/register",
                {
                    method: "POST",

                    headers: {
                    "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                    full_name: fullName,
                    institution,
                    email,
                    password,
                    }),
                }
                );

              const data =
                  await response.json();

              if (!response.ok) {

                  throw new Error(
                      data.detail ||
                          "Registration failed"
                  );

              }

              router.push("/login");

          } catch (err: any) {

              setError(err.message);

          } finally {

              setLoading(false);

          }

      }


  return (

      <main
        className="
        min-h-screen
        bg-slate-100
        flex
        items-center
        justify-center
        p-6
        "
        >

      <div
      className="
      w-full
      max-w-6xl
      bg-white
      rounded-3xl
      shadow-xl
      overflow-hidden
      grid
      lg:grid-cols-2
      "
      >


      {/* LEFT SIDE */}

      <section
      className="
      p-12
      bg-gradient-to-br
      from-blue-700
      to-indigo-800
      text-white
      "
      >

      <div
      className="
      flex
      items-center
      gap-3
      text-2xl
      font-bold
      "
      >

      <div
      className="
      bg-white/20
      p-3
      rounded-xl
      "
      >

      <BrainCircuit/>

      </div>

      AnomalyAI

      </div>

      <h1
      className="
      text-5xl
      font-bold
      mt-16
      leading-tight
      "
      >

      Intelligent

      <br/>

      <span className="text-blue-200">

      Anomaly Detection

      </span>

      </h1>

      <p
      className="
      mt-6
      text-blue-100
      text-lg
      "
      >

      Create your account and start
      detecting anomalies in
      vaccination records using
      Artificial Intelligence.

      </p>

      <div
      className="
      mt-12
      space-y-4
      "
      >

      <div
      className="
      bg-white/15
      rounded-xl
      p-4
      flex
      gap-4
      "
      >

      <Radar/>

      <div>

      <h3 className="font-semibold">

      Real-Time Monitoring

      </h3>

      <p className="text-sm text-blue-100">

      Continuous vaccination surveillance

      </p>

      </div>

      </div>

      <div
      className="
      bg-white/15
      rounded-xl
      p-4
      flex
      gap-4
      "
      >

      <ShieldAlert/>

      <div>

      <h3 className="font-semibold">

      Smart Alerts

      </h3>

      <p className="text-sm text-blue-100">

      Instant anomaly notifications

      </p>

      </div>

      </div>

      <div
      className="
      bg-white/15
      rounded-xl
      p-4
      flex
      gap-4
      "
      >

      <Activity/>

      <div>

      <h3 className="font-semibold">

      Machine Learning

      </h3>

      <p className="text-sm text-blue-100">

      AI-powered anomaly detection

      </p>

      </div>

      </div>

      </div>

      </section>


      {/* REGISTER */}

      <section
      className="
      p-12
      flex
      items-center
      "
      >

      <div className="w-full">

      <div className="text-center">

      <div
      className="
      mx-auto
      w-20
      h-20
      rounded-full
      bg-blue-100
      flex
      items-center
      justify-center
      "
      >

      <BrainCircuit
      className="text-blue-700"
      size={40}
      />

      </div>

      <h2
      className="
      text-3xl
      font-bold
      mt-6
      text-gray-900
      "
      >

      Create Account

      </h2>

      <p
      className="
      text-gray-500
      mt-2
      "
      >

      Register to access the
      Vaccination Anomaly Detection
      Platform

      </p>

      </div>

      <form


      onSubmit={handleRegister}
      className="
      mt-8
      space-y-5
      "
      >

      <div>

      <label className="text-gray-700">

      Full Name

      </label>

      <div className="relative mt-2">

      <User
      className="
      absolute
      left-4
      top-4
      text-gray-400
      "
      />

      <input

      type="text"

      value={fullName}

      onChange={(e)=>setFullName(e.target.value)}

      placeholder="Enter your full name"

      required

      className="
      w-full
      border
      rounded-xl
      py-4
      pl-12
      outline-none
      focus:ring-2
      focus:ring-blue-500
      "

      />

      </div>

      </div>

      <div>

      <label className="text-gray-700">

      Institution / Organization

      </label>

      <div className="relative mt-2">

      <Building2
      className="
      absolute
      left-4
      top-4
      text-gray-400
      "
      />

      <input

      type="text"

      value={institution}

      onChange={(e)=>setInstitution(e.target.value)}

      placeholder="Enter institution"

      required

      className="
      w-full
      border
      rounded-xl
      py-4
      pl-12
      outline-none
      focus:ring-2
      focus:ring-blue-500
      "

      />

      </div>

      </div>
      <div>

      <label className="text-gray-700">

      Email Address

      </label>

      <div className="relative mt-2">

      <Mail
      className="
      absolute
      left-4
      top-4
      text-gray-400
      "
      />

    <input

    type="email"

    value={email}

    onChange={(e)=>setEmail(e.target.value)}

    placeholder="Enter email"

    required

    className="
    w-full
    border
    rounded-xl
    py-4
    pl-12
    outline-none
    focus:ring-2
    focus:ring-blue-500
    "

    />

    </div>

    </div>
    <div>

    <label className="text-gray-700">

    Password

    </label>

    <div className="relative mt-2">

    <Lock
    className="
    absolute
    left-4
    top-4
    text-gray-400
    "
    />

    <input

    type={
    showPassword
    ?
    "text"
    :
    "password"
    }

    value={password}

    onChange={(e)=>setPassword(e.target.value)}

    placeholder="Create password"

    required

    className="
    w-full
    border
    rounded-xl
    py-4
    pl-12
    pr-12
    outline-none
    focus:ring-2
    focus:ring-blue-500
    "
    />

    <button

    type="button"

    onClick={()=>
    setShowPassword(
    !showPassword
    )
    }

    className="
    absolute
    right-4
    top-4
    text-gray-400
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

{password.length > 0 && (

<div>

<div
className="
flex
justify-between
mb-2
text-sm
"
>

<span>

Password Strength

</span>

<span className="font-semibold">

{passwordStrength().text}

</span>

</div>

<div
className="
w-full
bg-gray-200
rounded-full
h-2
"
>

<div

className={`
${passwordStrength().color}
${passwordStrength().width}
h-2
rounded-full
transition-all
duration-300
`}

/>

</div>

</div>

)}
    <div>
        

    <label className="text-gray-700">

    Confirm Password

    </label>

    <div className="relative mt-2">

    <Lock
    className="
    absolute
    left-4
    top-4
    text-gray-400
    "
    />

    <input

    type={
    showConfirmPassword
    ?
    "text"
    :
    "password"
    }

    value={confirmPassword}

    onChange={(e)=>
    setConfirmPassword(
    e.target.value
    )
    }

    placeholder="Confirm password"

    required

    className="
    w-full
    border
    rounded-xl
    py-4
    pl-12
    pr-12
    outline-none
    focus:ring-2
    focus:ring-blue-500
    "
    />

    <button

      type="button"

      onClick={()=>
      setShowConfirmPassword(
      !showConfirmPassword
      )
      }

      className="
      absolute
      right-4
      top-4
      text-gray-400
      "
      >

      {
      showConfirmPassword
      ?
      <EyeOff/>
      :
      <Eye/>
      }

    </button>

      </div>

      </div>
      {
      error &&

      <p
      className="
      text-red-500
      text-center
      font-medium
      "
      >

      {error}

      </p>

      }
    <button

      type="submit"

      disabled={loading}

      className="
      w-full
      bg-blue-700
      hover:bg-blue-800
      disabled:opacity-60
      text-white
      py-4
      rounded-xl
      font-semibold
      transition
      duration-300
      "

      >

      {
      loading
      ?
      "Creating Account..."
      :
      "Create Account"
      }

    </button>
      <p
      className="
      text-center
      text-gray-600
      "
      >

      Already have an account?
      

    <button

        type="button"

        onClick={()=>
        router.push("/login")
        }

        className="
        ml-2
        text-blue-700
        font-semibold
        hover:underline
        "

        >

        Login

    </button>

    </p>
    </form>

    </div>

    </section>

    </div>

    </main>

    );
    }






