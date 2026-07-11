"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Sparkles, 
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  color: string;
  badge?: string;
}

const shopItems: Product[] = [
  {
    id: "vip-villager",
    name: "VIP Warga Kece (30 Hari)",
    price: 150000,
    category: "VIP & Priority",
    description: "Prioritas antrian masuk server jalur kilat (bypass queue), tag Discord khusus emas, opsi ganti baju/skin premium, plus gaji bulanan in-game bertambah +15%.",
    color: "from-purple-500 to-indigo-500",
    badge: "Terlaris"
  },
  {
    id: "rizz-sultan-car",
    name: "Paket Sultan Rizz Motor",
    price: 750000,
    category: "Custom Cars",
    description: "Voucher custom car impor di dealer Rizz Motor. Buka garasi berisi mobil super sport impian dengan neon menyala gemilang + kustom plat nomor.",
    color: "from-amber-500 to-yellow-500",
    badge: "Hot Sale"
  },
  {
    id: "halfped-sub",
    name: "VIP Halfped Subscription (30 Hari)",
    price: 1250000,
    category: "Custom Skins",
    description: "Akses skin Halfped eksklusif (anime / karakter kustom khusus) secara penuh selama 1 bulan. Dapatkan rizz maksimal di kota!",
    color: "from-pink-500 to-rose-500",
    badge: "Populer"
  },
  {
    id: "halfped-prop",
    name: "Katalog Mobil & Prop Halfped Khusus",
    price: 2500000,
    category: "Custom Prop",
    description: "Voucher kepemilikan mobil prop halfped impor (seperti motor terbang sihir, skateboard neon) untuk berinteraksi di publik.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "arc-bpjs",
    name: "BPJS VVIP Arcane Rescue",
    price: 350000,
    category: "Kesehatan",
    description: "Gratis biaya pingsan / koma selama 1 bulan. Dokter ARC siap menjemput Anda dengan helikopter VVIP gratis kemana saja.",
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: "house-monthly-bill",
    name: "Tagihan Bulanan Rumah Dinas / Pribadi",
    price: 100000,
    category: "Perawatan Rumah",
    description: "Pembayaran iuran listrik & air bulanan untuk menghindari penyegelan properti rumah/apartemen pribadi Anda in-game.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "kakap-donatur",
    name: "Donatur Kelas Kakap (Permanen)",
    price: 5000000,
    category: "Premium Bundle",
    description: "Hak kepemilikan Mansion mewah di Vinewood, kustom plat nomor kendaraan gratis seumur hidup, dan status donatur legendaris.",
    color: "from-orange-500 to-red-500",
    badge: "Limited"
  }
];

