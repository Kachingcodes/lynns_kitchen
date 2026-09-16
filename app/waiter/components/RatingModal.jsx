"use client";

import {
  X,
  Star,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";


export default function RatingModal({
  isOpen,
  order,
  onClose,
}) {

  if (!isOpen || !order) {
    return null;
  }


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">


      <div className="w-full max-w-lg rounded-3xl bg-card shadow-2xl">


        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">

          <div>

            <h2 className="text-xl font-bold">
              Customer Rating
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Order #{order.id}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-muted"
          >

            <X size={20} />

          </button>

        </div>



        <div className="space-y-6 p-6">


          {/* Rating */}

          <div className="rounded-2xl bg-muted/50 p-5 text-center">

            <p className="text-sm text-muted-foreground">
              Customer Rating
            </p>


            <div className="mt-3 flex justify-center gap-1">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}
                    className={`h-8 w-8 ${
                      star <= order.rating_value
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/20"
                    }`}
                  />

                )
              )}

            </div>


            <p className="mt-3 text-2xl font-bold">
              {order.rating_value}/5
            </p>

          </div>



          {/* Customer */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

              <User size={18} />

            </div>


            <div>

              <p className="text-xs text-muted-foreground">
                Customer
              </p>

              <p className="font-semibold">
                {order.customer_name}
              </p>

            </div>

          </div>



          {/* Date */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

              <Clock size={18} />

            </div>


            <div>

              <p className="text-xs text-muted-foreground">
                Submitted
              </p>

              <p className="font-semibold">

                {order.rating_submitted_at
                  ? new Date(
                      order.rating_submitted_at
                    ).toLocaleString()
                  : "Not available"}

              </p>

            </div>

          </div>



          {/* Comment */}

          <div>

            <div className="flex items-center gap-2">

              <MessageSquare
                size={18}
                className="text-primary"
              />

              <p className="font-semibold">
                Customer Comment
              </p>

            </div>


            <div className="mt-3 rounded-2xl bg-muted/50 p-4">

              <p className="text-sm leading-relaxed text-muted-foreground">

                {order.rating_comment ||
                  "The customer did not leave a comment."}

              </p>

            </div>

          </div>


        </div>



        {/* Footer */}

        <div className="border-t border-border p-5">

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-secondary px-5 py-3 text-sm font-semibold transition hover:opacity-80"
          >

            Close

          </button>

        </div>


      </div>

    </div>

  );

}