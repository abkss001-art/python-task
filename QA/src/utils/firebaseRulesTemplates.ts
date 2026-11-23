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

    match /{document=**} {
      allow read, write: if false;
    }

    match /std_users/{uid} {
      allow read: if isSignedIn() && (request.auth.uid == uid || isAdmin());
      allow create, update, delete: if isAdmin();
    }

    match /std_workspaces/private_config {
      allow read: if hasProfile();
      allow write: if isAdmin();
    }

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

    match /std_systems/{systemKey} {
      allow read, write: if hasSystemAccess(systemKey);
    }

    match /std_chats/{systemKey} {
      allow read, write: if hasSystemAccess(systemKey);
    }

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
