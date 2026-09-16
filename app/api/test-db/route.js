import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS count
      FROM public.menu_item
    `);

    return NextResponse.json({
      success: true,
      menuItems: result.rows[0].count,
    });
  } catch (error) {
    console.error("TEST DB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}