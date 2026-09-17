"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  User,
  UtensilsCrossed,
  ChefHat,
  GlassWater,
  Send,
} from "lucide-react";

export default function ManageOrderPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);

  const [chefs, setChefs] = useState([]);
  const [bartenders, setBartenders] = useState([]);

  const [selectedChef, setSelectedChef] = useState("");
  const [selectedBartender, setSelectedBartender] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [sendingToKitchen, setSendingToKitchen] =
    useState(false);
    const [statuses, setStatuses] = useState([]);

    const [updatingStatus, setUpdatingStatus] =
  useState(false);

  /*
    Countdown value in seconds.

    We will display this beside the status.
  */
  const [remainingSeconds, setRemainingSeconds] =
    useState(null);


  useEffect(() => {
    if (!params.id) return;

    fetchOrder();
    fetchStaff();
    fetchStatuses();
  }, [params.id]);


  /*
    Load order
  */
  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/orders/${params.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load order"
        );
      }

      setOrder(data);

      /*
        Populate already assigned staff.

        This is useful if the page is refreshed
        after the order has been sent.
      */
      setSelectedChef(
        data.chef_id ? String(data.chef_id) : ""
      );

      setSelectedBartender(
        data.bartender_id
          ? String(data.bartender_id)
          : ""
      );

      /*
        actual_wait_minutes is our live
        countdown value.

        Convert minutes to seconds for
        smoother countdown display.
      */
      if (
        data.status === "preparing" &&
        data.actual_wait_minutes !== null
      ) {
        setRemainingSeconds(
          Number(data.actual_wait_minutes) * 60
        );
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };


  const fetchStatuses = async () => {
  try {
    const response = await fetch(
      "/api/orders/statuses"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to load statuses"
      );
    }

    setStatuses(data.statuses || []);

  } catch (error) {
    console.error(
      "Error loading statuses:",
      error
    );
  }
};

  /*
    Load chefs and bartenders
  */
  const fetchStaff = async () => {
    try {
      const [
        chefResponse,
        bartenderResponse,
      ] = await Promise.all([
        fetch("/api/chefs"),
        fetch("/api/bartenders"),
      ]);

      const chefData =
        await chefResponse.json();

      const bartenderData =
        await bartenderResponse.json();

      if (chefResponse.ok) {
        setChefs(chefData.chefs || []);
      }

      if (bartenderResponse.ok) {
        setBartenders(
          bartenderData.bartenders || []
        );
      }

    } catch (error) {
      console.error(
        "Error loading staff:",
        error
      );
    }
  };


  /*
    Determine whether the order
    contains food or drinks.
  */
  const foodCategories = [
    "main",
    "starter",
    "sides",
    "dessert",
  ];

  const foodItems =
    order?.items?.filter((item) =>
      foodCategories.includes(
        item.category?.toLowerCase()
      )
    ) || [];


  const drinkItems =
    order?.items?.filter(
      (item) =>
        item.category?.toLowerCase() ===
        "drinks"
    ) || [];


  /*
    Determine whether required staff
    have been selected.
  */

  const chefRequired = foodItems.length > 0;

  const bartenderRequired =
    drinkItems.length > 0;

const assignedChef =
  selectedChef || order?.chef_id;

const assignedBartender =
  selectedBartender || order?.bartender_id;


