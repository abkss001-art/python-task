import { TeamRole } from '../types/std';

export interface TeamMember {
  id: string;
  fullName: string;
  role: TeamRole;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-1', fullName: 'דניאל כהן', role: 'qa' },
  { id: 'tm-2', fullName: 'מיכל אברהם', role: 'qa' },
  { id: 'tm-3', fullName: 'רועי לוי', role: 'dev' },
  { id: 'tm-4', fullName: 'אלון מזרחי', role: 'dev' },
  { id: 'tm-5', fullName: 'יוסי ששון', role: 'qa' },
  { id: 'tm-6', fullName: 'שירה דוד', role: 'qa' },
  { id: 'tm-7', fullName: 'איתי גולן', role: 'dev' },
  { id: 'tm-8', fullName: 'נועה ברק', role: 'qa' },
  { id: 'tm-9', fullName: 'מתן כץ', role: 'dev' },
  { id: 'tm-10', fullName: 'טל פרידמן', role: 'qa' }
];

const TEAM_MEMBERS_STORAGE_KEY = 'tzavman_team_members_v2';
const REMEMBERED_USER_STORAGE_KEY = 'tzavman_remembered_user_v2';

export function getStoredTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_TEAM_MEMBERS;
}

export function saveStoredTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch {
    // ignore
  }
}

export function getRememberedLogin(): { fullName: string; rememberMe: boolean } | null {
  try {
    const raw = localStorage.getItem(REMEMBERED_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.fullName === 'string') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveRememberedLogin(fullName: string, rememberMe: boolean): void {
  try {
    if (rememberMe && fullName.trim()) {
      localStorage.setItem(
        REMEMBERED_USER_STORAGE_KEY,
        JSON.stringify({ fullName: fullName.trim(), rememberMe: true })
      );
    } else {
      localStorage.removeItem(REMEMBERED_USER_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
