import React from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Table2,
  Hash,
  MonitorSmartphone,
  RotateCcw,
  Download
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
  testCaseFilter: string;
  onTestCaseFilterChange: (id: string) => void;
  platformFilter: StdPlatform | 'ALL';
  onPlatformFilterChange: (p: StdPlatform | 'ALL') => void;
  statusFilter: StdStatus | 'ALL';
  onStatusFilterChange: (s: StdStatus | 'ALL') => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  availableTestCaseIds: string[];
  systemIssues: StdIssue[];
  filteredCount: number;
  onExportCsv: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  testCaseFilter,
  onTestCaseFilterChange,
  platformFilter,
  onPlatformFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  availableTestCaseIds,
  systemIssues,
  filteredCount,
  onExportCsv,
  onResetFilters
}) => {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(testCaseFilter.trim()) ||
    platformFilter !== 'ALL' ||
    statusFilter !== 'ALL';

  const getStatusCount = (status: StdStatus) =>
    systemIssues.filter((i) => i.status === status).length;

  return (
    <div className="space-y-4 mb-6" dir="rtl">
      {/* Interactive Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          type="button"
          onClick={() => onStatusFilterChange('ALL')}
          className={`flex items-center justify-between p-3.5 rounded-2xl border text-right transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs'
          }`}
        >
          <div>
            <div className={`text-xs font-medium ${statusFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
              סה"כ תקלות
            </div>
            <div className="text-xl font-extrabold font-mono mt-0.5">{systemIssues.length}</div>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${statusFilter === 'ALL' ? 'bg-indigo-400' : 'bg-slate-300'}`} />
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
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-right transition cursor-pointer ${
                isSelected
                  ? `${cfg.bgBadge} ${cfg.borderBadge} ring-2 ${cfg.activeRing} shadow-sm`
                  : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${cfg.textBadge}`}>{st}</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                  {count}
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${cfg.dotColor}`} />
            </button>
          );
        })}
      </div>

      {/* Main Search & Filter Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Right Side: Search + Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 flex-1">
            {/* Free Text Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="חיפוש חופשי בנושא, מהות השגיאה, הערות או כותב..."
                className="w-full pr-10 pl-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
              />
            </div>

            {/* Filter by Test Case ID (מזהה תסריט) */}
            <div className="relative sm:w-44">
              <Hash className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                list="testcase-id-suggestions"
                value={testCaseFilter}
                onChange={(e) => onTestCaseFilterChange(e.target.value)}
                placeholder="מזהה תסריט (10, 11...)"
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition rtl-safe"
              />
              <datalist id="testcase-id-suggestions">
                {availableTestCaseIds.map((id) => (
                  <option key={id} value={id} />
                ))}
              </datalist>
            </div>

            {/* Filter by Platform */}
            <div className="relative sm:w-44">
              <MonitorSmartphone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={platformFilter}
                onChange={(e) => onPlatformFilterChange(e.target.value as StdPlatform | 'ALL')}
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="ALL">כל הפלטפורמות</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    פלטפורמה: {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="relative sm:w-48">
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as StdStatus | 'ALL')}
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="ALL">כל הסטטוסים</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    סטטוס: {st}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                title="נקה את כל הסינונים"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>נקה סינון ({filteredCount})</span>
              </button>
            )}
          </div>

          {/* Left Side: View Switcher (Smart Table Default vs Smart Cards) + CSV Export */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span>טבלה חכמה</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>כרטיסיות חכמות</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="ייצא את התקלות המסוננות לקובץ Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">ייצוא Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
