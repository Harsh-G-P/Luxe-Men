
"use client";

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
    "/avatar/monkey.png",
    "/avatar/buffalo.png",
    "/avatar/cow.png",
    "/avatar/lion.png",
    "/avatar/fox.png",
    "/avatar/rabbit.png",
    "/avatar/cat.png",
    "/avatar/goat.png",
    "/avatar/deer.png",
    "/avatar/dragon.png",
    "/avatar/duck.png",
    "/avatar/elephant.png",
    "/avatar/giraffe.png",
    "/avatar/hippo.png",
    "/avatar/llama.png",
    "/avatar/panda.png",
    "/avatar/tiger.png",
    "/avatar/weasel.png",
    "/avatar/zebra.png",
    "/avatar/rhino.png",
  ];

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.image || "/avatar/camel.png"
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
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <div className="max-w-7xl w-full space-y-8">

        <div className="flex items-center">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-500 p-8 shadow-2xl">
          <div>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
            <div className="absolute left-20 top-10 h-24 w-24 rounded-full bg-white/20" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Customize Your Profile
          </h1>

          <p className="mt-2 text-violet-100">
            Update your personal information and choose your favorite avatar.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Side */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Personal Information
              </h2>

              {error &&
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                </div>
              }

              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  />
                  {fieldErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Display Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                  )}
                </div>

              </div>

            </div>

            {/* Avatar Selection */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
              >
                Change Avatar
              </button>

              {showAvatarPicker && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                  <p className="mb-3 text-xs text-slate-500 animate-pulse">
                    ↓ Scroll down to view more addresses
                  </p>
                  <div className="grid max-h-38 justify-items-center grid-cols-4 gap-3 overflow-y-auto pr-2 scrollbar-thin">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(avatar);
                          setShowAvatarPicker(false);
                        }}
                        className={`overflow-hidden w-16 rounded-full border-2 transition ${selectedAvatar === avatar
                          ? "border-violet-600"
                          : "border-transparent"
                          }`}
                      >
                        <Image
                          src={avatar}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Side Preview */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Banner */}
              <div className="relative h-44 bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500">
                <div>
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                  <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
                  <div className="absolute left-20 top-10 h-24 w-24 rounded-full bg-white/20" />
                </div>

                <div className="absolute -bottom-14 left-6">
                  <Image
                    src={selectedAvatar}
                    alt="avatar"
                    width={120}
                    height={120}
                    loading="eager"
                    className="rounded-full border-4 border-white shadow-xl"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-20">

                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  {name}
                </h2>

                <p className="text-slate-500">@{username}</p>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="mt-6 w-full rounded-2xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>

            {/* Mini Profile */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-medium text-slate-500">
                Nameplate Preview
              </p>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 to-slate-100 p-4 hover:shadow-md">
                <Image
                  src={selectedAvatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  loading="eager"
                  className="rounded-full"
                />

                <div>
                  <p className="font-medium text-slate-900">
                    {name}
                  </p>

                  <p className="text-xs text-slate-500">
                    @{username}
                  </p>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}