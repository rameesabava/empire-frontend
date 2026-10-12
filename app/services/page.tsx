
"use client";
import { useEffect, useState } from "react";

const stats = [
    { number: "9+", label: "Services Offered" },
    { number: "150+", label: "Projects Completed" },
    { number: "100%", label: "Client Satisfaction" },
];

const services = [
    {
        title: "Web Designing",
        description:
            "We design visually stunning, responsive websites that reflect your brand identity and deliver smooth user experiences across all devices. Designs that don't just look good — they work smart. We create engaging, modern websites that capture attention and drive results.",
        tags: ["UI/UX Design", "Responsive", "Brand Identity"],
        icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
        title: "Web Development",
        description:
            "We build secure, scalable, and high-performance websites using the latest technologies to ensure smooth functionality and long-term growth. From concept to deployment, our web development solutions turn ideas into powerful digital platforms that drive real results.",
        tags: ["React / Next.js", "WordPress", "Laravel"],
        icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    },
    {
        title: "Mobile App Development",
        description:
            "We develop high-quality mobile apps that are fast, secure, and scalable, delivering seamless experiences across Android and iOS platforms. From idea to launch, we build mobile applications that engage users, streamline operations, and drive business growth.",
        tags: ["Android", "iOS", "Flutter"],
        icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
        title: "Hosting & Domain",
        description:
            "Reliable hosting and domain solutions that ensure speed, security, and uninterrupted online presence. We provide secure hosting and easy domain management to keep your website running smoothly, always. Fast servers, regular backups, SSL included.",
        tags: ["SSL Security", "99.9% Uptime", "Daily Backups"],
        icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2",
    },
    {
        title: "Digital Marketing",
        description:
            "Data-driven digital marketing strategies that boost visibility, engage audiences, and grow your business online. We help brands reach the right audience, at the right time, with powerful digital marketing solutions that deliver measurable results and real ROI.",
        tags: ["SEO", "Social Media", "Content Marketing"],
        icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
    },
    {
        title: "E-Commerce Application",
        description:
            "We develop secure, scalable e-commerce applications that deliver seamless shopping experiences and drive online sales. From product listing to payment gateway, our e-commerce apps are built to convert visitors into loyal customers and maximize revenue.",
        tags: ["WooCommerce", "Payment Gateway", "Inventory Mgmt"],
        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
        title: "Software Application",
        description:
            "We develop custom software applications tailored to your specific business processes, ensuring efficiency, security, and scalability. Robust, high-performance software applications built with the latest technologies for seamless functionality and long-term reliability.",
        tags: ["ERP Systems", "CRM", "Custom Software"],
        icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
    },
    {
        title: "SEO",
        description:
            "We optimize your website to rank higher on search engines, driving organic traffic and increasing brand visibility. Our proven SEO strategies ensure your business is easily found by the right audience when they search for your products or services.",
        tags: ["On-Page SEO", "Off-Page SEO", "Keyword Research"],
        icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
    },
];

function AnimatedCounter({
    value,
    duration = 2000,
}: {
    value: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const target = parseInt(value.replace(/\D/g, ""), 10);
        const startTime = performance.now();
        let animationFrame = 0;

        const animate = (currentTime: number) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            // Smooth ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easedProgress * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    const suffix = value.replace(/[0-9]/g, "");

    return (
        <span>
            {count}
            {suffix}
        </span>
    );
}

function ArrowRight() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="16"
            height="16"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
        </svg>
    );
}

