"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* =====================================================================
   1. SCROLL TEXT REVEAL
   ===================================================================== */

const TEXT =
  "At Empire AE, we believe technology should feel effortless, inspire the people who use it, and help ambitious businesses grow. We are here to build digital experiences that move your business forward.";

// Words are kept as unbreakable units so wrapping stays natural;
// each word's letters are individual spans.
const WORD_LIST = TEXT.split(" ");

const DIM = 0x45; // #454545
const BRIGHT = 0xff; // #ffffff

// How many characters make up the soft "leading edge" of the reveal.
const EDGE = 8;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function ScrollTextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !paragraph) return;

    // DOM order of the spans is the reading order.
    const chars = Array.from(
      paragraph.querySelectorAll<HTMLSpanElement>("[data-char]")
    );
    const count = chars.length;
    if (!count) return;

    // Last painted channel value per character (avoids redundant style writes).
    const applied = new Array<number>(count).fill(-1);

    const paint = (i: number, t: number) => {
      const c = Math.round(DIM + (BRIGHT - DIM) * t);
      if (applied[i] !== c) {
        applied[i] = c;
        chars[i].style.color = `rgb(${c}, ${c}, ${c})`;
      }
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reduced motion: show the whole sentence in white, no scroll animation.
    if (reduceMotion) {
      for (let i = 0; i < count; i++) paint(i, 1);
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 1;

      // Reveal front moves from before the first character to past the last,
      // so char 0 starts dim at progress 0 and the last char is white at 1.
      const front = progress * (count + EDGE);

      for (let i = 0; i < count; i++) {
        paint(i, clamp((front - i) / EDGE));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Section/paragraph size can change when the font loads or text rewraps.
    const ro = new ResizeObserver(schedule);
    ro.observe(paragraph);
    ro.observe(section);

    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="eae-reveal">
      <div className="eae-reveal-sticky">
        <p ref={paragraphRef} className="eae-reveal-text">
          {/* One coherent sentence for assistive tech */}
          <span className="eae-sr-only">{TEXT}</span>

          <span aria-hidden="true">
            {WORD_LIST.map((word, w) => (
              <span key={`w-${w}`}>
                <span className="eae-word">
                  {Array.from(word).map((char, c) => (
                    <span key={`c-${w}-${c}`} data-char className="eae-char">
                      {char}
                    </span>
                  ))}
                </span>
                {w < WORD_LIST.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

/* =====================================================================
   2. DEMO DATA (replace with approved testimonials later)
   ===================================================================== */

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  /** Logo in its ORIGINAL colours (path in /public). */
  image?: string;
  /** A separate white/light version of the same logo. Wins over `image`. */
  imageOnDark?: string;
  /** Single-colour logo on a transparent PNG: draw it in white on the black avatar. */
  whiteMask?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "nakshathra",
    name: "Nakshathra Gold and Diamonds",
    role: "Founder",
    company: "",
    review:
      "Their engineering team helped us improve the reliability of our platform and simplify several complex workflows. The collaboration was professional and well organized.",
    // Single-colour logo drawn in white. Swap the path if this is not the
    // Gold and Diamonds logo.
    image: "/logos/logos/Nakshathra_Hrms.png",
    whiteMask: true,
  },
  {
    id: "Caior",
    name: "Caior",
    role: "Founder",
    company: "",
    review:
      "Their digital marketing strategies improved our online visibility, attracted more potential customers, and helped our business grow through effective campaigns.",
    
    image: "/logos/logos/caior.png",
    whiteMask: true,
  },
  {
    id: "charmika",
    name: "Charmika",
    role: "Founder",
    company: "",
    review:
      "Working with this team was a great experience. They understood our product requirements, communicated clearly, and delivered a solution that fit our business needs.",
    image: "/logos/logos/Charmika.png",
  },

  {
    id: "FalvorHouse",
    name: "Falvor House",
    role: "Founder",
    company: "",
    review:
      "The team took the time to understand our challenges and proposed a practical solution. Their attention to detail and responsiveness made a real difference to our project.",
   image: "/logos/logos/Falvor_House.png",
    whiteMask: true,
  },
  {
    id: "keralainstitutesalesapp",
    name: "kerala institute",
    role: "Founder",
    company: "",
    review:
      "From planning to delivery, the team maintained a clear focus on quality and usability. The final solution gave us a stronger foundation for future improvements.",
    image: "/logos/logos/kerala_institute_sales_app.png",
  },
];

/* =====================================================================
   3. BRAND SHOWCASE (GSAP: six clipped slots, logos swap group by group)
   ===================================================================== */

const SHOWCASE_HEADING = "Brands using GSAP®";

/* ---------------------------------------------------------------------
   Showcase theme: a strict, BINARY switch driven by scroll position.
   ---------------------------------------------------------------------
   The showcase is themed only through the CSS variables --bs-bg / --bs-fg,
   which every logo, border and decoration already reads. The section is
   exactly one of two states, never anything in between:

     default      -> DARK  (#000000 background, #FFFFFF text)   = Section 1
     .is-light    -> LIGHT (#FFFFFF background, #000000 text)   = Section 3

   One ScrollTrigger toggles the `is-light` class. There is no tween, no
   gradient and no CSS transition, so no intermediate shade can ever appear.
   STYLES below reads LIGHT.bg for Section 3 too, so the two always match.
   --------------------------------------------------------------------- */
const THEME_DARK = { bg: "#000000", fg: "#FFFFFF" };
const THEME_LIGHT = { bg: "#FFFFFF", fg: "#000000" };

// The switch point. "bottom 80%" = the showcase's lower edge has risen to 80%
// of the viewport height, i.e. Section 3 now occupies the bottom 20% of the
// screen. Above this scroll position: black. At or below it: white.
// Tune this one string to switch earlier or later.
const THEME_SWITCH_AT = "bottom 80%";

type Dir = "up" | "down" | "left" | "right";

type Variant =
  | "intel" | "youtube" | "netflix" | "amazon" | "ford" | "samsung"
  | "ea" | "nike" | "aol" | "gucci" | "mcdonalds" | "microsoft";

type Brand = {
  name: string;
  variant: Variant;
  /** Path to the logo image in /public. */
  src?: string;
  /** Visual size tweak relative to the shared slot box (1 = Indoor_petals reference).
   *  Use it for logos with transparent padding or unusual aspect ratios. */
  scale?: number;
  /** "theme": draw the artwork in the showcase foreground colour (white on the
   *  black theme, black on the white theme) via an alpha mask. Only for
   *  single-colour logos on a transparent background.
   *  "original": keep the artwork's own colours (default). */
  colorMode?: "theme" | "original";
};

// Add more groups here. Every group needs the same number of brands
// (one per slot) and the loop will cycle through them in this order.
const BRAND_GROUPS: Brand[][] = [
  [
    { name: "CAIOR", variant: "intel", src: "/logos/logos/caior.png", colorMode: "theme", scale: 1 },
    { name: "Charmika", variant: "youtube", src: "/logos/logos/Charmika.png", scale: 1 },
    { name: "Credtree", variant: "netflix", src: "/logos/logos/credtree.png", scale: 1 },
    { name: "Fira", variant: "amazon", src: "/logos/logos/Fira.png", colorMode: "theme", scale: 1 },
    { name: "Devamshi", variant: "ford", src: "/logos/logos/Devamshi.png", scale: 1 },
    { name: "EGL", variant: "samsung", src: "/logos/logos/EGL.png", scale: 1 },
  ],
  [
    { name: "Elaamy", variant: "ea", src: "/logos/logos/Elaamy.png", scale: 1 },
    { name: "Ethenzaa", variant: "nike", src: "/logos/logos/Ethenzaa.png", scale: 1 },
    { name: "Nakshathra HRMS", variant: "aol", src: "/logos/logos/Nakshathra_Hrms.png", colorMode: "theme", scale: 1 },
    { name: "Indoor Petals", variant: "gucci", src: "/logos/logos/kerala_institute_sales_app.png", scale: 1 }, // sizing reference
    { name: "Gabby Talk", variant: "mcdonalds", src: "/logos/logos/gabby_talk.png", scale: 1 },
    { name: "HeartMate", variant: "microsoft", src: "/logos/logos/suchiGo.png", scale: 1 },
  ],
];

// Per-slot motion, read from the reference video.
//   exit      = direction the old logo travels while it leaves its slot
//   enterFrom = side the new logo comes in from
const SLOT_MOTION: { exit: Dir; enterFrom: Dir }[] = [
  { exit: "left", enterFrom: "up" },
  { exit: "down", enterFrom: "right" },
  { exit: "right", enterFrom: "down" },
  { exit: "down", enterFrom: "left" },
  { exit: "left", enterFrom: "down" },
  { exit: "down", enterFrom: "right" },
];

// Timing in seconds (measured from the video, see notes in the reply).
const TIMING = {
  hold: 2.2, // how long a group stays on screen
  stagger: 0.2, // delay between neighbouring slots
  exitDuration: 0.32,
  gap: 0.32, // empty moment between a logo leaving and the next arriving
  enterDuration: 0.48,
};

// xPercent / yPercent offsets that push a logo fully out of its slot.
const vec = (d: Dir) => {
  switch (d) {
    case "left": return { xPercent: -100, yPercent: 0 };
    case "right": return { xPercent: 100, yPercent: 0 };
    case "up": return { xPercent: 0, yPercent: -100 };
    default: return { xPercent: 0, yPercent: 100 };
  }
};

// Text used by the simple one-word marks.
const MARK_TEXT: Partial<Record<Variant, string>> = {
  intel: "intel",
  netflix: "NETFLIX",
  ford: "Ford",
  samsung: "SAMSUNG",
  nike: "NIKE",
  aol: "Aol.",
  gucci: "GUCCI",
};

function LogoMark({ brand }: { brand: Brand }) {
  if (brand.src) {
    const scaleStyle = { "--bs-logo-scale": brand.scale ?? 1 } as CSSProperties;

    // Single-colour logo: alpha mask filled with the theme foreground, so it
    // flips with the existing --bs-fg variable (no transition, no filter).
    if (brand.colorMode === "theme") {
      return (
        <span
          role="img"
          aria-label={brand.name}
          className="eae-bs-brand-image eae-bs-brand-theme"
          style={{
            ...scaleStyle,
            WebkitMaskImage: `url(${brand.src})`,
            maskImage: `url(${brand.src})`,
          }}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.src}
        alt={brand.name}
        className="eae-bs-brand-image"
        style={scaleStyle}
        draggable={false}
      />
    );
  }

  switch (brand.variant) {
    case "youtube":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-yt">
          You<span className="eae-mk-yt-box">Tube</span>
        </span>
      );
    case "amazon":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-amz">
          <span>amazon</span>
          <i aria-hidden="true" />
        </span>
      );
    case "ea":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-ea">
          <span>EA</span>
          <small>GAMES</small>
        </span>
      );
    case "mcdonalds":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-mcd">
          <svg viewBox="0 0 24 20" aria-hidden="true">
            <path d="M3 19V8C3 -1.5 12 -1.5 12 9C12 -1.5 21 -1.5 21 8V19" />
          </svg>
        </span>
      );
    case "microsoft":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-ms">
          <span className="eae-mk-ms-grid" aria-hidden="true">
            <b /><b /><b /><b />
          </span>
          <span>Microsoft</span>
        </span>
      );
    default:
      return (
        <span role="img" aria-label={brand.name} className={`eae-mk eae-mk-${brand.variant}`}>
          {MARK_TEXT[brand.variant]}
        </span>
      );
  }
}

