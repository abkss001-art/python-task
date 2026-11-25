export const FIREBASE_RTDB_RULES_JSON = `{
  "rules": {
    ".read": false,
    ".write": false,
    "std_users": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin')",
        ".write": "auth != null && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (!root.child('std_users').exists() && auth.uid === $uid && newData.child('role').val() === 'admin'))",
        ".validate": "newData.hasChildren(['fullName', 'role']) && (newData.child('role').val() === 'admin' || newData.child('role').val() === 'qa' || newData.child('role').val() === 'dev')"
      }
    },
    "std_private_config": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'"
    },
    "std_meta": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "revision": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      },
      "updatedAt": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      },
      "lastUpdatedBy": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      },
      "lastAction": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      },
      "clientId": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      }
    },
    "std_systems": {
      "$systemKey": {
        ".read": "auth != null && root.child('std_users/' + auth.uid).exists() && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true || root.child('std_users/' + auth.uid + '/allowedSystemKeys/' + $systemKey).val() === true)",
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists() && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true || root.child('std_users/' + auth.uid + '/allowedSystemKeys/' + $systemKey).val() === true)"
      }
    },
    "std_workspace": {
      ".read": "auth != null && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true)",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'"
    },
    "std_chats": {
      "$systemKey": {
        ".read": "auth != null && root.child('std_users/' + auth.uid).exists() && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true || root.child('std_users/' + auth.uid + '/allowedSystemKeys/' + $systemKey).val() === true)",
        "$msgId": {
          ".write": "auth != null && root.child('std_users/' + auth.uid).exists() && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true || root.child('std_users/' + auth.uid + '/allowedSystemKeys/' + $systemKey).val() === true) && ((!data.exists() && (!newData.hasChild('authorUid') || newData.child('authorUid').val() === auth.uid)) || data.child('authorUid').val() === auth.uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (!data.child('deletedAt').exists() && newData.child('text').val() === data.child('text').val() && newData.child('author').val() === data.child('author').val() && (!data.hasChild('authorUid') || newData.child('authorUid').val() === data.child('authorUid').val())))",
          ".validate": "newData.hasChildren(['id', 'system', 'author', 'text', 'createdAt', 'updatedAt']) && newData.child('text').isString() && newData.child('text').val().length <= 4000"
        }
      }
    },
    "std_audit_log": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      ".indexOn": ["createdAt"],
      "$entryId": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists() && !data.exists() && newData.exists()",
        ".validate": "newData.hasChildren(['action', 'actorUid', 'actorName', 'createdAt']) && newData.child('actorUid').val() === auth.uid && newData.child('action').isString() && newData.child('action').val().length <= 300 && newData.child('actorName').isString() && newData.child('actorName').val().length <= 120 && newData.child('createdAt').isNumber()"
      }
    },
    "std_usage": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "$monthKey": {
        "$uid": {
          ".read": "auth != null && (auth.uid === $uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin')",
          ".write": "auth != null && auth.uid === $uid && root.child('std_users/' + auth.uid).exists()",
          ".validate": "newData.hasChildren(['appCheckTokens', 'updatedAt']) && newData.child('appCheckTokens').isNumber() && newData.child('appCheckTokens').val() >= 0 && newData.child('appCheckTokens').val() <= 100000 && newData.child('updatedAt').isNumber()"
        }
      }
    },
    "std_taken_names": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "$nameHash": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
        ".validate": "!newData.exists() || (newData.hasChildren(['uid', 'updatedAt']) && newData.child('uid').isString() && newData.child('uid').val().length >= 1 && newData.child('uid').val().length <= 128 && newData.child('updatedAt').isNumber())"
      }
    },
    "std_usernames": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "$usernameHash": {
        ".read": true,
        ".write": "auth != null && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (!data.exists() && newData.exists() && newData.child('uid').val() === auth.uid))",
        ".validate": "!newData.exists() || (newData.hasChildren(['email', 'uid', 'updatedAt']) && newData.child('email').isString() && newData.child('email').val().length >= 5 && newData.child('email').val().length <= 160 && newData.child('uid').isString() && newData.child('uid').val().length >= 1 && newData.child('uid').val().length <= 128 && newData.child('updatedAt').isNumber())"
      }
    },
    "std_join_requests": {
      ".read": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin')",
        ".write": "auth != null && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (auth.uid === $uid && newData.exists() && !root.child('std_users/' + auth.uid).exists() && newData.child('uid').val() === auth.uid && newData.child('status').val() === 'pending' && !newData.hasChild('approvedRole') && !newData.hasChild('approvedSystems') && !newData.hasChild('approvedAt') && !newData.hasChild('approvedBy') && (((!data.exists() || data.child('status').val() === 'approved') && newData.child('rejectCount').val() === 0 && newData.child('attemptNumber').val() === 1 && !newData.hasChild('rejectionReason') && !newData.hasChild('rejectedAt') && !newData.hasChild('rejectedBy') && (!data.exists() || newData.child('email').val() === data.child('email').val())) || (data.exists() && data.child('status').val() === 'rejected' && data.child('rejectCount').val() < 3 && newData.child('rejectCount').val() === data.child('rejectCount').val() && newData.child('attemptNumber').val() === data.child('rejectCount').val() + 1 && newData.child('email').val() === data.child('email').val() && ((!data.hasChild('rejectionReason') && !newData.hasChild('rejectionReason')) || newData.child('rejectionReason').val() === data.child('rejectionReason').val()) && ((!data.hasChild('rejectedAt') && !newData.hasChild('rejectedAt')) || newData.child('rejectedAt').val() === data.child('rejectedAt').val()) && ((!data.hasChild('rejectedBy') && !newData.hasChild('rejectedBy')) || newData.child('rejectedBy').val() === data.child('rejectedBy').val())))))",
        ".validate": "!newData.exists() || (newData.hasChildren(['uid', 'fullName', 'email', 'status', 'rejectCount', 'attemptNumber', 'requestedAt', 'updatedAt']) && newData.child('uid').val() === $uid && newData.child('fullName').isString() && newData.child('fullName').val().length >= 2 && newData.child('fullName').val().length <= 120 && newData.child('email').isString() && newData.child('email').val().length <= 160 && (!newData.hasChild('username') || (newData.child('username').isString() && newData.child('username').val().length >= 3 && newData.child('username').val().length <= 40)) && (newData.child('status').val() === 'pending' || newData.child('status').val() === 'approved' || newData.child('status').val() === 'rejected' || newData.child('status').val() === 'blocked') && newData.child('rejectCount').isNumber() && newData.child('rejectCount').val() >= 0 && newData.child('rejectCount').val() <= 3 && newData.child('attemptNumber').isNumber() && newData.child('attemptNumber').val() >= 1 && newData.child('attemptNumber').val() <= 3 && newData.child('requestedAt').isNumber() && newData.child('updatedAt').isNumber() && (!newData.hasChild('rejectionReason') || (newData.child('rejectionReason').isString() && newData.child('rejectionReason').val().length <= 300)) && (!newData.hasChild('approvedRole') || newData.child('approvedRole').val() === 'qa' || newData.child('approvedRole').val() === 'dev'))"
      }
    },
    "std_presence": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      "$clientId": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      }
    },
    "std_chat_typing": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      "$clientId": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      }
    }
  }
}`;

