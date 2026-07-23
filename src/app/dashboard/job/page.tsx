"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, User, Building, Phone, Send, CheckCircle, AlertCircle, LogOut, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function JobApplicationForm() {
  const [discordUsername, setDiscordUsername] = useState("Warga Sipil");
  const [step, setStep] = useState(1);
  
  // Job Form Data
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [targetJob, setTargetJob] = useState("police"); // police, emt, mechanic, taxi, doj
  const [rpExperience, setRpExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [playTimeHours, setPlayTimeHours] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const user = params.get("user");
      if (user) {
        setDiscordUsername(user);
        if (!fullName) setFullName(user);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !motivation.trim()) {
      return triggerToast("Mohon lengkapi semua bidang isian formulir lamaran kerja!");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discord_username: discordUsername,
          full_name: fullName,
          phone: phone,
          target_department: targetJob === "police" ? "scvp" : targetJob === "emt" ? "arc" : "doj",
          sim_type: `LAMARAN KERJA: ${targetJob.toUpperCase()} OFFICER`,
          sim_number: `Motivasi: ${motivation} | Jam Terbang: ${playTimeHours || 'Baru'} jam | Pengalaman RP: ${rpExperience || 'Pemula'}`,
          additional_notes: `Lowongan Pekerjaan ${targetJob.toUpperCase()}`
        })
      });

      if (res.ok) {
        setStep(2);
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        triggerToast("Gagal mengirim berkas lamaran kerja!");
      }
    } catch (err) {
      triggerToast("Terjadi masalah koneksi ke server!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-[#0b0713]">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-rose-950 border border-rose-500 text-rose-200 font-extrabold text-xs shadow-2xl animate-bounce">
          <AlertCircle className="w-4 h-4 inline mr-2 text-rose-400" />
          {toastMsg}
        </div>
      )}

      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/warga?user=${discordUsername}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xs font-black text-white tracking-wider flex items-center gap-2">
              LOKET LAMARAN KERJA RESMI <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold">CAREER CENTER</span>
            </h2>
            <p className="text-[10px] text-gray-400">Pendaftaran & Rekrutmen Pegawai Instansi Kota Supercali</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[10px] text-white uppercase">
            {discordUsername.substring(0, 2)}
          </div>
          <span className="text-xs font-bold text-gray-200 font-mono">@{discordUsername}</span>
        </div>
      </header>

      {/* Form Card Container */}
      <div className="w-full max-w-2xl glass rounded-3xl p-6 md:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden space-y-6 mt-12">
        
        {step === 1 ? (
          <form onSubmit={handleSubmitJob} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10">
                💼
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">Formulir Rekrutmen Pekerjaan</h3>
              <p className="text-gray-400 text-xs">Isi kualifikasi karakter RP Anda untuk melamar pekerjaan dinas/instansi.</p>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Select Job Position */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-300 tracking-wider flex items-center justify-between">
                  <span>PILIH POSISI PEKERJAAN TUJUAN</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">WAJIB</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetJob("police")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      targetJob === "police"
                        ? "bg-cyan-600/15 border-cyan-500 text-cyan-300 shadow-lg"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">🚨</span>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-sm text-white">Police Cadet</h4>
                      <p className="text-[10px] text-gray-400">Kepolisian Metro SCVP</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetJob("emt")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      targetJob === "emt"
                        ? "bg-rose-600/15 border-rose-500 text-rose-300 shadow-lg"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">🏥</span>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-sm text-white">EMS Paramedic</h4>
                      <p className="text-[10px] text-gray-400">Tim Medis ARC</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetJob("doj")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      targetJob === "doj"
                        ? "bg-amber-600/15 border-amber-500 text-amber-300 shadow-lg"
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">⚖️</span>
                    <div className="mt-3">
                      <h4 className="font-extrabold text-sm text-white">DOJ / Public Defender</h4>
                      <p className="text-[10px] text-gray-400">Jaksa / Pengacara Hukum</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-300 tracking-wider flex items-center justify-between">
                    <span>NAMA LENGKAP IC</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">WAJIB</span>
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama karakter Roleplay"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-300 tracking-wider flex items-center justify-between">
                    <span>NO. TELEPON KOTA</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">WAJIB</span>
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 555-0199"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none text-xs text-white"
                  />
                </div>
              </div>

              {/* Roleplay Experience & Active Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">PENGALAMAN RP (OPSIONAL)</label>
                  <input 
                    type="text" 
                    value={rpExperience}
                    onChange={(e) => setRpExperience(e.target.value)}
                    placeholder="Contoh: Pernah jadi Paramedic di server A"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">ESTIMASI JAM TERBANG (OPSIONAL)</label>
                  <input 
                    type="text" 
                    value={playTimeHours}
                    onChange={(e) => setPlayTimeHours(e.target.value)}
                    placeholder="Contoh: 150 jam di kota"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none text-xs text-white"
                  />
                </div>
              </div>

              {/* Motivation textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-300 tracking-wider flex items-center justify-between">
                  <span>MOTIVASI & ALASAN MELAMAR PEKERJAAN</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">WAJIB</span>
                </label>
                <textarea 
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Jelaskan alasan mengapa Anda tertarik bergabung dengan instansi ini dan kontribusi yang akan Anda berikan..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none text-xs text-white resize-none"
                />
              </div>

            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Mengirimkan Lamaran..." : "Kirimkan Lamaran Kerja"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-2xl text-white">Lamaran Kerja Berhasil Terkirim!</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                Terima kasih, <strong>{fullName}</strong>! Berkas pendaftaran lamaran posisi <strong>{targetJob.toUpperCase()} OFFICER</strong> telah dikirimkan ke Direktur instansi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 font-mono text-xs text-gray-300 text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">STATUS REKRUTMEN:</span>
                <span className="font-extrabold text-amber-400">● TAHAP SELEKSI (PENDING)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">POSISI DILAMAR:</span>
                <span className="font-extrabold text-emerald-300">{targetJob.toUpperCase()} OFFICER</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center max-w-md mx-auto pt-2">
              <Link href={`/dashboard/warga?user=${discordUsername}`} className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs text-white text-center shadow-lg transition">
                Kembali Ke Dashboard Warga
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
