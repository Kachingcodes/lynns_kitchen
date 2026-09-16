import { NextResponse } from "next/server";
import pool from "../../../lib/db";


export async function GET(request) {

  try {

    /*
      Get all tables that currently have an order
      that has NOT been paid.
    */

    const result = await pool.query(`
      SELECT DISTINCT table_number
      FROM orders
      WHERE status != 'paid'
        AND table_number IS NOT NULL
    `);


    /*
      Convert occupied tables into numbers.

      Example:
      [1, 3, 7]
    */

    const occupiedTables = result.rows.map(
      (row) => Number(row.table_number)
    );


    /*
      Generate all restaurant tables.

      Currently:
      Table 1 → Table 20
    */

    const allTables = Array.from(
      { length: 20 },
      (_, index) => index + 1
    );


    /*
      Only return tables that are NOT occupied.
    */

    const availableTables = allTables.filter(
      (table) => !occupiedTables.includes(table)
    );


    return NextResponse.json({

      availableTables,

      occupiedTables,

    });


  } catch (error) {

    console.error(
      "Error fetching available tables:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Failed to fetch available tables",
      },
      {
        status: 500,
      }
    );

  }

}