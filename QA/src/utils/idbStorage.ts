const DB_NAME = 'tzavman_qa_idb_v1';
const STORE_NAME = 'workspace_store';
const STATE_KEY = 'current_workspace_state';
const CHATS_KEY = 'system_chat_messages_v1';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putKeyInIndexedDB(key: string, value: unknown): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // Fallback handled by localStorage
  }
}

async function getKeyFromIndexedDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        db.close();
        resolve((req.result as T) ?? null);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return null;
  }
}

export async function saveWorkspaceToIndexedDB(state: unknown): Promise<void> {
  return putKeyInIndexedDB(STATE_KEY, state);
}

export async function loadWorkspaceFromIndexedDB<T>(): Promise<T | null> {
  return getKeyFromIndexedDB<T>(STATE_KEY);
}

export async function saveChatsToIndexedDB(chats: unknown): Promise<void> {
  return putKeyInIndexedDB(CHATS_KEY, chats);
}

export async function loadChatsFromIndexedDB<T>(): Promise<T | null> {
  return getKeyFromIndexedDB<T>(CHATS_KEY);
}
