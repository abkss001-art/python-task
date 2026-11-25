import React from 'react';
import { FlaskConical, ExternalLink } from 'lucide-react';
import { APP_VERSION, IS_STAGING, PROD_APP_URL } from '../utils/appEnv';

/**
 * High-contrast top banner rendered strictly in Pre-Prod (Staging) builds.
 * Renders null in Production so Prod UI stays 100% clean.
 */
export const StagingBanner: React.FC = () => {
  if (!IS_STAGING) return null;

  return (
    <div
      role="status"
      aria-label="סביבת בדיקות Pre-Prod"
      dir="rtl"
      className="sticky top-0 z-[60] w-full bg-gradient-to-l from-amber-600 via-orange-600 to-amber-600 text-white border-b border-amber-400/60 shadow-md px-3 py-1.5"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-extrabold">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/30 border border-white/25 shrink-0">
            <FlaskConical className="w-3.5 h-3.5 text-amber-200" />
            <span>Pre-Prod • סביבת בדיקות</span>
          </span>
          <span className="truncate font-bold text-amber-50">
            מסד נתונים מבודד (tzavman-qa-staging) • גרסה v{APP_VERSION} — שינויים כאן אינם משפיעים על הצוות ב-Prod
          </span>
        </div>
        <a
          href={PROD_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[11px] font-extrabold transition shrink-0"
        >
          <span>פתח Prod</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
