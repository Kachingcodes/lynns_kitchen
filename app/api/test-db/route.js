import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");

    return NextResponse.json({
      success: true,
      databaseConnected: true,
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("DB CONNECTION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        databaseConnected: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}