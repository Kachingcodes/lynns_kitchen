"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Landmark,
  Check,
  ReceiptText,
  User,
  Utensils,
} from "lucide-react";

import { toast } from "react-toastify";

export default function PaymentPage({ params }) {

  const router = useRouter();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [paying, setPaying] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("");


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
            data.error || "Failed to load order"
          );
        }

        setOrder(data);

      } catch (error) {

        console.error(error);

        toast.error(error.message);

      } finally {

        setLoading(false);

      }

    };


    loadOrder();

  }, [params]);


  const totalAmount = order?.items?.reduce(
    (total, item) =>
      total + Number(item.subtotal_naira),
    0
  );


  const handlePayment = async () => {

    if (!order) return;

    setPaying(true);

    try {

      const response = await fetch(
        `/api/orders/${order.id}/payment`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            waiterId: order.waiter_id,

            method: paymentMethod,

          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to process payment"
        );

      }


      toast.success(
        "Payment completed successfully"
      );


      router.push("/waiter");


    } catch (error) {

      console.error(error);

      toast.error(error.message);

    } finally {

      setPaying(false);

    }

  };


  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-background">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading payment details...
          </p>

        </div>

      </main>

    );

  }


  if (!order) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-background">

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Order not found
          </h2>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 text-sm font-semibold text-primary"
          >
            Go back
          </button>

        </div>

      </main>

    );

  }


  return (

    <main className="min-h-screen bg-background">

      {/* Header */}

      <header className="border-b border-border bg-card">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">

          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >

            <ArrowLeft size={18} />

            Back to Order

          </button>


          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <ReceiptText size={17} />

            Order #{order.id}

          </div>

        </div>

      </header>



      <div className="mx-auto max-w-5xl px-6 py-10">


        {/* Page Heading */}

        <div className="mb-10">

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Complete payment
          </h1>

          <p className="mt-3 text-muted-foreground">
            Review the order and select how the customer
            would like to pay.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            {/* Customer Information */}

            <section className="rounded-3xl border border-border bg-card p-6">

              <h2 className="text-lg font-semibold">
                Order details
              </h2>


              <div className="mt-6 grid gap-4 sm:grid-cols-2">


                {/* Customer */}

                <div className="rounded-2xl bg-muted/50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

                      <User size={19} />

                    </div>


                    <div>

                      <p className="text-xs text-muted-foreground">
                        Customer
                      </p>

                      <p className="mt-1 font-semibold">
                        {order.customer_name}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Table */}

                <div className="rounded-2xl bg-muted/50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

                      <Utensils size={19} />

                    </div>


                    <div>

                      <p className="text-xs text-muted-foreground">
                        Table
                      </p>

                      <p className="mt-1 font-semibold">
                        Table {order.table_number}
                      </p>

                    </div>

                  </div>

                </div>


              </div>

            </section>



            {/* Order Items */}

            <section className="rounded-3xl border border-border bg-card p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  Order items
                </h2>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">

                  {order.items.length}{" "}

                  {order.items.length === 1
                    ? "item"
                    : "items"}

                </span>

              </div>


              <div className="mt-6 divide-y divide-border">

                {order.items.map((item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                  >


                    <div className="min-w-0">

                      <p className="font-semibold text-foreground">

                        {item.quantity} × {item.name}

                      </p>


                      <p className="mt-1 text-sm text-muted-foreground">

                        ₦
                        {Number(
                          item.unit_price_naira
                        ).toLocaleString()}

                        {" each"}

                      </p>

                    </div>


                    <p className="shrink-0 font-semibold text-foreground">

                      ₦
                      {Number(
                        item.subtotal_naira
                      ).toLocaleString()}

                    </p>


                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* RIGHT SIDE — PAYMENT PANEL */}

        <aside className="h-fit lg:sticky lg:top-6">

          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">


            {/* ================= PAYMENT METHOD ================= */}

            <div className="p-6 sm:p-7">


              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Checkout
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-foreground">
                    Payment method
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Select how the customer would like to pay.
                  </p>

                </div>


                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  <ReceiptText size={20} />

                </div>

              </div>


              {/* PAYMENT OPTIONS */}

              <div className="mt-7 space-y-3">

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                      paymentMethod === "card"
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >

                    <CreditCard size={22} />

                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-foreground">
                      Card
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Debit or credit card
                    </p>

                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >

                    {paymentMethod === "card" && (
                      <Check size={14} />
                    )}

                  </div>

                </button>


                {/* TRANSFER */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("transfer")
                  }
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    paymentMethod === "transfer"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
                      paymentMethod === "transfer"
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >

                    <Landmark size={22} />

                  </div>


                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-foreground">
                      Bank Transfer
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Transfer directly to the restaurant
                    </p>

                  </div>


                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      paymentMethod === "transfer"
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >

                    {paymentMethod === "transfer" && (
                      <Check size={14} />
                    )}

                  </div>

                </button>


              </div>

            </div>


            {/* ================= DIVIDER ================= */}

            <div className="border-t border-border" />



            {/* ================= PAYMENT SUMMARY ================= */}

            <div className="bg-muted/30 p-6 sm:p-7">


              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-muted-foreground">
                    Total amount
                  </p>

                  <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">

                    ₦
                    {Number(
                      totalAmount
                    ).toLocaleString()}

                  </p>

                </div>


                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  {paymentMethod === "card" && (
                    <CreditCard size={25} />
                  )}

                  {paymentMethod === "transfer" && (
                    <Landmark size={25} />
                  )}

                </div>

              </div>


              {/* SUMMARY DETAILS */}

              <div className="mt-7 space-y-4 rounded-2xl border border-border/70 bg-card p-5">


                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted-foreground">
                    Order
                  </span>

                  <span className="font-semibold text-foreground">
                    #{order.id}
                  </span>

                </div>


                <div className="h-px bg-border" />


                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted-foreground">
                    Table
                  </span>

                  <span className="font-semibold text-foreground">
                    Table {order.table_number}
                  </span>

                </div>


                <div className="h-px bg-border" />


                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted-foreground">
                    Method
                  </span>

                  <span className="flex items-center gap-2 font-semibold capitalize text-primary">

                    {paymentMethod === "card" && (
                      <CreditCard size={15} />
                    )}

                    {paymentMethod === "transfer" && (
                      <Landmark size={15} />
                    )}

                    {paymentMethod}

                  </span>

                </div>

              </div>


              {/* PAYMENT BUTTON */}

              <button
                type="button"
                onClick={handlePayment}
                disabled={paying}
                className="group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >

                {paymentMethod === "card" && (
                  <CreditCard
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                )}

                {paymentMethod === "transfer" && (
                  <Landmark
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                )}


                {paying
                  ? "Processing payment..."
                  : `Complete Payment • ₦${Number(
                      totalAmount
                    ).toLocaleString()}`}

              </button>

              {/* DEMO NOTICE */}

              <div className="mt-5 flex items-center justify-center gap-2">

                  <p className="text-center text-sm font-semibold text-foreground"> 
                    Please note that we are a cashless restaurant. Payments can be made by card or bank transfer only.
                  </p>

              </div>

            </div>

          </div>

        </aside>

        </div>

      </div>

    </main>

  );

}