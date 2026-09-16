import OrderCard from "./OrderCard";

export default function IncomingOrders({
  orders,
  loading,
  onTakeOrder,
  onViewComplaint,
  onViewRating,
}) {

  if (loading) {
    return (
      <div className="mt-8">
        <p className="text-muted-foreground">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">

      {/* Heading */}
      <div className="flex items-end justify-between">

        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            All Orders
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>

        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>

      </div>


      {/* Orders */}
      {orders.length === 0 ? (

        <div className="mt-6 rounded-2xl border border-border bg-card p-10 text-center">

          <h3 className="text-lg font-semibold">
            No orders yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            New customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {orders.map((order) => (

            <OrderCard
              key={order.id}
              order={order}
              loading={loading}
              onTakeOrder={onTakeOrder}
              onViewComplaint={onViewComplaint}
              onViewRating={onViewRating}
            />

          ))}

        </div>

      )}

    </section>
  );
}