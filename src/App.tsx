import { useState, useEffect } from 'react';
import { Calculator, Edit3, Archive, ChevronUp, Grip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputForm } from './components/InputForm';
import { Sidebar } from './components/Sidebar';
import { History } from './components/History';
import { Modal } from './components/Modal';
import { useCalculator } from './hooks/useCalculator';
import { useAuth, useScenarios } from './hooks/useFirestore';
import type { CostItem, Scenario } from './types';
import { cn } from './lib/utils';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Data State
  const [title, setTitle] = useState('');
  const [fixedItems, setFixedItems] = useState<CostItem[]>([{ id: '1', name: 'Mesin Utama', cost: 0 }]);
  const [opexItems, setOpexItems] = useState<CostItem[]>([{ id: '1', name: 'Listrik', cost: 0 }, { id: '2', name: 'Gaji', cost: 0 }]);
  const [variableItems, setVariableItems] = useState<CostItem[]>([{ id: '1', name: 'Bahan', cost: 0 }]);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    type: 'info' | 'danger';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    type: 'info',
    onConfirm: () => { }
  });

  // Hooks
  const user = useAuth();
  const { scenarios, saveScenario, deleteScenario } = useScenarios(user);
  const results = useCalculator(fixedItems, opexItems, variableItems, sellingPrice, dailyTarget);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSave = () => {
    if (editingId) {
      setModalConfig({
        isOpen: true,
        title: "Perbarui Data?",
        description: "Skenario lama akan ditimpa dengan data baru yang sudah diubah.",
        confirmText: "Ya, Perbarui",
        type: 'info',
        onConfirm: executeSave
      });
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    const data = {
      title: title || "Bisnis Tanpa Nama",
      fixedItems,
      opexItems,
      variableItems,
      sellingPrice,
      dailyTarget
    };
    await saveScenario(data, editingId || undefined);

    if (editingId) {
      setEditingId(null);
    } else {
      resetForm();
    }
    setActiveTab('history');
  };

  const handleEdit = (s: Scenario) => {
    setEditingId(s.id || null);
    setTitle(s.title);
    setFixedItems(s.fixedItems);
    setOpexItems(s.opexItems);
    setVariableItems(s.variableItems);
    setSellingPrice(s.sellingPrice);
    setDailyTarget(s.dailyTarget);
    setActiveTab('input');
  };

  const handleDelete = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Analisis?",
      description: "Data skenario ini akan dihapus secara permanen dan tidak dapat dipulihkan kembali.",
      confirmText: "Hapus Sekarang",
      type: 'danger',
      onConfirm: () => deleteScenario(id)
    });
  };

  const resetForm = () => {
    setTitle('');
    setFixedItems([{ id: crypto.randomUUID(), name: 'Mesin Utama', cost: 0 }]);
    setOpexItems([{ id: crypto.randomUUID(), name: 'Listrik', cost: 0 }, { id: crypto.randomUUID(), name: 'Gaji', cost: 0 }]);
    setVariableItems([{ id: crypto.randomUUID(), name: 'Bahan', cost: 0 }]);
    setSellingPrice(0);
    setDailyTarget(10);
    setEditingId(null);
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen flex flex-col pb-32 md:pb-10 font-[Plus_Jakarta_Sans] bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10" />

      {/* Desktop Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="hidden md:block sticky top-6 z-30 px-8 mb-6"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-sm border border-white/50">
          <div className="flex items-center gap-3 font-black text-indigo-600 text-2xl tracking-tighter">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            CalculatorBisnis
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('input')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'input' ? "bg-white shadow-lg shadow-indigo-100 text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Grip className="w-4 h-4" /> Editor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'history' ? "bg-white shadow-lg shadow-indigo-100 text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Archive className="w-4 h-4" /> Arsip
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden bg-white/80 backdrop-blur-md border-b border-indigo-50 sticky top-0 z-30 px-6 py-5 flex justify-between items-center"
      >
        <div className="flex items-center gap-2 font-black text-indigo-600 text-xl tracking-tighter">
          <Calculator className="w-6 h-6 fill-indigo-600" /> Calculator
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide">
          {scenarios.length} PROYEK
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8 pb-32 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Panel (Input or History) */}
          <div className={cn("lg:col-span-8 transition-all duration-500", activeTab === 'history' ? 'lg:col-span-12' : '')}>
            <AnimatePresence mode="wait">
              {activeTab === 'input' ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <InputForm
                    title={title} setTitle={setTitle}
                    fixedItems={fixedItems} setFixedItems={setFixedItems}
                    opexItems={opexItems} setOpexItems={setOpexItems}
                    variableItems={variableItems} setVariableItems={setVariableItems}
                    sellingPrice={sellingPrice} setSellingPrice={setSellingPrice}
                    dailyTarget={dailyTarget} setDailyTarget={setDailyTarget}
                    onSave={handleSave}
                    isEditing={!!editingId}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <History
                    scenarios={scenarios}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Sidebar (Only visible in Input mode) */}
          <AnimatePresence>
            {activeTab === 'input' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, width: 0 }}
                className="hidden lg:block lg:col-span-4 space-y-6"
              >
                <div className="sticky top-28">
                  <Sidebar results={results} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Floating Quick Result */}
      <AnimatePresence>
        {!isMobileDetailOpen && activeTab === 'input' && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={() => setIsMobileDetailOpen(true)}
            className="md:hidden fixed bottom-28 left-4 right-4 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white/50 shadow-2xl shadow-indigo-900/10 z-40 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                results.netProfit > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              )}>
                {results.netProfit > 0 ? <Grip className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Estimasi Laba</p>
                <p className="font-black text-slate-800 text-lg">{formatIDR(results.netProfit)}</p>
              </div>
            </div>
            <div className="bg-slate-100 p-2 rounded-full">
              <ChevronUp className="w-5 h-5 text-slate-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Detail Overlay */}
      <AnimatePresence>
        {isMobileDetailOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDetailOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-slate-50 rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm pt-6 pb-4 z-20 rounded-t-[2.5rem]">
                <div className="w-16 h-1.5 bg-slate-300 rounded-full mx-auto" />
              </div>

              <div className="px-0 pb-24">
                <Sidebar results={results} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-around items-center z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setActiveTab('input')}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-300",
            activeTab === 'input' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            <Edit3 className="w-5 h-5" />
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors",
            activeTab === 'input' ? "text-indigo-600" : "text-slate-300"
          )}>Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className="group flex flex-col items-center gap-1.5"
        >
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-300",
            activeTab === 'history' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 group-hover:bg-slate-50"
          )}>
            <Archive className="w-5 h-5" />
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors",
            activeTab === 'history' ? "text-indigo-600" : "text-slate-300"
          )}>Arsip</span>
        </button>
      </nav>

      {/* Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}

export default App;
