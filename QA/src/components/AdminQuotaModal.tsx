import React, { useCallback, useEffect, useState } from 'react';
import {
  X,
  Gauge,
  RefreshCw,
  Database,
  Users,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { PlatformQuotaSnapshot } from '../types/std';
import { syncService } from '../services/syncService';
import { useModalUx } from '../utils/modalViewportAndBack';

interface AdminQuotaModalProps {
  onBack?: () => void;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx += 1;
  }
  const decimals = idx === 0 ? 0 : val >= 100 ? 1 : 2;
  return `${val.toFixed(decimals)} ${units[idx]}`;
}

function clampPct(used: number, limit: number): number {
  if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return 0;
  return Math.min(100, Math.max(0, (used / limit) * 100));
}

function formatPct(pct: number): string {
  if (pct === 0) return '0%';
  if (pct < 0.1) return '< 0.1%';
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

function barColorClasses(pct: number): { bar: string; badge: string; text: string } {
  if (pct >= 90) {
    return {
      bar: 'bg-rose-600 dark:bg-rose-500',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400'
    };
  }
  if (pct >= 75) {
    return {
      bar: 'bg-amber-500 dark:bg-amber-400',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400'
    };
  }
  return {
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-400'
  };
}

export const AdminQuotaModal: React.FC<AdminQuotaModalProps> = ({ onBack, onClose }) => {
  const [snapshot, setSnapshot] = useState<PlatformQuotaSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useModalUx(true, onBack || onClose);

  const fbConfig = syncService.getActiveFirebaseConfig();
  const projectId = fbConfig?.projectId || 'tzavman-qa';

  const loadSnapshot = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await syncService.fetchPlatformQuotaSnapshot();
      setSnapshot(data);
    } catch (err: any) {
      setError(err?.message || 'לא ניתן לטעון כרגע את נתוני המכסות.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const dbPct = snapshot ? clampPct(snapshot.totalDbBytes, snapshot.dbLimitBytes) : 0;
  const onlinePct = snapshot ? clampPct(snapshot.onlineCount, snapshot.onlineLimit) : 0;
  const authPct = snapshot ? clampPct(snapshot.registeredUsersCount, snapshot.authUsersLimit) : 0;
  const appCheckPct = snapshot
    ? clampPct(snapshot.monthlyAppCheckTokens, snapshot.monthlyAppCheckLimit)
    : 0;
  const driveStoragePct =
    snapshot?.driveQuota?.driveStorageUsedBytes != null &&
    snapshot?.driveQuota?.driveStorageLimitBytes
      ? clampPct(
          snapshot.driveQuota.driveStorageUsedBytes,
          snapshot.driveQuota.driveStorageLimitBytes
        )
      : 0;
  const driveDailyPct = snapshot?.driveQuota
    ? clampPct(snapshot.driveQuota.dailyUrlFetchCalls, snapshot.driveQuota.dailyUrlFetchLimit)
    : 0;

  const highestPct = Math.max(
    dbPct,
    onlinePct,
    authPct,
    appCheckPct,
    driveStoragePct,
    driveDailyPct
  );

  const dbTone = barColorClasses(dbPct);
  const onlineTone = barColorClasses(onlinePct);
  const authTone = barColorClasses(authPct);
  const appCheckTone = barColorClasses(appCheckPct);
  const driveStorageTone = barColorClasses(driveStoragePct);
  const driveDailyTone = barColorClasses(driveDailyPct);

  const formatTimestamp = (ts: number) => {
    try {
      return new Date(ts).toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 dark:bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-hidden overscroll-none"
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-auto max-h-[92dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-4 bg-gradient-to-l from-slate-900 via-cyan-950 to-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0"
                title="חזור שלב אחד אחורה"
              >
                <ArrowRight className="w-4 h-4" />
                <span>חזור</span>
              </button>
            )}
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold truncate">מכסות שימוש ואחסון</h3>
              <p className="text-xs text-slate-300">
                מעקב חי אחר נפח האחסון, מחוברים ומכסות המערכת
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSnapshot}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition disabled:opacity-50"
              title="רענן מדדים"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">רענן</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto min-h-0 flex-1 modal-scroll-area">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-semibold">
              {error}
            </div>
          )}

          {isLoading && !snapshot ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                טוען נתוני שימוש...
              </p>
            </div>
          ) : snapshot ? (
            <>
              {/* Overall Health Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  highestPct >= 90
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : highestPct >= 75
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                {highestPct >= 75 ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                )}
                <div className="text-xs space-y-0.5 flex-1">
                  <div className="font-extrabold flex items-center justify-between gap-2 flex-wrap">
                    <span>
                      {highestPct >= 90
                        ? 'אזהרה: אחד השירותים מעל 90% מהמכסה'
                        : highestPct >= 75
                        ? 'לתשומת לבך: אחד השירותים עבר 75% מהמכסה'
                        : 'כל המדדים בטווח תקין ובטוח'}
                    </span>
                    <span className="font-mono text-[11px] opacity-75">
                      עודכן {formatTimestamp(snapshot.generatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Base64 Image Bloat Alert if detected */}
              {snapshot.inlineBase64ImageCount > 0 && (
                <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">
                      זוהו {snapshot.inlineBase64ImageCount} תמונות מקומיות ({formatBytes(snapshot.inlineBase64Bytes)})
                    </span>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      ניתן להעביר אותן לאחסון החיצוני במסך הגיבוי כדי לפנות מקום.
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Quota Gauge Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Database Storage */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                          אחסון מסד נתונים
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          מכסה: 1 GB
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${dbTone.badge}`}
                    >
                      {formatPct(dbPct)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs font-mono">
                      <span className={`font-extrabold ${dbTone.text}`}>
                        {formatBytes(snapshot.totalDbBytes)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        מתוך 1.00 GB
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${dbTone.bar}`}
                        style={{ width: `${Math.max(dbPct, snapshot.totalDbBytes > 0 ? 1.5 : 0)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-slate-600 dark:text-slate-300">
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/70 flex justify-between">
                      <span>תקלות ({snapshot.totalIssuesCount}):</span>
                      <span className="font-mono font-bold">{formatBytes(snapshot.issuesBytes)}</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/70 flex justify-between">
                      <span>צ׳אט ({snapshot.totalChatsCount}):</span>
                      <span className="font-mono font-bold">{formatBytes(snapshot.chatsBytes)}</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/70 flex justify-between">
                      <span>צוות ומטה:</span>
                      <span className="font-mono font-bold">
                        {formatBytes(snapshot.metaAndUsersBytes)}
                      </span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/70 flex justify-between">
                      <span>יומן ביקורת:</span>
                      <span className="font-mono font-bold">
                        {formatBytes(snapshot.auditLogBytes)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Concurrent Connections + Firebase Auth Users */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        מחוברים ומשתמשים
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        חיבורים פעילים וחשבונות
                      </div>
                    </div>
                  </div>

                  {/* Concurrent connections */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        מחוברים כרגע
                      </span>
                      <span className="font-mono font-bold text-[11px]">
                        <span className={onlineTone.text}>{snapshot.onlineCount}</span> /{' '}
                        {snapshot.onlineLimit}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${onlineTone.bar}`}
                        style={{ width: `${Math.max(onlinePct, 2)}%` }}
                      />
                    </div>
                  </div>

                  {/* Registered Auth users */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-700/70">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        משתמשים מאושרים
                      </span>
                      <span className="font-mono font-bold text-[11px]">
                        <span className={authTone.text}>{snapshot.registeredUsersCount}</span> /{' '}
                        {snapshot.authUsersLimit.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${authTone.bar}`}
                        style={{ width: `${Math.max(authPct, 1.5)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Google Drive (5TB) + Daily Apps Script Quota */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                          אחסון תמונות (דרייב)
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          נפח אחסון ומכסה יומית
                        </div>
                      </div>
                    </div>
                    {snapshot.driveQuota && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${driveDailyTone.badge}`}
                      >
                        {formatPct(driveDailyPct)} היום
                      </span>
                    )}
                  </div>

                  {!snapshot.driveConnected ? (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                      אחסון תמונות טרם הוגדר במסך הגיבוי.
                    </p>
                  ) : snapshot.driveError ? (
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                      שגיאה בקריאת נתוני האחסון: {snapshot.driveError}
                    </p>
                  ) : snapshot.driveQuota ? (
                    <div className="space-y-3">
                      {/* Drive Storage */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            נפח אחסון בשימוש
                          </span>
                          <span className="font-mono font-bold">
                            {snapshot.driveQuota.driveStorageUsedBytes != null &&
                            snapshot.driveQuota.driveStorageLimitBytes != null ? (
                              <>
                                <span className={driveStorageTone.text}>
                                  {formatBytes(snapshot.driveQuota.driveStorageUsedBytes)}
                                </span>{' '}
                                / {formatBytes(snapshot.driveQuota.driveStorageLimitBytes)}
                              </>
                            ) : (
                              <span className="text-slate-500">זמין בחשבון Drive</span>
                            )}
                          </span>
                        </div>
                        {snapshot.driveQuota.driveStorageUsedBytes != null &&
                          snapshot.driveQuota.driveStorageLimitBytes != null && (
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${driveStorageTone.bar}`}
                                style={{
                                  width: `${Math.max(
                                    driveStoragePct,
                                    snapshot.driveQuota.driveStorageUsedBytes > 0 ? 1.5 : 0
                                  )}%`
                                }}
                              />
                            </div>
                          )}
                      </div>

                      {/* Daily Apps Script UrlFetch */}
                      <div className="space-y-1 pt-1 border-t border-slate-200/80 dark:border-slate-700/70">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            קריאות סקריפט היום ({snapshot.driveQuota.dateKey})
                          </span>
                          <span className="font-mono font-bold">
                            <span className={driveDailyTone.text}>
                              {snapshot.driveQuota.dailyUrlFetchCalls.toLocaleString('en-US')}
                            </span>{' '}
                            / {snapshot.driveQuota.dailyUrlFetchLimit.toLocaleString('en-US')}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${driveDailyTone.bar}`}
                            style={{
                              width: `${Math.max(
                                driveDailyPct,
                                snapshot.driveQuota.dailyUrlFetchCalls > 0 ? 1.5 : 0
                              )}%`
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {snapshot.driveQuota.dailyOperations} פעולות היום (העלאות, גיבויים ובדיקות חיבור)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      הדרייב מחובר בהצלחה, אך סקריפט ה-Apps Script בגרסה ישנה (לפני v6) שלא מחזירה מדדי נפח.
                    </p>
                  )}
                </div>

                {/* 4. App Check Monthly Token Quota */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                          בדיקות אבטחה חודשיות
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          מכסה: 10,000 בחודש ({snapshot.monthKey})
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${appCheckTone.badge}`}
                    >
                      {formatPct(appCheckPct)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs font-mono">
                      <span className={`font-extrabold ${appCheckTone.text}`}>
                        ~{snapshot.monthlyAppCheckTokens.toLocaleString('en-US')}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        מתוך {snapshot.monthlyAppCheckLimit.toLocaleString('en-US')} / חודש
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${appCheckTone.bar}`}
                        style={{
                          width: `${Math.max(
                            appCheckPct,
                            snapshot.monthlyAppCheckTokens > 0 ? 1.5 : 0
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    מונה אוטומטי של אימותי האבטחה החודשיים באפליקציה.
                  </p>
                </div>
              </div>

              {/* Per-System Density Hygiene Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>
                    <strong className="font-extrabold">המערכת הגדולה ביותר:</strong>{' '}
                    {snapshot.maxSystemName ? (
                      <span className="bidi-isolate font-bold">{snapshot.maxSystemName}</span>
                    ) : (
                      'אין עדיין תקלות'
                    )}
                    {snapshot.maxSystemName && ` (${snapshot.maxSystemIssueCount} תקלות)`}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    snapshot.maxSystemIssueCount >= 800
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {snapshot.maxSystemIssueCount >= 800
                    ? 'מומלץ לארכב תקלות ישנות'
                    : 'מהירות טעינה תקינה'}
                </span>
              </div>

              {/* Official Google Consoles Quick Links */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">
                  קישורים ללוחות הבקרה המלאים:
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://console.firebase.google.com/project/${encodeURIComponent(projectId)}/usage/details`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition"
                  >
                    <span>דוח שימוש ותעבורה</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://console.firebase.google.com/project/${encodeURIComponent(projectId)}/appcheck/products`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-[11px] font-bold transition"
                  >
                    <span>מדדי אבטחה</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://console.cloud.google.com/security/recaptcha?project=${encodeURIComponent(projectId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition"
                  >
                    <span>מכסת הגנת בוטים</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
