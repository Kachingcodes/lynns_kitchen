import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function PATCH(request, { params }) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const body = await request.json();

    const {
      chefId,
      bartenderId,
    } = body;

    await client.query("BEGIN");

    /*
      Get the order and its items.

      We need to know whether this order
      contains food and/or drinks.
    */
    const orderResult = await client.query(
      `
      SELECT
        o.id,
        o.restaurant_id,
        o.waiter_id,
        o.estimated_wait_minutes,
        o.status
      FROM orders o
      WHERE o.id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderResult.rows[0];

    /*
      Make sure a waiter has taken the order.
    */
    if (!order.waiter_id) {
      throw new Error(
        "This order must be taken by a waiter first"
      );
    }

    /*
      Get all items in the order.

      IMPORTANT:
      This assumes order_item connects to menu_item.
      Adjust table/column names only if yours differ.
    */
    const itemsResult = await client.query(
      `
      SELECT
        mi.category
      FROM order_item oi

      JOIN menu_item mi
        ON mi.id = oi.menu_item_id

      WHERE oi.order_id = $1
      `,
      [id]
    );

    const categories = itemsResult.rows.map(
      (item) =>
        item.category?.toLowerCase()
    );

    /*
      Food categories handled by chefs.
    */
    const foodCategories = [
      "main",
      "starter",
      "dessert",
    ];

    const hasFood = categories.some(
      (category) =>
        foodCategories.includes(category)
    );

    /*
      Drinks handled by bartenders.
    */
    const hasDrinks = categories.some(
      (category) =>
        category === "drinks"
    );

    /*
      Validate chef selection.
    */
    if (hasFood && !chefId) {
      throw new Error(
        "Please select a chef for the food items"
      );
    }

    /*
      Validate bartender selection.
    */
    if (hasDrinks && !bartenderId) {
      throw new Error(
        "Please select a bartender for the drinks"
      );
    }

    /*
      Validate the selected chef belongs
      to the same restaurant.
    */
    if (chefId) {
      const chefResult = await client.query(
        `
        SELECT id
        FROM chef
        WHERE id = $1
          AND restaurant_id = $2
        `,
        [
          chefId,
          order.restaurant_id,
        ]
      );

      if (chefResult.rows.length === 0) {
        throw new Error(
          "Selected chef does not belong to this restaurant"
        );
      }
    }

    /*
      Validate the selected bartender belongs
      to the same restaurant.
    */
    if (bartenderId) {
      const bartenderResult =
        await client.query(
          `
          SELECT id
          FROM bartender
          WHERE id = $1
            AND restaurant_id = $2
          `,
          [
            bartenderId,
            order.restaurant_id,
          ]
        );

      if (
        bartenderResult.rows.length === 0
      ) {
        throw new Error(
          "Selected bartender does not belong to this restaurant"
        );
      }
    }

    /*
      Update the order.

      actual_wait_minutes starts from
      estimated_wait_minutes.

      Status changes to preparing.
    */
    const updatedOrderResult =
      await client.query(
        `
        UPDATE orders

        SET
          chef_id = $1,
          bartender_id = $2,
          status = 'preparing',
          actual_wait_minutes = estimated_wait_minutes,
            preparing_started_at = NOW()
        WHERE id = $3

        RETURNING
          id,
          restaurant_id,
          customer_id,
          waiter_id,
          chef_id,
          bartender_id,
          table_number,
          status,
          estimated_wait_minutes,
          actual_wait_minutes,
          preparing_started_at,
          order_datetime
        `,
        [
          chefId || null,
          bartenderId || null,
          id,
        ]
      );

    await client.query("COMMIT");

    return NextResponse.json({
      message:
        "Order sent to kitchen successfully",

      order:
        updatedOrderResult.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Error sending order to kitchen:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to send order to kitchen",
      },
      {
        status: 500,
      }
    );

  } finally {
    client.release();
  }
}