"use client";

import Link from "next/link";
import { Country, State } from "country-state-city";
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
};

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

    const stateOptions = State.getStatesOfCountry(country).map((state) => ({
        value: state.isoCode,
        label: state.name,
    }));

    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "0px",
            borderColor: state.isFocused ? "#9b8150" : "#d3cec3",
            backgroundColor: "#f5f4ef",
            boxShadow: "none",
            transition: "all 300ms ease",
            "&:hover": {
                borderColor: "#9b8150",
            },
        }),

        valueContainer: (base: any) => ({
            ...base,
            padding: "0 16px",
        }),

        singleValue: (base: any) => ({
            ...base,
            color: "#3f3b35",
            fontSize: "11px",
            letterSpacing: "0.04em",
        }),

        placeholder: (base: any) => ({
            ...base,
            color: "#99948b",
            fontSize: "11px",
        }),

        input: (base: any) => ({
            ...base,
            color: "#3f3b35",
            fontSize: "11px",
        }),

        menu: (base: any) => ({
            ...base,
            marginTop: "5px",
            borderRadius: "0px",
            border: "1px solid #d8d4cb",
            backgroundColor: "#faf9f6",
            boxShadow: "0 14px 35px rgba(40, 36, 28, 0.10)",
            overflow: "hidden",
            zIndex: 100,
        }),

        menuList: (base: any) => ({
            ...base,
            padding: "4px",
            maxHeight: "188px",
            overflowY: "auto",

            scrollbarWidth: "thin",
            scrollbarColor: "#c4b58f transparent",

            "&::-webkit-scrollbar": {
                width: "4px",
            },

            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },

            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c4b58f",
            },

            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9b8150",
            },
        }),

        option: (base: any, state: any) => ({
            ...base,
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            padding: "10px 13px",

            backgroundColor: state.isSelected
                ? "#eeece5"
                : state.isFocused
                    ? "#f3f0e9"
                    : "transparent",

            color: state.isSelected ? "#272522" : "#5f5b54",

            // Option text size
            fontSize: "12px",

            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "all 200ms ease",

            "&:active": {
                backgroundColor: "#e8e3d8",
            },
        }),


        indicatorSeparator: () => ({
            display: "none",
        }),

        dropdownIndicator: (base: any, state: any) => ({
            ...base,
            color: state.isFocused ? "#9b8150" : "#99948b",
            paddingRight: "14px",
            transition: "color 200ms ease",

            "&:hover": {
                color: "#9b8150",
            },
        }),

        clearIndicator: (base: any) => ({
            ...base,
            color: "#99948b",

            "&:hover": {
                color: "#8c655e",
            },
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setFieldErrors({});

        try {
            const res = await fetch("/api/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors && typeof data.errors === "object") {
                    const errors: FieldErrors = {};

                    Object.entries(data.errors).forEach(([key, message]) => {
                        errors[key as keyof FieldErrors] = message as string;
                    });

                    setFieldErrors(errors);
                    toast.error("Please check the highlighted fields and try again.")
                    return;
                }

                setError(data.message || "Something went wrong");
                return;
            }

            toast.success(data.message);

            router.push("/profile/addresses");
        } catch (error) {
            console.log(error);
            setError("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f4ef] text-[#171614]">

            {/* HEADER */}
            <section className="border-b border-[#e4e0d7]">

                <div className="mx-auto max-w-7xl px-5 py-7 md:px-10 md:py-9">

                    <Link
                        href="/profile/addresses"
                        className=" group mb-5 inline-flex items-center gap-2.5 border-b border-[#d9d5cd] pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#171512] transition-all duration-300 hover:border-[#9a8a74] hover:text-[#1b1a18]"
                    >
                        <span className="text-[13px] leading-none transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                        </span>

                        <span>Back to Addresses</span>
                    </Link>

                    <div className="flex flex-col mt-5 gap-5 md:flex-row md:items-end md:justify-between">

                        <div>
                            <p className="mb-1.5 text-[8px] uppercase tracking-[0.38em] text-[#9b8150]">
                                Private Account
                            </p>

                            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#201f1c] md:text-4xl">
                                Add New Address
                            </h1>

                            <p className="mt-3 max-w-md text-[11px] leading-5 text-[#77736b]">
                                Add a delivery destination for your future orders
                                and shipments.
                            </p>
                        </div>

                        <span className="text-[8px] uppercase tracking-[0.28em] text-[#9b8150]">
                            Delivery Details
                        </span>

                    </div>

                </div>

            </section>

            {/* FORM SECTION */}
            <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-12">

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">

                    {/* FORM */}
                    <div
                        className=" overflow-hidden border border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
                    >

                        {/* FORM HEADER */}
                        <div className="border-b border-[#d6d1c7] px-6 py-6 md:px-9">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                        Delivery Collection
                                    </p>

                                    <h2 className="mt-2 font-serif text-2xl text-[#272522] md:text-3xl">
                                        Address Details
                                    </h2>

                                    <p className="mt-2 text-[9px] leading-5 text-[#8a857c]">
                                        Complete the information below to save
                                        your destination.
                                    </p>
                                </div>

                                <span className="font-serif text-xl italic text-[#c2b9a7]">
                                    ☆
                                </span>

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7 px-6 py-7 md:px-9 md:py-9"
                        >

                            {/* ERROR */}
                            {error && (
                                <div className="border border-[#d2b8b2] bg-[#f4e8e5] px-4 py-3">

                                    <div className="flex items-center gap-2">

                                        <span className="h-1.5 w-1.5 rounded-full bg-[#a65d52]" />

                                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#8f5047]">
                                            {error}
                                        </p>

                                    </div>

                                </div>
                            )}

                            {/* FULL NAME */}
                            <div>

                                <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.fullname}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullname: e.target.value,
                                        })
                                    }
                                    className="w-full border border-[#d3cec3] bg-[#f5f4ef] px-4 py-3.5 text-[11px] text-[#272522] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#fdfcf9]"
                                />

                                {fieldErrors.fullname && (
                                    <span className="mt-1.5 text-[10px] text-[#e16551]">
                                        {fieldErrors.fullname}
                                    </span>
                                )}

                            </div>

                            {/* PHONE */}
                            <div className="grid gap-4 md:grid-cols-4">

                                {/* COUNTRY CODE */}
                                <div className="md:col-span-1">

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        Country Code
                                    </label>

                                    <Select
                                        instanceId="country-code"
                                        styles={selectStyles}
                                        options={phoneOptions}
                                        value={phoneOptions.find(
                                            (option) =>
                                                option.value === formData.countryCode
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
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.countryCode}
                                        </span>
                                    )}

                                </div>

                                {/* PHONE */}
                                <div className="md:col-span-3">

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="Enter phone number"
                                        className="w-full border border-[#d3cec3] bg-[#f5f4ef] px-4 py-3.5 text-[11px] text-[#272522] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#fdfcf9]"
                                    />

                                    {fieldErrors.phone && (
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.phone}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* ADDRESS */}
                            <div>

                                <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                    Address Line
                                </label>

                                <textarea
                                    rows={3}
                                    value={formData.addressLine}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            addressLine: e.target.value,
                                        })
                                    }
                                    placeholder="House No, Street, Area..."
                                    className="w-full resize-none border border-[#d3cec3] bg-[#f5f4ef] px-4 py-3.5 text-[11px] leading-5 text-[#272522] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#fdfcf9]"
                                />

                                {fieldErrors.addressLine && (
                                    <span className="mt-1.5 text-[10px] text-[#e16551]">
                                        {fieldErrors.addressLine}
                                    </span>
                                )}

                            </div>

                            {/* COUNTRY + STATE */}
                            <div className="grid gap-4 md:grid-cols-2">

                                {/* COUNTRY */}
                                <div>

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        Country
                                    </label>

                                    <Select
                                        instanceId="country"
                                        styles={selectStyles}
                                        options={countryOptions}
                                        value={countryOptions.find(
                                            (option) =>
                                                option.label === formData.country
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
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.country}
                                        </span>
                                    )}

                                </div>

                                {/* STATE */}
                                <div>

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        State
                                    </label>

                                    <Select
                                        instanceId="state"
                                        styles={selectStyles}
                                        options={stateOptions}
                                        value={stateOptions.find(
                                            (option) =>
                                                option.label === formData.state
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
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.state}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* CITY + POSTAL */}
                            <div className="grid gap-4 md:grid-cols-2">

                                {/* CITY */}
                                <div>

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter city"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full border border-[#d3cec3] bg-[#f5f4ef] px-4 py-3.5 text-[11px] text-[#272522] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#fdfcf9]"
                                    />

                                    {fieldErrors.city && (
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.city}
                                        </span>
                                    )}

                                </div>

                                {/* POSTAL */}
                                <div>

                                    <label className="mb-2 block text-[8px] font-medium uppercase tracking-[0.25em] text-[#5f5b54]">
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                postalCode: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. 380015"
                                        className="w-full border border-[#d3cec3] bg-[#f5f4ef] px-4 py-3.5 text-[11px] text-[#272522] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#9b8150] focus:bg-[#fdfcf9]"
                                    />

                                    {fieldErrors.postalCode && (
                                        <span className="mt-1.5 text-[10px] text-[#e16551]">
                                            {fieldErrors.postalCode}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col gap-2.5 border-t border-[#d6d1c7] pt-6 sm:flex-row">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative overflow-hidden bg-[#171614] px-8 py-4 text-[8px] font-medium uppercase tracking-[0.28em] text-white transition-colors duration-500 hover:bg-[#292722] disabled:cursor-not-allowed disabled:bg-[#aaa69e]"
                                >

                                    <span className="relative z-10">
                                        {loading
                                            ? "Saving Address..."
                                            : "Save Address"}
                                    </span>

                                    {!loading && (
                                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#c4a66a] transition-transform duration-500 group-hover:scale-x-100" />
                                    )}

                                </button>

                                <Link
                                    href="/profile/addresses"
                                    className="border border-[#d0cbc1] bg-[#f8f6f0] px-8 py-4 text-center text-[8px] uppercase tracking-[0.28em] text-[#5f5b54] transition-colors duration-300 hover:border-[#9b8150] hover:bg-[#eeebe3]"
                                >
                                    Cancel
                                </Link>

                            </div>

                        </form>
                    </div>

                    {/* SIDE INFORMATION */}
                    <aside className="hidden lg:block">

                        <div
                            className=" overflow-hidden border p-6 border-[#e2ded4] bg-[#f5f4ef] shadow-[0_4px_18px_rgba(45,40,30,0.035)] transition-all duration-500 ease-out hover:border-[#c8bb94] hover:bg-[#faf8f3] hover:shadow-[0_16px_40px_rgba(65,55,38,0.09)]"
                        >

                            <p className="text-[8px] uppercase tracking-[0.35em] text-[#9b8150]">
                                Address Collection
                            </p>

                            <h3 className="mt-2 font-serif text-2xl text-[#272522]">
                                Delivery
                            </h3>

                            <div className="mt-7 space-y-6 border-t border-[#d6d1c7] pt-6">

                                {/* 01 */}
                                <div>

                                    <p className="font-serif text-base text-[#272522]">
                                        01
                                    </p>

                                    <p className="mt-1.5 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Secure Details
                                    </p>

                                    <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                                        Your delivery information is securely
                                        stored for future orders.
                                    </p>

                                </div>

                                {/* 02 */}
                                <div className="border-t border-[#d6d1c7] pt-6">

                                    <p className="font-serif text-base text-[#272522]">
                                        02
                                    </p>

                                    <p className="mt-1.5 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Faster Checkout
                                    </p>

                                    <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                                        Save your destination once and use it
                                        whenever you return.
                                    </p>

                                </div>

                                {/* 03 */}
                                <div className="border-t border-[#d6d1c7] pt-6">

                                    <p className="font-serif text-base text-[#272522]">
                                        03
                                    </p>

                                    <p className="mt-1.5 text-[7px] font-medium uppercase tracking-[0.18em] text-[#5f5b54]">
                                        Preferred Destination
                                    </p>

                                    <p className="mt-1.5 text-[8px] leading-4 text-[#99948b]">
                                        Your new address can be selected as
                                        your preferred destination.
                                    </p>

                                </div>

                            </div>
                        </div>

                        {/* SMALL DECORATIVE FOOTER */}
                        <div className="mt-6 flex items-center justify-center gap-3">

                            <span className="h-px w-10 bg-[#d1ccc2]" />

                            <span className="font-serif text-sm italic text-[#b6aa91]">
                                LM
                            </span>

                            <span className="h-px w-10 bg-[#d1ccc2]" />

                        </div>

                    </aside>

                </div>
            </section>
        </main>
    );
}