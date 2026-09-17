import MenuItemCard from "./MenuItemCard";

const categoryTitles = {
  all: "All",
  starter: "Starters",
  main: "Main Courses",
  sides: "Sides",
  dessert: "Desserts",
  drinks: "Drinks",
};

export default function MenuInfo({
  items,
  activeCategory,
  loading,
    searchQuery,
}) {
  const title = categoryTitles[activeCategory] || "Menu";

  if (loading) {
    return (
      <section className="flex-1 px-6 py-6 lg:px-10">
        <p className="text-muted-foreground">
          Loading menu...
        </p>
      </section>
    );
  }

  return (
    <section className="flex-1 px-6 py-6 lg:px-10">
      {/* Section Heading */}
      <div className="mb-4 lg:mb-8 flex items-center justify-between">
        <p className="text-xl lg:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {items.length}{" "}
          {items.length === 1 ? "item" : "items"} available
        </p>
      </div>

      {/* Menu Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              image_url={item.image_url}
              description={item.description}
              prepTime={`${item.avg_prep_minutes} min`}
              price={`₦${Number(item.price_naira).toLocaleString()}`}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-lg font-semibold text-foreground">
            No items found
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
                ? `No menu items match "${searchQuery}".`
                : "There are currently no items in this category."}
            </p>
        </div>
        )}
    </section>
  );
}