"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowUp, Check, CheckCircle2, Code2,  Monitor, Plus, ShieldCheck, Smartphone, Users, Zap } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const marqueeItems = [
  "Software Solutions",
  "Brand Identity",
  "Web Design",
  "Web Development",
  "Mobile Apps",
  "Digital Marketing",
  "SEO",
  "E-Commerce",
  "Hosting & Domain",
];

const services = [
  {
    icon: Monitor,
    title: "Web Design",
    text: "We design visually stunning, responsive websites that reflect your brand identity and deliver smooth user experiences across all devices.",
  },
  {
    icon: Code2,
    title: "Web Development",
    text: "We build secure, scalable, and high-performance websites using the latest technologies to ensure smooth functionality and long-term growth.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    text: "We develop high-quality mobile apps that are fast, secure, and scalable, delivering seamless experiences across Android and iOS platforms.",
  },
];

const checks = [
  "Client-Centric Approach",
  "Dedicated Post-Launch Support",
  "Fast Response & Issue Resolution",
  "Continuous Performance Monitoring",
];

const stats = [
  { value: "9+", label: "Years of Experience" },
  { value: "150+", label: "Websites Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "100%", label: "Client Satisfaction" },
];

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Most websites are completed within 1–3 weeks, depending on the project scope and content availability. We keep you informed at every stage of the process.",
  },
  {
    q: "Do you provide hosting and maintenance?",
    a: "Yes. We offer secure hosting with regular backups, performance monitoring, and ongoing technical support to keep your site running perfectly.",
  },
];

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-[#1ea5c4]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1ea5c4] border">
    <span className="h-1.5 w-1.5 rounded-full bg-[#1ea5c4]" />
    {children}
  </span>
);


function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 800; // Fast animation: 0.8 seconds
    const startTime = performance.now();
    let animationFrame: number;

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return <>{count}+</>;
}

