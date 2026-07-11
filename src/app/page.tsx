"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag, 
  FileText, 
  Gamepad2, 
  Users, 
  Clock, 
  Activity,
  ArrowRight,
  Heart,
  Globe,
  Flame,
  BookOpen
} from "lucide-react";

// Dictionaries
const textContent = {
  id: {
    titleTag: "PORTAL WARGA GEMILANG JAYA",
    heroTitle1: "Nikmati Roleplay",
    heroTitle2: "Paling Gemilang!",
    heroDesc: "Selamat datang di Supercali Roleplay! Bangun karirmu di Kepolisian Vibe Patrol (SCVP), layani warga bersama Arcane Rescue Center, modifikasi mobil impian di Rizz Motor, atau jadi pebisnis sukses nan gemilang.",
    btnWhitelist: "Gabung Whitelist",
    btnDonate: "Donasi Gemilang Jaya",
    activeWarga: "Warga Aktif",
    activeWargaDesc: "Saat ini ada warga aktif in-game yang sedang berinteraksi.",
    uptime: "Uptime Server",
    uptimeDesc: "Server aktif 24/7 dengan kestabilan optimal terproteksi Cloudflare Guard.",
    autoDoc: "Layanan Surat Auto",
    autoDocDesc: "Cetak Surat Keterangan Sehat ARC atau Izin Senjata SCVP otomatis lewat dashboard dinas.",
    mascotTag: "✨ Temui Maskot Kota Kami",
    mascotTitle: "Cali & Cila: Duo Kucing Penyihir Bintang",
    mascotDesc: "Kota Supercali dijaga oleh dua anak kucing penyihir kembar yang sangat lucu: Cali (si kucing abu gelap bermata bintang emas) dan Cila (si kucing pastel ungu bermata bintang perak).",
    caliDesc: "Pemberi kehangatan, keceriaan, dan keberuntungan untuk seluruh warga sipil serta donatur Gemilang Jaya.",
    cilaDesc: "Penjaga ketertiban, keamanan, dan kedamaian hukum di bawah patroli kepolisian SCVP & penanganan medis ARC.",
    historyTag: "📖 Sejarah Kelam & Drama Kota",
    historyTitle: "Lore Supercali: Awal Mula Segala Drama",
    historyDesc1: "Dahulu kala, Supercali hanyalah sebuah kota kecil biasa. Semuanya berubah ketika klan penyihir kucing kuno secara tidak sengaja menumpahkan ramuan 'Sihir Rizz' di sumur kota, membuat warganya menjadi sangat narsis, drama, dan haus akan validasi sosial.",
    historyDesc2: "Kini, di era modern, perselisihan tiada henti antara geng pembalap liar Rizz Motor, polisi SCVP yang suka razia secara dramatis, dan dokter ARC yang pusing mengurus warga koma, mewarnai kehidupan sehari-hari di kota penuh bintang ini.",
    quickAccess: "Akses Cepat Warga",
    home: "Beranda",
    whitelistQuiz: "Whitelist Quiz",
    shop: "Toko Gemilang Jaya",
    dashboard: "Layanan Dokumen & MDT",
    serverOnline: "Server Online",
    creditsTitle: "Tim & Partner Gemilang Kami",
    creditsDesc: "Para pendiri, pengembang, studio kreatif, dan tim pendukung di balik keajaiban kota Supercali Roleplay.",
    liveFivemTitle: "Daftar Live Warga FiveM",
    liveFivemDesc: "Warga yang sedang aktif in-character di kota saat ini. Klik tombol untuk melacak.",
    btnCheckPlayers: "Cek Daftar Pemain",
    modalClose: "Tutup"
  },
  en: {
    titleTag: "GLORIOUS CITIZENS PORTAL",
    heroTitle1: "Enjoy The Most",
    heroTitle2: "Glorious Roleplay!",
    heroDesc: "Welcome to Supercali Roleplay! Build your career in the Vibe Patrol Police (SCVP), serve citizens with the Arcane Rescue Center, customize dream cars at Rizz Motor, or become a highly successful businessman.",
    btnWhitelist: "Join Whitelist",
    btnDonate: "Donate Gemilang Jaya",
    activeWarga: "Active Citizens",
    activeWargaDesc: "There are currently active citizens interacting in-game.",
    uptime: "Server Uptime",
    uptimeDesc: "Server online 24/7 with optimal stability guarded by Cloudflare.",
    autoDoc: "Auto Document Center",
    autoDocDesc: "Generate ARC Medical clearance or SCVP weapon licenses automatically through the department dashboard.",
    mascotTag: "✨ Meet Our Town Mascots",
    mascotTitle: "Cali & Cila: The Star Witch Cat Duo",
    mascotDesc: "Supercali city is protected by two adorable twin witch kittens: Cali (the dark grey cat with gold star eyes) and Cila (the pastel purple cat with silver star eyes).",
    caliDesc: "Bringer of warmth, happiness, and ultimate luck to all citizens and Gemilang Jaya donors.",
    cilaDesc: "Guardian of order, security, and peaceful law under SCVP Vibe Patrol and ARC medical responses.",
    historyTag: "📖 Dark History & City Drama",
    historyTitle: "Supercali Lore: The Origin of All Drama",
    historyDesc1: "Once upon a time, Supercali was just a quiet town. Everything changed when the ancient clan of witch cats accidentally spilled the 'Rizz Potion' in the town well, making every citizen extremely dramatic, expressive, and validation-hungry.",
    historyDesc2: "Now, in the modern era, endless rivalries between Rizz Motor racers, SCVP officers doing dramatic traffic stops, and ARC doctors tired of treating clumsy citizens, shape the daily life in this star-blessed magical metropolis.",
    quickAccess: "Citizens Quick Access",
    home: "Home",
    whitelistQuiz: "Whitelist Quiz",
    shop: "Gemilang Jaya Shop",
    dashboard: "Document & MDT Panel",
    serverOnline: "Server Online",
    creditsTitle: "Our Glorious Team & Partners",
    creditsDesc: "The brilliant minds, developers, and studios behind the magic of Supercali Roleplay.",
    liveFivemTitle: "Live FiveM Citizens list",
    liveFivemDesc: "Warga yang sedang aktif in-character di kota saat ini. Klik tombol untuk melacak.",
    btnCheckPlayers: "Cek Daftar Pemain",
    modalClose: "Tutup"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [playerCount, setPlayerCount] = useState(42);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);

  // Simulated live active FiveM players list
  const activeFivemPlayers = [
    { name: "Ucup Slebew", id: 1, ping: "24ms", job: "Warga Sipil / Civilian" },
    { name: "Mulyono Racing", id: 2, ping: "35ms", job: "Mechanic - Rizz Motor" },
    { name: "Dr. Siti Arcane", id: 3, ping: "18ms", job: "Medical - Arcane Rescue" },
    { name: "Kapolda Mulyono", id: 4, ping: "42ms", job: "Vibe Patrol SCVP" },
    { name: "cosmic_frills", id: 5, ping: "12ms", job: "Warga Sipil / Civilian" }
  ];

  // Simple simulated live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 0 ? next : 12;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const dict = textContent[lang];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header / Nav */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/supercali_logo.png" 
            alt="Supercali Logo" 
            className="h-10 w-10 object-contain rounded-full bg-white/5 border border-purple-500/20 shadow-md animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div>
            <h1 className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-yellow-200">
              SUPERCALI <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ROLEPLAY</span>
            </h1>
            <p className="text-[10px] text-gray-400">supercalifragilisticexpialidocious</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-purple-400 transition">{dict.home}</Link>
          <Link href="/whitelist" className="hover:text-purple-400 transition flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> {dict.whitelistQuiz}
          </Link>
          <Link href="/shop" className="hover:text-purple-400 transition flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-amber-400" /> {dict.shop}
          </Link>
          <Link href="/dashboard" className="hover:text-purple-400 transition flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" /> {dict.dashboard}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Translation Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1 text-[10px] font-bold">
            <button 
              onClick={() => setLang("id")}
              className={`px-2.5 py-1.5 rounded-lg transition ${lang === "id" ? "bg-purple-600 text-white" : "text-gray-400"}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 rounded-lg transition ${lang === "en" ? "bg-purple-600 text-white" : "text-gray-400"}`}
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {dict.serverOnline}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto w-full py-12 md:py-20 space-y-12">
        
        {/* Banner Card */}
        <div className="w-full relative rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex-1 space-y-6 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              {dict.titleTag}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              {dict.heroTitle1} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                {dict.heroTitle2}
              </span>
            </h2>

            <p className="text-gray-300 text-sm max-w-lg leading-relaxed">
              {dict.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Link href="/whitelist" className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition group text-sm">
                {dict.btnWhitelist}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link href="/shop" className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-white border border-white/10 flex items-center justify-center gap-2 transition text-sm">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {dict.btnDonate}
              </Link>
            </div>
          </div>

          <div className="w-full md:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 bg-gradient-to-tr from-purple-900/10 via-indigo-900/10 to-pink-900/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/supercali_logo.png" 
              alt="Supercali Logo Big" 
              className="object-contain w-3/4 h-3/4 drop-shadow-[0_10px_35px_rgba(196,181,253,0.3)] animate-pulse"
              style={{ animationDuration: "6s" }}
            />
          </div>
        </div>

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          <div className="glass glass-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">{dict.activeWarga}</h3>
                <p className="text-gray-400 text-xs mt-1">
                  {lang === "id" ? `Saat ini ada ` : `There are currently `}
                  <strong className="text-purple-300">{playerCount} {lang === "id" ? "warga" : "citizens"}</strong> 
                  {lang === "id" ? ` aktif in-game yang sedang berinteraksi.` : ` active in-game interacting right now.`}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsPlayersModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/20 text-purple-300 text-[10px] font-bold tracking-wider uppercase transition mt-2"
            >
              🔍 {dict.btnCheckPlayers}
            </button>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{dict.uptime}</h3>
              <p className="text-gray-400 text-xs mt-1">{dict.uptimeDesc}</p>
            </div>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{dict.autoDoc}</h3>
              <p className="text-gray-400 text-xs mt-1">{dict.autoDocDesc}</p>
            </div>
          </div>

        </div>

        {/* Mascot Introduction Section */}
        <div className="w-full glass rounded-3xl p-6 md:p-8 border border-purple-500/10 bg-gradient-to-tr from-purple-950/20 via-slate-900/40 to-pink-950/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full md:w-5/12 flex justify-center relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/mascot.png" 
              alt="Mascot Cali and Cila" 
              className="max-h-64 object-contain drop-shadow-[0_8px_25px_rgba(236,72,153,0.25)] hover:scale-105 transition duration-300"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] font-bold uppercase tracking-wider">
              {dict.mascotTag}
            </span>
            
            <h3 className="text-2xl md:text-3xl font-black text-white">
              {dict.mascotTitle}
            </h3>

            <p className="text-gray-300 text-xs leading-relaxed">
              {dict.mascotDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/10 space-y-1 text-left">
                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                  <span className="text-yellow-400">★</span> Cali
                </h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  {dict.caliDesc}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/10 space-y-1 text-left">
                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                  <span className="text-pink-400">✦</span> Cila
                </h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  {dict.cilaDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dramatic Gen-Z Town History Section */}
        <div className="w-full glass rounded-3xl p-6 md:p-10 border border-white/5 relative overflow-hidden bg-gradient-to-br from-indigo-950/10 to-purple-950/20 space-y-6">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
              {dict.historyTag}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              {dict.historyTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm leading-relaxed text-gray-300">
            <p className="bg-white/5 p-4 rounded-2xl border border-white/5">
              {dict.historyDesc1}
            </p>
            <p className="bg-white/5 p-4 rounded-2xl border border-white/5">
              {dict.historyDesc2}
            </p>
          </div>

          {/* Lore Timeline details */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <p className="text-[10px] font-bold text-purple-400 tracking-widest uppercase text-center md:text-left">Timeline Perjalanan Kota</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
              <div className="flex gap-2">
                <span className="text-purple-400 font-extrabold shrink-0">1990:</span>
                <span className="text-gray-400">Sihir Rizz tumpah. Warga mulai bergosip dramatis di balai kota.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400 font-extrabold shrink-0">2010:</span>
                <span className="text-gray-400">Pembentukan Kepolisian SCVP akibat maraknya balap liar Rizz Motor.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-pink-400 font-extrabold shrink-0">2026:</span>
                <span className="text-gray-400">Supercali resmi bertransformasi menjadi kota paling gemilang se-roleplay!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Credits & Partners Section */}
        <div className="w-full glass rounded-3xl p-6 md:p-8 border border-purple-500/10 mb-6 bg-gradient-to-br from-purple-950/10 via-slate-900/40 to-cyan-950/10 space-y-6">
          <div className="text-center md:text-left space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider">
              🤝 SUPERCALI PARTNERSHIP
            </span>
            <h3 className="text-2xl font-black text-white">{dict.creditsTitle}</h3>
            <p className="text-gray-400 text-xs">{dict.creditsDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {/* Owner & Studio */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group hover:border-purple-500/30 transition">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-500" />
              <span className="text-xl block">👑</span>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition">Kenxzo MXI</h4>
                <p className="text-[10px] text-purple-400 font-bold">Owner & Founder</p>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">Studio Kenxzo MXI — Developer utama dan pencipta kota Supercali.</p>
            </div>

            {/* Co-Founder Council Zyra */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group hover:border-pink-500/30 transition">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-500" />
              <span className="text-xl block">🔮</span>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-pink-300 transition">Dewan Zyra</h4>
                <p className="text-[10px] text-pink-400 font-bold">Co-Founder & High Council</p>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">Dewan Sihir penasihat jalannya roda hukum sosial di Supercali RP.</p>
            </div>

            {/* Co-Founder Davy */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group hover:border-rose-500/30 transition">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-red-500 to-rose-500" />
              <span className="text-xl block">⚡</span>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-rose-300 transition">Davy</h4>
                <p className="text-[10px] text-rose-400 font-bold">Co-Founder</p>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">Penyokong utama pengembangan infrastruktur server Supercali RP.</p>
            </div>

            {/* Partner Studio */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group hover:border-cyan-500/30 transition">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              <span className="text-xl block">🎨</span>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition">Altermorph Studio</h4>
                <p className="text-[10px] text-cyan-400 font-bold">Official Partner</p>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">Menyediakan aset 3D kustom, UI premium, dan modifikasi visual kota.</p>
            </div>

            {/* Other Teams */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-500" />
              <span className="text-xl block">🎮</span>
              <div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition">Staff & Support Team</h4>
                <p className="text-[10px] text-amber-400 font-bold">Moderator & Admin</p>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">Menjaga kondusifitas OOC dan kenyamanan warga 24/7 non-stop.</p>
            </div>
          </div>
        </div>

        {/* Shortcuts for Features */}
        <div className="w-full text-center space-y-4 pt-4">
          <p className="text-xs text-gray-500 tracking-widest font-bold uppercase">{dict.quickAccess}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard?tab=scvp" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 border border-white/5 text-xs font-semibold text-gray-300 transition">
              🚨 MDT Vibe Patrol (SCVP)
            </Link>
            <Link href="/dashboard?tab=arc" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/5 text-xs font-semibold text-gray-300 transition">
              🏥 Arcane Rescue Center
            </Link>
            <Link href="/dashboard?tab=rizz" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/5 text-xs font-semibold text-gray-300 transition">
              🔧 Rizz Motor Catalog
            </Link>
            <Link href="/dashboard?tab=docs" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 border border-white/5 text-xs font-semibold text-gray-300 transition">
              📄 Generator Surat Dinas
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 px-6 py-6 text-center text-xs text-gray-500 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Supercali Roleplay by kenxzo.mxi. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> untuk warga Gemilang Jaya.
        </p>
      </footer>

      {/* FiveM Live Active Players Modal */}
      {isPlayersModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass border border-purple-500/20 rounded-3xl p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {dict.liveFivemTitle}
                </h3>
                <p className="text-[10px] text-gray-400">{dict.liveFivemDesc}</p>
              </div>
              <button 
                onClick={() => setIsPlayersModalOpen(false)}
                className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold px-2 py-1"
              >
                {dict.modalClose}
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {activeFivemPlayers.map((player) => (
                <div key={player.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] border border-purple-500/30">
                      ID: {player.id}
                    </span>
                    <div>
                      <p className="font-bold text-white">{player.name}</p>
                      <p className="text-[10px] text-gray-500">{player.job}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {player.ping}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[10px] text-gray-400 leading-normal text-center">
              Informasi status terhubung langsung ke API server FiveM Supercali.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
