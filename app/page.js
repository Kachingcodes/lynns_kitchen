"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";

export default function Home() {
  const [activeBtn, setActiveBtn] = useState("customer");

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">

        {/* =====================================================
            LEFT SIDE — BRAND & CONTENT
        ====================================================== */}
        <div className="relative z-10 flex min-h-screen flex-col overflow-hidden bg-background px-6 sm:px-10 md:bg-background/90 lg:bg-transparent lg:px-16 xl:px-24">

          {/* Decorative background */}
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />


          {/* ===================================================
              Navigation
          ==================================================== */}
          <header className="relative z-20 flex items-center justify-between py-7">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">

              <div className="relative flex h-16 w-16 items-center justify-center">
                <Image
                  src="/images/lynn.png"
                  alt="Lynn's Kitchen"
                  width={94}
                  height={94}
                  priority
                  className="object-contain rounded-md"
                />
              </div>

              <div className="hidden sm:block">
                <p className="font-logo text-2xl leading-none text-primary">
                  Lynn's Kitchen
                </p>
              </div>

            </Link>


            {/* Customer / Waiter */}
            {/* <div className="flex items-center rounded-full border border-border bg-white p-1 shadow-sm">

              <button
                onClick={() => setActiveBtn("customer")}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
                  activeBtn === "customer"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Customer
              </button>

              <Link
                href="/waiter"
                onClick={() => setActiveBtn("waiter")}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
                  activeBtn === "waiter"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Waiter
              </Link>

            </div> */}

          </header>


          {/* ===================================================
              HERO CONTENT
          ==================================================== */}
          <section className="absolute inset-0 z-10 flex items-center px-6 sm:px-10 lg:px-16 xl:px-24">

            <div className="w-full max-w-lg lg:max-w-xl">

              {/* Small label */}
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Modern Fusion Cuisine
                </p>
              </div>

              {/* Main Heading */}
              <h1 className="font-heading text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-7xl xl:text-8xl">
                A taste worth 

                <span className="font-logo mt-3 block text-primary">
                  staying for.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 lg:max-w-md text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">
                A modern dining experience where bold flavours, carefully
                crafted dishes, and beautiful moments come together.
              </p>


              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">

                <Link
                  href="/customer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Explore Our Menu

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>


                <Link
                  href="/customer/track"
                  className="group inline-flex items-center justify-center border-2 border-background rounded-full gap-2 px-4 py-3 text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 hover:translate-y-1 hover:shadow-xl"
                >
                  Track your order

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>


              {/* Small Feature */}
              <div className="mt-10 flex items-center gap-4 border-t border-border pt-6 sm:mt-14 sm:pt-7">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Utensils size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Made for memorable moments
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Good food. Great flavours. Beautiful experiences.
                  </p>
                </div>

              </div>

            </div>

          </section>


          {/* ===================================================
              FOOTER — FIXED AT BOTTOM OF LEFT SIDE
          ==================================================== */}
          <footer className="relative z-20 mt-auto pb-7">

            <div className="flex items-center justify-between border-t border-border pt-5">

              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Lynn's Kitchen
              </p>

              <p className="text-xs text-muted-foreground">
                Powered by{" "}
                <span className="font-medium text-primary">
                  Chowdy
                </span>
              </p>

            </div>

          </footer>

        </div>


        {/* =====================================================
            RIGHT SIDE — RESTAURANT IMAGE
        ====================================================== */}
        <div className="absolute inset-0 z-0 hidden min-h-screen overflow-hidden md:block lg:relative lg:inset-auto lg:z-auto">
          <Image
            src="/images/bg.png"
            alt="Lynn's Kitchen restaurant interior"
            fill
            priority
            sizes="55vw"
            className="object-cover"
          />


          {/* ===================================================
              BLENDED LEFT EDGE

              This removes the hard straight divide.
          ==================================================== */}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-background via-background/10 to-transparent xl:w-4" />


          {/* Image atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/35 via-transparent to-black/15" />


          {/* ===================================================
              FLOATING BRAND CARD
          ==================================================== */}
          <div className="absolute bottom-10 left-10 right-10">

            <div className="max-w-md border border-white/20 bg-black/35 p-7 text-white backdrop-blur-md">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
                Lynn's Kitchen
              </p>

              <h2 className="font-heading mt-4 text-3xl leading-tight">
                Where flavour meets imagination.
              </h2>

              <div className="mt-5 h-px w-12 bg-gold" />

              <p className="mt-5 text-sm leading-7 text-white/70">
                Discover dishes inspired by different cultures and crafted
                into something uniquely Lynn's.
              </p>

            </div>

          </div>


          {/* ===================================================
              VERTICAL LABEL
          ==================================================== */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2">

            <p className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/50">
              Modern Fusion Cuisine
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}
