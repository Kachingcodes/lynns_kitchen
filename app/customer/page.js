"use client";

import Header from "./Header";
import MenuIntro from "./MenuIntro";
import MenuPage from "./MenuPage";
import { useState } from "react";

export default function CustomerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Header onSearch={setSearchQuery} />
      <MenuIntro />
      <MenuPage searchQuery={searchQuery} />
    </div>
  );
}