export default function Services() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="flex min-h-142.5 flex-col items-center bg-linear-to-b from-[#f1fbff] to-white px-6 pb-20 pt-20 text-center">
                {/* Breadcrumb */}
                <div className="mb-7 flex items-center gap-3 text-sm">
                    <span className="font-medium text-[#20afca]">
                        Home
                    </span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500">Services</span>
                </div>

                {/* Section Label */}
                <div className="mb-6 rounded-full border border-[#bcecf5] px-5 py-2 text-sm font-semibold tracking-widest text-[#159fba]">
                    <span className="mr-2">●</span>
                    WHAT WE DO
                </div>

                {/* Heading */}
                <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-[#101d32] sm:text-5xl md:text-7xl">
                    <span className="text-[#25b0cc]">
                        Smart Services
                    </span>{" "}
                    for a
                    <br className="hidden md:block" /> Smarter Digital Future
                </h1>

                {/* Description */}
                <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    From concept to launch and beyond — we provide every digital
                    service your business needs to succeed in the modern world.
                </p>
            </section>

            {/* Statistics Strip with Animated Counters */}
            <section className="relative h-75 w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/services.webp')",
                    }}
                />

                {/* Blue Fade Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #1a2342d9, #1ba8c880)",
                    }}
                />

                {/* Statistics */}
                <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex h-full flex-1 flex-col items-center justify-center px-3 text-center"
                        >
                            <span className="text-4xl font-extrabold text-white sm:text-5xl">
                                <AnimatedCounter
                                    value={stat.number}
                                    duration={2000}
                                />
                            </span>

                            <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/90 sm:text-sm">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* All Services Section */}
            <section className="all-services bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
                <div className="container mx-auto max-w-7xl">
                    {/* Section Header */}
                    <div className="section-header mb-14 text-center">
                        <span className="inline-flex items-center rounded-full border border-[#bcecf5] bg-[#eefafd] px-5 py-2 text-xs font-bold uppercase tracking-[2px] text-[#159fba]">
                            Our Services
                        </span>

                        <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#101d32] sm:text-4xl md:text-5xl">
                            Everything You Need to{" "}
                            <span className="bg-linear-to-r from-[#20afca] to-[#52c8dc] bg-clip-text text-transparent">
                                Grow Online
                            </span>
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            End-to-end digital solutions designed to help your business
                            thrive at every stage.
                        </p>
                    </div>

                    {/* Responsive Services Grid */}
                    <div className="services-grid mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <article
                                    key={service.title}
                                    className="service-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-300/50 sm:p-7"
                                >
                                    {/* Top Blue Accent */}
                                    <div className="absolute left-0 top-0 h-1 w-0 bg-linear-to-r from-[#20afca] to-[#52c8dc] transition-all duration-300 group-hover:w-full" />

                                    {/* Service Icon */}
                                    <div className="mb-6 flex items-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf9fc] text-[#17b1cf] transition-colors duration-300 group-hover:bg-[#20afca] group-hover:text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="h-7 w-7"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.6}
                                                    d={service.icon}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Service Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-extrabold leading-snug tracking-tight text-[#101d32] transition-colors duration-300 group-hover:text-[#159fba]">
                                            {service.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                                            {service.description}
                                        </p>

                                        {/* Service Tags */}
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {service.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-[#d8edf2] bg-[#f3fbfd] px-3 py-1.5 text-xs font-medium text-[#427084] transition-colors duration-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Get Started Link */}
                                    <div className="mt-7 pt-2">
                                        <a
                                            href="/contact/"
                                            className="group/cta inline-flex items-center gap-2 rounded-lg bg-transparent px-0 py-2 text-sm font-bold text-[#159fba] transition-colors duration-300"
                                        >
                                            <span>Get Started</span>

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 12h14m-7-7 7 7-7 7"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call To Action Section */}
            <section className="relative isolate overflow-hidden border-b-4 border-[#1ba8c8] bg-[linear-gradient(135deg,#1a2342_0%,#243060_100%)] px-5 py-24 text-center sm:px-8 sm:py-28">
                {/* Cyan Radial Glow */}
                <div
                    className="pointer-events-none absolute -top-25 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#1ba8c833_0%,transparent_70%)]"
                    aria-hidden="true"
                />

                <div className="mx-auto flex max-w-4xl flex-col items-center">
                    {/* Label */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1ba8c8]/40 bg-[#1ba8c8]/10 px-5 py-2 text-xs font-bold uppercase tracking-[2px] text-[#3abfdb]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3abfdb]" />
                        Let&apos;s Talk
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                        Ready to Build Your{" "}
                        <span className="bg-linear-to-r from-[#1ba8c8] to-[#3abfdb] bg-clip-text text-transparent">
                            Digital Empire?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
                        Contact our team today and let&apos;s turn your ideas into digital
                        reality.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                        <a
                            href="/contact/"
                            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#1ba8c8] to-[#3abfdb] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_#1ba8c840] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_#1ba8c855] sm:w-auto"
                        >
                            <span>Start a Project</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-7-7 7 7-7 7"
                                />
                            </svg>
                        </a>

                        <a
                            href="tel:+0000000000"
                            className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/2 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 sm:w-auto"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