export default function Shop() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: detail, 2: success
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [activeShowcaseType, setActiveShowcaseType] = useState<"cars" | "peds">("cars");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Showroom Catalog Items for Cars
  const showcaseCars = [
    { name: "Koenigsegg Jesko (Tier S+)", speed: "450 km/h", seat: "2 Kursi", bonus: "Kustom Plat Emas", type: "Hypercar", img: "/showcase_car.png" },
    { name: "McLaren P1 GTR (Tier S)", speed: "420 km/h", seat: "2 Kursi", bonus: "Full Underglow Neon", type: "Race Track", img: "/mclaren_preview.png" },
    { name: "Porsche 911 GT3 RS (Tier A)", speed: "390 km/h", seat: "2 Kursi", bonus: "Engine Tuning Stage 3", type: "Sport", img: "/showcase_car.png" }
  ];

  // Showroom Catalog Items for Peds (Custom Character Skins)
  const showcasePeds = [
    { name: "Anime Character Pack (Halfped)", format: ".YTD / .YFT", features: "Dynamic Cloth Physics & Custom Emotes", type: "Kustom Anime", img: "/showcase_ped.png" },
    { name: "Cyberpunk Streetwear Male/Female", format: ".YTD / .YFT", features: "Glow in the dark textures & custom glass specs", type: "Street Rizz", img: "/cyberpunk_preview.png" }
  ];

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id]--;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = shopItems.find(p => p.id === id);
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  };

  const handleCheckout = () => {
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const confirmPayment = () => {
    setCheckoutStep(2);
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    setCart({});
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/5 no-print">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
              GEMILANG JAYA <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">STORE</span>
            </h1>
            <p className="text-[10px] text-gray-400">Toko Donasi Supercali Roleplay</p>
          </div>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/20 text-amber-400 font-bold transition flex items-center gap-2 text-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          Keranjang
          {getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-bounce shadow">
              {getCartCount()}
            </span>
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        
        {/* Banner Lucu */}
        <div className="w-full glass rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-amber-950/20 to-slate-900/40">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" /> Beli Sekarang Biar Gemilang!
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Toko Kebutuhan Warga <br />
              <span className="text-amber-400">Gemilang Jaya</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Donasimu mendukung operasional server, perlindungan DDoS Cloudflare, dan update fitur skrip berkala di kota Supercali. Setiap pembelian berstatus donasi sukarela dengan benefit in-game instan.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  setSelectedItemIndex(0);
                  setActiveShowcaseType("cars");
                  setShowCatalogModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-slate-900 text-xs transition shadow-md"
              >
                🏎️ Cek Katalog Mobil Tier S / S+
              </button>
              
              <button 
                onClick={() => {
                  setSelectedItemIndex(0);
                  setActiveShowcaseType("peds");
                  setShowCatalogModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-white text-xs transition border border-purple-500/30"
              >
                🎭 Cek Katalog Ped / Skin Anime
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shopItems.map((item) => (
            <div 
              key={item.id}
              className="glass rounded-2xl border border-white/5 hover:border-white/10 overflow-hidden flex flex-col justify-between group transition duration-300"
            >
              <div className={`h-2.5 bg-gradient-to-r ${item.color}`} />
              
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-extrabold text-xl text-white group-hover:text-amber-400 transition">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">Harga Donasi</p>
                    <p className="font-extrabold text-lg text-white">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(item.id)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-slate-900 border border-white/10 hover:border-amber-400 font-extrabold text-xs text-white transition duration-200"
                  >
                    Tambah Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end no-print">
          <div className="w-full max-w-md h-full bg-[#0d121f] border-l border-white/10 shadow-2xl flex flex-col justify-between p-6">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Keranjang Gemilang</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {Object.keys(cart).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2 p-6">
                  <ShoppingBag className="w-12 h-12 text-gray-600 animate-bounce" />
                  <p className="text-sm font-bold text-gray-300">Keranjang Masih Kosong</p>
                  <p className="text-xs text-gray-500 max-w-xs">Ayo borong keuntungan biar harimu makin gemilang di Supercali!</p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const item = shopItems.find(p => p.id === id);
                  if (!item) return null;
                  return (
                    <div 
                      key={id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                        <p className="text-amber-400 text-xs font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => removeFromCart(id)}
                          className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5">{qty}</span>
                        <button 
                          onClick={() => addToCart(id)}
                          className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteFromCart(id)}
                          className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {Object.keys(cart).length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-400">Total Pembayaran</span>
                  <span className="text-white text-lg font-black">{formatPrice(getCartTotal())}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-extrabold text-slate-900 text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition"
                >
                  <CreditCard className="w-4 h-4" />
                  Selesaikan Donasi
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            
            {checkoutStep === 1 ? (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <h3 className="font-extrabold text-lg text-white">Invoice Donasi</h3>
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-gray-300 space-y-2">
                    <p className="font-bold text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Pernyataan Donatur:
                    </p>
                    <p className="leading-relaxed">
                      Saya bersedia mendonasikan sebagian rezeki saya secara sukarela untuk mendukung kelangsungan server Supercali Roleplay.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 tracking-wider block">ID DISCORD ATAU NAMA UCP</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: ucup_surucup#1234"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-amber-400 outline-none text-sm text-white font-medium"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 font-mono">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Total Donasi</span>
                      <span className="text-white font-bold">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Gateway Mitra</span>
                      <span className="text-amber-400 font-bold">TEBEX CHECKOUT</span>
                    </div>
                  </div>

                  {/* Payment Gateway Options */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 block uppercase">Metode Pembayaran (Tebex Gateway)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-center font-bold text-white">
                        💳 Tebex Checkout (QRIS/E-Wallet/VA)
                      </div>
                      <div className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-center font-semibold text-gray-400 hover:text-white transition cursor-pointer" onClick={() => alert("Membuka gerbang pembayaran PayPal via Tebex.")}>
                        🅿️ PayPal (OOC/International)
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={confirmPayment}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-extrabold text-white text-sm transition"
                >
                  Konfirmasi & Bayar via Tebex
                </button>
              </>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-xl text-white">Donasi Gemilang Diterima!</h3>
                  <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                    Terima kasih telah berkontribusi! Harap hubungi Admin di kanal ticket Discord untuk sinkronisasi klaim benefit item Anda.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-[10px] text-gray-400 text-left space-y-1">
                  <p><strong className="text-white">ID INVOICE:</strong> INV/SC-GEMILANG/2026</p>
                  <p><strong className="text-white">STATUS:</strong> SELESAI / PAID</p>
                </div>

                <button 
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-slate-900 font-extrabold text-xs transition"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tebex Store Cooperation Info & Terms & Conditions Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-lg glass border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  🛡️ {activeShowcaseType === "cars" ? "Showroom Mobil Premium (Tier S/S+)" : "Katalog Kustom Ped & Skin Anime"}
                </h3>
                <p className="text-[10px] text-gray-400">Verifikasi aset in-game resmi tebex & hak cipta terdaftar.</p>
              </div>
              <button 
                onClick={() => setShowCatalogModal(false)}
                className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold px-2 py-1"
              >
                Tutup
              </button>
            </div>

            {/* Showcase Visual Image Banner */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 relative bg-slate-950/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={activeShowcaseType === "cars" ? showcaseCars[selectedItemIndex]?.img : showcasePeds[selectedItemIndex]?.img} 
                alt="Showcase Visual Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0813] to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] bg-black/60 border border-white/10 px-2 py-0.5 rounded text-white font-mono">
                📷 {activeShowcaseType === "cars" ? showcaseCars[selectedItemIndex]?.name : showcasePeds[selectedItemIndex]?.name}
              </span>
            </div>

            {/* List Showcase */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {activeShowcaseType === "cars" ? (
                showcaseCars.map((car, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`p-3.5 rounded-xl border space-y-2 cursor-pointer transition ${
                      selectedItemIndex === idx ? "bg-amber-500/10 border-amber-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] px-2 py-0.5 rounded font-black bg-amber-500/15 text-amber-300 border border-amber-500/20 uppercase">{car.type}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{car.seat}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{car.name}</h4>
                    <div className="flex justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                      <span>Kecepatan: <strong className="text-white">{car.speed}</strong></span>
                      <span>Bonus: <strong className="text-cyan-300">{car.bonus}</strong></span>
                    </div>
                  </div>
                ))
              ) : (
                showcasePeds.map((ped, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`p-3.5 rounded-xl border space-y-2 cursor-pointer transition ${
                      selectedItemIndex === idx ? "bg-purple-500/10 border-purple-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] px-2 py-0.5 rounded font-black bg-purple-500/15 text-purple-300 border border-purple-500/20 uppercase">{ped.type}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{ped.format}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{ped.name}</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{ped.features}</p>
                  </div>
                ))
              )}
            </div>

            {/* Terms and Conditions Showcase (TnC) & Tebex Footer */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2.5 text-[10px] text-gray-400 leading-normal">
              <p className="font-bold text-amber-300 flex items-center gap-1 uppercase tracking-wider">
                📢 Syarat & Ketentuan Lisensi Toko (Tebex TnC):
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-300">
                <li>Seluruh transaksi diproses dan diamankan melalui kemitraan resmi **Tebex Checkout**.</li>
                <li>Dilarang memperjualbelikan kembali (resell) file aset `.YTD / .YFT` kustom ped maupun mobil impor yang sudah diklaim.</li>
                <li>Refund hanya dilayani jika terjadi malfungsi skrip berat / file korup yang tidak dapat diselesaikan oleh tim developer dalam 3x24 jam.</li>
              </ul>
              <div className="pt-2.5 border-t border-white/5 text-[9px] text-center text-gray-500 font-mono">
                SECURED BY TEBEX PAYMENTS PARTNERSHIP • CERTIFIED SUPERCALI DEV
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
