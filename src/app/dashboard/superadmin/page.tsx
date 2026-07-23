"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Shield, CheckCircle, XCircle, LogOut, Key, UserCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function SuperadminAccountManager() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Create Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [department, setDepartment] = useState("police"); // police, emt, doj
  const [role, setRole] = useState("dinas"); // dinas (Staff/Direktur)

  // Accounts & Applications Lists
  const [accounts, setAccounts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((adminUsername === "admin" || adminUsername === "superadmin") && (adminPassword === "admin123" || adminPassword === "superadmin123")) {
      setIsLoggedIn(true);
      setLoginError("");
      fetchData();
    } else {
      setLoginError("Username atau Password Superadmin salah! Akses ditolak.");
    }
  };

  const fetchData = async () => {
    try {
      const resAcc = await fetch("/api/auth/staff");
      if (resAcc.ok) {
        const dataAcc = await resAcc.json();
        setAccounts(dataAcc);
      }

      const resApp = await fetch("/api/applications");
      if (resApp.ok) {
        const dataApp = await resApp.json();
        setApplications(dataApp);
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !displayName) {
      return triggerToast("Lengkapi semua isian form pembuat akun!");
    }

    try {
      const res = await fetch("/api/auth/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          username,
          password,
          display_name: displayName,
          department,
          role,
          created_by: "Superadmin"
        })
      });

      if (res.ok) {
        triggerToast(`Akun Direktur/Staff ${displayName} (@${username}) Berhasil Dibuat!`);
        setUsername("");
        setPassword("");
        setDisplayName("");
        fetchData();
      } else {
        triggerToast("Gagal membuat akun!");
      }
    } catch (err) {
      triggerToast("Terjadi masalah jaringan!");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        triggerToast(`Status berkas pengajuan berhasil diubah ke ${status}!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-[#0b0713]">
        <Link href="/dashboard/login" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1.5 text-sm font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Portal Login
        </Link>

        <div className="w-full max-w-md glass rounded-3xl p-8 border border-purple-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 bg-purple-600/20 border border-purple-500/40 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              👑
            </div>
            <h2 className="text-2xl font-black text-white">Superadmin Control Portal</h2>
            <p className="text-xs text-gray-400">Pusat Kelola Akun Direktur Instansi & Permohonan Warga</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">USERNAME SUPERADMIN</label>
              <input 
                type="text" 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="superadmin"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">PASSWORD SUPERADMIN</label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            {loginError && (
              <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs shadow-lg shadow-purple-600/20 transition"
            >
              Masuk Portal Superadmin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0b0713] text-gray-200">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-purple-900 border border-purple-500 text-white font-extrabold text-xs shadow-2xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-lg text-purple-300">
            👑
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-wide">SUPERADMIN MANAGEMENT PORTAL</h1>
            <p className="text-[10px] text-gray-400">Pusat Pembuatan Akun Direktur EMT / Police / DOJ & Approval Dokumen</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
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
        
        {/* Left Column: Account Creation Form */}
        <div className="lg:col-span-5 glass rounded-3xl p-6 border border-purple-500/20 space-y-6">
          <div className="space-y-1 border-b border-white/5 pb-4">
            <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" /> Buat Akun Direktur & Staff
            </h3>
            <p className="text-xs text-gray-400">Tambahkan kredensial masuk baru untuk pejabat instansi.</p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">NAMA LENGKAP / JABATAN DIREKTUR *</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Dr. Siti Arcane (Direktur ARC)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">USERNAME LOG-IN *</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr_siti"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">PASSWORD *</label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. ems123"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">INSTANSI TUJUAN AKUN *</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f0d19] border border-white/10 focus:border-purple-500 outline-none text-xs text-white font-bold"
              >
                <option value="police">🚨 SCVP Police Metro (/dashboard/police)</option>
                <option value="emt">🏥 ARC Medis EMT (/dashboard/emt)</option>
                <option value="doj">⚖️ DOJ Kemenkumham (/dashboard/doj)</option>
                <option value="all">👑 All Access (Direktur Utama)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs shadow-lg transition"
            >
              + Terbitkan Akun Baru
            </button>
          </form>

          {/* List of Registered Accounts */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <h4 className="font-extrabold text-xs text-gray-300 uppercase tracking-wider">Daftar Akun Terdaftar ({accounts.length})</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {accounts.map((acc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white">{acc.display_name}</h5>
                    <p className="text-[10px] text-gray-400 font-mono">
                      User: <strong className="text-purple-300">{acc.username}</strong> | Pass: <strong className="text-amber-300">{acc.password_hash}</strong>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    acc.department === "police" ? "bg-cyan-500/20 text-cyan-300" : acc.department === "emt" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {acc.department}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Citizen Applications Acc Manager */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 border border-purple-500/20 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" /> Permohonan Dokumen Warga (Approval)
              </h3>
              <p className="text-xs text-gray-400">ACC atau Tolak pengajuan berkas warga dari semua instansi.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-600/30 text-purple-200 border border-purple-500/40">
              Total: {applications.length} Berkas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                  <th className="pb-3 w-1/4">Pemohon (NIK)</th>
                  <th className="pb-3 w-1/4">Jenis Dokumen</th>
                  <th className="pb-3 w-1/3">Alasan Permohonan</th>
                  <th className="pb-3 w-1/5 text-right">Aksi Acc</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 font-semibold">
                      Belum ada berkas pengajuan dari warga.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4">
                        <span className="font-bold text-white block">{app.full_name}</span>
                        <span className="text-[10px] text-purple-300 font-mono">@{app.discord_username}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-amber-300 block">{app.sim_type}</span>
                        <span className="text-[10px] text-gray-400">Instansi: {app.target_department || "SCVP"}</span>
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
