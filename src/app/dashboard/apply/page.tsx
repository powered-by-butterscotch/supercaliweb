"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, CreditCard, Shield, CheckCircle, ChevronRight, LogOut, Building2, FileText, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function ApplyDataForm() {
  const [step, setStep] = useState(1); // 1: Identitas Warga, 2: Pilih Instansi & Jenis Dokumen, 3: Detail Pengajuan, 4: Berhasil
  
  // Data Warga
  const [fullName, setFullName] = useState("cosmic_frills");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [ktpAddress, setKtpAddress] = useState("");
  const [occupation, setOccupation] = useState("");

  // Target Instansi & Permohonan
  const [targetDepartment, setTargetDepartment] = useState("scvp"); // scvp (Kepolisian), arc (Medis), doj (Kemenkumham/Sihir)
  const [docCategory, setDocCategory] = useState("SIM A (Mobil)");
  const [applicationPurpose, setApplicationPurpose] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discordUsername, setDiscordUsername] = useState("cosmic_frills");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const user = params.get("user");
      if (user) {
        setDiscordUsername(user);
        setFullName(user);
      }
    }
  }, []);

  // Set default document options based on department
  useEffect(() => {
    if (targetDepartment === "scvp") {
      setDocCategory("SIM A (Mobil)");
    } else if (targetDepartment === "arc") {
      setDocCategory("Surat Keterangan Sehat Jasmani");
    } else if (targetDepartment === "doj") {
      setDocCategory("Akta Pernikahan Warga");
    }
  }, [targetDepartment]);

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            discord_username: discordUsername,
            full_name: fullName,
            birth_place: birthPlace,
            birth_date: birthDate,
            gender: gender,
            phone: phone,
            nik: nik,
            ktp_address: ktpAddress,
            occupation: occupation,
            target_department: targetDepartment,
            sim_type: `${docCategory} (${targetDepartment.toUpperCase()})`,
            sim_number: applicationPurpose,
            additional_notes: additionalNotes
          })
        });

        if (res.ok) {
          setStep(4);
          confetti({
            particleCount: 160,
            spread: 80,
            origin: { y: 0.6 }
          });
        } else {
          alert("Gagal mengirimkan berkas pengajuan. Silakan periksa kembali isian Anda!");
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi masalah koneksi ke server!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 min-h-screen bg-[#0b0713]">
      
      {/* Top Bar Navigation Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard?login_success=true" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xs font-black text-white tracking-wider flex items-center gap-2">
              LOKET PERMOHONAN RESMI <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold">SUPERCALI CITY</span>
            </h2>
            <p className="text-[10px] text-gray-400">Pengajuan Berkas Izin & Dokumen Instansi Terpadu</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center font-bold text-[10px] text-white uppercase">
              {discordUsername.substring(0, 2)}
            </div>
            <span className="text-xs font-bold text-gray-200 font-mono">{discordUsername}</span>
          </div>

          <Link href="/dashboard/login" className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition flex items-center gap-1.5 text-xs font-bold">
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </Link>
        </div>
      </header>

      {/* Main Multi-step Form Card */}
      <div className="w-full max-w-2xl glass rounded-3xl p-6 md:p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden space-y-6 mt-12">
        
        {/* Step Indicator Header */}
        {step < 4 && (
          <div className="text-center space-y-4">
            <div className="h-14 w-14 bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-purple-500/40 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg shadow-purple-500/10">
              {step === 1 ? "👤" : step === 2 ? "🏛️" : "📝"}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white tracking-wide">
                {step === 1 && "Identitas Lengkap Warga"}
                {step === 2 && "Pilih Instansi & Jenis Berkas"}
                {step === 3 && "Detail & Alasan Permohonan"}
              </h3>
              <p className="text-gray-400 text-xs">
                {step === 1 && "Tahap 1 dari 3 — Isi data diri sesuai identitas in-game Anda."}
                {step === 2 && "Tahap 2 dari 3 — Tentukan instansi tujuan dan jenis permohonan."}
                {step === 3 && "Tahap 3 dari 3 — Lengkapi alasan & permohonan untuk ditinjau petugas."}
              </p>
            </div>

            {/* Stepper Wizard Bar */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-bold text-gray-400">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition ${step === 1 ? "bg-purple-600/30 border-purple-500 text-purple-200" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">1</span> Identitas
              </div>
              <div className="h-0.5 w-6 bg-white/10" />
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition ${step === 2 ? "bg-purple-600/30 border-purple-500 text-purple-200" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">2</span> Instansi
              </div>
              <div className="h-0.5 w-6 bg-white/10" />
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition ${step === 3 ? "bg-purple-600/30 border-purple-500 text-purple-200" : "bg-white/5 border-white/5"}`}>
                <span className="h-4 w-4 rounded-full bg-black/40 flex items-center justify-center text-[9px]">3</span> Alasan
              </div>
            </div>
          </div>
        )}

        {/* User Account Info Banner */}
        {step < 4 && (
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow">
                {discordUsername.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">{discordUsername}</h4>
                <p className="text-[10px] text-gray-400">Akun Terautentikasi Discord API</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              ● Status Warga Aktif
            </span>
          </div>
        )}

        {/* STEP 1: IDENTITAS WARGA */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NAMA LENGKAP IN-GAME *</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama sesuai KTP / Karakter Roleplay"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
              <p className="text-[9px] text-gray-500 font-medium">Nama harus presisi sesuai identitas karakter RP Anda di kota.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TEMPAT LAHIR *</label>
                <input 
                  type="text" 
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Kota kelahiran"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TANGGAL LAHIR *</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NOMOR NIK / PASPOR *</label>
                <input 
                  type="text" 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Contoh: 317498129031"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">NO. TELEPON KOTA *</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 555-0192"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">JENIS KELAMIN *</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0d19] border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                >
                  <option value="">— Pilih —</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">PEKERJAAN SAAT INI *</label>
                <input 
                  type="text" 
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Supir Taksi, Mekanik, Warga Sipil"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">ALAMAT DOMISILI KOTA *</label>
              <input 
                type="text" 
                value={ktpAddress}
                onChange={(e) => setKtpAddress(e.target.value)}
                placeholder="Alamat rumah / apartemen di kota Supercali..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* STEP 2: PILIH INSTANSI TUJUAN & DOKUMEN */}
        {step === 2 && (
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TUJUAN LOKET INSTANSI *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Option 1: SCVP (Police) */}
                <button
                  type="button"
                  onClick={() => setTargetDepartment("scvp")}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    targetDepartment === "scvp"
                      ? "bg-cyan-600/15 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">🚨</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">SCVP</span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-sm text-white">Kepolisian Metro</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Izin SIM, Lisensi Senjata Api, Surat Tugas, & Surat Jalan.</p>
                  </div>
                </button>

                {/* Option 2: ARC (Medis) */}
                <button
                  type="button"
                  onClick={() => setTargetDepartment("arc")}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    targetDepartment === "arc"
                      ? "bg-rose-600/15 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">🏥</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">ARC</span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-sm text-white">Medis & Kesehatan</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Surat Sehat Jasmani, Hasil Pengecekan Psikologi, & Bebas Narkoba.</p>
                  </div>
                </button>

                {/* Option 3: DOJ / Catatan Sipil */}
                <button
                  type="button"
                  onClick={() => setTargetDepartment("doj")}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    targetDepartment === "doj"
                      ? "bg-amber-600/15 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">⚖️</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">DOJ</span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-extrabold text-sm text-white">DOJ / Catatan Sipil</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Akta Pernikahan, Legalitas Organisasi/Gang, & Izin Usaha Toko.</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Dynamic Category Selector */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">BERKAS PERMOHONAN KHUSUS *</label>
              <select 
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0f0d19] border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              >
                {targetDepartment === "scvp" && (
                  <>
                    <option value="SIM A (Mobil)">Golongan SIM A (Kendaraan Roda Empat)</option>
                    <option value="SIM C (Motor)">Golongan SIM C (Kendaraan Roda Dua)</option>
                    <option value="SIM B (Truk & Bus)">Golongan SIM B (Kendaraan Logistik / Heavy Machine)</option>
                    <option value="Izin Senjata Api (SA-1)">Izin Kepemilikan Senjata Api Bebas (SA-1)</option>
                    <option value="Surat Izin Jalan Logistik">Surat Izin Melintas Kendaraan Dinas Logistik</option>
                  </>
                )}
                {targetDepartment === "arc" && (
                  <>
                    <option value="Surat Keterangan Sehat Jasmani">Surat Keterangan Sehat Jasmani & Rohani</option>
                    <option value="Hasil Evaluasi Psikologi">Sertifikat Evaluasi Kelayakan Psikologi</option>
                    <option value="Surat Bebas Beban Fisik">Surat Bebas Kegiatan Fisik Berat</option>
                  </>
                )}
                {targetDepartment === "doj" && (
                  <>
                    <option value="Akta Pernikahan Warga">Akta Catatan Sipil Pernikahan Sah</option>
                    <option value="Izin Operasional Toko/Bisnis">Legalitas Izin Usaha / Toko Bisnis</option>
                    <option value="Legalitas Organisasi / Gang">Pendaftaran Berkas Komunitas & Organisasi</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: DETAIL ALASAN PERMOHONAN */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">TUJUAN & ALASAN PERMOHONAN *</label>
              <textarea 
                rows={4}
                value={applicationPurpose}
                onChange={(e) => setApplicationPurpose(e.target.value)}
                placeholder="Jelaskan kebutuhan pengajuan Anda (misal: Untuk keperluan bekerja supir truk antar kota, syarat pendaftaran pekerjaan, atau keperluan legalitas)..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">CATATAN TAMBAHAN / KETERANGAN PENDUKUNG</label>
              <input 
                type="text" 
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Keterangan tambahan jika ada (opsional)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none text-xs text-white"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Permohonan ini akan masuk ke antrean verifikasi instansi <strong>{targetDepartment.toUpperCase()}</strong>. Petugas ter-whitelist akan meninjau berkas Anda di Admin Panel sebelum dokumen resmi diterbitkan.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: BERHASIL DIKIRIM */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-2xl text-white">Berkas Pengajuan Terkirim!</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                Terima kasih, <strong>{fullName}</strong>! Permohonan Anda telah resmi tercatat di database instansi <strong>{targetDepartment.toUpperCase()}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 font-mono text-xs text-gray-300 text-left space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">STATUS VERIFIKASI:</span>
                <span className="font-extrabold text-amber-400">● PENDING (MENUNGGU ACC)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">INSTANSI TUJUAN:</span>
                <span className="font-extrabold text-white">{targetDepartment.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">JENIS DOKUMEN:</span>
                <span className="font-extrabold text-purple-300">{docCategory}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center max-w-md mx-auto pt-2">
              <Link href="/dashboard?login_success=true" className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-xs text-white text-center shadow-lg transition">
                Kembali Ke Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Card Navigation Buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {step > 1 ? (
              <button 
                type="button"
                onClick={handleBackStep}
                className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition"
              >
                Kembali
              </button>
            ) : (
              <Link href="/dashboard?login_success=true" className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition">
                Batalkan
              </Link>
            )}

            <button 
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className={`px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-extrabold text-white text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Kirim Berkas..." : (step === 3 ? "Kirim Permohonan" : "Lanjutkan")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Footer Link */}
      {step < 4 && (
        <Link href="/dashboard/login" className="text-[11px] text-gray-500 hover:text-gray-400 underline mt-6 select-none">
          Keluar dan gunakan akun lain
        </Link>
      )}

    </div>
  );
}

