"use client";

import { useState } from "react";

import {
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { toast } from "react-toastify";

export default function ComplaintModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}) {
  const [resolving, setResolving] =
    useState(false);

  if (!isOpen || !order) {
    return null;
  }

  const isResolved =
    order.complaint_status === "resolved";

  const handleResolveComplaint = async () => {
    if (!order.complaint_id) {
      toast.error("Complaint not found");
      return;
    }

    try {
      setResolving(true);

      const response = await fetch(
        `/api/complaints/${order.complaint_id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resolutionStatus: "resolved",

            /*
              Replace this later with the
              actual logged-in waiter ID.
            */
            waiterId: order.waiter_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to resolve complaint"
        );
      }

      toast.success(
        "Complaint resolved successfully"
      );

      onSuccess();

    } catch (error) {
      console.error(error);

      toast.error(error.message);

    } finally {
      setResolving(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />


      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">

              <MessageSquare size={22} />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-foreground">
                Customer Complaint
              </h2>

              <p className="text-sm text-muted-foreground">
                Order #{order.id} · Table {order.table_number}
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted"
          >
            <X size={18} />
          </button>

        </div>


        {/* Status */}
        <div className="mt-6">

          {isResolved ? (

            <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm font-medium text-green-600">

              <CheckCircle2 size={18} />

              Complaint Resolved

            </div>

          ) : (

            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">

              <AlertCircle size={18} />

              Complaint Open

            </div>

          )}

        </div>


        {/* Customer */}
        <div className="mt-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Customer
          </p>

          <p className="mt-1 font-semibold text-foreground">
            {order.customer_name}
          </p>

        </div>


        {/* Complaint */}
        <div className="mt-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Complaint
          </p>

          <div className="mt-2 rounded-2xl bg-muted p-4">

            <p className="text-sm leading-6 text-foreground">
              {order.complaint_description}
            </p>

          </div>

        </div>


        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            Close
          </button>


          {!isResolved && (

            <button
              type="button"
              onClick={handleResolveComplaint}
              disabled={resolving}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <CheckCircle2 size={17} />

              {resolving
                ? "Resolving..."
                : "Mark as Resolved"}

            </button>

          )}

        </div>

      </div>

    </div>
  );
}