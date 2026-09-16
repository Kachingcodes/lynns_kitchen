import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        category,
        description,
        price_naira,
        avg_prep_minutes,
        is_available,
        restaurant_id,
        image_url
      FROM menu_item
      WHERE restaurant_id = $1
        AND is_available = true
        AND category IN ('starter', 'main', 'sides', 'dessert', 'drinks')
      ORDER BY category, name
      `,
      [restaurantId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching menu:", error);

    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}