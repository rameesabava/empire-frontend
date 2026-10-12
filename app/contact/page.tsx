"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, JSX } from "react";

/* ---------- Types ---------- */

interface ContactItem {
    label: string;
    value: string;
    href?: string;
    icon: string; // SVG path "d" attribute
}

interface SocialLink {
    name: "Facebook" | "Instagram" | "LinkedIn";
    href: string;
}

interface ProcessStep {
    title: string;
    description: string;
    icon: string;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    service: string;
    message: string;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

/* ---------- Data ---------- */

const contactItems: ContactItem[] = [
    {
        label: "Phone",
        value: "+91 9847980605",
        href: "tel:+919847980605",
        icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
    },
    {
        label: "Email",
        value: "info@empireae.xyz",
        href: "mailto:info@empireae.xyz",
        icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    },
    {
        label: "Response Time",
        value: "Within 24 hours",
        icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    },
];

const socialLinks: SocialLink[] = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
];

const serviceOptions: string[] = [
    "Web Designing",
    "Web Development",
    "Mobile App Development",
    "Hosting & Domain",
    "Digital Marketing",
    "E-Commerce Application",
    "Software Application",
    "SEO",
];

const processSteps: ProcessStep[] = [
    {
        title: "Initial Consultation",
        description:
            "We respond within 24 hours to schedule a free consultation call to understand your requirements.",
        icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
    },
    {
        title: "Proposal & Strategy",
        description:
            "We provide a detailed project proposal outlining the scope, timeline, and strategy tailored for you.",
        icon: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184",
    },
    {
        title: "Project Kickoff",
        description:
            "Once approved, our team gets to work immediately, keeping you updated at every milestone.",
        icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    },
];

const initialForm: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
};

/* ---------- Small components ---------- */

interface OutlineIconProps {
    path: string;
    className?: string;
}

function OutlineIcon({ path, className = "h-6 w-6" }: OutlineIconProps): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
            className={className}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}



function SocialIcon({ name }: { name: SocialLink["name"] }): JSX.Element {

    const common = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: "h-6 w-6",
        "aria-hidden": true as const,
    };


    if (name === "Facebook") {
        return (
            <svg {...common} fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        );
    }



    if (name === "Instagram") {
        return (
            <svg
                {...common}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        );
    }


    return (
        <svg {...common} fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}





const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#f6f9fb] px-5 py-4 text-base text-[#101d32] placeholder:text-slate-400 outline-none transition focus:border-[#20afca] focus:bg-white focus:ring-4 focus:ring-[#20afca]/15";

const labelClass = "mb-2 block text-sm font-bold text-[#101d32]";

/* ---------- Page ---------- */

