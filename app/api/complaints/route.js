import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      orderId,
      customerId,
      description,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order is required" },
        { status: 400 }
      );
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer is required" },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Please enter your complaint" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO complaint (
        order_id,
        customer_id,
        description
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        orderId,
        customerId,
        description.trim(),
      ]
    );

    return NextResponse.json(
      {
        message: "Complaint submitted successfully",
        complaint: result.rows[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Error submitting complaint:",
      error
    );

    return NextResponse.json(
      { error: "Failed to submit complaint" },
      { status: 500 }
    );
  }
}