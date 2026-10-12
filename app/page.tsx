"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});


const WRAP = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
const TEAL_TEXT =
  "bg-[linear-gradient(135deg,#1ba8c8_0%,#3abfdb_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]";
/* original: h1..h6 { font-weight:700; line-height:1.2 } */
const H1 =
  "font-bold leading-[1.2] tracking-[-0.02em] text-[#0d1b2e] text-[clamp(2.5rem,5vw,4.5rem)]";
const H2 =
  "font-bold leading-[1.2] tracking-[-0.02em] text-[#0d1b2e] text-[clamp(2rem,4vw,3rem)]";
const SHADOW_TEAL = "shadow-[0_8px_32px_rgba(27,168,200,0.25)]";
const SECTION = "py-16 lg:py-[100px]";

const MILESTONES = [
  { n: "01", value: "150+", title: "Websites Delivered", text: "Successfully completed projects across e-commerce, SaaS, corporate, and personal brand sectors." },
  { n: "02", value: "50+", title: "Happy Clients", text: "Building long-term partnerships based on trust, transparency, and consistently excellent performance." },
  { n: "03", value: "9+", title: "Years of Experience", text: "Delivering reliable and scalable digital solutions with industry-leading expertise since 2015." },
  { n: "04", value: "100%", title: "Consistent Quality", text: "Building long-term client partnerships through consistent quality and measurable, tangible success." },
];