export default function Contact(): JSX.Element {
    const [form, setForm] = useState<FormData>(initialForm);
    const [status, setStatus] = useState<SubmitStatus>("idle");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setStatus("sending");

        try {
            // Replace with your real endpoint (API route, Formspree, EmailJS, etc.)
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Request failed");

            setStatus("success");
            setForm(initialForm);
        } catch {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="flex min-h-120 flex-col items-center bg-linear-to-b from-[#f1fbff] to-white px-6 pb-20 pt-20 text-center">
                {/* Breadcrumb */}
                <div className="mb-7 flex items-center gap-3 text-sm">
                    <span className="font-medium text-[#20afca]">Home</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500">Contact</span>
                </div>

                {/* Section Label */}
                <div className="mb-6 rounded-full border border-[#bcecf5] px-5 py-2 text-xs font-semibold tracking-widest text-[#159fba]">
                    <span className="mr-2">●</span>
                    GET IN TOUCH
                </div>

                {/* Heading */}
                <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-[#25b0cc] sm:text-5xl md:text-7xl">
                    <span className="text-[#101d32]">Let&apos;s</span> Start a
                    Conversation
                </h1>

                {/* Description */}
                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                    Have a project in mind? We&apos;d love to hear from you. Send us a{" "}
                    <br className="hidden md:block" /> message and we&apos;ll get back to
                    you within 24 hours.
                </p>
            </section>

            {/* Contact Info + Form */}
            <section className="bg-[#f6fafc] px-8 py-20 sm:px-8 lg:px-12 lg:py-28">
                <div className="mx-auto grid w-full max-w-300 gap-12 lg:grid-cols-2 lg:gap-24">
                    {/* Left: Contact Information */}
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#101d32] md:text-4xl">
                            Contact <span className="text-[#20afca]">Information</span>
                        </h2>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Ready to take your business to the next level? Reach out to our
                            team and let&apos;s make it happen.
                        </p>


                        <div className="mt-10 space-y-5">
                            {contactItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#f3f7fa] px-5 py-5 transition-all duration-300 hover:border-[#20afca] hover:bg-white hover:shadow-md hover:shadow-[#20afca]/10"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e3f4f8] text-[#17b1cf] transition-all duration-300 group-hover:bg-[#20afca] group-hover:text-white">
                                        <OutlineIcon path={item.icon} className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            {item.label}
                                        </p>

                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="mt-1 block break-words text-base font-medium text-[#101d32] transition-colors duration-300 group-hover:text-[#159fba]"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-base font-medium text-[#101d32] transition-colors duration-300 group-hover:text-[#159fba]">
                                                {item.value}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="mt-12">
                            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">
                                Follow Us
                            </p>





                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-[#f6fafc] px-6 py-3 text-base font-medium text-slate-500 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[#20afca] hover:bg-[#20afca] hover:text-white hover:shadow-md"
                                    >
                                        <SocialIcon name={social.name} />
                                        {social.name}
                                    </a>
                                ))}
                            </div>




                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="rounded-4xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-12">
                        <h3 className="text-3xl font-extrabold tracking-tight text-[#101d32]">
                            Send Us a Message
                        </h3>
                        <p className="mt-3 text-base text-slate-500">
                            Fill out the form below and our team will get back to you
                            promptly.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className={labelClass}>
                                        First Name *
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        placeholder="John"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className={labelClass}>
                                        Last Name *
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        placeholder="Doe"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className={labelClass}>
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="service" className={labelClass}>
                                    Service Interested In
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={form.service}
                                    onChange={handleChange}
                                    className={`appearance-none ${inputClass} ${form.service === "" ? "text-slate-400" : ""
                                        }`}
                                >
                                    <option value="">Select a service…</option>
                                    {serviceOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className={labelClass}>
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    placeholder="Tell us about your project…"
                                    value={form.message}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-y`}
                                />
                            </div>



                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2cb9d6] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#20afca]/30 transition hover:bg-[#20afca] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {status === "sending" ? "Sending…" : "Send Message"}

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    width="18"
                                    height="18"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>


                            {status === "success" && (
                                <p role="status" className="text-center text-sm font-medium text-emerald-600">
                                    Thanks! Your message has been sent. We&apos;ll reply within 24 hours.
                                </p>
                            )}
                            {status === "error" && (
                                <p role="alert" className="text-center text-sm font-medium text-red-600">
                                    Something went wrong. Please try again or email us directly.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* What Happens After You Contact Us */}

            <section className="border-b-4 border-[#20afca] bg-[#f6fafc] px-6 py-20 text-center">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bcecf5] bg-[#eefafd] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[2px] text-[#159fba]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#20afca]" />
                        Why Work With Us
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-[#101d32] md:text-5xl">
                        What Happens After{" "}
                        <span className="text-[#20afca]">You Contact Us</span>
                    </h2>

                    <div className="mt-16 flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-0">
                        {processSteps.map((step, index) => (
                            <div
                                key={step.title}
                                className="flex flex-col items-center md:flex-row md:items-start"
                            >
                                <div className="flex w-60 flex-col items-center px-2">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#20afca] text-white shadow-lg shadow-[#20afca]/30">
                                        <OutlineIcon path={step.icon} className="h-6 w-6" />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-[#101d32]">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                        {step.description}
                                    </p>
                                </div>

                                {index < processSteps.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="mx-5 hidden pt-6 text-xl text-[#20afca] md:block"
                                    >
                                        →
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}