"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { useWaiter } from "../context/WaiterContext";

export default function TakeOrderModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}) {
  const { setSelectedWaiter } = useWaiter();

  const [waiters, setWaiters] = useState([]);
  const [waiterId, setWaiterId] = useState("");
  const [loadingWaiters, setLoadingWaiters] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

    const getCurrentShift = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      hour12: false,
    }).format(new Date())
  );

  return hour >= 8 && hour < 14
    ? "Morning"
    : "Night";
};

  /*
    Fetch waiters when the modal opens
  */
  useEffect(() => {
    if (!isOpen) return;

    const fetchWaiters = async () => {
      try {
        setLoadingWaiters(true);

        const response = await fetch(
          "/api/waiters"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Failed to load waiters"
          );
        }

        const currentShift = getCurrentShift();

        const availableWaiters = (data.waiters || []).filter(
          (waiter) =>
            waiter.shift_schedule === currentShift
        );

        setWaiters(availableWaiters);

      } catch (error) {
        console.error(error);

        toast.error(error.message);

      } finally {
        setLoadingWaiters(false);
      }
    };

    fetchWaiters();
  }, [isOpen]);


  /*
    Reset modal when closed
  */
  useEffect(() => {
    if (!isOpen) {
      setWaiterId("");
    }
  }, [isOpen]);


  const handleTakeOrder = async () => {
    if (!waiterId) {
      toast.error(
        "Please select your name"
      );

      return;
    }

    if (!order?.id) {
      toast.error(
        "Order information is missing"
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `/api/orders/${order.id}/waiter`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            waiterId: Number(waiterId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to take order"
        );
      }

      /*
        Find the selected waiter
      */
      const selectedWaiter = waiters.find(
        (waiter) =>
          waiter.id === Number(waiterId)
      );

      /*
        Save the waiter globally
      */
      setSelectedWaiter(selectedWaiter);

      toast.success(
        "Order successfully assigned to you"
      );

      /*
        Tell parent component that
        the order was successfully taken
      */
      onSuccess?.(data.order);


    } catch (error) {
      console.error(error);

      toast.error(error.message);

    } finally {
      setSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-sm text-muted-foreground">
              Take Order #{order?.id}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              Who is taking this order?
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <X size={18} />
          </button>

        </div>


        {/* Waiters */}
        <div className="mt-6">

          <label className="mb-3 block text-sm font-medium">
            Select your name
          </label>


          {loadingWaiters ? (

            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading waiters...
            </div>

          ) : waiters.length === 0 ? (

            <div className="rounded-xl border border-border p-4 text-center text-sm text-muted-foreground">
              No waiters available.
            </div>

          ) : (

            <div className="grid grid-cols-2 gap-2">

              {waiters.map((waiter) => {

                const isSelected =
                  Number(waiterId) === waiter.id;

                return (

                  <button
                    key={waiter.id}
                    type="button"
                    onClick={() =>
                      setWaiterId(waiter.id)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >

                    <div>

                      <p className="font-semibold">
                        {waiter.name}
                      </p>

                      {waiter.shift_schedule && (
                        <p className="text-xs text-muted-foreground">
                          {waiter.shift_schedule}
                        </p>
                      )}

                    </div>

                  </button>

                );
              })}

            </div>

          )}

        </div>


        {/* Footer */}
        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={handleTakeOrder}
            disabled={
              !waiterId ||
              submitting ||
              loadingWaiters
            }
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Taking Order..."
              : "Take Order"}
          </button>

        </div>

      </div>

    </div>
  );
}