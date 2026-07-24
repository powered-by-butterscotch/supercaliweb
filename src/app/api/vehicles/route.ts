import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Sample initial data for Management Vehicle Balancing Report
let vehicleBalancingStore: any[] = [
  {
    id: "veh_1",
    model_name: "Elegy RH8 Custom",
    vehicle_class: "Sports / tuner",
    top_speed_mph: 138,
    acceleration_sec: 3.2,
    handling_score: "9.2/10",
    braking_score: "8.8/10",
    drivetrain: "AWD",
    tier_category: "Tier S (High End)",
    balance_status: "BALANCED",
    nerf_buff_note: "Handling slightly smoothed out for city corners.",
    price_ic: "$450,000",
    last_updated: "2026-07-24"
  },
  {
    id: "veh_2",
    model_name: "Vapid Dominator GTX",
    vehicle_class: "Muscle",
    top_speed_mph: 132,
    acceleration_sec: 3.6,
    handling_score: "7.9/10",
    braking_score: "7.5/10",
    drivetrain: "RWD",
    tier_category: "Tier A (Muscle)",
    balance_status: "BUFFED",
    nerf_buff_note: "Increased low-end torque by +8% for better drift control.",
    price_ic: "$280,000",
    last_updated: "2026-07-22"
  },
  {
    id: "veh_3",
    model_name: "Vapid Police Cruiser (SCVP)",
    vehicle_class: "Emergency (Police)",
    top_speed_mph: 142,
    acceleration_sec: 3.0,
    handling_score: "9.0/10",
    braking_score: "9.1/10",
    drivetrain: "AWD",
    tier_category: "Interceptor",
    balance_status: "BALANCED",
    nerf_buff_note: "Official police interceptor spec tuned for pursuit.",
    price_ic: "Dinas SCVP Only",
    last_updated: "2026-07-20"
  },
  {
    id: "veh_4",
    model_name: "Pegassi Zentorno",
    vehicle_class: "Supercar",
    top_speed_mph: 152,
    acceleration_sec: 2.8,
    handling_score: "9.5/10",
    braking_score: "9.3/10",
    drivetrain: "AWD",
    tier_category: "Tier S+ (Hyper)",
    balance_status: "NERFED",
    nerf_buff_note: "Top speed nerfed by -5 mph to prevent overpower in racing.",
    price_ic: "$1,200,000",
    last_updated: "2026-07-23"
  },
  {
    id: "veh_5",
    model_name: "Bravado Buffalo STX",
    vehicle_class: "Sports / Sedan",
    top_speed_mph: 135,
    acceleration_sec: 3.4,
    handling_score: "8.5/10",
    braking_score: "8.2/10",
    drivetrain: "RWD",
    tier_category: "Tier A (Daily Sports)",
    balance_status: "UNDER_REVIEW",
    nerf_buff_note: "Currently being tested by dev team for braking balance.",
    price_ic: "$320,000",
    last_updated: "2026-07-24"
  }
];

export async function GET() {
  const { data, error } = await supabase
    .from("vehicle_balancing_reports")
    .select("*")
    .order("model_name", { ascending: true });

  if (error || !data || data.length === 0) {
    return NextResponse.json(vehicleBalancingStore);
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVehicle = {
      id: "veh_" + Date.now(),
      model_name: body.model_name,
      vehicle_class: body.vehicle_class,
      top_speed_mph: Number(body.top_speed_mph) || 120,
      acceleration_sec: Number(body.acceleration_sec) || 4.0,
      handling_score: body.handling_score || "8.0/10",
      braking_score: body.braking_score || "8.0/10",
      drivetrain: body.drivetrain || "RWD",
      tier_category: body.tier_category || "Tier A",
      balance_status: body.balance_status || "BALANCED", // BALANCED, NERFED, BUFFED, UNDER_REVIEW
      nerf_buff_note: body.nerf_buff_note || "-",
      price_ic: body.price_ic || "$100,000",
      last_updated: new Date().toISOString().split("T")[0]
    };

    const { data, error } = await supabase
      .from("vehicle_balancing_reports")
      .insert(newVehicle)
      .select()
      .single();

    if (error) {
      vehicleBalancingStore.unshift(newVehicle);
      return NextResponse.json(newVehicle);
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
      .from("vehicle_balancing_reports")
      .update({
        balance_status: body.balance_status,
        nerf_buff_note: body.nerf_buff_note,
        top_speed_mph: body.top_speed_mph,
        last_updated: new Date().toISOString().split("T")[0]
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      vehicleBalancingStore = vehicleBalancingStore.map(v => 
        v.id === body.id ? { 
          ...v, 
          balance_status: body.balance_status || v.balance_status,
          nerf_buff_note: body.nerf_buff_note || v.nerf_buff_note,
          top_speed_mph: body.top_speed_mph || v.top_speed_mph,
          last_updated: new Date().toISOString().split("T")[0]
        } : v
      );
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
