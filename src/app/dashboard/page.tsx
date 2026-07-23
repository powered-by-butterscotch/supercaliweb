"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  FileText,
  Search,
  Printer,
  Shield,
  Plus,
  Bookmark,
  Activity,
  Wrench,
  CheckCircle,
  Clock,
  UserCheck
} from "lucide-react";

import { supabase } from "../../lib/supabase";

// Mock Data
const scvpSuspects = [
  { ucp: "ucup_slebew", name: "Ucup Slebew", status: "WANTED", charges: "Pencurian mobil, melanggar batas kecepatan di SCVP Zone.", warnLevel: "HIGH" },
  { ucp: "mulyono_racing", name: "Mulyono Racing", status: "CLEAN", charges: "Pernah ditilang akibat knalpot brong.", warnLevel: "LOW" },
  { ucp: "siti_arcane", name: "Siti Arcane", status: "CLEAN", charges: "Tidak ada catatan kriminal.", warnLevel: "NONE" }
];

const medicalRecords = [
  { ucp: "ucup_slebew", name: "Ucup Slebew", heartRate: "72 BPM", bloodType: "O+", diagnosis: "Patah kaki akibat jatuh dari tebing Vinewood.", doctor: "Dr. Siti Arcane" },
  { ucp: "mulyono_racing", name: "Mulyono Racing", heartRate: "90 BPM", bloodType: "B-", diagnosis: "Koma ringan akibat tabrakan mobil Rizz Motor.", doctor: "Dr. Siti Arcane" }
];

const rizzMotorCatalog = [
  { name: "Supercali Hyperion S", type: "Supercar", engine: "V10 Twin Turbo", price: "Rp 850.000.000 (In-game)", modCost: "Rp 45.000.000" },
  { name: "Retro Rizzler 1990", type: "Classic JDM", engine: "Inline 6 TwinCam", price: "Rp 240.000.000 (In-game)", modCost: "Rp 12.000.000" }
];

const scvpVehicles = [
  { plate: "B 411 GYA", ownerName: "Ucup Slebew", ownerUCP: "ucup_slebew", model: "Retro Rizzler 1990 (White)", status: "TERCATAT", flags: "STOLEN / DICURI" },
  { plate: "B 999 RIZ", ownerName: "Mulyono Racing", ownerUCP: "mulyono_racing", model: "Supercali Hyperion S (Gold)", status: "RESMI", flags: "NONE" },
  { plate: "B 777 ARC", ownerName: "Dr. Siti Arcane", ownerUCP: "siti_arcane", model: "Arcane Ambulance Van", status: "RESMI", flags: "NONE" }
];

interface DonationInvoice {
  id: string;
  discord_username: string;
  citizen_name: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("docs"); // docs, scvp, arc, rizz
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("surat-sehat"); // surat-sehat, izin-jalan, akta-nikah, surat-tugas
  
  // Dynamic Real-time DB State
  const [donations, setDonations] = useState<DonationInvoice[]>([]);

  // Document states
  const [citizenName, setCitizenName] = useState("Ucup Slebew");
  const [citizenUCP, setCitizenUCP] = useState("ucup_slebew");
  const [docDescription, setDocDescription] = useState("Dinyatakan sehat jasmani dan rohani setelah dilakukan pengecekan tekanan darah dan refleks saraf.");
  const [officerName, setOfficerName] = useState("Dr. Siti Arcane");
  const [officerRole, setOfficerRole] = useState("Kepala Medis ARC");
  const [docDate, setDocDate] = useState("2026-07-11");
  const [customFieldLabel, setCustomFieldLabel] = useState("Status Kesehatan");
  const [customFieldValue, setCustomFieldValue] = useState("100% Fit & Siap Roleplay");

  const printRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("warga"); // warga, dinas

  // Sync tab on query parameter if provided & check login simulation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get("login_success");
      const role = params.get("role");
      
