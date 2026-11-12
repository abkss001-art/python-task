export const FIREBASE_RTDB_RULES_JSON = `{
  "rules": {
    ".read": false,
    ".write": false,
    "std_users": {
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
          ".write": "auth != null && root.child('std_users/' + auth.uid).exists() && (root.child('std_users/' + auth.uid + '/role').val() === 'admin' || root.child('std_users/' + auth.uid + '/allSystems').val() === true || root.child('std_users/' + auth.uid + '/allowedSystemKeys/' + $systemKey).val() === true) && ((!data.exists() && (!newData.hasChild('authorUid') || newData.child('authorUid').val() === auth.uid)) || data.child('authorUid').val() === auth.uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (!data.child('deletedAt').exists() && newData.child('reactions').exists() && newData.child('text').val() === data.child('text').val()))"
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
