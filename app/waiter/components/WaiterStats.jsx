import {
  ClipboardList,
  Clock,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default function WaiterStats({ orders }) {

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const assignedOrders = orders.filter(
    (order) => order.waiter_name
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "paid"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
    },
    {
      label: "Assigned",
      value: assignedOrders,
      icon: UserCheck,
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5"
          >

            <div className="flex items-center justify-between">

              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={19} />
              </div>

            </div>

            <p className="mt-5 text-3xl font-bold text-foreground">
              {stat.value}
            </p>

          </div>
        );
      })}

    </div>
  );
}