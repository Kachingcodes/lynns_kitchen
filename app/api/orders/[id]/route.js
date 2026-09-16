import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    /*
      Get the main order information
      INCLUDING the customer information
    */
    const orderResult = await pool.query(
      `
      SELECT
        o.id,
        o.restaurant_id,
        o.customer_id,
        o.waiter_id,
        o.chef_id,
        o.bartender_id,
        o.table_number,
        o.status,
        o.order_datetime,
        o.estimated_wait_minutes,
        o.actual_wait_minutes,
        o.preparing_started_at,
        o.served_at,
        c.name AS customer_name
      FROM orders o
      JOIN customer c
        ON c.id = o.customer_id
      WHERE o.id = $1;
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const order = orderResult.rows[0];

    /*
      Get all items in the order
      INCLUDING category
    */
    const itemsResult = await pool.query(
      `
      SELECT
        oi.id,
        oi.quantity,
        oi.unit_price_naira,
        oi.subtotal_naira,
        oi.prep_start_time,
        oi.prep_end_time,

        mi.id AS menu_item_id,
        mi.name,
        mi.category,
        mi.avg_prep_minutes

      FROM order_item oi

      JOIN menu_item mi
        ON mi.id = oi.menu_item_id

      WHERE oi.order_id = $1

      ORDER BY oi.id
      `,
      [id]
    );

    return NextResponse.json({
      ...order,
      items: itemsResult.rows,
    });

  } catch (error) {
    console.error(
      "Error fetching order:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}