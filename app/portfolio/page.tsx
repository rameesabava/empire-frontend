"use client";


import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Category = "Web Design" | "Mobile Apps" | "Marketing" | "Branding";

const filters = ["All Projects", "Web Design", "Mobile Apps", "Marketing", "Branding"] as const;

const projects: {
  title: string;
  tag: string; // small badge on the card
  category: Category; // used by the filter buttons
  year: string;
  text: string;
  overlay: string; // short text shown on image hover
  image: string;
}[] = [
  {
    title: "E-Commerce Platform",
    overlay: "Full-featured online store with advanced filtering, secure payments, and a mobile-first checkout experience.",
    tag: "Web Development",
    category: "Web Design",
    year: "2025",
    text: "Custom-built WooCommerce store with advanced product filtering, secure payment gateway integration, and mobile-first design.",
    image: "https://tse4.mm.bing.net/th/id/OIP.kPURjF7-ZvO6mSVpmp95GwHaD8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    title: "Facebook Ad Campaign",
    overlay: "Multi-channel Facebook campaign that generated 300% ROI and 2x lead generation for a retail brand.",
    tag: "Digital Marketing",
    category: "Marketing",
    year: "2025",
    text: "Data-driven social media campaign delivering 300% ROI, reaching 500K+ targeted users with optimized ad creatives.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Social Media Brand Kit",
    overlay: "Complete social media brand identity including logo, templates, color system, and content strategy.",
    tag: "Branding",
    category: "Branding",
    year: "2024",
    text: "Full brand identity system with custom logo design, visual language, and pre-built social media content templates.",
    image: "https://masterbundles.com/wp-content/uploads/2023/05/01--330.jpg",
  },
  {
    title: "Business Management App",
    overlay: "Cross-platform mobile app with real-time data sync, offline capability, and intuitive dashboard interface.",
    tag: "Mobile App",
    category: "Mobile Apps",
    year: "2025",
    text: "Flutter-based cross-platform app serving 1,000+ daily active users with real-time analytics, push notifications, and offline data sync.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Corporate Website Redesign",
    overlay: "Complete website overhaul resulting in 180% increase in organic traffic and 40% better conversion rate.",
    tag: "Web Design",
    category: "Web Design",
    year: "2024",
    text: "Complete redesign with modern UI, optimized page speed (99 Lighthouse score), and SEO-first architecture.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Organic SEO Campaign",
    overlay: "6-month SEO strategy that pushed 50+ keywords to Page 1 and tripled organic traffic.",
    tag: "SEO",
    category: "Marketing",
    year: "2024",
    text: "Comprehensive SEO overhaul pushing 50+ target keywords to Page 1 of Google — 3x organic traffic growth in 6 months.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=900&q=80",
  },
];

const stats = [
  { end: 150, suffix: "+", label: "Projects Delivered" },
  { end: 50, suffix: "+", label: "Satisfied Clients" },
  { end: 300, suffix: "%", label: "Avg ROI for Clients" },
];

/* Counts quickly from 0 → end once the number scrolls into view */
function CountUp({ end, suffix = "", duration = 1400 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(end);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setVal(Math.round(end * (1 - Math.pow(1 - t, 3)))); // ease-out: fast start
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const Pill = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
      dark
        ? "border-white/15 bg-white/10 text-[#5fd0e8]"
        : "border-[#1ea5c4]/25text-[#1ea5c4]"
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-[#1ea5c4]" />
    {children}
  </span>
);

export default function PortfolioPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All Projects");
  const visible = active === "All Projects" ? projects : projects.filter((p) => p.category === active);

  return (
    <main className={`${jakarta.className} overflow-x-hidden bg-slate-50 text-[#0f1c3f]`}>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-in { animation: none !important; }
        }
      `}</style>

      {/* ───────────── PAGE HERO ───────────── */}
      <section className="bg-gradient-to-b from-[#eaf6fb] to-white px-6 pb-16 pt-20 text-center">
        <nav className="flex items-center justify-center gap-2 text-sm">
          <Link href="/" className="font-medium text-[#1ea5c4] hover:underline">Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500">Portfolio</span>
        </nav>

        <div className="mt-5">
          <Pill>Our Work</Pill>
        </div>

        <h1 className="mx-auto mt-6 max-w-6xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Projects That <span className="text-[#1ea5c4]">Speak for Themselves</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-slate-600">
          A curated showcase of our premium digital work — from sleek <br /> websites to powerful mobile apps and
          high-impact marketing campaigns.
        </p>
      </section>

      {/* ───────────── FILTER BAR ───────────── */}
      <div className="border-y border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-6 py-5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active === f
                  ? "border-[#1ea5c4] bg-[#1ea5c4] text-white shadow-lg shadow-[#1ea5c4]/30"
                  : "border-slate-300 bg-white text-slate-600 hover:border-[#1ea5c4] hover:text-[#1ea5c4]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────── PROJECT GRID ───────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-start gap-7 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.title}
              className="card-in group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1ea5c4]/15"
              style={{ animation: "cardIn .5s ease-out both" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1ea5c4] to-[#0f1c3f]">
            
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover overlay: tag, title, short text, View Work */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-[#0f1c3f]/90 via-[#145a82]/85 to-[#1ea5c4]/85 p-5 text-center opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100">
                  <span className="translate-y-3 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#8fe3f5] transition-transform duration-500 group-focus-within:translate-y-0 group-hover:translate-y-0">
                    {p.tag}
                  </span>
                  <p className="translate-y-3 text-xl font-bold text-white transition-transform delay-75 duration-500 group-focus-within:translate-y-0 group-hover:translate-y-0">
                    {p.title}
                  </p>
                  <p className="max-w-xs translate-y-3 text-sm leading-relaxed text-white/85 transition-transform delay-100 duration-500 group-focus-within:translate-y-0 group-hover:translate-y-0">
                    {p.overlay}
                  </p>
                  <Link
                    href='/contact'
                    className="mt-1 translate-y-3 rounded-full border-2 border-white/70 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition-all delay-150 duration-500 hover:bg-white hover:text-[#0f1c3f] group-focus-within:translate-y-0 group-hover:translate-y-0"
                  >
                    View Work
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#1ea5c4]/10 px-3 py-1 text-xs font-semibold text-[#1ea5c4]">
                    {p.tag}
                  </span>
                  <span className="text-sm text-slate-400">{p.year}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────────── STATS (count-up) ───────────── */}
      <section className="bg-gradient-to-b from-[#0f1c3f] to-[#16275a] pt-20 text-white">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center px-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="min-w-[180px] flex-1 px-6 py-3 text-center sm:border-r sm:border-white/15 sm:last:border-r-0"
            >
              <p className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-base font-medium text-white/70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ───────────── CTA ───────────── */}
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-24 text-center">
          <Pill dark>Work With Us</Pill>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-4xl lg:text-4xl">
            Let&apos;s Build Something <span className="text-[#1ea5c4]">Amazing Together</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Ready to take your digital presence to the next level? Contact our team and let&apos;s make it happen.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1ea5c4] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1ea5c4]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1ea5c4]/50"
            >
              Get In Touch
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2"
              />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-white/40 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/10"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

    
{/* Floating WhatsApp button */}
<Link
  href="https://wa.me/919847980605"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat on WhatsApp"
  className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
>
  <FaWhatsapp size={30} />
</Link>

    </main>
  );
}
