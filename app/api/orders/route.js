import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function POST(request) {

  const client = await pool.connect();

  try {

    const body = await request.json();

    const {
      restaurantId,
      customerName,
      tableNumber,
      items,
    } = body;


    /* ================= VALIDATION ================= */

    if (!restaurantId) {

      return NextResponse.json(
        {
          error: "Restaurant is required",
        },
        {
          status: 400,
        }
      );

    }


    if (!customerName?.trim()) {

      return NextResponse.json(
        {
          error: "Customer name is required",
        },
        {
          status: 400,
        }
      );

    }


    if (!tableNumber) {

      return NextResponse.json(
        {
          error: "Table number is required",
        },
        {
          status: 400,
        }
      );

    }


    if (!items || items.length === 0) {

      return NextResponse.json(
        {
          error:
            "Order must contain at least one item",
        },
        {
          status: 400,
        }
      );

    }


    /* ================= START TRANSACTION ================= */

    await client.query("BEGIN");


    /* =====================================================
       CHECK IF TABLE IS ALREADY OCCUPIED
    ===================================================== */

    const activeTableResult = await client.query(
      `
      SELECT id, status

      FROM orders

      WHERE restaurant_id = $1
        AND table_number = $2
        AND status != 'paid'

      LIMIT 1
      `,
      [
        restaurantId,
        tableNumber,
      ]
    );


    if (activeTableResult.rows.length > 0) {

      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error:
            `Table ${tableNumber} is currently unavailable. Please select another table.`,
        },
        {
          status: 409,
        }
      );

    }


    /* =====================================================
       CREATE CUSTOMER
    ===================================================== */

    const customerResult = await client.query(
      `
      INSERT INTO customer (name)

      VALUES ($1)

      RETURNING id, name
      `,
      [
        customerName.trim(),
      ]
    );


    const customer =
      customerResult.rows[0];


    /* =====================================================
       GET REAL MENU ITEMS
    ===================================================== */

    const menuItemIds = items.map(
      (item) => Number(item.id)
    );


    const menuResult = await client.query(
      `
      SELECT
        id,
        name,
        price_naira,
        avg_prep_minutes

      FROM menu_item

      WHERE id = ANY($1::int[])
        AND restaurant_id = $2
        AND is_available = true
      `,
      [
        menuItemIds,
        restaurantId,
      ]
    );


    if (
      menuResult.rows.length !== items.length
    ) {

      throw new Error(
        "One or more menu items are unavailable"
      );

    }


    /* =====================================================
       CREATE MENU ITEM LOOKUP
    ===================================================== */

    const menuItemsMap = new Map(

      menuResult.rows.map(
        (item) => [
          item.id,
          item,
        ]
      )

    );


    /* =====================================================
       CALCULATE ESTIMATED WAIT TIME
    ===================================================== */

    const estimatedWaitMinutes = Math.max(

      ...menuResult.rows.map(
        (item) =>
          item.avg_prep_minutes || 0
      )

    );


    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const orderResult = await client.query(
      `
      INSERT INTO orders (

        restaurant_id,
        customer_id,
        table_number,
        estimated_wait_minutes

      )

      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,
      [
        restaurantId,
        customer.id,
        tableNumber,
        estimatedWaitMinutes,
      ]
    );


    const order =
      orderResult.rows[0];


    /* =====================================================
       CREATE ORDER ITEMS
    ===================================================== */

    for (const item of items) {

      const menuItem =
        menuItemsMap.get(
          Number(item.id)
        );


      await client.query(
        `
        INSERT INTO order_item (

          order_id,
          menu_item_id,
          quantity,
          unit_price_naira

        )

        VALUES ($1, $2, $3, $4)
        `,
        [
          order.id,
          menuItem.id,
          item.quantity,
          menuItem.price_naira,
        ]
      );

    }


    /* ================= COMMIT ================= */

    await client.query("COMMIT");


    return NextResponse.json(

      {

        message:
          "Order created successfully",

        order: {

          id: order.id,

          customerName:
            customer.name,

          tableNumber:
            order.table_number,

          estimatedWaitMinutes:
            order.estimated_wait_minutes,

          status:
            order.status,

        },

      },

      {
        status: 201,
      }

    );


  } catch (error) {


    await client.query("ROLLBACK");


    console.error(
      "Error creating order:",
      error
    );


    return NextResponse.json(

      {

        error:

          error.message ||

          "Failed to create order",

      },

      {
        status: 500,
      }

    );


  } finally {

    client.release();

  }

}