"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, UserCheck, RefreshCw, LogOut, CheckCircle, XCircle, FileText, Key, Plus } from "lucide-react";

export default function DepartmentDashboard({ params }: { params: { dept?: string } }) {
  // Infer department type from path or state
  const [department, setDepartment] = useState<"police" | "emt" | "doj">("police");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("/emt")) setDepartment("emt");
      else if (path.includes("/doj")) setDepartment("doj");
      else setDepartment("police");
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, setLoginUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Applications & Accounts Data
  const [applications, setApplications] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  // Sub-account creation state for Direktur
  const [newStaffUser, setNewStaffUser] = useState("");
  const [newStaffPass, setNewStaffPass] = useState("");
  const [newStaffName, setNewStaffName] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleDepartmentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username,
          password,
          department
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setLoginUser(data.user);
        fetchData();
      } else {
        setErrorMsg(data.error || "Gagal masuk. Username atau Password salah!");
      }
    } catch (err) {
      setErrorMsg("Terjadi masalah koneksi server!");
    }
  };

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const resApp = await fetch("/api/applications");
      if (resApp.ok) {
        const dataApp = await resApp.json();
        // Filter applications specifically for this department
        const filtered = dataApp.filter((item: any) => {
          if (!item.target_department) return true;
          return item.target_department.toLowerCase() === department.toLowerCase();
        });
        setApplications(filtered);
      }

      const resStaff = await fetch(`/api/auth/staff?dept=${department}`);
      if (resStaff.ok) {
        const dataStaff = await resStaff.json();
        setStaffList(dataStaff);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        triggerToast(`Berkas warga berhasil di-${status === "APPROVED" ? "ACC (DISETUJUI)" : "TOLAK"}!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffUser || !newStaffPass || !newStaffName) {
      return triggerToast("Lengkapi semua isian form pembuat akun staf!");
    }

    try {
      const res = await fetch("/api/auth/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          username: newStaffUser,
          password: newStaffPass,
          display_name: newStaffName,
          department,
          created_by: loginUser?.display_name || "Direktur"
        })
      });

      if (res.ok) {
        triggerToast(`Akun Staf/Anggota ${newStaffName} (@${newStaffUser}) Berhasil Diterbitkan!`);
        setNewStaffUser("");
        setNewStaffPass("");
        setNewStaffName("");
        fetchData();
      }
    } catch (err) {
      triggerToast("Gagal menerbitkan akun baru!");
    }
  };

  const deptMeta = {
    police: {
      title: "SCVP POLICE METRO DIVISION",
      subtitle: "Portal Pengesahan SIM, Izin Senjata, & Penugasan Kepolisian",
      badge: "🚨 KEPOLISIAN METRO",
      bgGradient: "from-cyan-950 via-[#0b0713] to-slate-950",
      accent: "cyan"
    },
    emt: {
      title: "ARC MEDICAL & HEALTHCARE",
      subtitle: "Portal Pengesahan Surat Sehat Jasmani, Psikologi, & Bebas Narkoba",
      badge: "🏥 KEDOKTERAN & MEDIS",
      bgGradient: "from-rose-950 via-[#0b0713] to-slate-950",
      accent: "rose"
    },
    doj: {
      title: "DOJ KEMENKUMHAM & CATATAN SIPIL",
      subtitle: "Portal Legalitas Akta Nikah, Izin Usaha Toko, & Organisasi",
      badge: "⚖️ CATATAN SIPIL & LAW",
      bgGradient: "from-amber-950 via-[#0b0713] to-slate-950",
      accent: "amber"
    }
  }[department];

  if (!isLoggedIn) {
    return (
      <div className={`flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-b ${deptMeta.bgGradient}`}>
        <Link href="/dashboard/login" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1.5 text-sm font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Portal Login
        </Link>

        <div className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              {deptMeta.badge}
            </span>
            <h2 className="text-2xl font-black text-white mt-2">{deptMeta.title}</h2>
            <p className="text-xs text-gray-400">{deptMeta.subtitle}</p>
          </div>

          <form onSubmit={handleDepartmentLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">USERNAME LOG-IN *</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: kapolda_mulyono / dr_siti"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">PASSWORD *</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            {errorMsg && (
              <p className="text-[10px] text-rose-400 font-medium">{errorMsg}</p>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-extrabold text-white text-xs shadow-lg transition"
            >
              Masuk Portal Instansi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0b0713] text-gray-200">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-900 border border-emerald-500 text-white font-extrabold text-xs shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-4 bg-black/50 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded bg-white/10 text-purple-300">
              {deptMeta.badge}
            </span>
            <h1 className="font-extrabold text-base text-white tracking-wide">{deptMeta.title}</h1>
          </div>
          <p className="text-[10px] text-gray-400">Selamat bertugas, <strong>{loginUser?.display_name}</strong>!</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direktur Account Generator for Sub-Staff */}
        <div className="lg:col-span-5 glass rounded-3xl p-6 border border-white/10 space-y-6">
          <div className="space-y-1 border-b border-white/5 pb-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" /> Terbitkan Akun Staf/Anggota
            </h3>
            <p className="text-xs text-gray-400">Khusus Direktur: Buatkan akun staf tambahan untuk instansi Anda.</p>
          </div>

          <form onSubmit={handleCreateSubAccount} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">NAMA ANGGOTA / STAF *</label>
              <input 
                type="text" 
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Contoh: Bripka Ucup Slebew"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">USERNAME *</label>
                <input 
                  type="text" 
                  value={newStaffUser}
                  onChange={(e) => setNewStaffUser(e.target.value)}
                  placeholder="e.g. ucup_police"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">PASSWORD *</label>
                <input 
                  type="text" 
                  value={newStaffPass}
                  onChange={(e) => setNewStaffPass(e.target.value)}
                  placeholder="e.g. ucup123"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs shadow-lg transition"
            >
              + Terbitkan Akun Staf Baru
            </button>
          </form>

          {/* List of Department Accounts */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <h4 className="font-extrabold text-xs text-gray-300 uppercase tracking-wider">Anggota/Staf Terdaftar ({staffList.length})</h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {staffList.map((st, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white">{st.display_name}</h5>
                    <p className="text-[10px] text-gray-400 font-mono">
                      User: <strong className="text-purple-300">{st.username}</strong> | Pass: <strong className="text-amber-300">{st.password_hash}</strong>
                    </p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    AKTIFF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Application Approval Manager */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" /> Permohonan Dokumen Warga
              </h3>
              <p className="text-xs text-gray-400">Tinjau dan ACC pengajuan berkas warga khusus instansi ini.</p>
            </div>
            
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Cari nama / NIK pemohon..."
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-purple-500 w-full sm:w-48"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                  <th className="pb-3 w-1/4">Pemohon</th>
                  <th className="pb-3 w-1/4">Dokumen</th>
                  <th className="pb-3 w-1/3">Detail Permohonan</th>
                  <th className="pb-3 w-1/5 text-right">Aksi Approval</th>
                </tr>
              </thead>
              <tbody>
                {applications.filter(app => {
                  if (!searchTerm) return true;
                  const term = searchTerm.toLowerCase();
                  return (
                    (app.full_name || "").toLowerCase().includes(term) ||
                    (app.nik || "").toLowerCase().includes(term) ||
                    (app.discord_username || "").toLowerCase().includes(term)
                  );
                }).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 font-semibold">
                      Tidak ada permohonan yang sesuai dengan kata kunci pencarian.
                    </td>
                  </tr>
                ) : (
                  applications
                    .filter(app => {
                      if (!searchTerm) return true;
                      const term = searchTerm.toLowerCase();
                      return (
                        (app.full_name || "").toLowerCase().includes(term) ||
                        (app.nik || "").toLowerCase().includes(term) ||
                        (app.discord_username || "").toLowerCase().includes(term)
                      );
                    })
                    .map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4">
                        <span className="font-bold text-white block">{app.full_name}</span>
                        <span className="text-[10px] text-purple-300 font-mono">@{app.discord_username}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-amber-300 block">{app.sim_type}</span>
                        <span className="text-[10px] text-gray-400">NIK: {app.nik || "-"}</span>
                      </td>
                      <td className="py-4 text-gray-300">
                        <p className="line-clamp-2 text-[11px] italic">{app.sim_number || "Tidak ada rincian"}</p>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {app.status === "PENDING" ? (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[10px] transition shadow"
                            >
                              ACC
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-[10px] transition"
                            >
                              Tolak
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${app.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"}`}>
                            ● {app.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
}
