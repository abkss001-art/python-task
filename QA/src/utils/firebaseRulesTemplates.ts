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
    "std_workspace": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      ".write": "auth != null && root.child('std_users/' + auth.uid + '/role').val() === 'admin'",
      "issues": {
        ".write": "auth != null && root.child('std_users/' + auth.uid).exists()"
      },
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
    "std_chats": {
      ".read": "auth != null && root.child('std_users/' + auth.uid).exists()",
      "$systemKey": {
        "$msgId": {
          ".write": "auth != null && root.child('std_users/' + auth.uid).exists() && ((!data.exists() && (!newData.hasChild('authorUid') || newData.child('authorUid').val() === auth.uid)) || data.child('authorUid').val() === auth.uid || root.child('std_users/' + auth.uid + '/role').val() === 'admin' || (!data.child('deletedAt').exists() && newData.child('reactions').exists() && newData.child('text').val() === data.child('text').val()))"
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

    match /std_workspaces/main_workspace {
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
          'securityConfig'
        ])
      );
      allow delete: if false;
    }

    match /std_workspaces/system_chats {
      allow read, write: if hasProfile();
    }
  }
}`;
