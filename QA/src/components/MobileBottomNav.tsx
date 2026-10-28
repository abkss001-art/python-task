import React, { useState, useRef, useEffect } from 'react';
import {
  Table2,
  LayoutGrid,
  Columns3,
  Layers,
  Plus,
  Cloud,
  RefreshCw,
  Sun,
  Moon,
  ChevronUp,
  Check
} from 'lucide-react';
import { SyncStatusInfo } from '../types/std';

interface MobileBottomNavProps {
  viewMode: 'cards' | 'table' | 'kanban';
  onViewModeChange: (mode: 'cards' | 'table' | 'kanban') => void;
  systems: string[];
  activeSystem: string;
  onSelectSystem: (sys: string) => void;
  canCreateOrEdit: boolean;
  onOpenNewIssue: () => void;
  syncStatus: SyncStatusInfo;
  onManualSync: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  viewMode,
  onViewModeChange,
  systems,
  activeSystem,
  onSelectSystem,
  canCreateOrEdit,
  onOpenNewIssue,
  syncStatus,
  onManualSync,
  theme,
  onToggleTheme
}) => {
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        systemMenuRef.current &&
        !systemMenuRef.current.contains(e.target as Node)
      ) {
        setIsSystemMenuOpen(false);
      }
      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(e.target as Node)
      ) {
        setIsViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* System Selection Popover Menu */}
      {isSystemMenuOpen && (
        <div
          ref={systemMenuRef}
          dir="rtl"
          className="md:hidden fixed bottom-18 right-3 left-3 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>בחר מערכת פעילה</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {systems.length} מערכות
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                onSelectSystem('ALL');
                setIsSystemMenuOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSystem === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>כל המערכות</span>
              {activeSystem === 'ALL' && <Check className="w-3.5 h-3.5" />}
            </button>

            {systems.map((sys) => {
              const isSelected = activeSystem === sys;
              return (
                <button
                  key={sys}
                  type="button"
                  onClick={() => {
                    onSelectSystem(sys);
                    setIsSystemMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer truncate ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{sys}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode Popover Menu */}
      {isViewMenuOpen && (
        <div
          ref={viewMenuRef}
          dir="rtl"
          className="md:hidden fixed bottom-18 left-3 w-56 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 mb-1">
            בחר סגנון תצוגה
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onViewModeChange('table');
                setIsViewMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4" />
                <span>טבלה חכמה</span>
              </div>
              {viewMode === 'table' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                onViewModeChange('cards');
                setIsViewMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>כרטיסיות חכמות</span>
              </div>
              {viewMode === 'cards' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                onViewModeChange('kanban');
                setIsViewMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Columns3 className="w-4 h-4" />
                <span>לוח קנבן</span>
              </div>
              {viewMode === 'kanban' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav
        dir="rtl"
        aria-label="סרגל ניווט תחתון"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 shadow-2xl px-2 py-1 flex items-center justify-around safe-bottom"
      >
        {/* View Mode Switcher Button */}
        <button
          type="button"
          onClick={() => {
            setIsViewMenuOpen((prev) => !prev);
            setIsSystemMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 transition cursor-pointer ${
            isViewMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
          title={`החלף סגנון תצוגה (פעיל: ${viewMode === 'table' ? 'טבלה' : viewMode === 'cards' ? 'כרטיסים' : 'קנבן'})`}
        >
          {viewMode === 'table' && <Table2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          {viewMode === 'cards' && <LayoutGrid className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          {viewMode === 'kanban' && <Columns3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          <span className="text-[10px] font-bold mt-0.5">תצוגה</span>
        </button>

        {/* System Selector Button */}
        <button
          type="button"
          onClick={() => {
            setIsSystemMenuOpen((prev) => !prev);
            setIsViewMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center p-1.5 transition cursor-pointer max-w-[70px] ${
            isSystemMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
          title={`בחר מערכת (פעילה: ${activeSystem === 'ALL' ? 'כל המערכות' : activeSystem})`}
        >
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-bold mt-0.5 truncate w-full text-center">מערכות</span>
        </button>

        {/* Center Prominent New Issue (+) Button */}
        {canCreateOrEdit && (
          <div className="relative -top-4 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenNewIssue}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="דווח תקלה חדשה"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Manual Cloud Sync Button with Status Indicator */}
        <button
          type="button"
          onClick={onManualSync}
          className="flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
          title={`סנכרון ענן (${syncStatus.connected ? 'מחובר' : 'לא מקוון'})`}
        >
          <div className="relative">
            <Cloud className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900 ${
                syncStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>
          <span className="text-[10px] font-bold mt-0.5">סנכרון</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition cursor-pointer"
          title={theme === 'dark' ? 'עבור למצב יום (בהיר)' : 'עבור למצב לילה (כהה)'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-180 duration-300" />
          )}
          <span className="text-[10px] font-bold mt-0.5">
            {theme === 'dark' ? 'בהיר' : 'כהה'}
          </span>
        </button>
      </nav>
    </>
  );
};
