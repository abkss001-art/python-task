import { FirebaseUserProfile, TeamRole } from '../types/std';
import { encodeFirebaseSystemKey } from './chatUtils';

export type ProfileAccessFields = Pick<
  FirebaseUserProfile,
  'allowedSystems' | 'allowedSystemKeys' | 'allSystems'
>;

/**
 * Builds the server-enforced access fields of a user profile (std_users/{uid}).
 * Firebase Security Rules read `allSystems` / `allowedSystemKeys` to decide which
 * per-system partitions (issues + chat) the user may read or write.
 */
export function buildProfileAccessFields(
  role: TeamRole,
  allowedSystems?: string[]
): ProfileAccessFields {
  const cleaned = Array.isArray(allowedSystems)
    ? allowedSystems.filter((s): s is string => typeof s === 'string' && Boolean(s.trim()))
    : [];
  if (role === 'admin' || cleaned.length === 0) {
    return { allSystems: true };
  }
  const allowedSystemKeys: Record<string, boolean> = {};
  for (const sys of cleaned) {
    allowedSystemKeys[encodeFirebaseSystemKey(sys)] = true;
  }
  return { allSystems: false, allowedSystems: cleaned, allowedSystemKeys };
}

/** Returns the encoded system keys a profile may access, or null when unrestricted. */
export function getAllowedSystemKeys(profile: FirebaseUserProfile | null): string[] | null {
  if (!profile) return [];
  if (profile.role === 'admin' || profile.allSystems) return null;
  return Object.keys(profile.allowedSystemKeys || {}).filter(
    (k) => profile.allowedSystemKeys![k] === true
  );
}

/** Cheap deterministic string hash (djb2) used to detect changed partitions. */
export function hashString(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return `${input.length}:${h}`;
}

/** Removes undefined values (Firebase rejects them) by round-tripping through JSON. */
export function stripUndefinedDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
