"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Shield, CheckCircle, ChevronRight, LogOut } from "lucide-react";
import confetti from "canvas-confetti";

export default function ApplyDataForm() {
  const [step, setStep] = useState(1); // 1: Data Diri, 2: KTP & NIK, 3: SIM, 4: Success
  
  // Form states
  const [fullName, setFullName] = useState("cosmic_frills");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  
  const [nik, setNik] = useState("");
  const [ktpAddress, setKtpAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  
  const [simType, setSimType] = useState("SIM A (Mobil)");
  const [simNumber, setSimNumber] = useState("");

  const handleNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setStep(4);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-[#0b0713]">
      
      {/* Header bar mock */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-black/25 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold border border-purple-500/30">S</div>
          <h2 className="text-xs font-bold text-gray-300 tracking-wider">Supercali Loket <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 ml-1 font-extrabold uppercase">PORTAL</span></h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Avatar simulation */}
            <div className="h-7 w-7 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center font-bold text-xs text-purple-300 overflow-hidden">
              CF
            </div>
            <span className="text-xs font-bold text-gray-300 font-mono">cosmic_frills</span>
          </div>

          <Link href="/dashboard/login" className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 border border-white/5 text-gray-400 hover:text-rose-400 transition flex items-center gap-1 text-[10px] font-bold">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </Link>
        </div>
      </header>

      {/* Main Multi-step Card */}
      <div className="w-full max-w-xl glass rounded-3xl p-6 md:p-8 border border-purple-500/15 shadow-2xl relative overflow-hidden space-y-6 mt-10">
        
        {/* Step Indicator Header */}
        {step < 4 && (
          <div className="text-center space-y-3">
            <div className="h-12 w-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto text-xl">
              👤
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Lengkapi Data Diri</h3>
              <p className="text-gray-400 text-xs">Tahap {step} dari 3 — Isi data diri dasar kamu terlebih dahulu.</p>
            </div>

            {/* Stepper bar layout */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold text-gray-400">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step === 1 ? "bg-purple-600/25 border-purple-500 text-purple-300" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">1</span> Data Diri
              </div>
              <div className="h-0.5 w-6 bg-white/5" />
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step === 2 ? "bg-purple-600/25 border-purple-500 text-purple-300" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">2</span> KTP & NIK
              </div>
              <div className="h-0.5 w-6 bg-white/5" />
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${step === 3 ? "bg-purple-600/25 border-purple-500 text-purple-300" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">3</span> SIM
              </div>
            </div>
          </div>
        )}

        {/* Discord user info widget banner */}
        {step < 4 && (
          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              CF
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">cosmic_frills</h4>
              <p className="text-[10px] text-gray-400">Login via Discord • cosmic_frills</p>
            </div>
          </div>
        )}

        {/* STEP 1: DATA DIRI */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NAMA LENGKAP *</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama sesuai KTP ingame"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
              />
              <p className="text-[9px] text-gray-500 font-medium">Nama harus sesuai dengan nama kartu identitas in-game Anda.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TEMPAT LAHIR *</label>
                <input 
                  type="text" 
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Kota tempat lahir"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TANGGAL LAHIR *</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">JENIS KELAMIN *</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0d19] border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                >
                  <option value="">— Pilih —</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NO. TELEPON / HP *</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 555-1234"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: KTP & NIK */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NOMOR INDUK KEPENDUDUKAN (NIK) *</label>
              <input 
                type="text" 
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Contoh: 3174xxxxxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">ALAMAT SESUAI KTP *</label>
              <textarea 
                rows={2}
                value={ktpAddress}
                onChange={(e) => setKtpAddress(e.target.value)}
                placeholder="Tuliskan nama jalan dan nomor rumah di kota Supercali..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">PEKERJAAN SEKARANG *</label>
              <input 
                type="text" 
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Pekerjaan saat ini (misal: Supir Taksi, Dokter ARC, Mekanik Rizz, Warga Sipil)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SIM LICENSE */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">GOLONGAN SIM YANG DIAJUKAN *</label>
              <select 
                value={simType}
                onChange={(e) => setSimType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f0d19] border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
              >
                <option value="SIM A (Mobil)">SIM A (Mobil Pribadi)</option>
                <option value="SIM C (Motor)">SIM C (Kendaraan Roda Dua)</option>
                <option value="SIM B (Truk & Bus)">SIM B (Kendaraan Logistik / Berat)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NOMOR SIM ASAL (MOCK) *</label>
              <input 
                type="text" 
                value={simNumber}
                onChange={(e) => setSimNumber(e.target.value)}
                placeholder="Nomor lisensi jika ada, atau biarkan kosong"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15 text-[10px] text-yellow-300 leading-normal flex items-start gap-2.5">
              <span className="text-base">⚠️</span>
              <span>
                Dengan menekan tombol Simpan, data di atas akan dimasukkan ke database MDT Kepolisian Vibe Patrol (SCVP) secara langsung untuk diproses dalam berkas perizinan warga kota Supercali.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS SUBMISSION */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-xl text-white">Data Diri Disimpan!</h3>
              <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                Terima kasih, **cosmic_frills**! Data pengajuan kamu telah berhasil direkam dalam sistem portal loket terintegrasi Supercali.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[10px] text-gray-400 text-left space-y-1 max-w-sm mx-auto">
              <p><strong className="text-white">STATUS PENGAJUAN:</strong> MENUNGGU VERIFIKASI (PENDING)</p>
              <p><strong className="text-white">DIKIRIM OLEH:</strong> cosmic_frills (Discord)</p>
              <p><strong className="text-white">GOLONGAN SIM:</strong> {simType}</p>
            </div>

            <div className="flex gap-3 justify-center max-w-sm mx-auto pt-2">
              <Link href="/dashboard?login_success=true" className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white text-center shadow-lg transition">
                Kembali Ke Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Card Navigation Controls */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {step > 1 ? (
              <button 
                onClick={handleBackStep}
                className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition"
              >
                Kembali
              </button>
            ) : (
              <Link href="/dashboard/login" className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition">
                Batalkan
              </Link>
            )}

            <button 
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition"
            >
              {step === 3 ? "Simpan Data Diri" : "Lanjutkan"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Footer Link */}
      {step < 4 && (
        <Link href="/dashboard/login" className="text-[10px] text-gray-500 hover:text-gray-400 underline mt-4 select-none">
          Keluar dan gunakan akun lain
        </Link>
      )}

    </div>
  );
}
