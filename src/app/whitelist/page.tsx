"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Apa arti dari Metagaming (MG) dalam server roleplay?",
    options: [
      "Menggunakan informasi dari luar game (seperti Discord/Live Stream) untuk kepentingan karakter in-game.",
      "Melakukan aksi akrobatik ekstrim menggunakan kendaraan sport.",
      "Mengobrol santai menggunakan Voice Chat in-game.",
      "Membeli mobil mewah menggunakan uang donasi Gemilang Jaya."
    ],
    correctAnswer: 0,
    explanation: "Metagaming adalah tindakan penyalahgunaan info OOC (Out of Character) untuk keuntungan IC (In Character)."
  },
  {
    id: 2,
    question: "Jika karakter Anda sedang terluka parah (koma/pingsan) dan butuh bantuan medis, apa tindakan Powergaming (PG) yang dilarang?",
    options: [
      "Menunggu petugas medis Arcane Rescue Center datang menolong.",
      "Melakukan /me berbicara lancar, berlari kencang, dan menyetir mobil padahal sedang koma.",
      "Menelepon mekanik Rizz Motor secara IC untuk diderek.",
      "Mengingat kejadian sebelum pingsan sesuai dengan batas aturan RP."
    ],
    correctAnswer: 1,
    explanation: "Powergaming adalah melakukan tindakan yang tidak masuk akal atau tidak mungkin dilakukan secara fisik di dunia nyata."
  },
  {
    id: 3,
    question: "Kapan Anda diperbolehkan merampok / menyerang polisi Vibe Patrol (SCVP)?",
    options: [
      "Kapan saja jika saya merasa bosan atau ingin pamer aksi kriminal.",
      "Hanya jika ada skenario Roleplay yang jelas, jumlah personil mencukupi, dan sesuai dengan batas aturan kriminal server.",
      "Setiap kali polisi sedang patroli sendirian tanpa ada saksi.",
      "Tidak pernah sama sekali meskipun dalam skenario peperangan geng."
    ],
    correctAnswer: 1,
    explanation: "Tindakan kriminal terhadap aparat harus memiliki landasan alasan RP yang sangat kuat dan mematuhi batasan kriminalitas server."
  },
  {
    id: 4,
    question: "Apa singkatan dari OOC dan IC?",
    options: [
      "Only One Chance & In-game Character",
      "Out of Character (Dunia Nyata) & In Character (Dunia Game)",
      "Office of Police & Inspector General",
      "Order of Customization & Idle Control"
    ],
    correctAnswer: 1,
    explanation: "OOC merujuk pada diri kita di dunia nyata, sedangkan IC merujuk pada karakter yang kita mainkan di dalam server."
  }
];

export default function Whitelist() {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1..N: questions, N+1: completed
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showError, setShowError] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const startQuiz = () => {
    setCurrentStep(1);
    setAnswers({});
    setShowError(false);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowError(false);
  };

  const handleNext = () => {
    // Validate if answered
    const currentQuestion = quizQuestions[currentStep - 1];
    if (answers[currentQuestion.id] === undefined) {
      setShowError(true);
      return;
    }

    if (currentStep < quizQuestions.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate results
      let score = 0;
      quizQuestions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });

      const passed = score === quizQuestions.length;
      setIsPassed(passed);
      setCurrentStep(quizQuestions.length + 1);

      if (passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setShowError(false);
    } else {
      setCurrentStep(0);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1 text-sm font-semibold transition no-print">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
      </Link>

      <div className="w-full max-w-xl glass rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* STEP 0: INTRO */}
        {currentStep === 0 && (
          <div className="space-y-6 text-center">
            <div className="h-16 w-16 bg-cyan-500/15 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10 animate-bounce">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">Ujian Kelulusan Warga</h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                Isi kuis singkat ini untuk membuktikan pemahamanmu mengenai aturan bermain peran di server Supercali Roleplay.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left space-y-2 text-xs text-gray-300">
              <p className="font-bold text-gray-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Aturan Kuis:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Terdiri dari {quizQuestions.length} pertanyaan pilihan ganda.</li>
                <li>Kamu harus menjawab semua pertanyaan dengan <span className="text-cyan-300 font-semibold">100% benar</span> untuk lolos.</li>
                <li>Jika gagal, kamu bisa langsung mencoba kembali.</li>
              </ul>
            </div>

            <button 
              onClick={startQuiz}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-extrabold text-white text-sm tracking-wide shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5"
            >
              Mulai Ujian Whitelist
            </button>
          </div>
        )}

        {/* STEPS 1..N: QUIZ QUESTIONS */}
        {currentStep > 0 && currentStep <= quizQuestions.length && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
              <span>PERTANYAAN {currentStep} DARI {quizQuestions.length}</span>
              <span className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                Akurasi Min. 100%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                style={{ width: `${(currentStep / quizQuestions.length) * 100}%` }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white leading-snug">
                {quizQuestions[currentStep - 1].question}
              </h3>

              <div className="space-y-2.5">
                {quizQuestions[currentStep - 1].options.map((option, idx) => {
                  const qId = quizQuestions[currentStep - 1].id;
                  const isSelected = answers[qId] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(qId, idx)}
                      className={`w-full p-4 rounded-xl text-left text-sm transition-all border flex items-center justify-between ${
                        isSelected 
                          ? "bg-purple-600/25 border-purple-500 text-white font-medium shadow-md shadow-purple-500/5" 
                          : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 ml-3" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {showError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pilih salah satu jawaban terlebih dahulu sebelum melanjutkan!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button 
                onClick={handleBack}
                className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition"
              >
                {currentStep === quizQuestions.length ? "Kirim Hasil" : "Lanjut"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP N+1: RESULT */}
        {currentStep > quizQuestions.length && (
          <div className="space-y-6 text-center">
            {isPassed ? (
              <>
                <div className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white">Selamat, Kamu Lulus! 🎉</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Karaktermu sekarang siap berlabuh di kota Supercali. Silakan daftarkan UCP/Discord ID milikmu di server.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-purple-300 font-mono tracking-wider">
                  TOKEN KELULUSAN: SC-GEMILANG-JAYA-PASS-2026
                </div>
                <div className="flex gap-3 pt-2">
                  <Link href="/" className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition">
                    Kembali Ke Home
                  </Link>
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 100, spread: 60 });
                    }}
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition"
                  >
                    Rayakan Lagi!
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
                  <AlertCircle className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white">Belum Berhasil Lolos 😢</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto">
                    Beberapa jawabanmu masih belum tepat. Ingat, warga kota Supercali harus paham betul konsep dasar bermain peran!
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[11px] text-gray-400 text-left space-y-2">
                  <p className="font-bold text-rose-300">💡 Tips Kelulusan:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Metagaming dilarang karena merusak batas dunia nyata vs dunia game.</li>
                    <li>Karakter pingsan tidak bisa melakukan tindakan fisik normal (Powergaming).</li>
                    <li>Tindakan kriminal pada kepolisian harus memiliki skenario matang.</li>
                  </ul>
                </div>
                <button 
                  onClick={startQuiz}
                  className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-slate-950 font-black text-sm tracking-wide transition"
                >
                  Ulangi Ujian Whitelist
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
