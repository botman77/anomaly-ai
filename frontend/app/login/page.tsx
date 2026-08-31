"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  BrainCircuit,
  ShieldAlert,
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Radar,
} from "lucide-react";


export default function LoginPage() {


  const router = useRouter();


  const [showPassword,setShowPassword] = useState(false);


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);




  async function handleLogin(
    e:React.FormEvent
  ){

    e.preventDefault();


    setError("");

    setLoading(true);



    try{


    // const response = await fetch(
    // "http://localhost:8000/auth/login",
    // {
    //   method:"POST",
    //   headers:{
    //     "Content-Type":"application/json"
    //   },
    //   body:JSON.stringify({
    //     email,
    //     password
    //   })
    // }
    // );




  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });


      const data = await response.json();



      if(!response.ok){

        throw new Error(
          data.detail || "Login failed"
        );

      }




      localStorage.setItem(
        "token",
        data.access_token
      );



      router.push("/dashboard");



    }
    catch(err:any){


      setError(
        err.message
      );


    }
    finally{

      setLoading(false);

    }

  }





return (

<main className="
min-h-screen
bg-slate-100
flex
items-center
justify-center
p-6
">


<div className="
w-full
max-w-6xl
bg-white
rounded-3xl
shadow-xl
overflow-hidden
grid
lg:grid-cols-2
">





{/* LEFT SIDE */}


<section className="
p-12
bg-gradient-to-br
from-blue-700
to-indigo-800
text-white
">


<div className="
flex
items-center
gap-3
text-2xl
font-bold
">


<div className="
bg-white/20
p-3
rounded-xl
">

<BrainCircuit/>

</div>


AnomalyAI


</div>





<h1 className="
text-5xl
font-bold
mt-16
leading-tight
">


Intelligent

<br/>


<span className="text-blue-200">

Anomaly Detection

</span>


</h1>





<p className="
mt-6
text-blue-100
text-lg
">


Detect unusual patterns,
monitor risks and make
smarter decisions using
machine learning.


</p>







<div className="
mt-12
space-y-4
">



<div className="
bg-white/15
rounded-xl
p-4
flex
gap-4
">


<Radar/>


<div>

<h3 className="font-semibold">

Real Time Monitoring

</h3>


<p className="text-sm text-blue-100">

Continuous data analysis

</p>


</div>


</div>






<div className="
bg-white/15
rounded-xl
p-4
flex
gap-4
">


<ShieldAlert/>


<div>

<h3 className="font-semibold">

Smart Alerts

</h3>


<p className="text-sm text-blue-100">

Detect abnormal events

</p>


</div>


</div>







<div className="
bg-white/15
rounded-xl
p-4
flex
gap-4
">


<Activity/>


<div>

<h3 className="font-semibold">

ML Insights

</h3>


<p className="text-sm text-blue-100">

Model driven analysis

</p>


</div>


</div>


</div>


</section>









{/* LOGIN */}


<section className="
p-12
flex
items-center
">


<div className="w-full">





<div className="text-center">


<div className="
mx-auto
w-20
h-20
rounded-full
bg-blue-100
flex
items-center
justify-center
">


<BrainCircuit
className="text-blue-700"
size={40}
/>


</div>





<h2 className="
text-3xl
font-bold
mt-6
text-gray-900
">

Welcome Back

</h2>


<p className="
text-gray-500
mt-2
">

Login to your AI dashboard

</p>


</div>







<form

onSubmit={handleLogin}

className="
mt-8
space-y-5
"

>





<div>


<label className="text-gray-700">

Email

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

onChange={
(e)=>setEmail(e.target.value)
}

placeholder="Enter email"

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


onChange={
(e)=>setPassword(e.target.value)
}



placeholder="Password"



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


onClick={()=>setShowPassword(!showPassword)}


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






{
error &&

<p className="
text-red-500
text-center
">

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
text-white
py-4
rounded-xl
font-semibold
"


>


{
loading
?
"Logging in..."
:
"Login"
}


</button>




</form>


<p
  className="
  text-center
  text-gray-600
  "
>
  Don't have an account?

  <button
    type="button"
    onClick={() => router.push("/register")}
    className="
    ml-2
    text-blue-700
    font-semibold
    hover:underline
    "
  >
    Register
  </button>

</p>




</div>


</section>





</div>


</main>


);


}





