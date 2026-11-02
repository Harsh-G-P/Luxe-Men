
"use client";

import { Role } from "@/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type UserProps = {
  user: {
    id: string,
    name: string,
    username: string,
    email: string,
    role: Role,
    image: string | null,
    createdAt: Date
  }
}

type FieldErrors = {
  name?: string,
  username?: string,
  email?: string,
  password?: string
}

export default function ProfilePage({ user }: UserProps) {
  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const avatars = [
    "/Avatar/monkey.png",
    "/Avatar/buffalo.png",
    "/Avatar/cow.png",
    "/Avatar/lion.png",
    "/Avatar/fox.png",
    "/Avatar/rabbit.png",
    "/Avatar/cat.png",
    "/Avatar/goat.png",
    "/Avatar/deer.png",
    "/Avatar/dragon.png",
    "/Avatar/duck.png",
    "/Avatar/elephant.png",
    "/Avatar/giraffe.png",
    "/Avatar/hippo.png",
    "/Avatar/llama.png",
    "/Avatar/panda.png",
    "/Avatar/tiger.png",
    "/Avatar/weasel.png",
    "/Avatar/zebra.png",
    "/Avatar/rhino.png",
  ];

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.image || "/Avatar/camel.png"
  );

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setFieldErrors({})
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          username,
          image: selectedAvatar,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const errors: FieldErrors = {}

          Object.entries(data.errors).forEach(([key, message]) => {
            errors[key as keyof FieldErrors] = message as string
          })

          setFieldErrors(errors)
          return
        }
        setError("❌ " + (data.message || "Something went wrong"))
        return
      }

      toast.success(data.message)
    } catch (error) {
      console.log(error)
      setError("❌ Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#272522]">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">

        {/* PAGE HEADER */}
        <div className="mb-8 border-b border-[#d8d4cb] pb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <Link
                href="/profile"
                className="mb-4 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-[#77736b] transition-colors duration-300 hover:text-[#9b8150]"
              >
                <span className="text-[#9b8150]">←</span>
                Back to Profile
              </Link>

              <p className="mb-2 text-[8px] uppercase tracking-[0.42em] text-[#9b8150]">
                Private Account
              </p>

              <h1 className="font-serif text-4xl font-normal tracking-tight text-[#201f1c] md:text-5xl">
                Customize Your Profile
              </h1>

              <p className="mt-3 max-w-lg text-[10px] leading-5 text-[#77736b]">
                Update your personal information and choose how you appear
                throughout your private account.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#cfc7b7]" />

              <span className="text-[8px] uppercase tracking-[0.3em] text-[#9b8150]">
                Profile Settings
              </span>
            </div>

          </div>
        </div>

        {/* MAIN FRAME */}
        <div
          className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
        >

          {/* TOP ACCENT */}
          <div className="h-px w-full bg-[#bda875]" />

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.85fr]">

            {/* LEFT SIDE */}
            <div className="border-b border-[#d8d4cb] lg:border-b-0 lg:border-r">

              {/* PERSONAL INFORMATION */}
              <div className="px-6 py-7 md:px-8">

                <div className="mb-6 flex items-end justify-between border-b border-[#d8d4cb] pb-4">

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                      Personal Information
                    </p>

                    <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#272522]">
                      Account Details
                    </h2>
                  </div>

                  <span className="font-serif text-lg italic text-[#c2b9a7]">
                    ☆
                  </span>

                </div>


                {/* ERROR */}
                {error && (
                  <div className="mb-6 border-l border-[#9c6b63] bg-[#f3e9e6] px-4 py-3">
                    <p className="text-[9px] leading-5 text-[#8c655e]">
                      {error}
                    </p>
                  </div>
                )}


                {/* USERNAME */}
                <div className="group border-b border-[#d8d4cb] pb-6">

                  <label className="flex items-center justify-between">

                    <span className="text-[8px] uppercase tracking-[0.3em] text-[#5f5b54]">
                      Username
                    </span>

                    <span className="font-serif text-sm italic text-[#c7bfae]">
                      01
                    </span>

                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className=" mt-3 w-full border border-[#d3cec3] bg-[#faf9f6] px-4 py-3 text-[10px] text-[#302e2a] outline-none transition-all duration-300 placeholder:text-[#aaa59b] hover:border-[#c8bb94] focus:border-[#9b8150] focus:bg-[#fdfbf7] focus:shadow-[0_6px_20px_rgba(65,55,38,0.05)]"
                  />

                  {fieldErrors.username && (
                    <span className="mt-2 text-[10px] text-[#e78f7f]">
                      {fieldErrors.username}
                    </span>
                  )}

                  <div className="mt-3 h-px w-7 bg-[#bda875] transition-all duration-500 group-focus-within:w-14" />

                </div>


                {/* DISPLAY NAME */}
                <div className="group pt-6">

                  <label className="flex items-center justify-between">

                    <span className="text-[8px] uppercase tracking-[0.3em] text-[#5f5b54]">
                      Display Name
                    </span>

                    <span className="font-serif text-sm italic text-[#c7bfae]">
                      02
                    </span>

                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" mt-3 w-full border border-[#d3cec3] bg-[#faf9f6] px-4 py-3 text-[10px] text-[#302e2a] outline-none transition-all duration-300 placeholder:text-[#aaa59b] hover:border-[#c8bb94] focus:border-[#9b8150] focus:bg-[#fdfbf7] focus:shadow-[0_6px_20px_rgba(65,55,38,0.05)]"
                  />

                  {fieldErrors.name && (
                    <span className="mt-2 text-[10px] text-[#e78f7f]">
                      {fieldErrors.name}
                    </span>
                  )}

                  <div className="mt-3 h-px w-7 bg-[#bda875] transition-all duration-500 group-focus-within:w-14" />

                </div>

              </div>

              {/* AVATAR SECTION */}
              <div className="border-t border-[#d8d4cb] px-6 py-7 md:px-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                      Personal Identity
                    </p>

                    <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#272522]">
                      Profile Portrait
                    </h2>

                    <p className="mt-2 max-w-md text-[9px] leading-5 text-[#858078]">
                      Select a portrait that represents your private account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className=" group relative shrink-0 border border-[#cbc5b9] bg-[#f8f6f1] px-5 py-3 text-[8px] uppercase tracking-[0.25em] text-[#4f4b44] transition-all duration-300 hover:border-[#9b8150] hover:bg-[#eeebe3]"
                  >
                    {showAvatarPicker ? "Close Selection" : "Change Portrait"}

                    <span
                      className=" absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#9b8150] transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </button>

                </div>


                {/* AVATAR PICKER */}
                {showAvatarPicker && (
                  <div className="mt-6 border-t border-[#d8d4cb] pt-6">

                    <p className="mb-4 text-[8px] uppercase tracking-[0.25em] text-[#99948b]">
                      Select Portrait
                    </p>

                    <div className="grid max-h-52 grid-cols-4 gap-4 overflow-y-auto pr-2 scrollbar-thin">

                      {avatars.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setShowAvatarPicker(false);
                          }}
                          className={` group relative flex justify-center transition-all duration-300 hover:-translate-y-0.5
                        `}
                        >

                          <div
                            className={` overflow-hidden rounded-full border p-1 transition-all duration-300 ${selectedAvatar === avatar
                                ? "border-[#9b8150] bg-[#eeece5] shadow-[0_8px_22px_rgba(65,55,38,0.12)]"
                                : "border-[#d8d4cb] bg-[#faf9f6] group-hover:border-[#bda875] group-hover:shadow-[0_8px_22px_rgba(65,55,38,0.08)]"
                              }
                          `}
                          >
                            <Image
                              src={avatar}
                              alt="avatar"
                              width={60}
                              height={60}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                          </div>

                          {selectedAvatar === avatar && (
                            <span className="absolute bottom-0 right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#f5f4ef] bg-[#9b8150] text-[8px] text-white">
                              ✓
                            </span>
                          )}

                        </button>
                      ))}

                    </div>

                    <p className="mt-4 text-[8px] uppercase tracking-[0.18em] text-[#aaa59b]">
                      Scroll to explore portraits
                    </p>

                  </div>
                )}

              </div>

              {/* SAVE AREA */}
              <div className="border-t border-[#d8d4cb] px-6 py-6 md:px-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#77736b]">
                      Profile Changes
                    </p>

                    <p className="mt-1 text-[9px] text-[#99948b]">
                      Your changes will be reflected across your account.
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className=" group relative overflow-hidden bg-[#171614] px-7 py-3.5 text-[8px] uppercase tracking-[0.28em] text-white transition-all duration-300 hover:bg-[#292722] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {loading ? "Saving..." : "Save Changes"}
                    </span>

                    <span
                      className=" absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </button>

                </div>

              </div>

            </div>

            {/* RIGHT SIDE — PREVIEW */}
            <div className="bg-[#f5f2ea]">

              <div className="sticky top-6">

                {/* PREVIEW HEADER */}
                <div className="border-b border-[#d8d4cb] px-6 py-6 md:px-7">

                  <div className="flex items-end justify-between">

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                        Live Preview
                      </p>

                      <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#272522]">
                        Your Profile
                      </h2>
                    </div>

                    <span className="font-serif text-lg italic text-[#c2b9a7]">
                      ☆
                    </span>

                  </div>

                </div>


                {/* PROFILE PREVIEW */}
                <div className="px-6 py-7 md:px-7">

                  <div
                    className=" overflow-hidden border border-[#d8d4cb] bg-[#f8f6f1] shadow-[0_8px_28px_rgba(45,40,30,0.055)] transition-all duration-500 hover:border-[#c8bb94] hover:shadow-[0_18px_42px_rgba(65,55,38,0.09)]"
                  >

                    {/* PREVIEW TOP */}
                    <div className="h-1 bg-[#bda875]" />

                    <div className="px-6 py-7">

                      {/* AVATAR */}
                      <div className="flex justify-center">

                        <div className="relative">

                          <div className="rounded-full border border-[#c9c1b2] bg-[#e8e4db] p-1.5 shadow-[0_8px_25px_rgba(45,40,30,0.08)]">

                            <Image
                              src={selectedAvatar}
                              alt="avatar"
                              width={120}
                              height={120}
                              loading="eager"
                              className="h-28 w-28 rounded-full object-cover"
                            />

                          </div>

                          <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#f8f6f1] bg-[#75836c]" />

                        </div>

                      </div>


                      {/* NAME */}
                      <div className="mt-6 text-center">

                        <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                          Account Holder
                        </p>

                        <h3 className="mt-2 font-serif text-3xl font-normal text-[#302e2a]">
                          {name || "Your Name"}
                        </h3>

                        <p className="mt-2 text-[9px] tracking-[0.12em] text-[#858078]">
                          @{username || "username"}
                        </p>

                      </div>


                      {/* GOLD LINE */}
                      <div className="my-6 flex justify-center">
                        <div className="h-px w-10 bg-[#bda875]" />
                      </div>


                      {/* MINI DETAILS */}
                      <div className="border-y border-[#d8d4cb]">

                        {/* STATUS */}
                        <div className="flex items-center justify-between py-4">
                          <span className="text-[8px] uppercase tracking-[0.25em] text-[#99948b]">
                            Status
                          </span>

                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#75836c]">
                            Active
                          </span>
                        </div>

                        {/* ROLE */}
                        <div className="flex items-center justify-between border-t border-[#d8d4cb] py-4">
                          <span className="text-[8px] uppercase tracking-[0.25em] text-[#99948b]">
                            Role
                          </span>

                          <span
                            className={`text-[8px] uppercase tracking-[0.2em] ${user.role === "ADMIN"
                              ? "text-[#9b8150]"
                              : "text-[#4f4b44]"
                              }`}
                          >
                            {user.role === "ADMIN" ? "Administrator" : "Member"}
                          </span>
                        </div>

                        {/* ACCOUNT */}
                        <div className="flex items-center justify-between border-t border-[#d8d4cb] py-4">
                          <span className="text-[8px] uppercase tracking-[0.25em] text-[#99948b]">
                            Account
                          </span>

                          <span className="text-[9px] text-[#4f4b44]">
                            Private
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* NAMEPLATE */}
                  <div className="mt-7 border-t border-[#d8d4cb] pt-6">

                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#9b8150]">
                      Nameplate
                    </p>

                    <p className="mt-1.5 font-serif text-xl text-[#302e2a]">
                      Compact Preview
                    </p>


                    <div
                      className=" group mt-4 flex items-center gap-4 border border-[#d8d4cb] bg-[#f8f6f1] p-4 transition-all duration-500 hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_12px_30px_rgba(65,55,38,0.07)]"
                    >

                      <div className="shrink-0 rounded-full border border-[#c9c1b2] bg-[#e8e4db] p-1">

                        <Image
                          src={selectedAvatar}
                          alt="avatar"
                          width={45}
                          height={45}
                          loading="eager"
                          className="h-10 w-10 rounded-full object-cover"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-serif text-lg text-[#302e2a]">
                          {name || "Your Name"}
                        </p>

                        <p className="mt-0.5 truncate text-[8px] tracking-[0.12em] text-[#858078]">
                          @{username || "username"}
                        </p>

                        <p
                          className={`mt-1 text-[7px] uppercase tracking-[0.22em] ${user.role === "ADMIN"
                              ? "text-[#9b8150]"
                              : "text-[#aaa59b]"
                            }`}
                        >
                          {user.role === "ADMIN" ? "Administrator" : "Member"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* EDIT NOTE */}
                  <div className="mt-7 border-t border-[#d8d4cb] pt-5">

                    <div className="flex gap-3">

                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#bda875]" />

                      <p className="text-[9px] leading-5 text-[#858078]">
                        This preview updates automatically as you change your
                        personal information and portrait.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER DETAIL */}
        <div className="mt-8 grid grid-cols-1 border-y border-[#d8d4cb] sm:grid-cols-3">

          {/* 01 */}
          <div className="flex items-start gap-5 px-5 py-5 sm:block sm:border-r sm:border-[#d8d4cb]">

            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              01
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Personal Details
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Keep your account identity and personal information up to date.
              </p>
            </div>

          </div>


          {/* 02 */}
          <div className="flex items-start gap-5 border-t border-[#d8d4cb] px-5 py-5 sm:block sm:border-y-0 sm:border-r">

            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              02
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Profile Portrait
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Choose the portrait displayed throughout your private account.
              </p>
            </div>

          </div>


          {/* 03 */}
          <div className="flex items-start gap-5 border-t border-[#d8d4cb] px-5 py-5 sm:block sm:border-t-0">

            <p className="shrink-0 font-serif text-lg text-[#302e2a]">
              03
            </p>

            <div>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#5f5b54] sm:mt-2">
                Live Preview
              </p>

              <p className="mt-2 text-[9px] leading-5 text-[#99948b]">
                Preview how your profile identity will appear before saving.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}