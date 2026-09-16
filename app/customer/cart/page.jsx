"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";

import { useOrder } from "../../context/OrderContext";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();

  const {
    items,
    addToOrder,
    removeFromOrder,
    totalItems,
    totalPrice,
    totalPrepTime,
    clearOrder,
  } = useOrder();

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
const [tablesLoading, setTablesLoading] = useState(false);
const [tablesError, setTablesError] = useState("");

useEffect(() => {

  const loadAvailableTables = async () => {

    setTablesLoading(true);
    setTablesError("");

    try {

      const response = await fetch(
        "/api/tables/available"
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to load available tables"
        );

      }

      setAvailableTables(data.availableTables || []);

    } catch (error) {

      console.error(error);

      setTablesError(
        error.message ||
        "Unable to load available tables"
      );

      setAvailableTables([]);

    } finally {

      setTablesLoading(false);

    }

  };


  loadAvailableTables();

}, []);


const handleProceedToPrep = async () => {

  if (items.length === 0) {

    toast.info("Your Order is empty");

    return;

  }


  setShowCustomerForm(true);

  setTablesLoading(true);

  setTablesError("");


  try {

    const response = await fetch(
      "/api/tables/available"
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Failed to load available tables"
      );

    }


    setAvailableTables(
      data.availableTables || []

    );


    /*
      Clear previously selected table.

      This prevents a previously selected
      table from remaining selected if it
      has become unavailable.
    */

    setTableNumber("");


  } catch (error) {

    console.error(error);

    setTablesError(
      error.message ||
      "Unable to load available tables"
    );

    setAvailableTables([]);

  } finally {

    setTablesLoading(false);

  }

};


  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!customerName.trim()) {
    toast.error("Please enter your name");
    return;
  }

  if (!tableNumber) {
    toast.error("Please select your table number");
    return;
  }

  if (items.length === 0) {
    toast.error("Your order is empty");
    return;
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        restaurantId: 3, // Replace with your actual restaurant ID

        customerName: customerName.trim(),

        tableNumber,

        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to place order"
      );
    }

    console.log("ORDER CREATED:", data.order);

    toast.success("Your order has been placed!");

    clearOrder();

    setCustomerName("");
    setTableNumber("");

    // Next, we'll redirect to the confirmation page
    router.push(`/order/${data.order.id}`);

  } catch (error) {
    console.error(error);

    toast.error(error.message);
  }
};

  return (
    <main className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            {showCustomerForm && (
              <button
                type="button"
                onClick={() =>
                  setShowCustomerForm(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition hover:bg-secondary"
                aria-label="Back to order"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {showCustomerForm
                  ? "Your Details"
                  : "Your Order"}
              </h1>

              <p className="text-sm text-muted-foreground">
                {showCustomerForm
                  ? "Tell us where to bring your order"
                  : `${totalItems} ${
                      totalItems === 1
                        ? "item"
                        : "items"
                    }`}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Continue browsing
          </button>

        </div>
      </div>


      {/* Page Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">

        {!showCustomerForm ? (

          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

            {/* Cart Items */}
            <div>

              {items.length === 0 ? (

                <div className="rounded-2xl border border-border bg-card p-10 text-center">

                  <h2 className="text-xl font-semibold">
                    Your order is empty
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Add something delicious to get started.
                  </p>

                  <button
                    onClick={() => router.push("/customer")}
                    className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                  >
                    Browse Menu
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {items.map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                    >

                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-24 w-24 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.prepTime}
                        </p>

                        <div className="mt-4 flex items-center justify-between">

                          <span className="font-semibold text-primary">
                            {item.price}
                          </span>

                          <div className="flex items-center gap-2 rounded-full bg-secondary px-1.5 py-1">

                            <button
                              type="button"
                              onClick={() =>
                                removeFromOrder(item.id)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                addToOrder(item)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                            >
                              <Plus size={16} />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* Order Summary */}
            {items.length > 0 && (

              <aside className="h-fit rounded-2xl border border-border bg-card p-6">

                <h2 className="text-lg font-semibold">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-muted-foreground">
                      Items
                    </span>

                    <span className="font-semibold">
                      {totalItems}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-muted-foreground">
                      Estimated prep time
                    </span>

                    <span className="font-semibold">
                      {totalPrepTime} min
                    </span>

                  </div>

                  <div className="border-t border-border pt-4">

                    <div className="flex items-center justify-between">

                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-bold text-primary">
                        ₦{totalPrice.toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleProceedToPrep}
                  className="mt-6 w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Proceed to Prep
                </button>

              </aside>

            )}

          </div>

        ) : (

          /* Customer Details */
          <div className="mx-auto max-w-xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Order Summary */}
              <div className="rounded-2xl bg-secondary p-5">

                <h3 className="font-semibold text-foreground">
                  Order Summary
                </h3>

                <div className="mt-4 space-y-3">

                  {items.map((item) => (

                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >

                      <span>
                        {item.quantity} × {item.name}
                      </span>

                      <span className="font-medium">
                        {item.price}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="mt-5 border-t border-border pt-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-muted-foreground">
                      Estimated prep time
                    </span>

                    <span className="font-semibold">
                      {totalPrepTime} min
                    </span>

                  </div>

                  <div className="mt-3 flex justify-between">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-bold text-primary">
                      ₦{totalPrice.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>


              {/* Name */}
              <div>

                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />

              </div>


              {/* Table */}
              <div>

                <label
                  htmlFor="tableNumber"
                  className="mb-2 block text-sm font-semibold"
                >
                  Table Number
                </label>

                <select
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(event) =>
                    setTableNumber(event.target.value)
                  }
                  disabled={
                    tablesLoading ||
                    availableTables.length === 0
                  }
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="">

                    {tablesLoading
                      ? "Loading available tables..."
                      : availableTables.length === 0
                      ? "No tables currently available"
                      : "Select your table"}

                  </option>


                  {availableTables.map((table) => (

                    <option
                      key={table}
                      value={table}
                    >
                      Table {table}
                    </option>

                  ))}

                </select>

                  {tablesError && (

                    <p className="mt-2 text-sm text-red-500">

                      {tablesError}

                    </p>

                  )}

                  {!tablesLoading &&
                    !tablesError &&
                    availableTables.length === 0 && (

                      <p className="mt-2 text-sm text-muted-foreground">

                        All tables are currently occupied.

                      </p>

                  )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Place Order
              </button>

            </form>

          </div>

        )}

      </div>

    </main>
  );
}