/* ---------- count-up numbers ---------- */
function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const target = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1800;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started, target]);

  return (
    <div ref={ref} className={className}>
      {count}
      {suffix}
    </div>
  );
}

  /* ---------- reveal on scroll ---------- */
  function RevealBox({
    children,
    delay = 0,
  }: {
    children: React.ReactNode;
    delay?: number;
  }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        style={{ transitionDelay: `${delay}ms` }}
        className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
      >
        {children}
      </div>
    );
  }

  const FOUNDATION = [
    {
      title: "Our Vision",
      text: "To be the leading digital solutions provider across the globe — empowering businesses of every size to build powerful digital identities that drive growth, engagement, and lasting impact in an ever-evolving digital world.",
      icon: (
        <>
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </>
      ),
    },
    {
      title: "Our Mission",
      text: "To deliver high-performance digital solutions — combining strategy, design, and technology — that enable businesses to attract more customers, operate efficiently, and achieve sustainable long-term growth in the digital era.",
      icon: (
        <>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </>
      ),
    },
    {
      title: "Our Values",
      text: "Integrity, innovation, and impact are at the core of everything we do. We believe in radical transparency, client-first thinking, and relentless pursuit of quality in every pixel, line of code, and marketing strategy we deliver.",
      icon: (
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      ),
    },
  ];

  const BAD = [
    "Inconsistent quality standards",
    "Limited transparency",
    "Short-term project mindset",
    "Minimal accountability",
    "Outdated processes",
  ];
  const GOOD = [
    "Dedicated post-launch support",
    "Fast response & issue resolution",
    "Continuous performance monitoring",
    "Regular updates & optimization",
    "Long-term client partnerships",
  ];

  /* ---------- small helpers ---------- */
  function Icon({
    children,
    size = 24,
    stroke = 2,
  }: {
    children: React.ReactNode;
    size?: number;
    stroke?: number;
  }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    );
  }

  function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-[18px] py-[7px] text-[13px] font-semibold uppercase tracking-[0.1em] ${dark
            ? "border-white/20 bg-white/10 text-[#3abfdb]"
            : "border-[#1ba8c8]/30 bg-white/70 text-[#1490ac]"
          }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {children}
      </span>
    );
  }

  function Btn({
    href,
    variant = "primary",
    arrow = false,
    children,
  }: {
    href: string;
    variant?: "primary" | "outline" | "outline-dark";
    arrow?: boolean;
    children: React.ReactNode;
  }) {
    const styles = {
      primary: `bg-[linear-gradient(135deg,#1ba8c8_0%,#3abfdb_100%)] text-white ${SHADOW_TEAL} hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(27,168,200,0.4)]`,
      outline:
        "border-2 border-[#d0d9e3] bg-white text-[#0d1b2e] hover:-translate-y-0.5 hover:border-[#1ba8c8] hover:text-[#1ba8c8]",
      "outline-dark":
        "border-2 border-white/30 text-white hover:-translate-y-0.5 hover:border-white hover:bg-white/10",
    };
    return (
      <Link
        href={href}
        className={`inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 py-[15px] text-[16px] font-semibold transition-all duration-300 ${styles[variant]}`}
      >
        {children}
        {arrow && (
          <Icon size={18} stroke={2.4}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </Icon>
        )}
      </Link>
    );
  }

  function SectionHead({
    pill,
    title,
    text,
    dark = false,
  }: {
    pill: string;
    title: React.ReactNode;
    text?: string;
    dark?: boolean;
  }) {
    return (
      <div className="mx-auto max-w-[720px] text-center">
        <Pill dark={dark}>{pill}</Pill>
        <h2 className={`mt-4 ${H2} ${dark ? "!text-white" : ""}`}>{title}</h2>
        {text && (
          <p
            className={`mx-auto mt-4 max-w-[600px] text-[17.6px] leading-[1.8] ${dark ? "text-[#a8b5c5]" : "text-[#4a5a6b]"
              }`}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  
  function FloatingButtons() {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const onScroll = () => setShow(window.scrollY > 400);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
      <>
        <a
          href="https://wa.me/919847980605"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-[86px] right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 sm:right-[30px] sm:h-14 sm:w-14"
        >
          <Icon size={28} stroke={1.8}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M9 9.5c.5 2 2.5 4 5 5l1.5-1.5-2-1-1 .8c-.8-.4-1.6-1.2-2-2l.8-1-1-2z" />
          </Icon>
        </a>
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1ba8c8] shadow-[0_8px_28px_rgba(26,35,66,0.18)] transition-all duration-300 hover:-translate-y-1 sm:right-[33px] ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
          <Icon size={22} stroke={2.2}>
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </Icon>
        </button>
      </>
    );
  }

  /* ---------- page ---------- */
  export default function AboutPage() {
    return (
      <div
        className={`${poppins.className} min-h-screen bg-white leading-[1.6] text-[#0d1b2e] antialiased [&_a]:cursor-pointer [&_button]:cursor-pointer`}
      >
        <Header />

        <main>
          {/* HERO  (original: padding 160px 0 80px, header included) */}
          <section className="bg-[linear-gradient(135deg,#f0fbff_0%,#ffffff_50%,#f4f9ff_100%)] pb-16 pt-14 sm:pb-20 sm:pt-20">
            <div className={`${WRAP} text-center`}>
              <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2.5 text-[14px]">
                <Link href="/" className="font-medium text-[#1490ac] hover:underline">Home</Link>
                <Icon size={14} stroke={2}><path d="m9 18 6-6-6-6" /></Icon>
                <span className="text-[#7a8ba0]">About Us</span>
              </nav>

              <div className="mt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#bceaf4] bg-[#ebf9fc] px-4 py-2 text-sm font-semibold text-[#1ba8c8]">
                  <span className="h-2 w-2 rounded-full bg-[#1ba8c8]" />
                  About Us
                </span>
              </div>

              <h1 className={`mx-auto mt-4 max-w-[960px] ${H1}`}>
                Building <span className={TEAL_TEXT}>Digital Empires</span>
                <br />
                Since 2015
              </h1>

              <p className="mx-auto mt-5 max-w-[680px] text-center text-[15px] leading-[1.8] text-[#4a5a6b] sm:text-[17px]">
                A full-service digital solutions company dedicated to helping
                <br /> businesses build, grow, and strengthen their digital presence.
              </p>
            </div>
          </section>

          {/* WHO WE ARE */}
          <section className={`bg-white ${SECTION}`}>
            <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#bceaf4] bg-[#ebf9fc] px-4 py-2 text-sm font-semibold text-[#1ba8c8]">
                  <span className="h-2 w-2 rounded-full bg-[#1ba8c8]" />
                  Who We Are
                </span>

                <h2 className={`mt-4 ${H2}`}>
                  Your End-to-End <span className={TEAL_TEXT}>Digital Partner</span>
                </h2>
                <div className="mt-5 h-[3px] w-[60px] rounded-full bg-[#1ba8c8]" />

                <p className="mt-7 text-[17.6px] font-medium leading-[1.8] text-[#0d1b2e]">
                  Branding Empire AE is a full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
                </p>
                <p className="mt-5 text-[16px] leading-[1.75] text-[#556475]">
                  We specialize in website development, mobile app development, ERP solutions, digital marketing, and brand identity creation — offering all services under one roof. With over 9 years of industry experience, we bring deep expertise, proven strategies, and reliable solutions to every project we undertake.
                </p>
                <p className="mt-4 text-[16px] leading-[1.75] text-[#556475]">
                  We place our clients at the center of everything we do, focusing on understanding their unique goals and delivering tailored solutions that create real, measurable value for their businesses.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Btn href="/contact" arrow>Start a Project</Btn>
                  <Btn href="/services" variant="outline">Our Services</Btn>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(26,35,66,0.15)]">
                  <img
                    src="https://empireae.xyz/images/about.png"
                    alt="Empire AE Team"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center rounded-[20px] bg-white px-4 py-5 shadow-[0_20px_60px_rgba(26,35,66,0.16)] sm:absolute sm:-bottom-5 sm:-right-5 sm:mt-0 sm:w-[72%] sm:px-6">
                  <div className="flex-1 text-center">
                    <CountUp
                      value="9+"
                      className={`text-[32px] font-bold leading-none ${TEAL_TEXT}`}
                    />
                    <div className="mt-2 text-[14px] text-[#7a8ba0]">Years of Excellence</div>
                  </div>
                  <div className="h-11 w-px bg-[#d0d9e3]" />
                  <div className="flex-1 text-center">
                    <CountUp
                      value="150+"
                      className={`text-[32px] font-bold leading-none ${TEAL_TEXT}`}
                    />
                    <div className="mt-2 text-[14px] text-[#7a8ba0]">Projects Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MILESTONES */}
          <section className={`bg-[#f3f6f8] ${SECTION}`}>
            <div className={WRAP}>
              <SectionHead
                pill="Milestones"
                title={<>Digital Experiences. <span className={TEAL_TEXT}>Proven Results.</span></>}
                text="Numbers that speak for our dedication, quality, and commitment to client success."
              />
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {MILESTONES.map((m) => (
                  <article
                    key={m.n}
                    className="relative overflow-hidden rounded-[20px] border border-[#d0d9e3]/60 bg-white p-8 shadow-[0_1px_3px_rgba(26,35,66,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(26,35,66,0.12)]"
                  >
                    <span
                      className="pointer-events-none absolute -bottom-7 -right-2 select-none text-[150px] font-bold leading-none text-[#1ba8c8]/[0.07]"
                      aria-hidden="true"
                    >
                      {m.n}
                    </span>
                    <div className="relative">
                      <div className="text-[44px] font-bold leading-[1.1] text-[#1490ac]">
                        <CountUp value={m.value} />
                      </div>
                      <h3 className="mt-3 text-[19px] font-bold">{m.title}</h3>
                      <p className="mt-3 text-[15px] leading-[1.7] text-[#4a5a6b]">{m.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* VISION / MISSION / VALUES */}
          <section className={`bg-white ${SECTION}`}>
            <div className={WRAP}>
              <SectionHead
                pill="Our Foundation"
                title={<>Vision &amp; <span className={TEAL_TEXT}>Mission</span></>}
              />

              <div className="mt-14 grid gap-8 lg:grid-cols-3">
                {FOUNDATION.map((f, index) => (
                  <RevealBox key={f.title} delay={index * 150}>
                    <article className="group h-full rounded-[28px] border border-[#d0d9e3]/70 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(26,35,66,0.1)]">
                      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-[#ebf9fc] text-[#1ba8c8] transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
                        <Icon size={26} stroke={1.8}>
                          {f.icon}
                        </Icon>
                      </div>

                      <h3 className="mt-6 text-[22px] font-bold">{f.title}</h3>

                      <div className="mt-4 h-[3px] w-[60px] rounded-full bg-[#1ba8c8]" />

                      <p className="mt-5 text-[15.2px] leading-[1.8] text-[#4a5a6b]">
                        {f.text}
                      </p>
                    </article>
                  </RevealBox>
                ))}
              </div>
            </div>
          </section>

          {/* WHAT SETS US APART */}
          <section className={`bg-[#f3f6f8] ${SECTION}`}>
            <div className={WRAP}>
              <SectionHead
                pill="Our Advantage"
                title={<>What Sets Us <span className={TEAL_TEXT}>Apart</span></>}
                text="We go beyond just delivering projects — we build lasting partnerships built on trust, transparency, and consistent excellence."
              />

              <div className="mx-auto mt-14 grid max-w-[900px] items-center gap-6 lg:grid-cols-[1fr_54px_1fr] lg:gap-8">
                {/* not aligned */}
                <div className="rounded-[28px] border border-[#f3b9b9] bg-[#fcf1f1] p-8">
                  <div className="flex items-center gap-3 border-b border-[#1a2342]/10 pb-5 text-[#dc2626]">
                    <Icon size={16} stroke={2.6}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
                    <h3 className="text-[14px] font-bold uppercase tracking-[0.05em] !text-[#dc2626]">
                      Not Aligned With Our Values
                    </h3>
                  </div>
                  <ul className="mt-6 space-y-[13px]">
                    {BAD.map((i) => (
                      <li key={i} className="flex items-center gap-3 text-[16.8px] font-medium leading-[1.6] text-[#dc2626]">
                        <Icon size={14} stroke={2.4}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center">
                  <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white text-[17px] font-extrabold text-[#0d1b2e] shadow-[0_10px_30px_rgba(26,35,66,0.12)]">
                    VS
                  </span>
                </div>

                {/* advantage */}
                <div className="rounded-[28px] border border-[#9edbe8] bg-[#f4fcfe] p-8">
                  <div className="flex items-center gap-3 border-b border-[#1a2342]/10 pb-5 text-[#1490ac]">
                    <Icon size={14} stroke={3}><path d="M20 6 9 17l-5-5" /></Icon>
                    <h3 className="text-[14px] font-bold uppercase tracking-[0.05em] !text-[#1490ac]">
                      The Empire AE Advantage
                    </h3>
                  </div>
                  <ul className="mt-6 space-y-[13px]">
                    {GOOD.map((i) => (
                      <li key={i} className="flex items-center gap-3 text-[16.8px] font-medium leading-[1.6] text-[#1490ac]">
                        <Icon size={12} stroke={3.2}><path d="M20 6 9 17l-5-5" /></Icon>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className={`bg-[linear-gradient(135deg,#1a2342_0%,#243060_100%)] ${SECTION}`}>
            <div className={WRAP}>
              <SectionHead
                dark
                pill="Work With Us"
                title={<>Let&apos;s Build Something <span className="text-[#3abfdb]">Amazing Together</span></>}
                text="Ready to take your digital presence to the next level? Contact our team and let's make it happen."
              />
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Btn href="/contact" arrow>Get In Touch</Btn>
                <Btn href="/services" variant="outline-dark">View Services</Btn>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <FloatingButtons />
      </div>
    );
  }