function BrandShowcase({ groups }: { groups: Brand[][] }) {
  const sectionRef = useRef<HTMLElement>(null);
  // itemRefs.current[group][slot] -> the logo element for that slot in that group
  const itemRefs = useRef<(HTMLDivElement | null)[][]>([]);

  const slotCount = groups[0]?.length ?? 0;

  /* ---- Logo swap timeline (unchanged) ---------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || groups.length < 2 || slotCount === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    // matchMedia cleans up everything created inside it, and lets visitors
    // with reduced motion keep the static first group (see CSS).
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const { hold, stagger, exitDuration, gap, enterDuration } = TIMING;
      const transition = (slotCount - 1) * stagger + exitDuration + gap + enterDuration;
      const cycle = hold + transition;

      const tl = gsap.timeline({ paused: true, repeat: -1 });

      groups.forEach((_, g) => {
        const next = (g + 1) % groups.length;
        const start = g * cycle + hold;

        for (let s = 0; s < slotCount; s++) {
          const out = itemRefs.current[g]?.[s];
          const incoming = itemRefs.current[next]?.[s];
          const motion = SLOT_MOTION[s % SLOT_MOTION.length];
          if (!out || !incoming) continue;

          const tOut = start + s * stagger;
          const tIn = tOut + exitDuration + gap;
          const away = vec(motion.exit);
          const from = vec(motion.enterFrom);

          // Old logo slides out of its clipped slot, then fades at the very end.
          tl.fromTo(
            out,
            { xPercent: 0, yPercent: 0 },
            { ...away, duration: exitDuration, ease: "power2.in", immediateRender: false },
            tOut
          );
          tl.fromTo(
            out,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: exitDuration * 0.4, ease: "none", immediateRender: false },
            tOut + exitDuration * 0.6
          );

          // New logo slides into the same slot from its own side.
          tl.fromTo(
            incoming,
            { ...from },
            { xPercent: 0, yPercent: 0, duration: enterDuration, ease: "power3.out", immediateRender: false },
            tIn
          );
          tl.fromTo(
            incoming,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: enterDuration * 0.35, ease: "none", immediateRender: false },
            tIn
          );
        }
      });

      // Only run while the section is on screen.
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    });

    return () => mm.revert();
  }, [groups, slotCount]);

  /* ---- Binary theme switch (black <-> white) ---------------------------
     Active from THEME_SWITCH_AT to the end of the page => `is-light` on.
     Because the state comes from the scroll position itself, fast scrolling,
     jumps and scrolling back up always land on the correct theme. It only
     toggles a class, so it cannot touch the logo timeline. Cleanup kills the
     trigger and removes the class, so Strict Mode leaves exactly one trigger.
     --------------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: section,
      start: THEME_SWITCH_AT,
      end: "max",
      toggleClass: { targets: section, className: "is-light" },
    });

    return () => {
      st.kill();
      section.classList.remove("is-light");
    };
  }, []);

  return (
    <section ref={sectionRef} className="eae-bs" aria-label={SHOWCASE_HEADING}>
    

      <div className="eae-bs-row">
        {Array.from({ length: slotCount }, (_, s) => (
          <div key={s} className="eae-bs-slot">
            {groups.map((group, g) => (
              <div
                key={`${g}-${group[s].name}`}
                ref={(node) => {
                  if (!itemRefs.current[g]) itemRefs.current[g] = [];
                  itemRefs.current[g][s] = node;
                }}
                className={`eae-bs-logo${g === 0 ? " is-active" : ""}`}
              >
                <LogoMark brand={group[s]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   4. CLIENT TESTIMONIALS
   ===================================================================== */

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* Client avatar: shows the company logo on the black circle.
   - whiteMask: single-colour logo drawn in white from the PNG's alpha channel
     (styles are inline, so no external CSS is needed for it to work).
   - otherwise a standard <img> in the logo's original colours.
   If there is no logo, or the file fails to load, the initials show instead,
   so an invisible logo is never rendered. */
function ClientAvatar({ item }: { item: Testimonial }) {
  const src = item.imageOnDark ?? item.image;
  const [failed, setFailed] = useState(false);

  // A CSS mask can't fire onError, so probe the file to keep the initials fallback.
  useEffect(() => {
    if (!src || !item.whiteMask) return;
    setFailed(false);
    const probe = new window.Image();
    probe.onerror = () => setFailed(true);
    probe.src = src;
    return () => {
      probe.onerror = null;
    };
  }, [src, item.whiteMask]);

  let content: ReactNode = getInitials(item.name);

  if (src && !failed) {
    content = item.whiteMask ? (
      <span
        className="eae-avatar-mask"
        style={{
          display: "block",
          width: "72%",
          height: "72%",
          backgroundColor: "#ffffff",
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="eae-avatar-logo"
        draggable={false}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="eae-avatar" aria-hidden="true">
      {content}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

/* =====================================================================
   3b. MOUSE REVEAL (Client Reviews only)
   =====================================================================
   A canvas that fills the review section, BEHIND the review content. Where
   nothing is revealed it paints nothing, so the section stays pure white.
   Where the cursor has been it shows a slowly drifting animated layer.

   1. A smoothed copy of the cursor follows the real pointer (exponential
      ease), so the reveal trails slightly and never jumps.
   2. Cursor speed -> "energy" (fast attack, slow release). Energy drives
      blob size and strength: a stopped cursor settles back to clean white.
   3. Each frame, soft radial blobs are stamped into an offscreen MASK along
      the path travelled, stretched in the direction of motion and jittered
      with sin() noise, so the edge is feathered and organic. The mask fades
      every frame, which is the trail.
   4. The animated layer is drawn, then clipped with `destination-in` + mask.

   It only listens to pointer movement. It never reads wheel/touch/keys, so
   it cannot advance reviews, and review transitions never restart it.
   Touch: tap-to-reveal. Reduced motion: disabled (clean white surface).
   ===================================================================== */

// Colours of the revealed layer only. The section background is untouched.
const REVEAL_COLORS = ["#bceae8", "#7fd6d1", "#f1dfdf", "#d7f1f7"];

const REVEAL = {
  scale: 0.5, // canvas resolution relative to CSS px
  follow: 0.1, // seconds: how loosely the reveal trails the cursor
  attack: 0.08, // seconds: energy rise time
  release: 0.6, // seconds: energy fall time (how soon it settles once stopped)
  trail: 0.28, // seconds: mask fade time constant (trail length)
  fullSpeed: 700, // px/s that counts as "full energy"
};

// The animated layer: slowly drifting colour blobs and a soft moving highlight.
function drawRevealLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = REVEAL_COLORS[3];
  ctx.fillRect(0, 0, w, h);

  const m = Math.max(w, h);
  const blobs = [
    { c: REVEAL_COLORS[0], fx: 0.23, fy: 0.31, px: 0.0, py: 1.2, r: 0.55 },
    { c: REVEAL_COLORS[1], fx: 0.17, fy: 0.27, px: 2.1, py: 0.4, r: 0.42 },
    { c: REVEAL_COLORS[2], fx: 0.29, fy: 0.19, px: 4.2, py: 2.6, r: 0.5 },
    { c: REVEAL_COLORS[0], fx: 0.13, fy: 0.35, px: 1.1, py: 3.3, r: 0.38 },
    { c: REVEAL_COLORS[1], fx: 0.21, fy: 0.15, px: 5.0, py: 0.9, r: 0.3 },
  ];

  for (const b of blobs) {
    const x = w * (0.5 + 0.45 * Math.sin(t * b.fx * 2 + b.px));
    const y = h * (0.5 + 0.45 * Math.cos(t * b.fy * 2 + b.py));
    const r = m * b.r;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, b.c);
    g.addColorStop(1, `${b.c}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // Soft highlight band drifting across the layer.
  const bx = ((t * 0.05) % 1) * w * 1.6 - w * 0.3;
  const band = ctx.createLinearGradient(bx, 0, bx + w * 0.35, h);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(255,255,255,0.35)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, w, h);
}

function MouseReveal({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    // Reduced motion: no effect at all, the surface simply stays clean white.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const dctx = canvas.getContext("2d");
      const mask = document.createElement("canvas");
      const mctx = mask.getContext("2d");
      if (!dctx || !mctx) return;

      const S = REVEAL.scale;
      let W = 1;
      let H = 1;

      // State (plain variables: no React updates on pointer movement).
      const pointer = { cx: 0, cy: 0, valid: false };
      let tap: { cx: number; cy: number } | null = null;
      let sx = 0, sy = 0; // smoothed position, section-relative CSS px
      let psx = 0, psy = 0; // previous smoothed position
      let heading = 0;
      let energy = 0;
      let wasInside = false;
      let time = 0;
      let lastStamp = -999;
      let idleCleared = true;
      let visible = false;

      const resize = () => {
        const r = section.getBoundingClientRect();
        W = Math.max(1, Math.round(r.width * S));
        H = Math.max(1, Math.round(r.height * S));
        canvas.width = mask.width = W;
        canvas.height = mask.height = H;
        idleCleared = false;
        lastStamp = -999;
      };

      const stamp = (x: number, y: number, r: number, a: number, e: number) => {
        mctx.save();
        mctx.translate(x * S, y * S);
        mctx.rotate(heading);
        // Stretch along the direction of travel for a fluid, organic feel.
        mctx.scale(1 + 0.55 * e, 1 / (1 + 0.25 * e));
        for (let i = 0; i < 3; i++) {
          const ang = time * (0.9 + 0.45 * i) + i * 2.1;
          const ox = Math.cos(ang) * r * 0.26 * S;
          const oy = Math.sin(ang * 1.3) * r * 0.26 * S;
          const rr = r * S * (0.78 + 0.22 * Math.sin(time * 1.7 + i * 1.9));
          const g = mctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
          g.addColorStop(0, `rgba(0,0,0,${a})`);
          g.addColorStop(0.45, `rgba(0,0,0,${a * 0.7})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          mctx.fillStyle = g;
          mctx.beginPath();
          mctx.arc(ox, oy, rr, 0, Math.PI * 2);
          mctx.fill();
        }
        mctx.restore();
      };

      const tick = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        if (dt <= 0) return;
        time += dt;

        // Pointer relative to THIS section, re-read every frame so the reveal
        // stays aligned while the page scrolls or the viewport resizes.
        const rect = section.getBoundingClientRect();
        const within = (cx: number, cy: number) =>
          cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
        const inside = pointer.valid && within(pointer.cx, pointer.cy);

        if (tap) {
          if (within(tap.cx, tap.cy)) {
            sx = psx = tap.cx - rect.left;
            sy = psy = tap.cy - rect.top;
            energy = 1;
          }
          tap = null;
        }

        if (inside) {
          const tx = pointer.cx - rect.left;
          const ty = pointer.cy - rect.top;
          if (!wasInside) {
            sx = psx = tx; // snap on entry so there is no sweep from an old spot
            sy = psy = ty;
          }
          const k = 1 - Math.exp(-dt / REVEAL.follow);
          sx += (tx - sx) * k;
          sy += (ty - sy) * k;
        }
        wasInside = inside;

        const dist = Math.hypot(sx - psx, sy - psy);
        const speed = dist / dt;
        const target = inside ? Math.pow(clamp(speed / REVEAL.fullSpeed), 0.7) : 0;
        const tau = target > energy ? REVEAL.attack : REVEAL.release;
        energy += (target - energy) * (1 - Math.exp(-dt / tau));
        if (dist > 0.5) heading = Math.atan2(sy - psy, sx - psx);

        const active = energy > 0.02 || time - lastStamp < 2;
        if (!active) {
          if (!idleCleared) {
            mctx.clearRect(0, 0, W, H);
            canvas.style.opacity = "0";
            idleCleared = true;
          }
          psx = sx;
          psy = sy;
          return;
        }

        // Fade the mask (this is the trail), then stamp along the path.
        mctx.globalCompositeOperation = "destination-out";
        mctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / REVEAL.trail)})`;
        mctx.fillRect(0, 0, W, H);
        mctx.globalCompositeOperation = "source-over";

        if (energy > 0.02) {
          const R = clamp(Math.min(rect.width, rect.height) * 0.3, 110, 300);
          const r = R * (0.35 + 0.65 * energy);
          const a = clamp(energy * 1.8) * 0.95;
          const steps = Math.min(24, Math.max(1, Math.ceil(dist / Math.max(4, r * 0.35))));
          for (let i = 1; i <= steps; i++) {
            const f = i / steps;
            stamp(psx + (sx - psx) * f, psy + (sy - psy) * f, r, a, energy);
          }
          lastStamp = time;
        }
        psx = sx;
        psy = sy;

        // Animated layer, clipped by the mask.
        dctx.globalCompositeOperation = "source-over";
        drawRevealLayer(dctx, W, H, time);
        dctx.globalCompositeOperation = "destination-in";
        dctx.drawImage(mask, 0, 0);
        dctx.globalCompositeOperation = "source-over";

        canvas.style.opacity = "1";
        idleCleared = false;
      };

      /* ---- Input: pointer only (never wheel / touchmove / keys) ---- */
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        pointer.cx = e.clientX;
        pointer.cy = e.clientY;
        pointer.valid = true;
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        tap = { cx: e.clientX, cy: e.clientY }; // tap-to-reveal on touch
      };
      const onLeave = () => {
        pointer.valid = false;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);

      const ro = new ResizeObserver(resize);
      ro.observe(section);
      resize();

      // Only work while the section is on screen.
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(section);

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
        canvas.style.opacity = "0";
      };
    });

    return () => mm.revert();
  }, [sectionRef]);

  return <canvas ref={canvasRef} className="eae-rv-canvas" aria-hidden="true" />;
}

/* ---------------------------------------------------------------------
   Tuning
   --------------------------------------------------------------------- */
const SLIDE_DURATION = 0.8; // seconds per horizontal transition
const SLIDE_EASE = "power3.inOut";
// The section counts as "active" (wheel/touch/keys control the reviews) once
// its top is within this many px of the viewport top and it still covers it.
const ENGAGE_TOP_PX = 48;
// Wheel: px of accumulated delta that count as an intentional gesture, and
// the pause (ms) between wheel events that separates one gesture from the next.
// Trackpad momentum is one gesture, so a single swipe moves exactly one review.
const WHEEL_THRESHOLD = 30;
const WHEEL_GESTURE_GAP_MS = 100;
const TOUCH_THRESHOLD = 40; // px swipe distance

type Step = 1 | -1; // 1 = next (enters from the right), -1 = previous (enters from the left)

function ClientTestimonials({ items }: { items: Testimonial[] }) {
  const count = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Source of truth for logic. React state is only mirrored for aria + the
  // arrow buttons, and is set once per transition (never per wheel event).
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const stepRef = useRef<((step: Step) => boolean) | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count === 0) return;

    indexRef.current = 0;
    busyRef.current = false;
    setActive(0);

    // Scopes every tween created below; revert() on cleanup kills them all.
    const ctx = gsap.context(() => {}, section);

    /* ---- One transition. Directions are explicit (not a reversed play) ---- */
    const step = (dir: Step): boolean => {
      if (busyRef.current) return false;

      const from = indexRef.current;
      const to = from + dir;
      if (to < 0 || to >= count) return false;

      const outgoing = slideRefs.current[from];
      const incoming = slideRefs.current[to];
      if (!outgoing || !incoming) return false;

      indexRef.current = to;
      setActive(to);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ctx.add(() => {
        // Reduced motion: swap instantly, still scroll-controlled.
        if (reduceMotion) {
          gsap.set(outgoing, { autoAlpha: 0, xPercent: 0 });
          gsap.set(incoming, { autoAlpha: 1, xPercent: 0 });
          return;
        }

        busyRef.current = true;
        const D = SLIDE_DURATION;

        gsap
          .timeline({
            onComplete: () => {
              busyRef.current = false;
            },
          })
          // Incoming: from the right (dir 1) or from the left (dir -1) to centre.
          .fromTo(
            incoming,
            { xPercent: 100 * dir },
            { xPercent: 0, duration: D, ease: SLIDE_EASE },
            0
          )
          .fromTo(
            incoming,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: D * 0.7, ease: "none" },
            0
          )
          // Outgoing: to the left (dir 1) or to the right (dir -1).
          .fromTo(
            outgoing,
            { xPercent: 0 },
            { xPercent: -100 * dir, duration: D, ease: SLIDE_EASE },
            0
          )
          .fromTo(
            outgoing,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: D * 0.7, ease: "none" },
            D * 0.3
          );
      });

      return true;
    };
    stepRef.current = step;

    /* ---- Is the review stage currently in control of the viewport? ---- */
    const isActive = () => {
      const r = section.getBoundingClientRect();
      return r.top <= ENGAGE_TOP_PX && r.bottom >= window.innerHeight - ENGAGE_TOP_PX;
    };

    // Don't hijack the wheel from an independently scrollable child.
    const canScrollInside = (target: EventTarget | null, delta: number) => {
      let node = target instanceof HTMLElement ? target : null;
      while (node && node !== section) {
        const oy = getComputedStyle(node).overflowY;
        if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight) {
          const atTop = node.scrollTop <= 0;
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
          if (delta < 0 ? !atTop : !atBottom) return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    /* ---- Wheel / trackpad ---------------------------------------------
       A "gesture" = a run of wheel events with gaps < WHEEL_GESTURE_GAP_MS.
       - A gesture that STARTS while the section is not active (e.g. the
         momentum that carried the page here) is ignored for its whole length.
       - An active gesture moves at most one review, then its remaining
         momentum is swallowed so it can't skip or scroll the page.
       - A gesture that would go past the first/last review is never
         intercepted, so the page scrolls on natively (no trap).
       ------------------------------------------------------------------ */
    let lastWheel = 0;
    let wArmed = false;
    let wConsumed = false;
    let acc = 0;

    const toPx = (e: WheelEvent, v: number) =>
      e.deltaMode === 1 ? v * 16 : e.deltaMode === 2 ? v * window.innerHeight : v;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom

      const now = performance.now();
      if (now - lastWheel > WHEEL_GESTURE_GAP_MS) {
        wArmed = isActive();
        wConsumed = false;
        acc = 0;
      }
      lastWheel = now;
      if (!wArmed) return;

      const dx = toPx(e, e.deltaX);
      const dy = toPx(e, e.deltaY);
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const delta = horizontal ? dx : dy;
      if (delta === 0) return;

      if (!horizontal && canScrollInside(e.target, delta)) {
        wArmed = false;
        return;
      }

      // Transition running, or momentum after one: swallow, don't advance again.
      if (wConsumed || busyRef.current) {
        wConsumed = true;
        if (e.cancelable) e.preventDefault();
        return;
      }

      const dir: Step = delta > 0 ? 1 : -1;
      const to = indexRef.current + dir;

      if (to < 0 || to >= count) {
        // Horizontal swipes can't leave the section vertically; swallow them
        // (also avoids the browser's back/forward swipe). Vertical ones leave.
        if (horizontal) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        wArmed = false; // native scroll takes over for this whole gesture
        return;
      }

      if (e.cancelable) e.preventDefault();
      acc += delta;
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        wConsumed = true;
        step(acc > 0 ? 1 : -1);
      }
    };

    /* ---- Touch: swipe up / left = next, swipe down / right = previous ---- */
    let tArmed = false;
    let tConsumed = false;
    let sx = 0;
    let sy = 0;

    const onTouchStart = (e: TouchEvent) => {
      tArmed = e.touches.length === 1 && isActive();
      tConsumed = false;
      if (tArmed) {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tArmed) return;
      if (e.touches.length !== 1) {
        tArmed = false;
        return;
      }
      const t = e.touches[0];
      const dx = sx - t.clientX;
      const dy = sy - t.clientY;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const d = horizontal ? dx : dy;
      if (d === 0) return;

      if (tConsumed || busyRef.current) {
        tConsumed = true;
        if (e.cancelable) e.preventDefault();
        return;
      }

      const dir: Step = d > 0 ? 1 : -1;
      const to = indexRef.current + dir;
      if (to < 0 || to >= count) {
        if (horizontal) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        tArmed = false; // let the page scroll out of the section
        return;
      }

      // Decided on the first move so the browser never starts a page scroll.
      if (e.cancelable) e.preventDefault();
      if (Math.abs(d) >= TOUCH_THRESHOLD) {
        tConsumed = true;
        step(dir);
      }
    };

    /* ---- Keyboard: Left / Right arrows while the section is active ---- */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!isActive()) return;
      if (step(e.key === "ArrowRight" ? 1 : -1)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      stepRef.current = null;
      ctx.revert();
      indexRef.current = 0;
      busyRef.current = false;
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="eae-showcase"
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <MouseReveal sectionRef={sectionRef} />

      <div className="eae-container">
        <div className="eae-header">
          <h2 className="eae-heading">What clients say about us</h2>
          <div className="eae-controls">
            <button
              type="button"
              className="eae-arrow"
              onClick={() => stepRef.current?.(-1)}
              disabled={active === 0}
              aria-label="Previous testimonial"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="eae-arrow"
              onClick={() => stepRef.current?.(1)}
              disabled={active === count - 1}
              aria-label="Next testimonial"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>

        {/* Stationary stage: every review shares one grid cell, so the stage is
            as tall as the tallest review and only the content slides. */}
        <div className="eae-viewport" aria-live="polite">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              className={`eae-slide${i === 0 ? " eae-slide--initial" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== active}
            >
              <div className="eae-content">
                <div className="eae-person">
                  <ClientAvatar item={item} />
                  <div>
                    <p className="eae-name">{item.name}</p>
                    <p className="eae-meta">{item.role}</p>
                    <p className="eae-meta">{item.company}</p>
                  </div>
                </div>

                <blockquote className="eae-quote">{item.review}</blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   5. STYLES (scoped with the "eae-" prefix)
   ===================================================================== */

const STYLES = `
/* Scroll text reveal */
.eae-reveal {
  position: relative;
  background: #000000;
  height: 300vh;
}
.eae-reveal-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  overflow: hidden;
  padding: 0 clamp(20px, 6vw, 96px);
  box-sizing: border-box;
}
.eae-reveal-text {
  margin: 0;
  width: 100%;
  max-width: 1000px;
  text-align: left;
  font-family: inherit;
  font-weight: 300;
  font-size: clamp(28px, 2.8vw, 44px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  overflow-wrap: break-word;
}
/* Keeps each word intact so lines break between words only */
.eae-word { display: inline-block; white-space: nowrap; }
.eae-char { color: #454545; }
.eae-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 1024px) {
  .eae-reveal-text { font-size: clamp(24px, 3.6vw, 34px); }
}
@media (max-width: 640px) {
  .eae-reveal { height: 240vh; }
  .eae-reveal-text {
    font-size: clamp(22px, 5.8vw, 28px);
    line-height: 1.22;
  }
}
@media (prefers-reduced-motion: reduce) {
  .eae-reveal { height: auto; }
  .eae-reveal-sticky {
    position: relative;
    height: auto;
    min-height: 100svh;
    padding-top: 80px;
    padding-bottom: 80px;
  }
}

/* Testimonials section background: shares LIGHT.bg with the showcase theme */
.eae-showcase {
  background: ${THEME_LIGHT.bg};
  position: relative;
  isolation: isolate;
  color: #d7f1f7;
  padding: clamp(80px, 10vw, 160px) 0 clamp(56px, 8vw, 120px);
  overflow-x: clip;
  font-family: inherit;
  /* Full-height stage so the section can align with the viewport while the
     reviews are scroll-controlled */
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Brand showcase: six clipped slots, logos swap with a staggered slide.
   --bs-bg / --bs-fg default to the black theme (matches Section 1) so the
   very first paint is correct. GSAP overrides them inline while scrolling. */
.eae-bs {
  --bs-bg: ${THEME_DARK.bg};
  --bs-fg: ${THEME_DARK.fg};
  --bs-fs: clamp(18px, 2.3vw, 40px); /* base logo size, everything scales from it */
  --bs-h: clamp(56px, 5.6vw, 96px);  /* slot height */
  background: var(--bs-bg);
  color: var(--bs-fg);
  padding: clamp(28px, 3vw, 48px) clamp(16px, 2vw, 32px) clamp(48px, 6vw, 96px);
  font-family: inherit;
  overflow: hidden;
}
/* Binary light state: toggled by the scroll trigger, never animated */
.eae-bs.is-light {
  --bs-bg: ${THEME_LIGHT.bg};
  --bs-fg: ${THEME_LIGHT.fg};
}
.eae-bs-heading {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 clamp(36px, 6vw, 96px);
  font-size: clamp(12px, 1.1vw, 15px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--bs-fg);
}
.eae-bs-brace {
  font-size: 2.6em;
  font-weight: 200;
  line-height: 0.7;
  transform: scaleX(0.7);
}
.eae-bs-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(12px, 2vw, 32px);
}
.eae-bs-slot {
  position: relative;
  height: var(--bs-h);
  overflow: hidden; /* each logo is clipped to its own slot */
}
.eae-bs-logo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  visibility: hidden; /* GSAP reveals each logo with autoAlpha */
  opacity: 0;
  will-change: transform, opacity;
}
.eae-bs-logo.is-active { visibility: visible; opacity: 1; }

/* Text-based logo marks. Swap in real SVGs through the "src" field in BRAND_GROUPS. */
.eae-mk {
  display: inline-flex;
  align-items: center;
  font-size: var(--bs-fs);
  line-height: 1;
  white-space: nowrap;
  color: var(--bs-fg);
}
.eae-bs-mask {
  display: block;
  width: calc(var(--bs-fs) * 4);
  height: calc(var(--bs-fs) * 1.2);
  background: var(--bs-fg);
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: left center; mask-position: left center;
  -webkit-mask-size: contain; mask-size: contain;
}
.eae-bs-brand-image {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
  user-select: none;
  pointer-events: none;
  transform: scale(var(--bs-logo-scale, 1));
  transform-origin: left center;
}
/* Theme-coloured logos: the PNG's alpha channel is the shape, --bs-fg the colour */
.eae-bs-brand-theme {
  background-color: var(--bs-fg);
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: left center; mask-position: left center;
  -webkit-mask-size: contain; mask-size: contain;
}
.eae-mk-intel { font-weight: 700; letter-spacing: -0.05em; font-size: calc(var(--bs-fs) * 1.1); }
.eae-mk-youtube, .eae-mk-yt { font-weight: 700; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 0.85); }
.eae-mk-yt-box {
  margin-left: 0.12em;
  padding: 0.1em 0.22em;
  border-radius: 0.28em;
  background: var(--bs-fg);
  color: var(--bs-bg);
}
.eae-mk-netflix { font-weight: 800; letter-spacing: 0.02em; font-size: calc(var(--bs-fs) * 0.8); }
.eae-mk-amz { flex-direction: column; align-items: flex-start; gap: 0; font-weight: 700; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 1); }
.eae-mk-amz i {
  display: block;
  width: 70%;
  height: 0.3em;
  margin: -0.08em 0 0 0.35em;
  border-bottom: 0.09em solid var(--bs-fg);
  border-radius: 0 0 60% 60%;
}
.eae-mk-ford {
  padding: 0.1em 0.7em 0.16em;
  border: 0.07em solid var(--bs-fg);
  border-radius: 50%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 700;
  font-size: calc(var(--bs-fs) * 0.8);
}
.eae-mk-samsung {
  padding: 0.35em 1em;
  border-radius: 50%;
  background: var(--bs-fg);
  color: var(--bs-bg);
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: calc(var(--bs-fs) * 0.5);
}
.eae-mk-ea { flex-direction: column; align-items: flex-start; font-style: italic; font-weight: 800; font-size: calc(var(--bs-fs) * 0.95); }
.eae-mk-ea small { font-size: 0.34em; font-style: normal; font-weight: 600; letter-spacing: 0.08em; margin-top: 0.15em; }
.eae-mk-nike { font-style: italic; font-weight: 900; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 0.9); }
.eae-mk-aol { font-weight: 800; letter-spacing: -0.02em; font-size: calc(var(--bs-fs) * 1); }
.eae-mk-gucci { font-family: Georgia, "Times New Roman", serif; font-weight: 300; letter-spacing: 0.03em; font-size: calc(var(--bs-fs) * 0.95); }
.eae-mk-mcd svg {
  width: calc(var(--bs-fs) * 0.95);
  height: calc(var(--bs-fs) * 0.8);
  fill: none;
  stroke: var(--bs-fg);
  stroke-width: 3.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  overflow: visible;
}
.eae-mk-ms { gap: 0.25em; font-weight: 500; font-size: calc(var(--bs-fs) * 0.72); }
.eae-mk-ms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.09em;
  width: 1.15em;
  height: 1.15em;
}
.eae-mk-ms-grid b { display: block; background: var(--bs-fg); }

/* Tablet and phone: same six slots, laid out as 3 x 2 so nothing overflows */
@media (max-width: 900px) {
  .eae-bs { --bs-fs: clamp(20px, 5.2vw, 34px); --bs-h: clamp(56px, 12vw, 84px); }
  .eae-bs-row { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: clamp(8px, 3vw, 24px); }
}

/* Reduced motion: the first group stays put, nothing animates */
@media (prefers-reduced-motion: reduce) {
  .eae-bs-logo { transition: none; }
}

/* Testimonials */
.eae-container {
  position: relative;
  z-index: 1; /* review content stays above the reveal layer */
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) clamp(20px, 5vw, 48px) 0;
  box-sizing: border-box;
}
.eae-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(40px, 6vw, 80px);
}
.eae-heading {
  margin: 0;
  font-size: clamp(30px, 4.2vw, 52px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #000000;
}
.eae-controls { display: flex; gap: 12px; flex-shrink: 0; }
.eae-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 180ms ease, transform 180ms ease;
}
.eae-arrow:hover { background: #3d3d3d; transform: scale(1.06); }
.eae-arrow:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }

.eae-content {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
  min-height: 280px;
}
.eae-person { display: flex; align-items: center; gap: 20px; }
.eae-avatar {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  overflow: hidden;
}
.eae-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Logo inside the avatar: whole logo visible, centred, original colours */
.eae-avatar .eae-avatar-logo {
  padding: 14%;
  box-sizing: border-box;
  object-fit: contain;
  object-position: center;
}
/* Single-colour logo drawn in white: PNG alpha is the shape */
.eae-avatar .eae-avatar-mask {
  display: block;
  width: 72%;
  height: 72%;
  background-color: #ffffff;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: center; mask-position: center;
  -webkit-mask-size: contain; mask-size: contain;
}
.eae-name { margin: 0; font-size: 20px; font-weight: 600; color: #444141; }
.eae-meta { margin: 4px 0 0; font-size: 16px; line-height: 1.4; color: #4b4545; }
.eae-quote {
  margin: 0;
  max-width: 680px;
  font-size: clamp(20px, 2.5vw, 34px);
  font-weight: 400;
  line-height: 1.4;
  color: #292626;
  text-align: left;
}
/* Mouse-reveal layer: behind the review content, transparent until revealed */
.eae-rv-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

/* Review stage: stationary, clipped, all slides share one grid cell */
.eae-viewport {
  position: relative;
  overflow: hidden;
  display: grid;
}
.eae-slide {
  grid-area: 1 / 1;
  min-width: 0;
  visibility: hidden; /* GSAP reveals slides with autoAlpha */
  opacity: 0;
  will-change: transform, opacity;
}
.eae-slide--initial { visibility: visible; opacity: 1; } /* first review: visible on first paint */
.eae-arrow:disabled { opacity: 0.35; cursor: default; }
.eae-arrow:disabled:hover { background: #000000; transform: none; }

/* Responsive */
@media (max-width: 900px) {
  .eae-content { grid-template-columns: 1fr; min-height: 0; }
}
@media (max-width: 640px) {
  .eae-header { align-items: flex-start; gap: 16px; }
  .eae-person { gap: 16px; }
  .eae-arrow { width: 44px; height: 44px; }
  .eae-avatar { width: 64px; height: 64px; font-size: 20px; }
}

/* ---------------------------------------------------------------
   Extra responsive tuning (CSS only: no JS, timeline or theme changes)
   --------------------------------------------------------------- */

/* Very large screens: keep the logo row from stretching edge to edge */
@media (min-width: 1800px) {
  .eae-bs-row { max-width: 1760px; margin-inline: auto; }
  .eae-reveal-text { max-width: 1100px; }
}

/* Small laptops / large tablets */
@media (max-width: 1200px) {
  .eae-content { gap: clamp(28px, 5vw, 64px); }
}

/* Tablets and below */
@media (max-width: 900px) {
  .eae-bs { padding-inline: clamp(16px, 4vw, 32px); }
  .eae-showcase { padding: clamp(56px, 12vw, 96px) 0 clamp(40px, 8vw, 72px); }
  .eae-container { padding-top: clamp(32px, 6vw, 64px); }
  .eae-header { margin-bottom: clamp(28px, 5vw, 48px); }
  .eae-quote { max-width: none; }
}

/* Phones */
@media (max-width: 640px) {
  .eae-bs { --bs-h: clamp(48px, 13vw, 68px); padding-inline: 16px; }
  .eae-bs-row { column-gap: 12px; }
  .eae-heading { font-size: clamp(26px, 7.4vw, 34px); }
  .eae-quote { font-size: clamp(18px, 4.8vw, 24px); line-height: 1.45; }
  .eae-name { font-size: 18px; }
  .eae-meta { font-size: 15px; }
  .eae-controls { gap: 10px; }
}

/* Very small phones: 2 x 3 logo grid so each logo keeps a readable size */
@media (max-width: 360px) {
  .eae-bs-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eae-container { padding-inline: 16px; }
}

/* Short landscape screens (phones turned sideways, small windows) */
@media (max-height: 560px) {
  .eae-showcase { padding: 24px 0; }
  .eae-container { padding-top: 16px; }
  .eae-header { margin-bottom: 20px; }
  .eae-content { min-height: 0; gap: 24px; }
  .eae-quote { font-size: clamp(16px, 2.4vw, 22px); }
  .eae-reveal-text { font-size: clamp(20px, 3.4vw, 30px); }
}

/* Touch screens: no sticky hover state on the arrow buttons */
@media (hover: none) {
  .eae-arrow:hover { background: #000000; transform: none; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .eae-arrow { transition: none; }
}
`;

/* =====================================================================
   6. PAGE
   ===================================================================== */

export default function EmpireAEIntroPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <ScrollTextReveal />

      <BrandShowcase groups={BRAND_GROUPS} />

      <ClientTestimonials items={TESTIMONIALS} />

    </>
  );
}