export const FIREBASE_FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function hasProfile() {
      return isSignedIn() && exists(/databases/$(database)/documents/std_users/$(request.auth.uid));
    }

    function userProfile() {
      return get(/databases/$(database)/documents/std_users/$(request.auth.uid)).data;
    }

    function isAdmin() {
      return hasProfile() && userProfile().role == 'admin';
    }

    function isAllSystems() {
      return hasProfile() && (
        userProfile().role == 'admin' ||
        (('allSystems' in userProfile()) && userProfile().allSystems == true)
      );
    }

    function hasSystemAccess(systemKey) {
      return isAllSystems() || (
        hasProfile() &&
        ('allowedSystemKeys' in userProfile()) &&
        (systemKey in userProfile().allowedSystemKeys) &&
        userProfile().allowedSystemKeys[systemKey] == true
      );
    }

    function isOwnUsageDocId(docId) {
      return isSignedIn() &&
        docId.matches('^[0-9]{4}-(0[1-9]|1[0-2])_' + request.auth.uid + '$');
    }

    function isValidUsageDoc(docId, data) {
      return isOwnUsageDocId(docId) &&
        data.keys().hasAll(['monthKey', 'uid', 'appCheckTokens', 'updatedAt']) &&
        data.keys().hasOnly(['monthKey', 'uid', 'appCheckTokens', 'updatedAt']) &&
        data.uid is string &&
        data.uid == request.auth.uid &&
        data.monthKey is string &&
        data.monthKey.matches('^[0-9]{4}-(0[1-9]|1[0-2])$') &&
        docId == data.monthKey + '_' + request.auth.uid &&
        data.appCheckTokens is int &&
        data.appCheckTokens >= 0 &&
        data.appCheckTokens <= 100000 &&
        data.updatedAt is int &&
        data.updatedAt >= 0;
    }

    function isValidOptionalString(data, field, maxLen) {
      return !(field in data) ||
        (data[field] is string && data[field].size() <= maxLen);
    }

    function isValidOptionalNonNegativeInt(data, field) {
      return !(field in data) ||
        (data[field] is int && data[field] >= 0);
    }

    function isValidApprovedSystems(data) {
      return !('approvedSystems' in data) || (
        data.approvedSystems is list &&
        data.approvedSystems.size() <= 100 &&
        (data.approvedSystems.size() == 0 || (
          data.approvedSystems[0] is string &&
          data.approvedSystems[0].size() <= 120 &&
          data.approvedSystems[data.approvedSystems.size() - 1] is string &&
          data.approvedSystems[data.approvedSystems.size() - 1].size() <= 120
        ))
      );
    }

    function isValidJoinRequest(uid, data) {
      return data.keys().hasAll([
          'uid',
          'fullName',
          'email',
          'status',
          'rejectCount',
          'attemptNumber',
          'requestedAt',
          'updatedAt'
        ]) &&
        data.keys().hasOnly([
          'uid',
          'fullName',
          'username',
          'email',
          'status',
          'rejectCount',
          'attemptNumber',
          'requestedAt',
          'updatedAt',
          'rejectionReason',
          'rejectedAt',
          'rejectedBy',
          'approvedRole',
          'approvedSystems',
          'approvedAt',
          'approvedBy'
        ]) &&
        data.uid is string &&
        data.uid == uid &&
        data.uid.size() >= 1 &&
        data.uid.size() <= 128 &&
        data.fullName is string &&
        data.fullName.trim().size() >= 2 &&
        data.fullName.size() <= 120 &&
        (!('username' in data) || (
          data.username is string &&
          data.username.size() >= 3 &&
          data.username.size() <= 40 &&
          data.username.matches('^[a-z0-9._-]+$')
        )) &&
        data.email is string &&
        data.email.size() >= 1 &&
        data.email.size() <= 160 &&
        data.email.matches('^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$') &&
        data.status is string &&
        data.status in ['pending', 'approved', 'rejected', 'blocked'] &&
        data.rejectCount is int &&
        data.rejectCount >= 0 &&
        data.rejectCount <= 3 &&
        data.attemptNumber is int &&
        data.attemptNumber >= 1 &&
        data.attemptNumber <= 3 &&
        data.requestedAt is int &&
        data.requestedAt >= 0 &&
        data.updatedAt is int &&
        data.updatedAt >= 0 &&
        isValidOptionalString(data, 'rejectionReason', 300) &&
        isValidOptionalNonNegativeInt(data, 'rejectedAt') &&
        isValidOptionalString(data, 'rejectedBy', 120) &&
        (!('approvedRole' in data) || (data.approvedRole is string && data.approvedRole in ['qa', 'dev'])) &&
        isValidApprovedSystems(data) &&
        isValidOptionalNonNegativeInt(data, 'approvedAt') &&
        isValidOptionalString(data, 'approvedBy', 120);
    }

    function matchesAuthEmailIfPresent(email) {
      return !('email' in request.auth.token) ||
        !(request.auth.token.email is string) ||
        email.lower() == request.auth.token.email.lower();
    }

    function isJoinRequestFieldAbsentOrUnchanged(field) {
      return !(field in request.resource.data) ||
        (field in resource.data && request.resource.data[field] == resource.data[field]);
    }

    function isValidTakenName(nameHash, data) {
      return nameHash is string &&
        nameHash.matches('^[0-9a-f]{64}$') &&
        data.keys().hasAll(['uid', 'updatedAt']) &&
        data.keys().hasOnly(['uid', 'updatedAt']) &&
        data.uid is string &&
        data.uid.size() >= 1 &&
        data.uid.size() <= 128 &&
        data.updatedAt is int &&
        data.updatedAt >= 0;
    }

    function isValidUsernameMapping(usernameHash, data) {
      return usernameHash is string &&
        usernameHash.matches('^[0-9a-f]{64}$') &&
        data.keys().hasAll(['email', 'uid', 'updatedAt']) &&
        data.keys().hasOnly(['email', 'uid', 'updatedAt']) &&
        data.email is string &&
        data.email.size() >= 5 &&
        data.email.size() <= 160 &&
        data.email.matches('^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$') &&
        data.uid is string &&
        data.uid.size() >= 1 &&
        data.uid.size() <= 128 &&
        data.updatedAt is int &&
        data.updatedAt >= 0;
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // User roles & per-system permissions directory (server-enforced RBAC)
    match /std_users/{uid} {
      allow read: if isSignedIn() && (request.auth.uid == uid || isAdmin());
      allow create, update, delete: if isAdmin();
    }

    // Protected Google Drive & Apps Script secret config (Admin write, active team read)
    match /std_workspaces/private_config {
      allow read: if hasProfile();
      allow write: if isAdmin();
    }

    // Partitioned workspace metadata (systems list, teamMembers, archives)
    match /std_workspaces/meta {
      allow read: if hasProfile();
      allow create: if isAdmin();
      allow update: if isAdmin() || (
        hasProfile() &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny([
          'systems',
          'archivedSystems',
          'deletedIssueIds',
          'deletedSystemIds',
          'teamMembers',
          'securityConfig',
          'partitionVersion'
        ])
      );
      allow delete: if false;
    }

    // Per-system issues partitions (server enforces per-system access!)
    match /std_systems/{systemKey} {
      allow read, write: if hasSystemAccess(systemKey);
    }

    // Per-system group chat partitions (server enforces per-system access!)
    match /std_chats/{systemKey} {
      allow read, write: if hasSystemAccess(systemKey);
    }

    // Immutable append-only server Audit Log (admin read only, authenticated append only, never editable/deletable)
    match /std_audit_log/{entryId} {
      allow read: if isAdmin();
      allow create: if hasProfile() &&
        request.resource.data.actorUid == request.auth.uid &&
        request.resource.data.action is string &&
        request.resource.data.action.size() <= 300 &&
        request.resource.data.actorName is string &&
        request.resource.data.actorName.size() <= 120 &&
        request.resource.data.createdAt is int;
      allow update, delete: if false;
    }

    // Monthly App Check usage counters (admin read all, users read/increment only their own {YYYY-MM}_{uid} doc, never deletable)
    // Assumed Data Model for std_usage/{docId}:
    //   Document ID: {YYYY-MM}_{uid}
    //   Fields (all required, strict schema):
    //     - monthKey: string (immutable, matches YYYY-MM with valid month 01-12, must match docId prefix)
    //     - uid: string (immutable, must equal request.auth.uid and docId suffix)
    //     - appCheckTokens: int (0..100000, monotonic non-decreasing on update)
    //     - updatedAt: int (>= 0, Unix epoch ms)
    match /std_usage/{docId} {
      allow get: if isAdmin() || (
        hasProfile() && (
          (resource == null && isOwnUsageDocId(docId)) ||
          (resource != null && resource.data.uid == request.auth.uid)
        )
      );
      allow list: if isAdmin() || (
        hasProfile() && resource.data.uid == request.auth.uid
      );
      allow create: if hasProfile() &&
        isValidUsageDoc(docId, request.resource.data);
      allow update: if hasProfile() &&
        resource.data.uid == request.auth.uid &&
        isValidUsageDoc(docId, request.resource.data) &&
        request.resource.data.uid == resource.data.uid &&
        request.resource.data.monthKey == resource.data.monthKey &&
        request.resource.data.appCheckTokens >= resource.data.appCheckTokens;
      allow delete: if false;
    }

    // Privacy-preserving duplicate full-name index (SHA-256 keyed; single-hash lookup only, admin managed)
    // Assumed Data Model for std_taken_names/{nameHash}:
    //   Document ID: {nameHash} (64-character lowercase hex SHA-256 hash)
    //   Fields (all required, strict schema):
    //     - uid: string (1..128 chars, owning user's Firebase Auth UID)
    //     - updatedAt: int (>= 0, Unix epoch ms)
    match /std_taken_names/{nameHash} {
      allow get: if isSignedIn();
      allow list: if isAdmin();
      allow create, update: if isAdmin() &&
        isValidTakenName(nameHash, request.resource.data);
      allow delete: if isAdmin();
    }

    // Privacy-preserving username-to-email lookup index (SHA-256 keyed; single-hash lookup only, no enumeration)
    // Assumed Data Model for std_usernames/{usernameHash}:
    //   Document ID: {usernameHash} (64-character lowercase hex SHA-256 hash)
    //   Fields (all required, strict schema):
    //     - email: string (5..160 chars, valid email format, must match Auth token email on non-admin create)
    //     - uid: string (1..128 chars, owning user's Firebase Auth UID; must equal request.auth.uid on non-admin create)
    //     - updatedAt: int (>= 0, Unix epoch ms)
    match /std_usernames/{usernameHash} {
      allow get: if true;
      allow list: if isAdmin();
      allow create: if (
        isAdmin() &&
        isValidUsernameMapping(usernameHash, request.resource.data)
      ) || (
        isSignedIn() &&
        isValidUsernameMapping(usernameHash, request.resource.data) &&
        request.resource.data.uid == request.auth.uid &&
        matchesAuthEmailIfPresent(request.resource.data.email)
      );
      allow update: if isAdmin() &&
        isValidUsernameMapping(usernameHash, request.resource.data);
      allow delete: if isAdmin();
    }

    // Self-registration waiting room with server-enforced 3-attempt anti-spam cap
    // Assumed Data Model for std_join_requests/{uid}:
    //   Document ID: {uid} (applicant Firebase Auth UID)
    //   Required base fields (8):
    //     - uid: string (immutable, 1..128 chars, must equal {uid})
    //     - fullName: string (trimmed >= 2 chars, total <= 120 chars)
    //     - email: string (1..160 chars, valid email format, matches Auth token email on user writes)
    //     - status: string ('pending' | 'approved' | 'rejected' | 'blocked')
    //     - rejectCount: int (0..3, immutable on rejected retry, reset to 0 on revoked-approved resubmit, admin-managed)
    //     - attemptNumber: int (1..3, must be 1 on create or revoked-approved resubmit, and resource.rejectCount + 1 on retry)
    //     - requestedAt: int (>= 0, Unix epoch ms)
    //     - updatedAt: int (>= 0, Unix epoch ms)
    //   Optional applicant field (1):
    //     - username: string (3..40 chars, lowercase letters/digits/._-, matches ^[a-z0-9._-]+$)
    //   Optional admin-only fields (7):
    //     - rejectionReason: string (<= 300 chars)
    //     - rejectedAt: int (>= 0, Unix epoch ms)
    //     - rejectedBy: string (<= 120 chars)
    //     - approvedRole: string ('qa' | 'dev')
    //     - approvedSystems: list<string> (<= 100 items, element length <= 120 chars)
    //     - approvedAt: int (>= 0, Unix epoch ms)
    //     - approvedBy: string (<= 120 chars)
    match /std_join_requests/{uid} {
      allow get: if (isSignedIn() && request.auth.uid == uid) || isAdmin();
      allow list: if isAdmin();
      allow create: if (
        isAdmin() &&
        isValidJoinRequest(uid, request.resource.data)
      ) || (
        isSignedIn() &&
        !hasProfile() &&
        request.auth.uid == uid &&
        isValidJoinRequest(uid, request.resource.data) &&
        request.resource.data.keys().hasOnly([
          'uid',
          'fullName',
          'username',
          'email',
          'status',
          'rejectCount',
          'attemptNumber',
          'requestedAt',
          'updatedAt'
        ]) &&
        request.resource.data.uid == request.auth.uid &&
        matchesAuthEmailIfPresent(request.resource.data.email) &&
        request.resource.data.status == 'pending' &&
        request.resource.data.rejectCount == 0 &&
        request.resource.data.attemptNumber == 1
      );
      allow update: if (
        isAdmin() &&
        isValidJoinRequest(uid, request.resource.data) &&
        (!('uid' in resource.data) || request.resource.data.uid == resource.data.uid)
      ) || (
        isSignedIn() &&
        !hasProfile() &&
        request.auth.uid == uid &&
        isValidJoinRequest(uid, request.resource.data) &&
        ('uid' in resource.data) &&
        resource.data.uid == request.auth.uid &&
        request.resource.data.uid == resource.data.uid &&
        matchesAuthEmailIfPresent(request.resource.data.email) &&
        ('email' in resource.data) &&
        resource.data.email is string &&
        request.resource.data.email.lower() == resource.data.email.lower() &&
        ('status' in resource.data) &&
        request.resource.data.status == 'pending' &&
        (
          (
            resource.data.status == 'rejected' &&
            ('rejectCount' in resource.data) &&
            resource.data.rejectCount is int &&
            resource.data.rejectCount >= 0 &&
            resource.data.rejectCount < 3 &&
            request.resource.data.rejectCount == resource.data.rejectCount &&
            request.resource.data.attemptNumber == resource.data.rejectCount + 1 &&
            !request.resource.data.keys().hasAny([
              'approvedRole',
              'approvedSystems',
              'approvedAt',
              'approvedBy'
            ]) &&
            isJoinRequestFieldAbsentOrUnchanged('rejectionReason') &&
            isJoinRequestFieldAbsentOrUnchanged('rejectedAt') &&
            isJoinRequestFieldAbsentOrUnchanged('rejectedBy')
          ) || (
            resource.data.status == 'approved' &&
            request.resource.data.keys().hasOnly([
              'uid',
              'fullName',
              'username',
              'email',
              'status',
              'rejectCount',
              'attemptNumber',
              'requestedAt',
              'updatedAt'
            ]) &&
            request.resource.data.rejectCount == 0 &&
            request.resource.data.attemptNumber == 1
          )
        )
      );
      allow delete: if isAdmin();
    }

    // Legacy monolithic docs (restricted to admins / unrestricted users for migration)
    match /std_workspaces/main_workspace {
      allow read: if isAllSystems();
      allow write: if isAdmin();
    }

    match /std_workspaces/system_chats {
      allow read: if isAllSystems();
      allow write: if isAdmin();
    }
  }
}`;
