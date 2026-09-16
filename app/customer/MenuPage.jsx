"use client";

import { useEffect, useState } from "react";
import MenuNav from "./MenuNav";
import MenuInfo from "./MenuInfo";

export default function MenuPage({ searchQuery }) {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const restaurantId = 1;

        const response = await fetch("/api/menu?restaurantId=3");

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await response.json();

        setMenuItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
  const query = searchQuery.trim().toLowerCase();

  const matchesCategory =
    activeCategory === "all" ||
    item.category === activeCategory;

  if (!query) {
    return matchesCategory;
  }

  const searchableText = [
    item.name,
    item.description,
    `${item.avg_prep_minutes} min`,
    item.avg_prep_minutes,
    item.price_naira,
    `₦${Number(item.price_naira).toLocaleString()}`,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    matchesCategory &&
    searchableText.includes(query)
  );
});
        
  return (
    <main className="min-h-screen bg-background">      
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* Navigation */}
        <div className="border-r border-border">
          <MenuNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            menuItems={menuItems}
          />
        </div>

        {/* Menu */}
        <MenuInfo 
          items={filteredItems}
          activeCategory={activeCategory}
          loading={loading}
          searchQuery={searchQuery}
          />
      </div>
    </main>
  );
}