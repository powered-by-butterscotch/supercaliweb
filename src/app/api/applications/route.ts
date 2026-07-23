import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Temporary in-memory fallback store when Supabase SQL table is missing
let localApplications: any[] = [];

export async function GET() {
  const { data, error } = await supabase
    .from("whitelist_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // If table doesn't exist yet in Supabase schema, serve local fallback
    return NextResponse.json(localApplications);
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = {
      id: "app_" + Date.now(),
      discord_username: body.discord_username || "Warga",
      full_name: body.full_name,
      birth_place: body.birth_place,
      birth_date: body.birth_date,
      gender: body.gender,
      phone: body.phone,
      nik: body.nik,
      ktp_address: body.ktp_address,
      occupation: body.occupation,
      sim_type: body.sim_type,
      sim_number: body.sim_number,
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("whitelist_applications")
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      // Fallback: If table is missing, push to local memory store and return success
      localApplications.unshift(newRecord);
      return NextResponse.json(newRecord);
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("whitelist_applications")
      .update({ status: body.status })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      localApplications = localApplications.map(item => item.id === body.id ? { ...item, status: body.status } : item);
      return NextResponse.json({ id: body.id, status: body.status });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
