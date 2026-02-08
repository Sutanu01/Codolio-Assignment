/**
 * CRUD API for the sheet.
 * In an actual application, these handlers would read/write to a database
 * (e.g. Prisma + PostgreSQL). Here we use in-memory / raw data only.
 */

import { NextRequest, NextResponse } from "next/server";
import { sampleSheet } from "@/data/sample-sheet";
import type { Sheet } from "@/types/sheet";

let sheetData: Sheet = JSON.parse(JSON.stringify(sampleSheet));

export async function GET() {
  try {
    return NextResponse.json(sheetData);
  } catch (err) {
    console.error("GET /api/sheet error:", err);
    return NextResponse.json(
      { error: "Failed to load sheet" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.sheet) {
      sheetData = body.sheet;
    }
    return NextResponse.json(sheetData);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.sheet) {
      sheetData = body.sheet;
    }
    return NextResponse.json(sheetData);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
