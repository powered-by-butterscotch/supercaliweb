import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

// In-memory accounts store for accounts created dynamically by Superadmin/Direktur
let staffAccountsStore: any[] = [
  { id: "acc_police_1", username: "kapolda_mulyono", password_hash: "police123", role: "dinas", department: "police", display_name: "Kapolda Mulyono", created_by: "Superadmin" },
  { id: "acc_ems_1", username: "dr_siti_arcane", password_hash: "dr_siti", role: "dinas", department: "emt", display_name: "Dr. Siti Arcane (Direktur Medis)", created_by: "Superadmin" },
  { id: "acc_doj_1", username: "hakim_rizzler", password_hash: "doj123", role: "dinas", department: "doj", display_name: "Hakim Agung Rizzler", created_by: "Superadmin" }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dept = searchParams.get("dept");

  const { data, error } = await supabase
    .from("staff_accounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    let result = staffAccountsStore;
    if (dept && dept !== "all") {
      result = result.filter(item => item.department === dept);
    }
    return NextResponse.json(result);
  }

  let finalData = data;
  if (dept && dept !== "all") {
    finalData = finalData.filter((item: any) => item.department === dept);
  }
  return NextResponse.json(finalData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // LOGIN ACTION
    if (body.action === "login") {
      const { username, password, department } = body;
      
      // Check database first
      const { data, error } = await supabase
        .from("staff_accounts")
        .select("*")
        .eq("username", username)
        .single();

      if (!error && data) {
        if (data.password_hash === password && (!department || data.department === department || data.department === "all" || data.role === "admin")) {
          return NextResponse.json({ success: true, user: data });
        }
      }

      // Check fallback local store
      const localFound = staffAccountsStore.find(
        acc => acc.username.toLowerCase() === (username || "").toLowerCase() && acc.password_hash === password
      );

      if (localFound) {
        if (!department || localFound.department === department || localFound.department === "all" || localFound.role === "admin") {
          return NextResponse.json({ success: true, user: localFound });
        }
      }

      return NextResponse.json({ error: "Username, Password, atau Hak Akses Instansi Tidak Sesuai!" }, { status: 401 });
    }

    // CREATE ACCOUNT ACTION (Superadmin / Direktur)
    if (body.action === "create") {
      const newAcc = {
        id: "acc_" + Date.now(),
        username: body.username.trim().toLowerCase(),
        password_hash: body.password,
        role: body.role || "dinas",
        department: body.department, // emt, police, doj, all
        display_name: body.display_name,
        created_by: body.created_by || "Superadmin",
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("staff_accounts")
        .insert(newAcc)
        .select()
        .single();

      if (error) {
        staffAccountsStore.unshift(newAcc);
        return NextResponse.json({ success: true, account: newAcc });
      }

      return NextResponse.json({ success: true, account: data });
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
