import { TeamRole } from '../types/std';
import { getEffectiveSuperAdminName } from './securityUtils';

export interface TeamMember {
  id: string;
  fullName: string;
  role: TeamRole;
  isSuperAdmin?: boolean;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-super-admin', fullName: 'שמעון אבקסיס', role: 'admin', isSuperAdmin: true },
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

export function ensureSuperAdminInMembers(members: TeamMember[]): TeamMember[] {
  const superAdminName = getEffectiveSuperAdminName();
  const filtered = members.filter(
    (m) =>
      !m.isSuperAdmin &&
      m.fullName.toLowerCase() !== superAdminName.toLowerCase() &&
      m.fullName.toLowerCase() !== 'שמעון אבקסיס'
  );

  const superAdminItem: TeamMember = {
    id: 'tm-super-admin',
    fullName: superAdminName,
    role: 'admin',
    isSuperAdmin: true
  };

  return [superAdminItem, ...filtered];
}

export function getStoredTeamMembers(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return ensureSuperAdminInMembers(parsed);
      }
    }
  } catch {
    // ignore
  }
  return ensureSuperAdminInMembers(DEFAULT_TEAM_MEMBERS);
}

export function mergeCloudTeamMembers(cloudMembers: TeamMember[]): TeamMember[] {
  if (!Array.isArray(cloudMembers) || cloudMembers.length === 0) {
    return getStoredTeamMembers();
  }

  const memberMap = new Map<string, TeamMember>();

  // Add default members as baseline
  for (const m of DEFAULT_TEAM_MEMBERS) {
    if (m && m.fullName) {
      memberMap.set(m.fullName.trim().toLowerCase(), m);
    }
  }

  // Overlay current local members
  const local = getStoredTeamMembers();
  for (const m of local) {
    if (m && m.fullName) {
      memberMap.set(m.fullName.trim().toLowerCase(), m);
    }
  }

  // Overlay incoming cloud members
  for (const m of cloudMembers) {
    if (m && m.fullName) {
      memberMap.set(m.fullName.trim().toLowerCase(), m);
    }
  }

  const merged = ensureSuperAdminInMembers(Array.from(memberMap.values()));
  saveStoredTeamMembers(merged);
  return merged;
}

export function saveStoredTeamMembers(members: TeamMember[]): void {
  try {
    const ensured = ensureSuperAdminInMembers(members);
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(ensured));
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