const hasRequiredStaffAssigned =
  (!chefRequired || assignedChef) &&
  (!bartenderRequired || assignedBartender);

  const canSendToKitchen =
    (!chefRequired || selectedChef) &&
    (!bartenderRequired ||
      selectedBartender) &&
    order?.status === "pending";


  /*
    Send order to kitchen.
  */
  const handleSendToKitchen = async () => {
    if (!canSendToKitchen) return;

    try {
      setSendingToKitchen(true);

      const response = await fetch(
        `/api/orders/${order.id}/send-to-kitchen`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chefId: selectedChef
              ? Number(selectedChef)
              : null,

            bartenderId: selectedBartender
              ? Number(selectedBartender)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to send order to kitchen"
        );
      }

      /*
        Update the order immediately.
      */
      setOrder((previousOrder) => ({
        ...previousOrder,
        ...data.order,
      }));


      /*
        Start countdown immediately.

        actual_wait_minutes was set by
        the API to estimated_wait_minutes.
      */
      setRemainingSeconds(
        Number(data.order.actual_wait_minutes) *
          60
      );

    } catch (error) {
      console.error(error);

      toast.error(error.message);

    } finally {
      setSendingToKitchen(false);
    }
  };

  const handleStatusChange = async (
  event
) => {
  const newStatus = event.target.value;


  /*
    Don't allow Preparing unless
    the required staff have been assigned.
  */

  if (
    newStatus === "preparing" &&
    !hasRequiredStaffAssigned
  ) {
    toast.error(
      "Please assign the required chef and/or bartender."
    );

    return;
  }


  /*
    If the order is still pending and the user
    has not clicked Send to Kitchen, they should
    not manually move it to Preparing.

    Send to Kitchen is responsible for:
    - Saving staff
    - Changing status to preparing
    - Setting actual_wait_minutes
    - Setting preparing_started_at
  */

  if (
    newStatus === "preparing" &&
    order.status === "pending"
  ) {
    toast.error(
      "Please use Send to Kitchen."
    );

    return;
  }


  try {
    setUpdatingStatus(true);

    const response = await fetch(
      `/api/orders/${order.id}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to update status"
      );
    }


    /*
      Update frontend immediately.
    */

    setOrder((previousOrder) => ({
      ...previousOrder,
      ...data.order,
    }));

  } catch (error) {
    console.error(error);

    toast.error(error.message);

  } finally {
    setUpdatingStatus(false);
  }
};

  /*
    Countdown.
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
      Number(order.estimated_wait_minutes);

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

  return () => clearInterval(interval);

}, [
  order?.status,
  order?.preparing_started_at,
  order?.actual_wait_minutes,
  order?.estimated_wait_minutes,
]);


  /*
    Format countdown.
  */
const formatCountdown = (seconds) => {
  if (
    seconds === null ||
    seconds === undefined ||
    Number.isNaN(seconds)
  ) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);

  const remaining = seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(remaining).padStart(
    2,
    "0"
  )}`;
};


  /*
    Status options.
  */
  const statusOptions = [
    "pending",
    "preparing",
    "served",
    "paid",
    "cancelled",
  ];


  /*
    Loading state
  */
  if (loading) {
    return (
      <main className="min-h-screen bg-background p-8">

        <div className="mx-auto max-w-7xl">

          <p className="text-muted-foreground">
            Loading order...
          </p>

        </div>

      </main>
    );
  }


  /*
    Order not found
  */
  if (!order) {
    return (
      <main className="min-h-screen bg-background p-8">

        <div className="mx-auto max-w-7xl">

          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft size={17} />

            Back
          </button>


          <div className="rounded-2xl border border-border bg-card p-8 text-center">

            <h1 className="text-xl font-semibold">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              This order may no longer exist.
            </p>

          </div>

        </div>

      </main>
    );
  }


  /*
    Calculate order total.
  */
  const orderTotal = order.items.reduce(
    (total, item) =>
      total +
      Number(item.subtotal_naira),
    0
  );


  return (
    <main className="min-h-screen bg-background">


      {/* HEADER */}

      <div className="border-b border-border bg-card">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-6 py-5">

          {/* Left */}

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-border transition hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>

              <p className="text-sm text-muted-foreground">
                Manage Order
              </p>

              <h1 className="text-lg lg:text-2xl font-semibold text-foreground">
                Order #{order.id}
              </h1>

            </div>

          </div>


          {/* Status + Countdown */}

         <div className="flex items-center gap-3">

            <select
                value={order.status || "pending"}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold capitalize text-primary outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >

                {statuses.map((status) => (

                <option
                    key={status}
                    value={status}
                >

                  {status}

                </option>

                ))}

            </select>

            {order.status === "preparing" && (

                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2">

                <Clock
                    size={16}
                    className="text-primary"
                />

                <span className="font-semibold text-primary">

                    {formatCountdown(
                    remainingSeconds
                    )}

                </span>

                </div>

            )}

            </div>
        </div>

      </div>


      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6 lg:py-8">

        {/* TOP INFORMATION */}

        <div className="grid gap-4 xl:gap-6 grid-cols-2 xl:grid-cols-4">


          {/* Customer */}

          <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-muted">

                <User size={18} />

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

          <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">

            <div className="flex items-center gap-3">

              <div className="flex flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-muted">

                <UtensilsCrossed size={18} />

              </div>

              <div>

                <p className="text-xs text-muted-foreground">
                  Table Number
                </p>

                <p className="mt-1 font-semibold">
                  Table {order.table_number}
                </p>

              </div>

            </div>

          </div>


          {/* Estimated Time */}

          <div className="rounded-2xl border border-primary bg-primary p-4 lg:p-5 text-primary-foreground">

            <div className="flex items-center gap-3">

              <Clock size={18} />


              <div>

                <p className="text-xs opacity-80">
                  Estimated Prep Time
                </p>

                <p className="mt-1 text-xl lg:text-3xl font-bold">
                  {order.estimated_wait_minutes} min
                </p>

              </div>

            </div>

          </div>

          {/* Items */}

          <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">

            <p className="text-xs text-muted-foreground">
              Total Items
            </p>

            <p className="mt-2 text-2xl lg:text-3xl font-bold text-foreground">

              {order.items.reduce(
                (total, item) =>
                  total +
                  Number(item.quantity),
                0
              )}

            </p>

          </div>

        </div>

        {/* STAFF ASSIGNMENT */}

        <section className="mt-8">

          {/* Section Header */}

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Assign Kitchen Staff
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Assign staff responsible for preparing this order.
              </p>

            </div>


            {/* Send Button */}

            <button
              type="button"
              onClick={handleSendToKitchen}
              disabled={
                !canSendToKitchen ||
                sendingToKitchen
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <Send size={17} />

              {sendingToKitchen
                ? "Sending..."
                : order.status === "preparing"
                  ? "Sent to Kitchen"
                  : "Send to Kitchen"}

            </button>

          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

            {/* CHEF */}

            {chefRequired && (

              <div className="rounded-2xl border border-border bg-card p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <ChefHat size={21} />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Assign Chef
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Responsible for food preparation
                    </p>

                  </div>

                </div>


                <select
                  value={selectedChef}
                  disabled={
                    order.status !== "pending"
                  }
                  onChange={(event) =>
                    setSelectedChef(
                      event.target.value
                    )
                  }
                  className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="">
                    Select a chef
                  </option>


                  {chefs.map((chef) => (

                    <option
                      key={chef.id}
                      value={chef.id}
                    >
                      {chef.name}

                      {chef.specialty
                        ? ` — ${chef.specialty}`
                        : ""}

                    </option>

                  ))}

                </select>

              </div>

            )}



            {/* BARTENDER */}

            {bartenderRequired && (

              <div className="rounded-2xl border border-border bg-card p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    <GlassWater size={21} />

                  </div>


                  <div>

                    <h3 className="font-semibold">
                      Assign Bartender
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Responsible for drink preparation
                    </p>

                  </div>

                </div>

                <select
                  value={selectedBartender}
                  disabled={
                    order.status !== "pending"
                  }
                  onChange={(event) =>
                    setSelectedBartender(
                      event.target.value
                    )
                  }
                  className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <option value="">
                    Select a bartender
                  </option>


                  {bartenders.map(
                    (bartender) => (

                      <option
                        key={bartender.id}
                        value={bartender.id}
                      >

                        {bartender.name}

                        {bartender.specialty
                          ? ` — ${bartender.specialty}`
                          : ""}

                      </option>

                    )
                  )}

                </select>

              </div>

            )}

          </div>

        </section>



        {/* ORDER TABLE */}

        <section className="mt-8 rounded-2xl border border-border bg-card">

          <div className="border-b border-border px-6 py-5">

            <h2 className="text-xl font-semibold">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Items requested by the customer
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-border bg-muted/40">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Item
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Type
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Quantity
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Unit Price
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subtotal
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Prep Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {order.items.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0"
                  >

                    <td className="px-6 py-5">

                      <p className="font-semibold text-foreground">
                        {item.name}
                      </p>

                    </td>


                    <td className="px-6 py-5">

                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                        {item.category || "Food"}
                      </span>

                    </td>


                    <td className="px-6 py-5 text-center font-medium">
                      {item.quantity}
                    </td>


                    <td className="px-6 py-5 text-right">

                      ₦{Number(
                        item.unit_price_naira
                      ).toLocaleString()}

                    </td>


                    <td className="px-6 py-5 text-right font-semibold text-primary">

                      ₦{Number(
                        item.subtotal_naira
                      ).toLocaleString()}

                    </td>


                    <td className="px-6 py-5 text-center">

                      <span className="font-semibold">

                        {item.avg_prep_minutes} min

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>


              <tfoot className="border-t-2 border-border bg-muted/20">

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-5 text-right font-semibold"
                  >
                    Order Total
                  </td>


                  <td className="px-6 py-5 text-right text-lg font-bold text-primary">

                    ₦{orderTotal.toLocaleString()}

                  </td>


                  <td />

                </tr>

              </tfoot>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}