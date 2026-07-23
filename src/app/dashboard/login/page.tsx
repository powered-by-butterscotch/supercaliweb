"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, FileText, CheckSquare, Search, Award, HelpCircle } from "lucide-react";

export default function DiscordLoginPortal() {
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDiscordLogin = () => {
    if (!agreed) {
      setErrorMsg("Kamu harus menyetujui pernyataan integritas data warga terlebih dahulu!");
      return;
    }
    setErrorMsg("");
    // Redirect to multi-step apply identity form page
    window.location.href = "/dashboard/apply";
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-[#0b0713]">
      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1.5 text-sm font-semibold transition">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="w-full max-w-md glass rounded-3xl p-6 md:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Decorative background lights */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-2xl shadow-purple-500/5">
            ⚖️
          </div>
          <h2 className="text-2xl font-black text-white">Supercali Loket</h2>
          <p className="text-gray-400 text-xs tracking-wide">Portal Layanan & Pengajuan Warga</p>
        </div>

        {/* Action card information */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-sm text-white border-b border-white/5 pb-2">
            {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("portal") === "admin" && "Portal Owner / Admin Kota"}
            {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("portal") === "staff" && "Portal Pegawai & Staf Dinas"}
            {(typeof window === "undefined" || (typeof window !== "undefined" && !["admin", "staff"].includes(new URLSearchParams(window.location.search).get("portal") || ""))) && "Portal Layanan Warga Sipil"}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Pilih jenis portal masuk di bawah ini. Warga menggunakan Discord, sedangkan Pegawai/Direktur Instansi menggunakan Username & Password resmi.
          </p>

          {/* Quick Department Portals */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href="/dashboard/superadmin" className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-[10px] font-bold text-purple-200 text-center transition flex items-center justify-center gap-1">
              👑 Superadmin
            </Link>
            <Link href="/dashboard/police" className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-[10px] font-bold text-cyan-200 text-center transition flex items-center justify-center gap-1">
              🚨 SCVP Police
            </Link>
            <Link href="/dashboard/emt" className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-[10px] font-bold text-rose-200 text-center transition flex items-center justify-center gap-1">
              🏥 ARC Medis
            </Link>
            <Link href="/dashboard/doj" className="p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-[10px] font-bold text-amber-200 text-center transition flex items-center justify-center gap-1">
              ⚖️ DOJ / Hukum
            </Link>
          </div>

          {/* Simulated White-listed Discord accounts list */}
          <div className="space-y-2 text-xs">
            <div className="space-y-2">
              {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("portal") === "admin" && (
                <button
                  onClick={() => {
                    if (!agreed) {
                      setErrorMsg("Kamu harus menyetujui pernyataan integritas data warga terlebih dahulu!");
                      return;
                    }
                    setErrorMsg("");
                    const host = window.location.host;
                    const protocol = window.location.protocol;
                    const clientId = "1526047021654609970";
                    const redirectUri = encodeURIComponent(`${protocol}//${host}/api/auth/discord`);
                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=admin`;
                  }}
                  className="w-full py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] font-extrabold text-white text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.87-.64,1.71-1.32,2.51-2a75.46,75.46,0,0,0,72.63,0c.8,0.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.7,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                  Masuk via Discord Owner (Resmi)
                </button>
              )}

              {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("portal") === "staff" && (
                <button
                  onClick={() => {
                    if (!agreed) {
                      setErrorMsg("Kamu harus menyetujui pernyataan integritas data warga terlebih dahulu!");
                      return;
                    }
                    setErrorMsg("");
                    const host = window.location.host;
                    const protocol = window.location.protocol;
                    const clientId = "1526047021654609970";
                    const redirectUri = encodeURIComponent(`${protocol}//${host}/api/auth/discord`);
                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=staff`;
                  }}
                  className="w-full py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] font-extrabold text-white text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.87-.64,1.71-1.32,2.51-2a75.46,75.46,0,0,0,72.63,0c.8,0.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.7,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                  Masuk via Discord Staf (Resmi)
                </button>
              )}

              {typeof window !== "undefined" && !["admin", "staff"].includes(new URLSearchParams(window.location.search).get("portal") || "") && (
                <button
                  onClick={() => {
                    if (!agreed) {
                      setErrorMsg("Kamu harus menyetujui pernyataan integritas data warga terlebih dahulu!");
                      return;
                    }
                    setErrorMsg("");
                    const host = window.location.host;
                    const protocol = window.location.protocol;
                    const clientId = "1526047021654609970";
                    const redirectUri = encodeURIComponent(`${protocol}//${host}/api/auth/discord`);
                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=warga`;
                  }}
                  className="w-full py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] font-extrabold text-white text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.87-.64,1.71-1.32,2.51-2a75.46,75.46,0,0,0,72.63,0c.8,0.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.7,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                  Masuk via Discord (Resmi)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Capabilities List */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase text-center">LAYANAN YANG TERSEDIA</p>
          
          <div className="space-y-2.5 text-xs text-gray-300">
            <div className="flex gap-3 items-start">
              <FileText className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Cetak Dokumen Resmi</strong> — Cetak surat sehat ARC, izin jalan SCVP, atau akta nikah.
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Search className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Akses MDT Kriminal</strong> — Cek daftar pencarian orang (DPO) Vibe Patrol.
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <Award className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Verifikasi Warga</strong> — Status pendaftaran whitelist tersinkronisasi otomatis.
              </div>
            </div>
          </div>
        </div>

        {/* Agreement toggle */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <label className="flex gap-2.5 items-start cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 rounded bg-white/5 border border-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
            />
            <span className="text-[10px] leading-relaxed text-gray-400 group-hover:text-gray-300 select-none">
              Pastikan Anda sudah login Discord di browser. Dengan login, saya menyetujui bahwa data IC yang dimasukkan adalah benar, sah, dan hanya bersifat keperluan roleplay (IC).
            </span>
          </label>

          {errorMsg && (
            <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> {errorMsg}
            </p>
          )}
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[9px] text-gray-500 text-center leading-normal">
          Semua aktivitas di portal ini terekam log in-game dan tidak dapat digunakan untuk keperluan penyalahgunaan di luar roleplay Supercali.
        </p>

      </div>
    </div>
  );
}
