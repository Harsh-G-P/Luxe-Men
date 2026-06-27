"use client";

import Link from "next/link";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AddressFormData = {
    fullname: string;
    countryCode: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
};

type FieldErrors = {
    fullname?: string;
    countryCode?: string;
    phone?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export default function AddAddressPage() {
    const [country, setCountry] = useState("");

    const countryOptions = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: `${country.flag} ${country.name}`,
        phoneCode: `+${country.phonecode}`,
    }));

    const phoneOptions = Country.getAllCountries().map((country) => ({
        value: country.phonecode.startsWith("+")
            ? country.phonecode
            : `+${country.phonecode}`,
        label: `${country.flag} ${country.phonecode} (${country.isoCode})`,
    }));

    const stateOptions = State.getStatesOfCountry(country).map(
        (state) => ({
            value: state.isoCode,
            label: state.name,
        })
    );

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: "52px",
            borderRadius: "16px",
            borderColor: "#cbd5e1",
            boxShadow: "none",
        }),
    };

    const [formData, setFormData] = useState<AddressFormData>({
        fullname: "",
        countryCode: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setFieldErrors({})

        try {
            const res = await fetch("/api/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
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

            router.push("/profile/addresses")

        } catch (error) {
            console.log(error)
            setError("❌ Network error. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <div className="mx-auto max-w-5xl w-full">

                {/* Back Button */}
                <div className="mb-5">
                    <Link
                        href="/profile/addresses"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                        ← Back to Addresses
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Add New Address 📍
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Add a new delivery address for orders and shipments.
                    </p>
                </div>

                {/* Gradient Divider */}
                <div className="mb-6 h-2 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-500" />

                {/* Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Address Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Fill in the information below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error &&
                            <div className="text-center">
                                <p className="text-red-500 ms-3 mb-4">{error}</p>
                            </div>
                        }

                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            />

                            {fieldErrors.fullname && (
                                <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.fullname}</p>
                            )}

                        </div>

                        {/* Country Code + Phone */}
                        <div className="grid gap-4 md:grid-cols-4">

                            {/* Country Code */}
                            <div className="md:col-span-1">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Country Code
                                    </label>

                                    <Select
                                        instanceId="country-code"
                                        styles={selectStyles}
                                        options={phoneOptions}
                                        value={phoneOptions.find(
                                            (option) => option.value === formData.countryCode
                                        )}
                                        onChange={(option) => {
                                            if (!option) return;

                                            setFormData({
                                                ...formData,
                                                countryCode: option.value,
                                            });
                                        }}
                                    />
                                    {fieldErrors.countryCode && (
                                        <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.countryCode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="md:col-span-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                    />
                                    {fieldErrors.phone && (
                                        <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.phone}</p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Address */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Address Line
                            </label>

                            <textarea
                                rows={4}
                                value={formData.addressLine}
                                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                                placeholder="House No, Street, Area..."
                                className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            />
                            {fieldErrors.addressLine && (
                                <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.addressLine}</p>
                            )}
                        </div>

                        {/* Country + State */}
                        <div className="grid gap-4 md:grid-cols-2">

                            {/* Country */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Country
                                </label>

                                <Select
                                    instanceId="country"
                                    styles={selectStyles}
                                    options={countryOptions}
                                    value={countryOptions.find(
                                        (option) => option.label === formData.country
                                    )}
                                    onChange={(option) => {
                                        if (!option) return;

                                        setCountry(option.value); 

                                        setFormData({
                                            ...formData,
                                            country: option.label,
                                            state: "",
                                            city: "",
                                        });
                                    }}
                                />
                                {fieldErrors.country && (
                                    <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.country}</p>
                                )}

                            </div>

                            {/* State */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    State
                                </label>

                                <Select
                                    instanceId="state"
                                    styles={selectStyles}
                                    options={stateOptions}
                                    value={stateOptions.find(
                                        (option) => option.label === formData.state
                                    )}
                                    onChange={(option) => {
                                        if (!option) return;

                                        setFormData({
                                            ...formData,
                                            state: option.label,
                                            city: "",
                                        });
                                    }}
                                />
                                {fieldErrors.state && (
                                    <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.state}</p>
                                )}
                            </div>

                        </div>

                        {/* City + Postal Code */}
                        <div className="grid gap-4 md:grid-cols-2">

                            {/* City */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    City
                                </label>

                                <input
                                type="text"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                            />
                                
                                {fieldErrors.city && (
                                    <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.city}</p>
                                )}
                            </div>

                            {/* Postal */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    placeholder="e.g. 380015"
                                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                                />
                                {fieldErrors.postalCode && (
                                    <p className="text-red-500 ms-3 text-sm mt-1">{fieldErrors.postalCode}</p>
                                )}
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button
                                type="submit"
                                className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
                            >
                                {loading ? "Saving Address..." : "Save Address"}
                            </button>

                            <Link
                                href="/profile/addresses"
                                className="rounded-2xl border border-slate-300 px-6 py-3 text-center font-medium transition hover:bg-slate-100"
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}