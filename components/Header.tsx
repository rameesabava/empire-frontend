"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";

const WRAP = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
const SHADOW_TEAL = "shadow-[0_8px_32px_rgba(27,168,200,0.25)]";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/60 shadow-[0_4px_24px_rgba(26,35,66,0.08)]"
          : "bg-white/20"
      }`}
    >
      <div
        className={`${WRAP} flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-[70px]" : "h-[80px]"
        }`}
      >
        <Link href="/" aria-label="Empire AE home" className="shrink-0">
          <img
            src="https://empireae.xyz/images/logo.png"
            alt="Empire AE Logo"
            className={`w-auto transition-all duration-300 ${scrolled ? "h-[62px]" : "h-[72px]"}`}
          />
        </Link>

        {/* desktop nav: dark text, blue + underline on hover only */}
        <nav className="hidden flex-1 items-center justify-center gap-9 lg:flex" aria-label="Main">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative py-2 text-[15px] font-medium text-[#0d1b2e] transition-colors duration-300 hover:text-[#1ba8c8]"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#1ba8c8] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className={`inline-flex items-center rounded-full bg-[linear-gradient(135deg,#1ba8c8_0%,#3abfdb_100%)] px-8 py-[14px] text-[16px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 ${SHADOW_TEAL}`}
          >
            Let&apos;s Talk
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className={`h-0.5 w-6 bg-[#1a2342] transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#1a2342] transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#1a2342] transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-[#d0d9e3]/60 bg-white/75 px-5 pb-6 pt-3 shadow-[0_10px_40px_rgba(26,35,66,0.12)] backdrop-blur-md lg:hidden"
          aria-label="Mobile"
        >
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-[16px] font-medium text-[#0d1b2e] hover:bg-[#ebf9fc] hover:text-[#1ba8c8]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={`mt-3 flex justify-center rounded-full bg-[linear-gradient(135deg,#1ba8c8_0%,#3abfdb_100%)] py-3.5 text-[16px] font-semibold text-white ${SHADOW_TEAL}`}
          >
            Let&apos;s Talk
          </Link>
        </nav>
      )}
    </header>
  );
}