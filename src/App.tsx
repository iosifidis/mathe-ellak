import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, ExternalLink, BookOpen } from 'lucide-react';

// 1. Σωστό Import του Logo
import logo from './mathe-ellak.png';

// 2. Import του Master Index
import categories from './data.json';

// 3. Προ-φόρτωση των JSON (Eager Loading) για να αποφύγουμε σφάλματα path
import data_daily from './data_daily.json';
import data_business from './data_business.json';
import data_edu from './data_edu.json';
import data_gov from './data_gov.json';

// Map για να συνδέσουμε το "file" του data.json με τα πραγματικά imports
const dataMap: Record<string, any> = {
  "data_daily.json": data_daily,
  "data_business.json": data_business,
  "data_edu.json": data_edu,
  "data_gov.json": data_gov
};

export default function App() {
  const [activeData, setActiveData] = useState<any[] | null>(null);
  const [topLevelIndex, setTopLevelIndex] = useState(0);
  const [subPath, setSubPath] = useState<number[]>([]);
  const [history, setHistory] = useState<{ topIndex: number; subPath: number[] }[]>([]);

  // Πλέον η φόρτωση είναι ακαριαία από το Map
  const loadCategory = (fileName: string) => {
    const data = dataMap[fileName];
    if (data) {
      setActiveData(data);
      setTopLevelIndex(0);
      setSubPath([]);
      setHistory([]);
    } else {
      alert(`Σφάλμα: Δεν βρέθηκαν δεδομένα για το ${fileName}`);
    }
  };

  const currentTopic = activeData
    ? (() => {
      let topic = activeData[topLevelIndex];
      for (const index of subPath) {
        if (topic.subcategories && topic.subcategories[index]) {
          topic = topic.subcategories[index];
        }
      }
      return topic;
    })()
    : categories[topLevelIndex];


  // 1. Διόρθωση του handleNext για να κυλάει σωστά στις υποκατηγορίες
  const handleNext = () => {
    if (!activeData) {
      // Looping στην αρχική οθόνη (Daily, Business κλπ)
      setTopLevelIndex((prev) => (prev + 1) % categories.length);
      return;
    }

    if (subPath.length === 0) {
      // Looping στις κύριες ενότητες του αρχείου (π.χ. από Εργαλεία Γραφείου σε Πολυμέσα)
      setTopLevelIndex((prev) => (prev + 1) % activeData.length);
    } else {
      // Looping ΜΟΝΟ μέσα στην υποκατηγορία (π.χ. μόνο ανάμεσα στα Linux Distros)
      // Βρίσκουμε τον γονέα
      let parent = activeData[topLevelIndex];
      for (let i = 0; i < subPath.length - 1; i++) {
        parent = parent.subcategories[subPath[i]];
      }

      const currentIndexInLevel = subPath[subPath.length - 1];
      // Υπολογισμός του επόμενου index με modulo για να γυρνάει στο 0
      const nextIndex = (currentIndexInLevel + 1) % parent.subcategories.length;

      const newPath = [...subPath];
      newPath[newPath.length - 1] = nextIndex;
      setSubPath(newPath);
    }
  };

  // 2. Διόρθωση του handleYes για να μπαίνει στην πρώτη υποκατηγορία σωστά
  const handleYes = () => {
    if (!activeData) {
      loadCategory(categories[topLevelIndex].file);
    } else if (currentTopic.subcategories && currentTopic.subcategories.length > 0) {
      setHistory([...history, { topIndex: topLevelIndex, subPath: [...subPath] }]);
      // Μπαίνουμε στην πρώτη υποκατηγορία (index 0)
      setSubPath([...subPath, 0]);
    } else if (currentTopic.url) {
      window.open(currentTopic.url, '_blank');
    }
  };
  const handleBack = () => {
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      setTopLevelIndex(lastEntry.topIndex);
      setSubPath(lastEntry.subPath);
      setHistory(history.slice(0, -1));
    } else {
      setActiveData(null);
      setTopLevelIndex(0);
      setSubPath([]);
    }
  };

  const handleBackToStart = () => {
    setActiveData(null);
    setTopLevelIndex(0);
    setSubPath([]);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#1a1d20] text-white flex flex-col font-sans">

      {/* Navbar */}
      <nav className="w-full bg-[#141619] border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-md">
        <a href="#" onClick={(e) => { e.preventDefault(); handleBackToStart(); }} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">ΜΑΘΕ ΕΛΛΑΚ</h1>
            <p className="text-[10px] text-[#35b9ab] uppercase font-semibold">Οργανισμός Ανοιχτών Τεχνολογιών</p>
          </div>
        </a>

        <div className="flex items-center gap-6">
          <a href="https://ellak.gr/wiki" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-[#35b9ab] transition-colors">
            <BookOpen className="w-4 h-4" /> Wiki
          </a>
          <a href="https://mathe.ellak.gr" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-[#35b9ab] transition-colors">
            <ExternalLink className="w-4 h-4" /> mathe.ellak.gr
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl w-full space-y-8">

          <header className="space-y-2">
            <p className="text-gray-400 text-lg">«Ανακάλυψε τον κόσμο του Ανοιχτού Λογισμικού»</p>
            <h1 className="text-3xl font-serif">Βρες το κατάλληλο εργαλείο σε 3 βήματα</h1>
          </header>

          <div className="text-[#35b9ab] text-[10px] font-black tracking-[0.2em]">
            {activeData ? "Εξερεύνηση Λογισμικού" : "Επιλέξτε Κατηγορία Χρήσης"}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTopic.id + (activeData ? 'active' : 'idle')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#1e4d46] p-8 sm:p-12 rounded-xl shadow-2xl text-white border border-[#35b9ab]/20 relative"
            >
              {activeData && !currentTopic.subcategories && (
                <div className="absolute top-0 right-0 bg-[#35b9ab] text-[#1a3a3a] px-4 py-1 text-[10px] font-bold uppercase">
                  Πρόταση ΕΛ/ΛΑΚ
                </div>
              )}

              <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight text-[#35b9ab]">
                {currentTopic.title}
              </h2>

              {currentTopic.commercial_equivalent && (
                <div className="inline-block bg-[#1a3a3a] text-[#35b9ab] px-4 py-2 rounded-md font-bold text-sm mb-6 border border-[#35b9ab]/30 shadow-sm">
                  ΑΝΤΙΚΑΘΙΣΤΑ: {currentTopic.commercial_equivalent}
                </div>
              )}

              <p className="text-lg sm:text-xl font-medium leading-relaxed opacity-90 max-w-2xl mx-auto italic">
                {currentTopic.description}
              </p>

            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={handleYes}
              className="bg-[#28a745] hover:bg-[#218838] text-white font-bold py-4 px-10 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              {activeData ? (currentTopic.subcategories ? "Πες μου περισσότερα" : "Επίσκεψη στην ιστοσελίδα") : "Ενδιαφέρομαι"}
            </button>

            <button
              onClick={handleNext}
              className="bg-[#dc3545] hover:bg-[#c82333] text-white font-bold py-4 px-10 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg"
            >
              <XCircle className="w-5 h-5" />
              Δεν με ενδιαφέρει, επόμενο
            </button>

            {(activeData || history.length > 0) && (
              <button
                onClick={handleBack}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white font-bold py-4 px-10 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Έκανα λάθος. Πάμε πίσω
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-500 text-[10px] uppercase tracking-widest bg-[#141619]">
        © {new Date().getFullYear()} <a href="https://ellak.gr" target="_blank" rel="noreferrer">Οργανισμός Ανοιχτών Τεχνολογιών - ΕΕΛΛΑΚ</a>
      </footer>
    </div>
  );
}