export default function Home() {
  const [open, setOpen] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 200);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <main className="overflow-x-hidden bg-white font-sans text-[#0f1c3f]">
      {/* Keyframes used by the animations below */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim { animation: none !important; }
        }
      `}</style>

      {/* ───────────── HERO ───────────── */}
      <section className="bg-gradient-to-br from-white via-[#f3fafd] to-[#eaf6fa]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Left */}
          <div>
            <Pill>Complete Digital Solutions</Pill>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
              Build. Grow.
              <span className="block text-[#1ea5c4]">Dominate</span>
              <span className="block text-[#1ea5c4]">Digital.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
              Empire AE is your end-to-end partner — from stunning websites and
              powerful mobile apps to data-driven marketing strategies that grow
              your business.
            </p>

            {/* Buttons move UP on hover */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#1ea5c4] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#1ea5c4]/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1ea5c4]/40"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1ea5c4] hover:shadow-xl"
              >
                Explore Services
              </Link>
            </div>

            
<div className="mt-12 grid max-w-md grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-8">
  {[
    { value: 150, label: "Websites Delivered" },
    { value: 50, label: "Happy Clients" },
    { value: 9, label: "Years of Experience" },
  ].map(({ value, label }) => (
    <div key={label} className="px-3 first:pl-0 last:pr-0">
      <p className="text-2xl font-extrabold sm:text-3xl">
        <CountUp end={value} />
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  ))}
</div>

          </div>

          {/* Right */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-[#1ea5c4]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.webp"
                alt="Modern office with team"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            {/* Floating badges: smooth up & down */}
            <div className="anim absolute -right-3 -top-4 flex animate-[float_3.5s_ease-in-out_infinite] items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold shadow-xl">
              <Zap size={14} className="text-[#1ea5c4]" /> Fast Delivery
            </div>
            <div className="anim absolute -bottom-5 -left-4 flex animate-[float_4s_ease-in-out_infinite_1s] items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold shadow-xl">
              <CheckCircle2 size={14} className="text-[#1ea5c4]" /> 9+ Years
              Experience
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── MARQUEE (moves left continuously) ───────────── */}
      <div className="overflow-hidden bg-[#0f1c3f] py-4">
        <div className="anim flex w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-white/80"
            >
              <span className="px-8">{item}</span>
              <span className="text-[#1ea5c4]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────────── ABOUT ───────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about.webp"
            alt="Our team"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl"
          />
          <div className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#1ea5c4]/10 text-[#1ea5c4]">
              <Users size={20} />
            </span>
            <div>
              <p className="text-xl font-extrabold leading-none">50+</p>
              <p className="text-xs text-slate-500">Happy Clients</p>
            </div>
          </div>
        </div>

        <div>
          <Pill>About Us</Pill>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight">
            Who We Are
          </h2>
          <div className="mt-3 h-1 w-14 rounded bg-[#1ea5c4]" />
          <p className="mt-6 font-medium leading-relaxed text-slate-700">
            Branding Empire AE is a full-service digital solutions company
            dedicated to helping businesses build, grow, and strengthen their
            digital presence.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            We specialize in website development, mobile app development, ERP
            solutions, digital marketing, and brand identity creation — offering
            end-to-end services under one roof. With over 9 years of industry
            experience, we bring deep expertise, proven strategies, and reliable
            solutions to every project.
          </p>

          <ul className="mt-6 space-y-3">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1ea5c4] text-white">
                  <Check size={14} />
                </span>
                {c}
              </li>
            ))}
          </ul>

          {/* Turns blue bg + white text on hover */}
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#1ea5c4] bg-transparent px-6 py-3 text-sm font-semibold text-[#1ea5c4] transition-colors duration-300 hover:bg-[#1ea5c4] hover:text-white"
          >
            Learn More About Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ───────────── SERVICES ───────────── */}
      <section id="services" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Pill>Our Services</Pill>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              &ldquo;Smart services for a
              <span className="block text-[#1ea5c4]">smarter digital future.&rdquo;</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-slate-600">
              Everything you need to build, grow, and scale your digital
              presence — all under one roof.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Top line: grows left → right on hover */}
                <span className="absolute left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-[#1ea5c4] to-[#1ea5c4] transition-all duration-500 ease-out group-hover:w-full" />

                {/* Icon turns colored on hover */}
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#1ea5c4]/10 text-slate-500 transition-colors duration-300 group-hover:bg-[#1ea5c4] group-hover:text-white">
                  <Icon size={24} />
                </span>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {text}
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1ea5c4]"
                >
                  Learn More <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1ea5c4] px-7 py-3 text-sm font-semibold text-[#1ea5c4] transition-colors duration-300 hover:bg-[#1ea5c4] hover:text-white"
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── WHY CHOOSE US ───────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div>
          <Pill>Why Choose Us</Pill>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your Trusted <span className="text-[#1ea5c4]">Digital Partner</span>
          </h2>
          <div className="mt-3 h-1 w-14 rounded bg-[#1ea5c4]" />
          <p className="mt-6 max-w-md text-slate-600">
            We place our clients at the center of everything we do, focusing on
            understanding their goals and delivering tailored solutions that
            create real value.
          </p>
          <div className="mt-8 flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1ea5c4]/10 text-[#1ea5c4]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="font-bold">Dedicated Post-Launch Support</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                We stay with you after launch, providing ongoing monitoring and
                optimization.
              </p>
            </div>
          </div>
        </div>

      
<div className="grid grid-cols-2 gap-5">
  {stats.map((s) => (
    <div
      key={s.label}
      className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-9 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="text-4xl font-extrabold text-[#1ea5c4]">
        <CountUp end={parseInt(s.value)} />
      </p>
      <p className="mt-2 text-sm text-slate-500">{s.label}</p>
    </div>
  ))}
</div>

      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Pill>FAQ</Pill>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your Questions, <span className="text-[#1ea5c4]">Answered</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need to know before getting started with Empire AE.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-sm font-semibold"
                  aria-expanded={open === i}
                >
                  {f.q}
                  <Plus
                    size={18}
                    className={`text-[#1ea5c4] transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="overflow-hidden px-6 text-sm text-slate-500">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section
        id="contact"
        className="bg-gradient-to-b from-[#0f1c3f] to-[#16275a] py-24 text-center text-white"
      >
        <div className="mx-auto max-w-3xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#5fd0e8]">
            Get Started Today
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ready to <span className="text-[#1ea5c4]">Elevate Your Digital</span>{" "}
            Presence?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/70">
            Join 50+ satisfied clients who trust Empire AE for their digital
            transformation journey.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#1ea5c4] px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1ea5c4]/40"
            >
              Start Your Project <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919847980605"
              className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#0f1c3f]"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
     
{/* Floating WhatsApp and Scroll-to-Top Buttons */}
<div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
  {/* WhatsApp Button */}
  <Link
    href="https://wa.me/919847980605"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
  >
    <FaWhatsapp size={30} />
  </Link>

  {/* Scroll-to-Top Button */}
  <button
    type="button"
    onClick={() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    aria-label="Scroll to top"
    className={`grid h-12 w-12 place-items-center rounded-full bg-white text-blue-400 shadow-xl transition-all duration-300 hover:scale-110 hover:text-white hover:bg-[#168aa5] ${
      showScrollTop
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-3 opacity-0"
    }`}
    aria-hidden={!showScrollTop}
    tabIndex={showScrollTop ? 0 : -1}
  >
    <ArrowUp size={24} />
  </button>
</div>


    </main>
  );
}
