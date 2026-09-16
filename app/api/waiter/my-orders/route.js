import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

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
      Get all orders assigned to this waiter.

      We also get:
      - Customer information
      - Chef information
      - Bartender information
      - Number of items in the order
    */

    const ordersResult = await pool.query(
      `
      SELECT
        o.id,
        o.restaurant_id,
        o.table_number,
        o.status,
        o.order_datetime,
        o.estimated_wait_minutes,
        o.actual_wait_minutes,
        o.served_at,

        c.id AS customer_id,
        c.name AS customer_name,

        w.id AS waiter_id,
        w.name AS waiter_name,

        ch.id AS chef_id,
        ch.name AS chef_name,

        b.id AS bartender_id,
        b.name AS bartender_name,

        COUNT(oi.id)::INTEGER AS total_items

      FROM orders o

      JOIN customer c
        ON c.id = o.customer_id

      JOIN waiter w
        ON w.id = o.waiter_id

      LEFT JOIN chef ch
        ON ch.id = o.chef_id

      LEFT JOIN bartender b
        ON b.id = o.bartender_id

      LEFT JOIN order_item oi
        ON oi.order_id = o.id

      WHERE o.waiter_id = $1
        AND o.restaurant_id = 1

      GROUP BY
        o.id,
        c.id,
        w.id,
        ch.id,
        b.id

      ORDER BY
        o.order_datetime DESC
      `,
      [Number(waiterId)]
    );

    return NextResponse.json({
      orders: ordersResult.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching waiter orders:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch your orders",
      },
      {
        status: 500,
      }
    );
  }
}