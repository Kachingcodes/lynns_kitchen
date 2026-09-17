"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import MenuNav from "./MenuNav";
import MenuInfo from "./MenuInfo";

export default function MenuPage({ searchQuery }) {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const restaurantId = 3;

        const response = await fetch(
          `/api/menu?restaurantId=${restaurantId}`
        );

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

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-2 right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </main>
  );
}