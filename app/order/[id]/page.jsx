"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import confetti from "canvas-confetti";
import Link from "next/link";


import {
  CheckCircle2,
  Clock,
  User,
  Utensils,
  MessageSquare,
  Send,
  Star,
  Receipt,
  Sparkles,
  ConciergeBell,
  PartyPopper,
} from "lucide-react";

import { toast } from "react-toastify";


export default function OrderPage({ params }) {

  const router = useRouter();

  const [activeBtn, setActiveBtn] = useState("customer")
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);


  const [complaint, setComplaint] = useState("");

  const [
    submittingComplaint,
    setSubmittingComplaint,
  ] = useState(false);


  const [rating, setRating] = useState(0);

  const [
    ratingComment,
    setRatingComment,
  ] = useState("");

  const [
    submittingRating,
    setSubmittingRating,
  ] = useState(false);


  const [
    ratingSubmitted,
    setRatingSubmitted,
  ] = useState(false);


  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(null);



  /*
    LOAD ORDER
  */

  useEffect(() => {

    const loadOrder = async () => {

      try {

        const resolvedParams = await params;


        const response = await fetch(
          `/api/orders/${resolvedParams.id}`
        );


        const data = await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Failed to load order"
          );

        }


        setOrder(data);


      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };


    loadOrder();


    const interval = setInterval(
      loadOrder,
      5000
    );


    return () => clearInterval(interval);


  }, [params]);

  /*
    COMPLAINT
  */

  const handleComplaintSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (!complaint.trim()) {

      toast.error(
        "Please enter your complaint"
      );

      return;

    }


    setSubmittingComplaint(true);


    try {

      const response = await fetch(
        "/api/complaints",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            orderId: order.id,

            customerId:
              order.customer_id,

            description: complaint,

          }),

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to submit complaint"
        );

      }


      toast.success(
        "Your complaint has been submitted"
      );


      setComplaint("");


    } catch (error) {

      console.error(error);

      toast.error(error.message);


    } finally {

      setSubmittingComplaint(false);

    }

  };

  /*
    COUNTDOWN
  */

  useEffect(() => {

    if (

      !order ||

      order.status !== "preparing" ||

      !order.preparing_started_at

    ) {

      setRemainingSeconds(null);

      return;

    }


    const updateCountdown = () => {

      const startedAt = new Date(
        order.preparing_started_at
      ).getTime();


      const durationMinutes =

        Number(order.actual_wait_minutes) ||

        Number(
          order.estimated_wait_minutes
        );


      if (

        Number.isNaN(startedAt) ||

        !durationMinutes

      ) {

        setRemainingSeconds(null);

        return;

      }


      const endTime =

        startedAt +

        durationMinutes * 60 * 1000;


      const remaining = Math.max(

        0,

        Math.floor(
          (endTime - Date.now()) / 1000
        )

      );


      setRemainingSeconds(remaining);

    };


    updateCountdown();


    const interval = setInterval(
      updateCountdown,
      1000
    );


    return () =>
      clearInterval(interval);


  }, [

    order?.status,

    order?.preparing_started_at,

    order?.actual_wait_minutes,

    order?.estimated_wait_minutes,

  ]);


  /*
    FORMAT COUNTDOWN
  */

  const formatCountdown = (
    seconds
  ) => {

    if (

      seconds === null ||

      seconds === undefined ||

      Number.isNaN(seconds)

    ) {

      return "--:--";

    }


    const minutes =
      Math.floor(seconds / 60);


    const remaining =
      seconds % 60;


    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;

  };


  /*
    RATING
  */

  const handleRatingSubmit = async () => {

    if (!rating) {

      toast.error(
        "Please select a rating"
      );

      return;

    }

    setSubmittingRating(true);

    try {

      const response = await fetch(
        "/api/ratings",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            orderId: order.id,

            customerId:
              order.customer_id,

            ratingValue:
              rating,

            comment:
              ratingComment,

          }),

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to submit rating"
        );

      }


      /*  SHOW SUCCESS SCREEN  */

      setRatingSubmitted(true);

      confetti({

        particleCount: 150,

        spread: 100,

        origin: {
          y: 0.6,
        },

      });

      setTimeout(() => {

        confetti({

          particleCount: 80,

          angle: 60,

          spread: 55,

          origin: {
            x: 0,
            y: 0.7,
          },

        });


        confetti({

          particleCount: 80,

          angle: 120,

          spread: 55,

          origin: {
            x: 1,
            y: 0.7,
          },

        });

      }, 300);


      setTimeout(() => {

        router.push("/customer");

      }, 4000);


    } catch (error) {

      console.error(error);

      toast.error(error.message);


    } finally {

      setSubmittingRating(false);

    }

  };


  /*
    LOADING
  */

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-background">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">

            <Clock className="h-6 w-6 animate-spin text-primary" />

          </div>


          <p className="mt-4 text-sm text-muted-foreground">

            Loading your order...

          </p>

        </div>

      </main>

    );

  }


  /*
    ORDER NOT FOUND
  */

  if (!order) {

    return (

      <main className="flex min-h-screen items-center justify-center">

        <p className="text-muted-foreground">

          Order not found.

        </p>

      </main>

    );

  }



  /*
    TOTAL
  */

  const totalAmount =
    order.items.reduce(

      (total, item) =>

        total +
        Number(item.subtotal_naira),

      0

    );


  return (

    <main className="min-h-screen bg-background">


      {/* ================= HEADER ================= */}

      <header className="border-b border-border bg-card/80 backdrop-blur">

        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-5">

          {/* Restaurant Info */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:h-14 sm:w-16">

              <Image
                src="/images/lynn.png"
                alt="Lynn's Kitchen"
                width={100}
                height={100}
                priority
                sizes="48px"
                className="rounded-full object-contain"
              />

            </div>

            <div className="min-w-0">

              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-foreground sm:text-xs">
                Lynn's Kitchen
              </p>

              <h1 className="truncate text-sm font-semibold text-muted-foreground sm:text-base">
                Order #{order.id}
              </h1>

            </div>

          </div>


          {/* Right Side */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

            {/* Table */}
            <div className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm">
              Table {order.table_number}
            </div>


            {/* Customer / Waiter Toggle */}
            <div className="flex items-center rounded-full bg-background p-1 backdrop-blur-md">

              {/* Customer */}
              <Link
                href={`/order/${order.id}`}
                onClick={() => setActiveBtn("customer")}
                aria-label="Customer"
                title="Customer"
                className={`flex items-center justify-center rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-300 sm:px-4 ${
                  activeBtn === "customer"
                    ? "bg-primary text-white shadow-lg"
                    : "text-black hover:text-foreground"
                }`}
              >

                <User className="h-4 w-4 sm:hidden" />

                <span className="hidden sm:block">
                  Customer
                </span>

              </Link>


              {/* Waiter */}
              <Link
                href="/waiter"
                onClick={() => setActiveBtn("waiter")}
                aria-label="Waiter"
                title="Waiter"
                className={`flex items-center justify-center rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-300 sm:px-4 ${
                  activeBtn === "waiter"
                    ? "bg-primary text-white shadow-lg"
                    : "text-black hover:text-foreground"
                }`}
              >

                <ConciergeBell className="h-4 w-4 sm:hidden" />

                <span className="hidden sm:block">
                  Waiter
                </span>

              </Link>

            </div>

          </div>

        </div>

      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-12">


        {/* ================= PAYMENT SUCCESS ================= */}

        {order.status === "paid" ? (

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">


            {/* ========================================= */}
            {/* LEFT — PAYMENT + RATING */}
            {/* ========================================= */}

            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">


              {!ratingSubmitted ? (

                <div className="p-4 text-center sm:p-6 lg:p-8">


                  {/* SUCCESS ICON */}

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 sm:h-20 sm:w-20">

                    <CheckCircle2 className="h-6 w-6 lg:h-10 lg:w-10 text-green-600" />

                  </div>


                  {/* PAYMENT STATUS */}

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-green-600">

                    Payment Successful

                  </p>

                  <h2 className="mt-3 text-xl lg:text-3xl font-bold tracking-tight text-foreground sm:text-4xl">

                    Payment has been made

                  </h2>


                  <p className="mx-auto mt-3 max-w-md text-sm lg:text-md text-muted-foreground">

                    Thank you for dining with us.
                    We hope you enjoyed your experience.

                  </p>

                  {/* DIVIDER */}

                  <div className="mx-auto my-6 lg:my-10 max-w-md border-t border-border" />


                  {/* RATING */}

                  <div className="mx-auto max-w-lg">


                    <div className="flex justify-center">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                        <Sparkles className="h-6 w-6" />

                      </div>

                    </div>


                    <h3 className="mt-5 text-xl font-bold text-foreground">

                      How was your experience?

                    </h3>


                    <p className="mt-2 text-sm text-muted-foreground">

                      Your feedback helps us serve you better.

                    </p>

                    {/* STARS */}

                    <div className="mt-4 lg:mt-7 flex justify-center gap-2 sm:gap-3">


                      {[1, 2, 3, 4, 5].map((star) => (

                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="group transition duration-200 hover:scale-110"
                        >

                          <Star
                            className={`h-8 w-8 lg:h-9 lg:w-9 transition sm:h-10 sm:w-10 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/20 group-hover:text-yellow-400/50"
                            }`}
                          />

                        </button>

                      ))}


                    </div>



                    {/* RATING MESSAGE */}

                    {rating > 0 && (

                      <p className="mt-4 lg:mt-5 font-semibold text-primary">

                        {rating === 1 &&
                          "We're sorry your experience wasn't great."}

                        {rating === 2 &&
                          "We appreciate your honest feedback."}

                        {rating === 3 &&
                          "Thank you for sharing your experience."}

                        {rating === 4 &&
                          "We're glad you enjoyed your visit!"}

                        {rating === 5 &&
                          "We're thrilled you loved your experience!"}

                      </p>

                    )}



                    {/* COMMENT */}

                    <textarea
                      value={ratingComment}

                      onChange={(event) =>
                        setRatingComment(event.target.value)
                      }

                      placeholder="Tell us more about your experience (optional)"

                      rows={4}

                      className="mt-5 lg:mt-7 w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-sm outline-none transition focus:border-primary"
                    />



                    {/* SUBMIT */}

                    <button
                      type="button"

                      onClick={handleRatingSubmit}

                      disabled={
                        submittingRating ||
                        rating === 0
                      }

                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <Star className="h-4 w-4" />

                      {submittingRating
                        ? "Submitting..."
                        : "Submit Review"}

                    </button>


                  </div>

                </div>

              ) : (

                /* ========================================= */
                /* RATING SUCCESS */
                /* ========================================= */

                <div className="flex min-h-[600px] flex-col items-center justify-center px-6 py-16 text-center">


                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">

                    <PartyPopper className="h-12 w-12" />

                  </div>


                  <h2 className="mt-8 text-4xl font-bold tracking-tight text-foreground">

                    Thank You! 🎉

                  </h2>


                  <p className="mx-auto mt-4 max-w-md text-muted-foreground">

                    Your review means a lot to us.
                    Thank you for taking the time to
                    share your experience.

                  </p>


                  {/* SELECTED RATING */}

                  <div className="mt-8 flex gap-2">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <Star
                        key={star}

                        className={`h-7 w-7 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/20"
                        }`}
                      />

                    ))}

                  </div>


                  <p className="mt-10 text-sm text-muted-foreground">
                    Taking you back to the menu...
                  </p>

                </div>

              )}

            </div>



            {/* ========================================= */}
            {/* RIGHT — ORDER DETAILS */}
            {/* ========================================= */}

            <aside className="lg:sticky lg:top-6">


              <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">


                {/* HEADER */}

                <div className="border-b border-border px-6 py-6">


                  <div className="flex items-center gap-3">


                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                      <Receipt className="h-5 w-5" />

                    </div>


                    <div>

                      <h2 className="font-semibold text-foreground">

                        Your Order

                      </h2>


                      <p className="text-sm text-muted-foreground">

                        Order #{order.id}

                      </p>

                    </div>

                  </div>


                  {/* TABLE */}

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">

                    <span className="text-sm text-muted-foreground">
                      Table
                    </span>

                    <span className="font-semibold text-foreground">
                      {order.table_number}
                    </span>
                  </div>

                </div>


                {/* ITEMS */}

                <div className="max-h-[400px] divide-y divide-border overflow-y-auto">


                  {order.items.map((item) => (

                    <div
                      key={item.id}

                      className="flex items-start justify-between gap-4 px-6 py-5"
                    >


                      <div className="min-w-0">


                        <p className="font-semibold text-foreground">

                          {item.quantity} × {item.name}

                        </p>


                        <p className="mt-1 text-sm text-muted-foreground">

                          ₦{Number(
                            item.unit_price_naira
                          ).toLocaleString()} each

                        </p>
                      </div>

                      <p className="shrink-0 font-semibold text-primary">

                        ₦{Number(
                          item.subtotal_naira
                        ).toLocaleString()}

                      </p>

                    </div>

                  ))}


                </div>

                {/* TOTAL */}

                <div className="border-t border-border bg-secondary/50 px-6 py-6">


                  <div className="flex items-center justify-between">


                    <div>

                      <p className="text-sm text-muted-foreground">

                        Total Paid

                      </p>


                      <p className="mt-1 text-xl lg:text-2xl font-bold text-foreground">

                        ₦{totalAmount.toLocaleString()}

                      </p>


                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">

                      <CheckCircle2 className="h-6 w-6 text-green-600" />

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </section>

        ) : (
          /* ================= ORDER TRACKING ================= */

          <>

            {/* STATUS HERO */}

            <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-12">

              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative text-center">


                {/* ICON */}

                <div className="mx-auto flex h-12 w-12 lg:h-20 lg:w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">

                  {order.status === "preparing" ? (

                    <ChefHat className="h-8 w-8 lg:h-10 lg:w-10" />
                  
                  ) : order.status === "ready" ? (

                    <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-orange-500"/>

                  ) : order.status === "served" ? (

                    <CheckCircle2 className="h-8 w-8 lg:h-10 lg:w-10 text-green-600" />

                  ) : (

                    <Clock className="h-8 w-8 lg:h-10 lg:w-10" />

                  )}

                </div>


                {/* STATUS LABEL */}

                <p className="mt-5 lg:mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">

                  {order.status === "pending" &&
                    "Order Received"}

                  {order.status === "preparing" &&
                    "Currently Preparing"}

                  {order.status === "ready" &&
                    "Ready"}

                  {order.status === "served" &&
                    "Order Served"}

                </p>


                {/* MAIN CONTENT */}

                {order.status === "served" ? (

                  <>

                    <h2 className="mt-4 text-2xl lg:text-4xl font-bold tracking-tight sm:text-5xl">
                      Enjoy your meal! 
                    </h2>


                    <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                      Your order has been served.
                      We hope you enjoy every bite!
                    </p>

                  </>

                ) : order.status === "ready" ? (

                  <>
                    <h2 className="mt-4 text-2xl lg:text-4xl font-bold tracking-tight text-orange-500 sm:text-6xl">

                      Your Order Is Ready! 

                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                      Your food is ready and waiting for you.
                      Your waiter will serve you shortly.
                    </p>

                  </>

                ) : (

                  <>

                    <div className="mt-3 lg:mt-5 text-4xl lg:text-6xl font-bold tracking-tight text-primary sm:text-8xl">

                      {order.status === "preparing"

                        ? formatCountdown(
                            remainingSeconds
                          )

                        : order.estimated_wait_minutes}

                    </div>


                    <p className="mt-3 text-lg font-semibold">

                      {order.status === "preparing"

                        ? "Minutes : Seconds"

                        : "Estimated Minutes"}

                    </p>


                    <p className="mx-auto mt-4 lg:mt-6 max-w-md text-sm text-muted-foreground">

                      {order.status === "pending" &&
                        "Your order is waiting to be sent to the kitchen."}

                      {order.status === "preparing" &&
                        "Our kitchen is freshly preparing your food."}

                    </p>

                  </>

                )}

              </div>

            </section>


            {/* CUSTOMER INFO */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-3xl border border-border bg-card p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">

                    <User className="h-5 w-5 text-primary" />

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {order.customer_name}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-border bg-card p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">

                    <Utensils className="h-5 w-5 text-primary" />

                  </div>

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Table

                    </p>


                    <p className="font-semibold">

                      Table {order.table_number}

                    </p>

                  </div>

                </div>

              </div>


            </section>


          </>

        )}



        {/* ================= ORDER SUMMARY ================= */}

        {order.status !== "paid" && (

          <section className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-card">

            <div className="flex items-center gap-3 border-b border-border px-6 py-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                <Receipt className="h-5 w-5" />

              </div>


              <div>

                <h2 className="font-semibold">

                  Order Summary

                </h2>


                <p className="text-sm text-muted-foreground">

                  {order.items.length} item
                  {order.items.length !== 1
                    ? "s"
                    : ""}

                </p>

              </div>

            </div>

            <div className="divide-y divide-border">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >

                  <div>

                    <p className="font-semibold">

                      {item.quantity} × {item.name}

                    </p>


                    <p className="mt-1 text-sm text-muted-foreground">

                      ₦{Number(
                        item.unit_price_naira
                      ).toLocaleString()} each

                    </p>

                  </div>


                  <p className="font-semibold text-primary">

                    ₦{Number(
                      item.subtotal_naira
                    ).toLocaleString()}

                  </p>

                </div>

              ))}

            </div>



            {/* TOTAL */}

            <div className="flex items-center justify-between bg-secondary/50 px-6 py-6">

              <p className="text-lg font-bold">

                Total

              </p>


              <p className="text-2xl font-bold text-primary">

                ₦{totalAmount.toLocaleString()}

              </p>

            </div>

          </section>

        )}

        {/* ================= COMPLAINT ================= */}

        {/* ONLY SHOW BEFORE PAYMENT */}

        {order.status !== "paid" && (

          <section className="mt-8 rounded-[2rem] border border-border bg-card p-6 sm:p-8">


            <div className="flex items-start gap-4">


              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">

                <MessageSquare className="h-5 w-5" />

              </div>


              <div>

                <h2 className="font-semibold">

                  Something not right?

                </h2>


                <p className="mt-1 text-sm text-muted-foreground">

                  Let us know and our team will
                  look into it.

                </p>

              </div>


            </div>



            <form

              onSubmit={
                handleComplaintSubmit
              }

              className="mt-6"

            >


              <textarea

                value={complaint}

                onChange={(event) =>
                  setComplaint(
                    event.target.value
                  )
                }

                placeholder="Tell us what happened..."

                rows={5}

                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-sm outline-none transition focus:border-primary"

              />


              <button

                type="submit"

                disabled={
                  submittingComplaint
                }

                className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"

              >

                <Send className="h-4 w-4" />


                {submittingComplaint

                  ? "Submitting..."

                  : "Submit Complaint"}

              </button>


            </form>


          </section>

        )}


      </div>

    </main>

  );

}