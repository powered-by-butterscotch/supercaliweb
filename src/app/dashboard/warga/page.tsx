"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, Plus, LogOut, User, ShieldCheck } from "lucide-react";

export default function WargaDashboard() {
  const [discordUsername, setDiscordUsername] = useState("Warga Sipil");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const user = params.get("user");
      if (user) {
        setDiscordUsername(user);
      }

      fetchWargaApplications();
    }
  }, []);

  const fetchWargaApplications = async () => {
    setLoading(true);
    let localSaved: any = null;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("supercali_active_application");
        if (raw) localSaved = JSON.parse(raw);
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (localSaved) {
      setApplications([localSaved]);
    }
    setLoading(false);
  };

  const activeApp = applications.length > 0 ? applications[0] : null;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0b0713] text-gray-200">
      
      {/* Top Header */}
      <header className="px-6 py-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/login" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-black text-base text-white tracking-wider flex items-center gap-2">
              PORTAL WARGA SUPERCALI <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold">CITIZEN HUB</span>
            </h1>
            <p className="text-[10px] text-gray-400">Pusat Informasi & Status Permohonan Berkas Warga Kota</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center font-bold text-[10px] text-white uppercase">
              {discordUsername.substring(0, 2)}
            </div>
            <span className="text-xs font-bold text-gray-200 font-mono">@{discordUsername}</span>
          </div>

          <Link href="/dashboard/login" className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition text-xs font-bold flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-slate-950 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase tracking-widest">
              ● STATUT WARGA AKTIF
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Selamat Datang, {discordUsername}!</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Pantau status verifikasi berkas permohonan Anda (SIM, Surat Sehat, Akta Pernikahan, atau Lisensi Senjata) secara real-time langsung dari dashboard warga ini.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link 
              href={`/dashboard/job?user=${discordUsername}`}
              className="px-5 py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 font-black text-emerald-300 text-xs shadow-lg transition flex items-center gap-2"
            >
              💼 Melamar Pekerjaan
            </Link>

            <Link 
              href={`/dashboard/apply?user=${discordUsername}`}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-black text-white text-xs shadow-lg shadow-purple-600/25 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Buat Permohonan Berkas
            </Link>
          </div>
        </div>

        {/* Content Section: Active Application Card & Official Document Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Application Tracker Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Status Pengajuan Berkas
                </h3>
                <span className="text-[10px] text-gray-400">Terakhir Diperbarui</span>
              </div>

              {loading ? (
                <div className="py-8 text-center space-y-2">
                  <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-400">Memuat status pengajuan...</p>
                </div>
              ) : activeApp ? (
                <div className="space-y-4">
                  
                  {/* Status Badge */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS AKSES:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                        activeApp.status === "APPROVED" 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                          : activeApp.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                      }`}>
                        ● {activeApp.status === "APPROVED" ? "DISETUJUI (APPROVED)" : activeApp.status === "REJECTED" ? "DITOLAK (REJECTED)" : "MENUNGGU ACC (PENDING)"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-white">{activeApp.sim_type}</h4>
                      <p className="text-xs text-purple-300">Pemohon: <strong>{activeApp.full_name}</strong> (NIK: {activeApp.nik})</p>
                    </div>

                    <div className="text-[11px] text-gray-300 pt-1 border-t border-white/5">
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">ALASAN / TUJUAN PERMOHONAN:</span>
                      <p className="italic mt-0.5 text-gray-300">&ldquo;{activeApp.sim_number || "Pengajuan izin resmi kota."}&rdquo;</p>
                    </div>
                  </div>

                  {/* Informational Box */}
                  {activeApp.status === "APPROVED" ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-bold flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        🎉 Selamat! Permohonan Anda telah disetujui resmi oleh Petugas Instansi. Dokumen A4 di sebelah kanan telah aktif dan siap dicetak / disimpan ke PDF!
                      </div>
                    </div>
                  ) : activeApp.status === "REJECTED" ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 leading-relaxed font-bold flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        Mohon maaf, permohonan Anda ditolak oleh petugas. Silakan periksa kembali kelengkapan syarat dan ajukan permohonan baru.
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-bold flex items-start gap-2.5">
                      <Clock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5 animate-spin" />
                      <div>
                        Berkas Anda sedang dalam antrean verifikasi oleh petugas instansi ter-whitelist. Hasil approval akan muncul otomatis di halaman ini.
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-2xl">
                    📑
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white">Belum Ada Permohonan Aktif</h4>
                    <p className="text-[11px] text-gray-400">Silakan ajukan permohonan baru ke loket instansi.</p>
                  </div>
                  <Link 
                    href={`/dashboard/apply?user=${discordUsername}`}
                    className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition shadow"
                  >
                    + Ajukan Permohonan Sekarang
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: A4 Official Document Output Preview (ONLY VISIBLE WHEN APPROVED) */}
          <div className="lg:col-span-7 flex justify-center">
            {activeApp && activeApp.status === "APPROVED" ? (
              <div className="w-full max-w-[210mm] min-h-[297mm] bg-[#faf8f5] text-slate-900 border-8 border-double border-amber-800/35 shadow-2xl p-8 md:p-12 flex flex-col justify-between font-serif relative overflow-hidden rounded-2xl">
                
                {/* Watermark Accent */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <div className="text-[100px] font-bold rotate-45 border-8 border-slate-950 p-10 rounded-full">SUPERCALI</div>
                </div>

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b-4 border-double border-amber-900 pb-4 mb-6">
                    <div className="h-14 w-14 rounded-full bg-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-600/30">
                      ⚕️
                    </div>
                    
                    <div className="text-center flex-1 px-4">
                      <h2 className="font-extrabold text-xl tracking-wide uppercase text-slate-950 font-sans font-black">
                        CITY OF SUPERCALI GOVERNMENT
                      </h2>
                      <p className="text-[10px] font-black tracking-widest text-amber-900 font-sans mt-0.5 uppercase">
                        STATE REGISTRY & OFFICIAL PERMIT DIVISION
                      </p>
                      <p className="text-[8px] italic text-slate-500 mt-1 font-sans font-medium">
                        City Hall Building, 42 Vinewood Boulevard, Supercali State • www.supercali.tech
                      </p>
                    </div>

                    <div className="h-14 w-14 flex items-center justify-center font-bold text-2xl border-2 border-amber-800/40 rounded-full shadow-inner bg-amber-500/5">
                      🦅
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="text-center my-6 space-y-1">
                    <h3 className="font-black text-lg tracking-wider uppercase text-slate-950 font-serif underline decoration-amber-900 decoration-2 underline-offset-4">
                      {activeApp.sim_type}
                    </h3>
                    <p className="text-[10px] text-slate-600 font-sans font-bold tracking-widest uppercase">
                      Permit ID: {activeApp.id || "042/EMS/MED/2026"}
                    </p>
                  </div>

                  {/* Details Table */}
                  <div className="space-y-5 text-xs leading-relaxed text-slate-800 font-serif px-2">
                    <p className="text-justify">
                      This official state document certifies that the following citizen identity has been registered and verified by the State Government of Supercali Roleplay:
                    </p>

                    <table className="w-full text-left font-sans text-xs border-collapse ml-2 bg-white/40 border border-slate-200/60 rounded-xl shadow-sm">
                      <tbody>
                        <tr className="border-b border-slate-200/60">
                          <td className="py-2.5 px-3 font-extrabold w-1/3 text-slate-500 uppercase tracking-wider">Nama Lengkap IC</td>
                          <td className="py-2.5 px-3 text-slate-950 font-extrabold text-xs">
                            {activeApp.full_name}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200/60">
                          <td className="py-2.5 px-3 font-extrabold text-slate-500 uppercase tracking-wider">ID Discord / NIK</td>
                          <td className="py-2.5 px-3 font-mono text-slate-900 font-bold">
                            @{activeApp.discord_username} (NIK: {activeApp.nik})
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200/60">
                          <td className="py-2.5 px-3 font-extrabold text-slate-500 uppercase tracking-wider">Golongan Berkas</td>
                          <td className="py-2.5 px-3 text-slate-950 font-bold">
                            {activeApp.sim_type}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-extrabold text-slate-500 uppercase tracking-wider">Status Validasi</td>
                          <td className="py-2.5 px-3 text-emerald-800 font-black">
                            ● VALID & APPROVED
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-1 font-serif">
                      <p className="font-bold text-slate-900 text-[10px] uppercase tracking-wider font-sans mb-1">Keterangan / Deskripsi Resmi:</p>
                      <p className="pl-4 border-l-4 border-amber-800 italic text-slate-800 bg-[#f3efe6] p-3 rounded-xl font-serif text-xs">
                        &ldquo;{activeApp.sim_number || "Dinyatakan sah dan berlaku sesuai hukum pemerintahan kota Supercali."}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-end mt-10 pt-4 border-t border-slate-200">
                  <div className="text-center font-sans text-[10px]">
                    <p className="text-slate-500 mb-1">QR Validasi Asli</p>
                    <div className="h-14 w-14 border-2 border-slate-800 p-1 mx-auto flex flex-col justify-between">
                      <div className="flex justify-between"><div className="h-2.5 w-2.5 bg-slate-900"/><div className="h-2.5 w-2.5 bg-slate-900"/></div>
                      <div className="text-[5px] font-mono leading-none tracking-tighter text-slate-700">SUPERCALI CITY</div>
                      <div className="flex justify-between"><div className="h-2.5 w-2.5 bg-slate-900"/><div className="h-2.5 w-2.5 bg-slate-900"/></div>
                    </div>
                  </div>

                  <div className="text-center font-sans text-xs w-48">
                    <p className="text-slate-500 mb-1 text-[10px]">City of Supercali</p>
                    <p className="font-bold text-slate-800 text-xs">Official State Department</p>
                    <div className="h-8 flex items-center justify-center font-script text-amber-900 font-bold text-sm italic">
                      Supercali State Seal
                    </div>
                    <p className="text-[9px] text-slate-500 border-t border-slate-400 pt-0.5">Verified Government Officer</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="w-full glass rounded-3xl p-10 border border-white/10 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
                <div className="h-16 w-16 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  📜
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="font-extrabold text-base text-white">Dokumen Resmi Belum Diterbitkan</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Lembar cetak fisik A4 ini hanya akan tampil setelah pengajuan berkas Anda **di-ACC resmi oleh Petugas Instansi**.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  ● Status: Menunggu Approval Officer
                </span>
              </div>
            )}
          </div>

        </div>

      </main>

    </div>
  );
}
