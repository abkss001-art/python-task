import React from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Table2,
  Columns3,
  MonitorSmartphone,
  RotateCcw,
  Download,
  Flame,
  UserCheck,
  ChevronDown,
  X
} from 'lucide-react';
import {
  PLATFORMS,
  STATUSES,
  STATUS_CONFIG,
  StdIssue,
  StdPlatform,
  StdStatus
} from '../types/std';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  platformFilter: StdPlatform | 'ALL';
  onPlatformFilterChange: (p: StdPlatform | 'ALL') => void;
  statusFilter: StdStatus | 'ALL';
  onStatusFilterChange: (s: StdStatus | 'ALL') => void;
  quickPreset: 'ALL' | 'MY_ISSUES' | 'CRITICAL';
  onQuickPresetChange: (preset: 'ALL' | 'MY_ISSUES' | 'CRITICAL') => void;
  myIssuesCount: number;
  criticalIssuesCount: number;
  viewMode: 'cards' | 'table' | 'kanban';
  onViewModeChange: (mode: 'cards' | 'table' | 'kanban') => void;
  systemIssues: StdIssue[];
  filteredCount: number;
  onExportCsv: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  platformFilter,
  onPlatformFilterChange,
  statusFilter,
  onStatusFilterChange,
  quickPreset,
  onQuickPresetChange,
  myIssuesCount,
  criticalIssuesCount,
  viewMode,
  onViewModeChange,
  systemIssues,
  filteredCount,
  onExportCsv,
  onResetFilters
}) => {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    platformFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    quickPreset !== 'ALL';

  const getStatusCount = (status: StdStatus) =>
    systemIssues.filter((i) => i.status === status).length;

  return (
    <div className="space-y-3 sm:space-y-4 mb-6" dir="rtl">
      {/* Interactive Status Summary Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => onStatusFilterChange('ALL')}
          className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border text-right transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/30 shadow-sm dark:bg-indigo-950/60 dark:border-indigo-500 dark:ring-indigo-500/40'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80'
          }`}
        >
          <div>
            <div
              className={`text-[11px] sm:text-xs font-bold transition-colors ${
                statusFilter === 'ALL'
                  ? 'text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              סה"כ תקלות
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold font-mono mt-0.5 transition-colors ${
                statusFilter === 'ALL'
                  ? 'text-indigo-950 dark:text-indigo-100'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {systemIssues.length}
            </div>
          </div>
          <span
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-300 dark:ring-indigo-700'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
        </button>

        {STATUSES.map((st) => {
          const cfg = STATUS_CONFIG[st];
          const count = getStatusCount(st);
          const isSelected = statusFilter === st;

          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusFilterChange(isSelected ? 'ALL' : st)}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                isSelected
                  ? `${cfg.bgBadge} ${cfg.borderBadge} ring-2 ${cfg.activeRing} shadow-sm`
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className={`text-[11px] sm:text-xs font-bold ${cfg.textBadge}`}>{st}</div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                  {count}
                </div>
              </div>
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${cfg.dotColor}`} />
            </button>
          );
        })}
      </div>

      {/* Main Unified Controls Card (Linear / GitHub Style) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-3 sm:p-4 space-y-3">
        {/* Top Row: Search Input + View Switchers & Export */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Universal Search (free text + ID matching) */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="חיפוש חופשי או לפי מזהה (#10, כותרת, מהות שגיאה, כותב)..."
              className="w-full pr-10 pl-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 focus:bg-white dark:focus:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="נקה חיפוש"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Switcher (Smart Table, Cards, Kanban) + CSV Export */}
          <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Table2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>טבלה חכמה</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>כרטיסיות</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('kanban')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>קנבן</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer shrink-0"
              title="ייצא את התקלות המסוננות לקובץ Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
              <span className="hidden sm:inline">ייצוא Excel</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Ultra-Clean Horizontal Scrollable Filter Chips (Linear/GitHub Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {/* Quick Preset: ALL */}
          <button
            type="button"
            onClick={() => onQuickPresetChange('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              quickPreset === 'ALL'
                ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>כל התקלות</span>
            <span className="text-[10px] opacity-80 font-mono">({systemIssues.length})</span>
          </button>

          {/* Quick Preset: MY_ISSUES */}
          <button
            type="button"
            onClick={() => onQuickPresetChange(quickPreset === 'MY_ISSUES' ? 'ALL' : 'MY_ISSUES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              quickPreset === 'MY_ISSUES'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>התקלות שלי</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                quickPreset === 'MY_ISSUES'
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
              }`}
            >
              {myIssuesCount}
            </span>
          </button>

          {/* Quick Preset: CRITICAL */}
          <button
            type="button"
            onClick={() => onQuickPresetChange(quickPreset === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              quickPreset === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50/70 dark:hover:bg-rose-950/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>תקלות קריטיות</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                quickPreset === 'CRITICAL'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
              }`}
            >
              {criticalIssuesCount}
            </span>
          </button>

          {/* Subtle separator */}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

          {/* Platform Dropdown Chip */}
          <div
            className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 cursor-pointer ${
              platformFilter !== 'ALL'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
          >
            <MonitorSmartphone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <span className="pointer-events-none">
              {platformFilter === 'ALL' ? 'כל הפלטפורמות' : platformFilter}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
            <select
              value={platformFilter}
              onChange={(e) => onPlatformFilterChange(e.target.value as StdPlatform | 'ALL')}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="סנן לפי פלטפורמה"
            >
              <option value="ALL">כל הפלטפורמות</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown Chip */}
          <div
            className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 cursor-pointer ${
              statusFilter !== 'ALL'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <span className="pointer-events-none">
              {statusFilter === 'ALL' ? 'כל הסטטוסים' : statusFilter}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as StdStatus | 'ALL')}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="סנן לפי סטטוס"
            >
              <option value="ALL">כל הסטטוסים</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Pill (visible only when filters active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition cursor-pointer shrink-0"
              title="איפוס כל הסינונים"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס ({filteredCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
