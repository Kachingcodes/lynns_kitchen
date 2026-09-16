import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const waiterId = searchParams.get("waiterId");

    if (!waiterId) {
      return NextResponse.json(
        {
          error: "Waiter ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
      First confirm that the waiter exists.
    */

    const waiterResult = await pool.query(
      `
      SELECT
        id,
        name
      FROM waiter
      WHERE id = $1
        AND restaurant_id = 3
      `,
      [waiterId]
    );

    if (waiterResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Waiter not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
      Get all orders assigned to this waiter.
    */

    const ordersResult = await pool.query(
      `
      SELECT
        o.id,
        o.table_number,
        o.status,
        o.order_datetime,
        o.estimated_wait_minutes,
        o.actual_wait_minutes,
        o.served_at,

        c.id AS customer_id,
        c.name AS customer_name,

        COUNT(oi.id)::INTEGER AS total_items

      FROM orders o

      JOIN customer c
        ON c.id = o.customer_id

      LEFT JOIN order_item oi
        ON oi.order_id = o.id

      WHERE o.waiter_id = $1
        AND o.restaurant_id = 3

      GROUP BY
        o.id,
        c.id

      ORDER BY
        o.order_datetime DESC
      `,
      [waiterId]
    );

    return NextResponse.json({
      waiter: waiterResult.rows[0],

      orders: ordersResult.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching waiter orders:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch waiter orders",
      },
      {
        status: 500,
      }
    );
  }
}