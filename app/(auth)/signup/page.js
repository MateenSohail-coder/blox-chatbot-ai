"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Signup() {
  const [loader, setloader] = useState(false);
  const [mes, setmes] = useState(false);
  const [sucess, setsucess] = useState("");
  const [error, seterror] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Errors show as you type!
  });
  async function submit(data) {
    setloader(true);
    try {
      const res = await axios.post("/api/auth/signup", data);
      setsucess(res.data.message);
      setmes(true);
      window.location.href = "/dashboard/Chats";
    } catch (err) {
      seterror(err.response?.data?.message || "something went wrong !");
      setmes(true);
    } finally {
      setloader(false);
      if (error) {
        reset();
      }
      setTimeout(() => {
        setmes(false);
        seterror("");
        setsucess("");
      }, 5000);
    }
  }
  return (
    <div className="min-h-screen w-full overflow-auto flex items-center justify-center bg-amber-200 ">
      <form
        onSubmit={handleSubmit(submit)}
        className="p-4 md:p-10 fade-out-element flex flex-col gap-4 border-4 md:border-8 border-amber-950 rounded-2xl m-3"
      >
        <h1 className="text-xl md:text-3xl bg-amber-950 text-amber-200 p-2 md:p-3 font-mono font-extrabold rounded-2xl flex items-center justify-center ">
          SignUp Here ⬇
        </h1>
        <input
          {...register("username", {
            required: " ⚠ User name is required",
            maxLength: {
              value: 20,
              message: " ⚠ username must be under 20 charaters",
            },
            minLength: {
              value: 4,
              message: " ⚠ username must be above 4 characters",
            },
          })}
          className="text-lg md:text-3xl p-2 md:p-3 font-extrabold font-mono border-2 md:border-4 border-amber-950 text-amber-950 focus:outline-none focus:ring-0 border-t-transparent border-r-transparent border-l-transparent "
        />
        <p className="bg-amber-950 text-amber-300 text-xs md:text-sm font-mono font-extrabold rounded-4xl p-1 px-4">
          {errors.username?.message}
        </p>
        <input
          type="email"
          {...register("email", {
            required: "⚠ email is required",
          })}
          className="text-lg md:text-3xl p-2 md:p-3 font-extrabold font-mono border-2 md:border-4 border-amber-950 text-amber-950 focus:outline-none focus:ring-0 border-t-transparent border-r-transparent border-l-transparent "
        />
        <p className="bg-amber-950 text-amber-300 text-xs md:text-sm font-mono font-extrabold rounded-4xl p-1 px-4">
          {errors.email?.message}
        </p>
        <input
          {...register("password", {
            required: " ⚠ password is required",
            maxLength: {
              value: 15,
              message: " ⚠ password must be under 15 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
              message: " ⚠ Must include uppercase, lowercase, and a number",
            },
            minLength: {
              value: 8,
              message: " ⚠ password must be above 8 charaters",
            },
          })}
          className="text-lg md:text-3xl p-2 md:p-3 font-extrabold font-mono border-2 md:border-4 border-amber-950 text-amber-950 focus:outline-none focus:ring-0 border-t-transparent border-r-transparent border-l-transparent "
        />
        <p className="bg-amber-950 text-amber-300 text-xs md:text-sm font-mono font-extrabold rounded-4xl p-1 px-4">
          {errors.password?.message}
        </p>
        <p className="bg-amber-950 text-amber-100 text-xs font-mono font-extrabold rounded-4xl p-1 px-4">
          ALready Have an account ?{" "}
          <Link href="/login" className="underline hover:text-amber-200">
            Login Here
          </Link>
        </p>
        <button
          style={{
            cursor: loader ? "not-allowed" : "pointer",
          }}
          type="submit"
          className="w-full bg-amber-950 text-amber-200 font-mono flex items-center justify-center font-extrabold text-xl md:text-3xl rounded-2xl border-2 md:border-4 border-amber-950 transition-all p-2 md:p-4 hover:bg-amber-200 hover:text-amber-950 active:bg-amber-200 active:text-amber-950 active:scale-[0.96] "
        >
          {loader ? (
            <div className="sppiner h-10 w-10 border-4 border-dotted rounded-full border-amber-700 border-t-amber-200 transition-all animate-spin"></div>
          ) : (
            "Submit"
          )}
        </button>
        {mes ? (
          error ? (
            <div className="error-class transition-all opacity-70 rounded-2xl border-2 border-white bg-red-700 text-sx p-3 font-mono font-extrabold ">
              {error}
            </div>
          ) : (
            <div className="success-class rounded-2xl opacity-70 border-2 border-white transition-all  bg-green-700 text-sx p-3 font-mono font-extrabold ">
              {sucess}
            </div>
          )
        ) : null}
      </form>
    </div>
  );
}