      if (isSuccess === "true") {
        setIsLoggedIn(true);
        if (role) {
          setUserRole(role);
        }
        fetchDonations();
      } else {
        // Redirect to Discord portal
        window.location.href = "/dashboard/login";
        return;
      }

      const tab = params.get("tab");
      if (tab && ["docs", "scvp", "arc", "rizz", "admin"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setDonations(data);
    }
  };

  const confirmInvoicePayment = async (id: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: "PAID" })
      .eq("id", id);
    
    if (!error) {
      alert("Status invoice berhasil diubah ke PAID! Data terupdate di database Supabase.");
      fetchDonations();
    }
  };

  // Preset document types configuration
  const handleDocTypeChange = (type: string) => {
    setSelectedDocType(type);
    if (type === "surat-sehat") {
      setDocDescription("Dinyatakan sehat jasmani dan rohani setelah dilakukan pengecekan tekanan darah dan refleks saraf.");
      setOfficerName("Dr. Siti Arcane");
      setOfficerRole("Kepala Medis ARC");
      setCustomFieldLabel("Rekomendasi Medis");
      setCustomFieldValue("Bebas Kegiatan Berat 3 Hari");
    } else if (type === "izin-jalan") {
      setDocDescription("Diberikan izin melintas resmi menggunakan kendaraan logistik besar di area operasional kota Supercali.");
      setOfficerName("Kapolda Mulyono");
      setOfficerRole("Divisi Vibe Patrol - SCVP");
      setCustomFieldLabel("Nomor Plat Kendaraan");
      setCustomFieldValue("B 411 GYA");
    } else if (type === "akta-nikah") {
      setDocDescription("Menyatakan pernikahan sah secara hukum adat Roleplay Supercali antara pihak pertama dan pihak kedua.");
      setOfficerName("Kiai Rizzler");
      setOfficerRole("Dewan Sihir / Walikota");
      setCustomFieldLabel("Nama Pasangan");
      setCustomFieldValue("Siti Arcane");
    } else if (type === "surat-tugas") {
      setDocDescription("Surat perintah penugasan penangkapan buron kelas kakap Ucup Slebew di daerah dermaga.");
      setOfficerName("Komandan Jenderal");
      setOfficerRole("Kepala Markas SCVP");
      setCustomFieldLabel("Target Operasi");
      setCustomFieldValue("Ucup Slebew (WANTED)");
    } else if (type === "izin-senjata") {
      setDocDescription("Dinyatakan lulus uji kelayakan psikologi dan menembak. Diberikan izin memegang senjata pertahanan diri tipe genggam ringan.");
      setOfficerName("Kapolda Mulyono");
      setOfficerRole("Markas Besar SCVP");
      setCustomFieldLabel("Jenis Senjata Berlisensi");
      setCustomFieldValue("Glock-17 / Pistol 9mm");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0b0713]">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-white/10 animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-semibold tracking-wider">Menghubungkan ke Discord Auth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-45 px-6 py-4 flex items-center justify-between border-b border-white/5 no-print">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white">
              DASHBOARD DEPARTEMEN
            </h1>
            <p className="text-[10px] text-gray-400">Pusat Layanan Warga & Instansi Kota</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-xs font-semibold gap-1">
          <button 
            onClick={() => setActiveTab("docs")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === "docs" ? "bg-purple-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
          >
            <FileText className="w-3.5 h-3.5" /> Dokumen Resmi
          </button>
          <button 
            onClick={() => setActiveTab("scvp")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === "scvp" ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
          >
            <Shield className="w-3.5 h-3.5" /> SCVP MDT
          </button>
          <button 
            onClick={() => setActiveTab("arc")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === "arc" ? "bg-rose-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
          >
            <Activity className="w-3.5 h-3.5" /> ARC Medis
          </button>
          <button 
            onClick={() => setActiveTab("rizz")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === "rizz" ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white"}`}
          >
            <Wrench className="w-3.5 h-3.5" /> Rizz Catalog
          </button>
          
          {/* Admin Whitelist Tab (Visible to dinas/admin roles, locked for warga) */}
          <button 
            onClick={() => {
              if (userRole === "dinas" || userRole === "admin") {
                setActiveTab("admin");
              }
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "admin" 
                ? "bg-purple-700 text-white shadow" 
                : (userRole === "dinas" || userRole === "admin")
                  ? "text-purple-300 hover:text-white"
                  : "text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            🔑 {userRole === "warga" ? "Admin (Locked)" : "Admin Panel"}
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">

        {/* TAB 1: AUTO DOCUMENT GENERATOR */}
        {activeTab === "docs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
             {/* Form Editor (NO PRINT) */}
            <div className="lg:col-span-5 glass rounded-3xl p-6 border border-white/10 space-y-6 no-print">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white">Buat Surat Resmi</h3>
                <p className="text-gray-400 text-xs">Pilih tipe surat dinas, lengkapi formulir, lalu klik cetak ke kertas/PDF.</p>
              </div>

              {userRole === "warga" ? (
                <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-4 text-center">
                  <span className="text-3xl block">🔒</span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">Layanan Hanya Pegawai</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Akun Discord Anda terdaftar sebagai **Warga Sipil**. Silakan ajukan permohonan Anda ke loket pengajuan atau hubungi petugas instansi (ARC/SCVP) yang ter-whitelist untuk menerbitkan dokumen ini.
                    </p>
                  </div>
                  <Link href="/dashboard/apply" className="block w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition text-center shadow-md">
                    Ke Loket Pengajuan
                  </Link>
                </div>
              ) : (
                <>

              {/* Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider">JENIS DOKUMEN</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "surat-sehat", name: "Surat Sehat ARC" },
                    { id: "izin-jalan", name: "Izin Jalan SCVP" },
                    { id: "akta-nikah", name: "Akta Nikah Sihir" },
                    { id: "surat-tugas", name: "Surat Tugas SCVP" },
                    { id: "izin-senjata", name: "Senjata Api SCVP" }
                  ].map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocTypeChange(doc.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                        selectedDocType === doc.id 
                          ? "bg-purple-600/10 border-purple-500 text-purple-300 shadow" 
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {doc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">NAMA WARGA</label>
                    <input 
                      type="text" 
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">ID UCP / PASSPOR</label>
                    <input 
                      type="text" 
                      value={citizenUCP}
                      onChange={(e) => setCitizenUCP(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 tracking-wider">KETERANGAN / PERNYATAAN SURAT</label>
                  <textarea 
                    rows={3}
                    value={docDescription}
                    onChange={(e) => setDocDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">NAMA PENANGGUNG JAWAB</label>
                    <input 
                      type="text" 
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">JABATAN DINAS</label>
                    <input 
                      type="text" 
                      value={officerRole}
                      onChange={(e) => setOfficerRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">LABEL BIDANG KHUSUS</label>
                    <input 
                      type="text" 
                      value={customFieldLabel}
                      onChange={(e) => setCustomFieldLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 tracking-wider">ISI BIDANG KHUSUS</label>
                    <input 
                      type="text" 
                      value={customFieldValue}
                      onChange={(e) => setCustomFieldValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL BERLAKU</label>
                  <input 
                    type="date" 
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus:border-purple-500 outline-none text-xs text-white"
                  />
                </div>
              </div>

              <button 
                onClick={handlePrint}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 font-extrabold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 transition"
              >
                <Printer className="w-4 h-4" /> Cetak / Simpan PDF Resmi
              </button>
              </>
              )}
            </div>

            {/* Document Preview (A4 styled, looks like real paper) */}
            <div className="lg:col-span-7 flex justify-center p-2 print-area">
              <div 
                ref={printRef}
                className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 border border-slate-300 shadow-2xl p-10 md:p-14 flex flex-col justify-between font-serif relative"
              >
                <div>
                  {/* Kop Surat Header */}
                  <div className="flex items-center justify-between border-b-4 border-double border-slate-900 pb-5 mb-8">
                    <div className="h-14 w-14 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-2xl text-white">
                      {selectedDocType.includes("sehat") || selectedDocType.includes("arc") ? "🏥" : "🚨"}
                    </div>
                    
                    <div className="text-center flex-1 px-4">
                      <h2 className="font-extrabold text-xl tracking-wide uppercase text-slate-900 font-sans">
                        Pemerintah Kota Supercali
                      </h2>
                      <p className="text-[11px] font-bold tracking-widest text-slate-700 font-sans mt-0.5">
                        {selectedDocType === "surat-sehat" && "DINAS KESEHATAN • ARCANE RESCUE CENTER"}
                        {selectedDocType === "izin-jalan" && "KEPOLISIAN METRO DIVISION • VIBE PATROL SCVP"}
                        {selectedDocType === "akta-nikah" && "DEWAN SIHIR KOTA • URUSAN CATATAN SIPIL"}
                        {selectedDocType === "surat-tugas" && "MARKAS BESAR KEPOLISIAN • VIBE PATROL SCVP"}
                        {selectedDocType === "izin-senjata" && "DIVISI INTELIJEN & LISENSI • VIBE PATROL SCVP"}
                      </p>
                      <p className="text-[9px] italic text-slate-500 mt-1 font-sans">
                        Jl. Vinewood Raya No. 42, Kota Supercali Roleplay | domain: supercali.tech
                      </p>
                    </div>

                    <div className="h-14 w-14 flex items-center justify-center font-bold text-2xl border-2 border-slate-800 rounded">
                      📜
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="text-center my-8">
                    <h3 className="font-black text-lg underline tracking-wide uppercase text-slate-900">
                      {selectedDocType === "surat-sehat" && "SURAT KETERANGAN SEHAT JASMANI"}
                      {selectedDocType === "izin-jalan" && "SURAT IZIN KENDARAAN & JALAN DINAS"}
                      {selectedDocType === "akta-nikah" && "AKTA PERNIKAHAN WARGA GEMILANG"}
                      {selectedDocType === "surat-tugas" && "SURAT TUGAS OPERASI KHUSUS"}
                      {selectedDocType === "izin-senjata" && "SURAT IZIN KEPEMILIKAN SENJATA API (SA-1)"}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-sans">
                      Nomor: {selectedDocType === "surat-sehat" && "042/ARC/MED-SEHAT/2026"}
                      {selectedDocType === "izin-jalan" && "911/SCVP/PERIZINAN/2026"}
                      {selectedDocType === "akta-nikah" && "114/SIHIR/AKTA-NIKAH/2026"}
                      {selectedDocType === "surat-tugas" && "007/SCVP/OP-KHUSUS/2026"}
                      {selectedDocType === "izin-senjata" && "357/SCVP/IZIN-SENJATA/2026"}
                    </p>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-6 text-sm leading-relaxed text-slate-800">
                    <p>
                      Yang bertanda tangan di bawah ini, selaku penanggung jawab instansi resmi Kota Supercali Roleplay menerangkan dengan sebenarnya bahwa:
                    </p>

                    <table className="w-full text-left font-sans text-xs border-collapse ml-4">
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-2.5 font-bold w-1/3 text-slate-600">Nama Lengkap IC</td>
                          <td className="py-2.5 text-slate-900 font-extrabold">{citizenName}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2.5 font-bold text-slate-600">ID UCP / Discord</td>
                          <td className="py-2.5 font-mono text-slate-900">{citizenUCP}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2.5 font-bold text-slate-600">{customFieldLabel}</td>
                          <td className="py-2.5 text-slate-900 font-semibold">{customFieldValue}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-2.5 font-bold text-slate-600">Tanggal Validasi</td>
                          <td className="py-2.5 text-slate-900">{docDate}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="pt-2 font-serif text-justify">
                      <p className="font-bold text-slate-900">Deskripsi / Rekomendasi Resmi:</p>
                      <p className="mt-1.5 pl-4 border-l-2 border-slate-400 italic text-slate-700 bg-slate-50 p-3 rounded">
                        &ldquo;{docDescription}&rdquo;
                      </p>
                    </div>

                    <p>
                      Demikian surat keterangan resmi ini dikeluarkan secara sadar agar dapat dipergunakan sebagaimana mestinya in-character untuk mendukung peran kehidupan sosial warga Supercali.
                    </p>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
                  <div className="text-center font-sans text-xs">
                    <p className="text-slate-500 mb-2">QR Validasi Asli</p>
                    {/* Simulated QR block */}
                    <div className="h-16 w-16 border-2 border-slate-800 p-1 mx-auto flex flex-col justify-between">
                      <div className="flex justify-between"><div className="h-3 w-3 bg-slate-900"/><div className="h-3 w-3 bg-slate-900"/></div>
                      <div className="text-[6px] font-mono leading-none tracking-tighter text-slate-700">SUPERCALI TECH</div>
                      <div className="flex justify-between"><div className="h-3 w-3 bg-slate-900"/><div className="h-3 w-3 bg-slate-900"/></div>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1 font-mono">ID verification verified</p>
                  </div>

                  <div className="text-center font-sans text-xs w-56">
                    <p className="text-slate-500 mb-1">Kota Supercali, {docDate}</p>
                    <p className="font-bold text-slate-800">{officerRole}</p>
                    
                    {/* Digitized Signature Graphic placeholder */}
                    <div className="my-2 h-10 flex items-center justify-center italic text-blue-600 font-mono tracking-widest text-[10px]">
                      ~ Signed by {officerName} ~
                    </div>

                    <p className="font-black text-slate-900 underline">{officerName}</p>
                    <p className="text-[9px] text-slate-400">NIP. {selectedDocType === "surat-sehat" ? "882.ARC.109" : "911.SCVP.773"}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SCVP MDT POLICE DATABASE */}
        {activeTab === "scvp" && (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-cyan-500/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    Vibe Patrol Mobile Data Terminal (MDT)
                  </h3>
                  <p className="text-xs text-gray-400">Database kependudukan kriminalitas kepolisian SCVP.</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Cari nama UCP atau Paspor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:border-cyan-500 outline-none text-xs text-white font-medium"
                  />
                </div>
              </div>

              {/* MDT Suspect Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {scvpSuspects
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ucp.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((suspect, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-base text-white">{suspect.name}</h4>
                          <p className="text-[10px] text-gray-400 font-mono">UCP: {suspect.ucp}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                          suspect.status === "WANTED" 
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {suspect.status}
                        </span>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1">
                        <p className="font-bold text-gray-300">Catatan Pelanggaran:</p>
                        <p className="text-gray-400 text-[11px] leading-relaxed">{suspect.charges}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-gray-500">Tingkat Ancaman</span>
                        <span className={`${
                          suspect.warnLevel === "HIGH" ? "text-rose-400" : suspect.warnLevel === "LOW" ? "text-yellow-400" : "text-gray-400"
                        }`}>
                          {suspect.warnLevel}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Vehicle Lookup Database Sub-panel */}
            <div className="glass rounded-3xl p-6 border border-cyan-500/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    🚗 Sistem Pencarian Pelat Nomor (SCVP Vehicle Lookup)
                  </h3>
                  <p className="text-xs text-gray-400">Lacak kepemilikan plat nomor kendaraan terdaftar dan bendera status in-game.</p>
                </div>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Contoh: B 411 GYA..."
                    value={vehicleSearchQuery}
                    onChange={(e) => setVehicleSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:border-cyan-500 outline-none text-xs text-white font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                      <th className="pb-3 w-1/4">Plat Nomor</th>
                      <th className="pb-3 w-1/4">Tipe / Model Mobil</th>
                      <th className="pb-3 w-1/4">Pemilik IC (UCP)</th>
                      <th className="pb-3 w-1/4">Bendera Kasus / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scvpVehicles
                      .filter(v => v.plate.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) || v.ownerName.toLowerCase().includes(vehicleSearchQuery.toLowerCase()))
                      .map((vehicle, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 font-mono font-bold text-cyan-300">{vehicle.plate}</td>
                          <td className="py-4 text-white font-semibold">{vehicle.model}</td>
                          <td className="py-4 text-gray-300">{vehicle.ownerName} ({vehicle.ownerUCP})</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              vehicle.flags !== "NONE" 
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {vehicle.flags !== "NONE" ? vehicle.flags : vehicle.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ARC HEALTH LOGS */}
        {activeTab === "arc" && (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-rose-500/20">
              <div className="space-y-1 mb-6">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400" />
                  Rekam Medis & Kesehatan Warga (ARC)
                </h3>
                <p className="text-xs text-gray-400">Catatan kesehatan, denyut jantung, dan penanggung jawab medis di kota.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalRecords.map((rec, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-base text-white">{rec.name}</h4>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                        {rec.heartRate}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-gray-500 text-[10px]">Golongan Darah</p>
                        <p className="text-white mt-0.5">{rec.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-[10px]">Dokter Pemeriksa</p>
                        <p className="text-white mt-0.5">{rec.doctor}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Diagnosis Medis</p>
                      <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                        {rec.diagnosis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RIZZ MOTOR CATALOG */}
        {activeTab === "rizz" && (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-amber-500/20">
              <div className="space-y-1 mb-6">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
                  Katalog Custom Modifikasi Rizz Motor
                </h3>
                <p className="text-xs text-gray-400">Daftar estimasi harga kendaraan in-game dan biaya tuning performa.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rizzMotorCatalog.map((car, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">{car.type}</span>
                      <h4 className="font-extrabold text-lg text-white mt-0.5">{car.name}</h4>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spesifikasi Mesin</span>
                        <span className="text-white font-bold">{car.engine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Harga Dealer</span>
                        <span className="text-amber-300 font-bold">{car.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimasi Modifikasi</span>
                        <span className="text-white font-bold">{car.modCost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN PANEL (WHITELIST & DONATION ACTIONS) */}
        {activeTab === "admin" && (userRole === "dinas" || userRole === "admin") && (
          <div className="space-y-6">
            
            {/* Whitelist Panel for Dinas / Staff role */}
            {userRole === "dinas" && (
              <div className="glass rounded-3xl p-6 border border-purple-500/20">
                <div className="space-y-1 mb-6">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    🔑 Supercali Whitelist Admin Panel
                  </h3>
                  <p className="text-xs text-gray-400">Kelola dan tinjau pengajuan formulir data diri warga yang masuk ke Loket.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                        <th className="pb-3 w-1/4">User Discord</th>
                        <th className="pb-3 w-1/5">UCP / Nama IC</th>
                        <th className="pb-3 w-1/5">Golongan SIM</th>
                        <th className="pb-3 w-1/6">Pekerjaan</th>
                        <th className="pb-3 w-1/4 text-right">Tindakan Kelulusan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { discord: "ucup_slebew", ucp: "ucup_slebew", name: "Ucup Slebew", sim: "SIM A", job: "Warga Sipil", id: 1 },
                        { discord: "cosmic_frills", ucp: "cosmic_frills", name: "Cosmic Frills", sim: "SIM C", job: "Warga Sipil", id: 2 },
                        { discord: "mulyono_racing", ucp: "mulyono_racing", name: "Mulyono Racing", sim: "SIM B", job: "Mekanik Rizz", id: 3 }
                      ].map((applicant) => (
                        <tr key={applicant.id} className="border-b border-white/5 hover:bg-white/5 transition" id={`applicant-row-${applicant.id}`}>
                          <td className="py-4 font-bold text-purple-300">{applicant.discord}</td>
                          <td className="py-4 text-white font-semibold">{applicant.name} ({applicant.ucp})</td>
                          <td className="py-4 text-gray-300 font-mono">{applicant.sim}</td>
                          <td className="py-4 text-gray-400">{applicant.job}</td>
                          <td className="py-4 text-right space-x-2">
                            <button 
                              onClick={() => {
                                alert(`Loloskan warga ${applicant.name}! Data telah disinkronisasikan ke database FiveM & Discord Bot.`);
                                const row = document.getElementById(`applicant-row-${applicant.id}`);
                                if (row) row.style.opacity = "0.3";
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[10px] transition"
                            >
                              Setujui (Approve)
                            </button>
                            <button 
                              onClick={() => {
                                alert(`Tolak pengajuan warga ${applicant.name}. Permohonan dipindahkan ke log arsip ditolak.`);
                                const row = document.getElementById(`applicant-row-${applicant.id}`);
                                if (row) row.style.opacity = "0.3";
                              }}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-[10px] transition"
                            >
                              Tolak (Reject)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Donation Management Panel for Admin / Owner role */}
            {userRole === "admin" && (
              <div className="glass rounded-3xl p-6 border border-amber-500/20">
                <div className="space-y-1 mb-6">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    💰 Gemilang Jaya Donation & Invoice Management
                  </h3>
                  <p className="text-xs text-gray-400">Verifikasi bukti invoice donasi masuk dari website, validasi pembayaran, dan kirim benefit item.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                        <th className="pb-3 w-1/4">Donatur (UCP)</th>
                        <th className="pb-3 w-1/4">Paket Donasi</th>
                        <th className="pb-3 w-1/5">Nominal Transfer</th>
                        <th className="pb-3 w-1/6">Status Invoice</th>
                        <th className="pb-3 w-1/4 text-right">Aksi Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500 font-semibold">
                            Belum ada invoice donasi terdaftar di database Supabase.
                          </td>
                        </tr>
                      ) : (
                        donations.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition" id={`invoice-row-${invoice.id}`}>
                            <td className="py-4 font-bold text-amber-300">
                              {invoice.discord_username} <span className="text-[10px] text-gray-500 font-normal">({invoice.citizen_name})</span>
                            </td>
                            <td className="py-4 text-white font-semibold">
                              {invoice.items?.map(it => `${it.name} (x${it.quantity})`).join(", ") || "Paket Donasi"}
                            </td>
                            <td className="py-4 text-gray-300 font-mono">
                              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(invoice.total_amount)}
                            </td>
                            <td className="py-4">
                              <span id={`invoice-badge-${invoice.id}`} className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                invoice.status === "PENDING" 
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              {invoice.status === "PENDING" && (
                                <button 
                                  onClick={() => confirmInvoicePayment(invoice.id)}
                                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-slate-900 text-[10px] transition"
                                >
                                  Verifikasi (Set PAID)
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Auto Reminders Panel (Active subscriptions & Monthly bills) */}
            {userRole === "admin" && (
              <div className="glass rounded-3xl p-6 border border-rose-500/20">
                <div className="space-y-1 mb-6">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    📢 Auto Reminders & Properti Bulanan (Billing System)
                  </h3>
                  <p className="text-xs text-gray-400">Jadwal jatuh tempo sewa rumah dinas warga dan langganan Halfped aktif.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase font-bold tracking-wider">
                        <th className="pb-3 w-1/4">User / Pemilik</th>
                        <th className="pb-3 w-1/4">Jenis Tagihan / Langganan</th>
                        <th className="pb-3 w-1/5">Batas Jatuh Tempo</th>
                        <th className="pb-3 w-1/6">Sisa Hari</th>
                        <th className="pb-3 w-1/4 text-right">Kirim Pengingat (Reminder)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { owner: "Ucup Slebew", type: "Tagihan Rumah Vinewood (Monthly)", due: "2026-07-15", daysLeft: 4, id: 201 },
                        { owner: "cosmic_frills", type: "VIP Halfped Subscription", due: "2026-07-12", daysLeft: 1, id: 202 },
                        { owner: "Mulyono Racing", type: "Tagihan Apartemen Dinas", due: "2026-07-28", daysLeft: 17, id: 203 }
                      ].map((reminder) => (
                        <tr key={reminder.id} className="border-b border-white/5 hover:bg-white/5 transition" id={`reminder-row-${reminder.id}`}>
                          <td className="py-4 font-bold text-white">{reminder.owner}</td>
                          <td className="py-4 text-rose-300 font-semibold">{reminder.type}</td>
                          <td className="py-4 text-gray-300 font-mono">{reminder.due}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                              reminder.daysLeft <= 3 
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" 
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}>
                              {reminder.daysLeft} Hari Lagi
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => {
                                alert(`Notifikasi pengingat pembayaran dikirimkan otomatis ke Discord ${reminder.owner}!`);
                                const btn = document.getElementById(`reminder-btn-${reminder.id}`);
                                if (btn) {
                                  btn.innerText = "Terkirim";
                                  btn.setAttribute("disabled", "true");
                                  btn.className = "px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-500 font-bold text-[10px] cursor-not-allowed";
                                }
                              }}
                              id={`reminder-btn-${reminder.id}`}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-[10px] transition"
                            >
                              Kirim Alert Discord
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Store Editor Panel (Real-time shop manager) */}
            {userRole === "admin" && (
              <div className="glass rounded-3xl p-6 border border-amber-500/20 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    🛠️ Gemilang Jaya Store Editor (Pengaturan Toko)
                  </h3>
                  <p className="text-xs text-gray-400">Atur katalog produk, edit nominal harga donasi, atau nonaktifkan paket promo di website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Edit Existing Items */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <h4 className="font-extrabold text-sm text-amber-300">Edit Harga Paket Aktif</h4>
                    
                    <div className="space-y-3 text-xs">
                      {[
                        { name: "VIP Warga Kece (30 Hari)", price: "150.000", id: "vip" },
                        { name: "Paket Sultan Rizz Motor", price: "750.000", id: "rizz" },
                        { name: "VIP Halfped Subscription", price: "1.250.000", id: "halfped" },
                        { name: "Donatur Kelas Kakap (Permanen)", price: "5.000.000", id: "kakap" }
                      ].map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                          <span className="font-bold text-white">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500">Rp</span>
                            <input 
                              type="text" 
                              defaultValue={item.price}
                              className="w-24 px-2 py-1 rounded bg-[#0f0d19] border border-white/10 text-white font-mono font-bold text-right"
                            />
                            <button 
                              onClick={() => alert(`Harga baru untuk ${item.name} berhasil disimpan!`)}
                              className="px-2 py-1 rounded bg-amber-500 text-slate-900 font-bold text-[9px]"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Item to Store */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-xs">
                    <h4 className="font-extrabold text-sm text-purple-300">Tambah Produk / Mobil Impor Baru</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 block">NAMA DOKUMEN / NAMA MOBIL</label>
                        <input type="text" placeholder="Contoh: Koenisegg Jesko Supercar" className="w-full px-3 py-2 rounded-lg bg-[#0f0d19] border border-white/10 text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block">HARGA DONASI (RP)</label>
                          <input type="number" placeholder="Contoh: 1500000" className="w-full px-3 py-2 rounded-lg bg-[#0f0d19] border border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block">KATEGORI</label>
                          <select className="w-full px-3 py-2 rounded-lg bg-[#0f0d19] border border-white/10 text-white">
                            <option>Custom Cars</option>
                            <option>Custom Skins</option>
                            <option>VIP & Priority</option>
                            <option>Custom Prop</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 block">DESKRIPSI BENEFIT MOBIL / ITEM</label>
                        <textarea placeholder="Tuliskan spesifikasi mobil impor atau limitasi item..." className="w-full h-14 px-3 py-2 rounded-lg bg-[#0f0d19] border border-white/10 text-white resize-none"></textarea>
                      </div>
                      
                      <button 
                        onClick={() => alert("Item baru telah sukses didaftarkan ke etalase Toko Donasi Gemilang Jaya!")}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs tracking-wider transition"
                      >
                        Publish Ke Toko
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
