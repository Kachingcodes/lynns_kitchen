"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useOrder } from "../context/OrderContext";
import { Clock } from "lucide-react";


export default function MenuItemCard({
  id,
  name = "",
  prepTime = "",
  description = "",
  price = "",
  image_url = "",
}) {
  const { addToOrder, removeFromOrder, getQuantity } = useOrder();

  const [isFlying, setIsFlying] = useState(false);

  const quantity = getQuantity(id);

  const sendToOrder = () => {
    setIsFlying(true);

    setTimeout(() => {
      setIsFlying(false);
    }, 700);
  };

  const handleAdd = () => {
    addToOrder({
      id,
      name,
      description,
      prepTime,
      price,
      image_url,
    });

    sendToOrder();

    toast.success(
      quantity === 0
        ? `${name} added to your Order`
        : `Another ${name} added to your Order`
    );
  };

  const handleRemove = () => {
    removeFromOrder(id);

    toast.info(`${name} removed from your Order`);
  };

  return (
    <div className="group relative flex h-[430px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Food Image */}
      <div className="relative h-60 overflow-hidden">

        <img
          src={image_url}
          alt={name}
          className="h-full w-full object-cover"
        />

        {/* Subtle image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Prep Time - Top Left */}
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Clock className="h-3.5 w-3.5" />
          <span>{prepTime}</span>
        </div>

        {/* Price - Bottom Right */}
        <div className="absolute bottom-2 right-2 rounded-full bg-white/60 px-2 py-1 text-sm font-bold shadow-md">
          {price}
        </div>

        {/* Flying food animation */}
        {isFlying && (
          <img
            src={image_url}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-xl animate-food-to-order"
          />
        )}

      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">

        {/* Name */}
        <h3 className="text-lg font-semibold text-foreground">
          {name}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {/* Order Section */}
        <div className="mt-auto pt-3">

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              Place Order
            </button>
          ) : (
            <div className="flex w-full items-center justify-between rounded-full bg-secondary px-2 py-1.5">

              <button
                onClick={handleRemove}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-foreground transition-colors hover:bg-white"
                aria-label={`Remove one ${name}`}
              >
                −
              </button>

              <span className="min-w-5 text-center text-sm font-bold">
                {quantity}
              </span>

              <button
                onClick={handleAdd}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white transition-all hover:opacity-90 active:scale-90"
                aria-label={`Add another ${name}`}
              >
                +
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
