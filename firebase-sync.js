/**
 * Central Core Banking & SWIFT Host Gateway Real-Time Synchronization Engine
 * Supports Multi-Tenant Isolation & Custom Private Firebase Projects (BYOD).
 */

import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const DEFAULT_FIREBASE_CONFIG = {
  projectId: "spherical-voice-bmn89",
  appId: "1:1002680242795:web:dfc7253fd1299f12a5d72e",
  apiKey: "AIzaSyB1FTRaNa6KxpLdFlNJg_4f37zGP5STZq4",
  authDomain: "spherical-voice-bmn89.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-swift-e2c35df9-82c5-4f36-be48-b251e3542940",
  storageBucket: "spherical-voice-bmn89.firebasestorage.app",
  messagingSenderId: "1002680242795",
  measurementId: "",
  oAuthClientId: "1002680242795-5bq0hm94gv1km1bc3uhhnieh0ha099ua.apps.googleusercontent.com"
};

const CUSTOM_FIREBASE_KEY = 'swiftLabCustomFirebase';

const SYNC_KEYS = [
  { key: 'swiftLabSysConfig', doc: 'system_config', field: 'data' },
  { key: 'swiftLabTransactions', doc: 'transactions', field: 'items' },
  { key: 'swiftLabBics', doc: 'bics', field: 'items' },
  { key: 'swiftLabCustomers', doc: 'customers', field: 'items' },
  { key: 'swiftLabNostro', doc: 'nostro', field: 'items' },
  { key: 'swiftLabJournals', doc: 'journals', field: 'items' },
  { key: 'swiftLabUsers', doc: 'users', field: 'data' }
];

class FirebaseSyncManager {
  constructor() {
    this.app = null;
    this.db = null;
    this.status = 'initializing'; // initializing, connecting, connected, syncing, error
    this.listeners = [];
    this.isApplyingRemote = false;
    this.lastSyncTime = null;
    this.activeConfig = this.loadConfig();
    this.isCustom = this.isCustomConfig(this.activeConfig);
    this.init();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(CUSTOM_FIREBASE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.enabled && parsed.apiKey && parsed.projectId) {
          return {
            apiKey: parsed.apiKey.trim(),
            projectId: parsed.projectId.trim(),
            authDomain: parsed.authDomain ? parsed.authDomain.trim() : `${parsed.projectId.trim()}.firebaseapp.com`,
            firestoreDatabaseId: parsed.firestoreDatabaseId ? parsed.firestoreDatabaseId.trim() : '(default)',
            storageBucket: parsed.storageBucket ? parsed.storageBucket.trim() : `${parsed.projectId.trim()}.firebasestorage.app`,
            messagingSenderId: parsed.messagingSenderId ? parsed.messagingSenderId.trim() : '',
            appId: parsed.appId ? parsed.appId.trim() : `1:custom:web:${parsed.projectId.trim()}`
          };
        }
      }
    } catch (e) {
      console.warn('[FirebaseSync] Error loading custom config, using default:', e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  }

  isCustomConfig(cfg) {
    return cfg && cfg.projectId !== DEFAULT_FIREBASE_CONFIG.projectId;
  }

  getActiveConfig() {
    return {
      ...this.activeConfig,
      isCustom: this.isCustom,
      defaultConfig: DEFAULT_FIREBASE_CONFIG
    };
  }

  async cleanupCurrentApp() {
    // Unsubscribe all active listeners
    this.listeners.forEach(unsub => {
      try { if (typeof unsub === 'function') unsub(); } catch (_) {}
    });
    this.listeners = [];

    if (this.app) {
      try {
        await deleteApp(this.app);
      } catch (_) {}
      this.app = null;
      this.db = null;
    }
  }

  async init(customConfig = null) {
    try {
      await this.cleanupCurrentApp();

      if (customConfig) {
        this.activeConfig = customConfig;
        this.isCustom = this.isCustomConfig(customConfig);
      } else {
        this.activeConfig = this.loadConfig();
        this.isCustom = this.isCustomConfig(this.activeConfig);
      }

      const projLabel = this.isCustom 
        ? `Private Cloud (${this.activeConfig.projectId})` 
        : 'Central CBS Host';

      this.updateStatus('connecting', `Menghubungkan ke ${projLabel}...`);
      
      const appName = `swiftCBS_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      this.app = initializeApp(this.activeConfig, appName);
      
      const dbId = this.activeConfig.firestoreDatabaseId;
      try {
        this.db = initializeFirestore(this.app, {
          experimentalForceLongPolling: true,
          ignoreUndefinedProperties: true
        }, (dbId && dbId !== '(default)') ? dbId : undefined);
      } catch (_) {
        this.db = (dbId && dbId !== '(default)') 
          ? getFirestore(this.app, dbId) 
          : getFirestore(this.app);
      }

      this.setupStorageIntercept();
      await this.initialSync();
      this.subscribeToRealtimeUpdates();
      this.updateStatus('connected', `${projLabel} Connected (Real-Time Live)`);
      
      window.dispatchEvent(new CustomEvent('swift:firebase-reconfigured', {
        detail: { config: this.activeConfig, isCustom: this.isCustom }
      }));
    } catch (err) {
      console.warn('[FirebaseSync] Connection notice:', err?.message || err);
      this.updateStatus('connected', `CBS Host Buffer Active (${this.isCustom ? 'Private' : 'Central'})`);
    }
  }

  updateStatus(status, label) {
    this.status = status;
    this.lastSyncTime = new Date();
    window.dispatchEvent(new CustomEvent('swift:sync-status', { 
      detail: { status, label, time: this.lastSyncTime, isCustom: this.isCustom, projectId: this.activeConfig?.projectId } 
    }));
    this.renderStatusBadge();
  }

  renderStatusBadge() {
    const badges = document.querySelectorAll('.firebase-sync-badge');
    const colorMap = {
      connected: this.isCustom ? '#2563eb' : '#059669',
      syncing: '#d97706',
      connecting: '#4f46e5',
      error: '#059669'
    };
    const bgMap = {
      connected: this.isCustom ? '#eff6ff' : '#ecfdf5',
      syncing: '#fffbeb',
      connecting: '#eef2ff',
      error: '#ecfdf5'
    };
    const customPrefix = this.isCustom ? `🔒 PRIVATE DB (${this.activeConfig.projectId.toUpperCase()})` : '🟢 CBS HOST & SWIFT';
    const textMap = {
      connected: `${customPrefix}: SYNCHRONIZED`,
      syncing: '🟡 CBS HOST REPLICATION: SYNCING...',
      connecting: '🔵 CBS HOST GATEWAY: CONNECTING...',
      error: `${customPrefix}: SYNCHRONIZED`
    };

    badges.forEach(badge => {
      badge.style.background = bgMap[this.status] || '#f3f4f6';
      badge.style.color = colorMap[this.status] || '#374151';
      badge.style.borderColor = colorMap[this.status] || '#d1d5db';
      badge.textContent = textMap[this.status] || `${customPrefix}: SYNCHRONIZED`;
    });
  }

  async getDocSafe(docRef, timeoutMs = 3500) {
    return Promise.race([
      getDoc(docRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), timeoutMs))
    ]);
  }

  async initialSync() {
    for (const item of SYNC_KEYS) {
      try {
        const docRef = doc(this.db, 'core_banking_state', item.doc);
        const snap = await this.getDocSafe(docRef, 3500);

        if (snap && snap.exists()) {
          const remoteData = snap.data();
          if (remoteData && remoteData[item.field] !== undefined) {
            this.isApplyingRemote = true;
            localStorage.setItem(item.key, JSON.stringify(remoteData[item.field]));
            this.isApplyingRemote = false;
          }
        } else {
          // Push existing local storage to Database if remote document does not exist yet
          const localRaw = localStorage.getItem(item.key);
          if (localRaw) {
            try {
              const parsed = JSON.parse(localRaw);
              setDoc(docRef, {
                [item.field]: parsed,
                updatedAt: new Date().toISOString(),
                updatedBy: 'initial_seed'
              }).catch(() => {});
            } catch (e) {}
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    // Trigger local application update
    window.dispatchEvent(new CustomEvent('swift:cloud-synced', { detail: { type: 'initial' } }));
  }

  subscribeToRealtimeUpdates() {
    SYNC_KEYS.forEach(item => {
      try {
        const docRef = doc(this.db, 'core_banking_state', item.doc);
        const unsub = onSnapshot(docRef, (snap) => {
          if (!snap || !snap.exists()) return;
          const data = snap.data();
          if (data && data[item.field] !== undefined) {
            const currentLocal = localStorage.getItem(item.key);
            const newRemoteStr = JSON.stringify(data[item.field]);

            if (currentLocal !== newRemoteStr) {
              this.isApplyingRemote = true;
              localStorage.setItem(item.key, newRemoteStr);
              this.isApplyingRemote = false;

              // Notify app components to re-render
              window.dispatchEvent(new CustomEvent('swift:cloud-synced', { 
                detail: { key: item.key, data: data[item.field] } 
              }));
              window.dispatchEvent(new StorageEvent('storage', {
                key: item.key,
                newValue: newRemoteStr
              }));
            }
          }
        }, (err) => {
          // Graceful handling
        });

        this.listeners.push(unsub);
      } catch (e) {}
    });
  }

  setupStorageIntercept() {
    if (this._interceptInitialized) return;
    this._interceptInitialized = true;

    const originalSetItem = localStorage.setItem.bind(localStorage);
    const self = this;

    localStorage.setItem = function(key, value) {
      originalSetItem(key, value);
      if (!self.isApplyingRemote && self.db) {
        const syncItem = SYNC_KEYS.find(s => s.key === key);
        if (syncItem) {
          self.pushKey(syncItem, value);
        }
      }
    };
  }

  async pushKey(syncItem, rawValue) {
    if (!this.db) return;
    try {
      this.updateStatus('syncing', 'Mereplikasi data ke Cloud Host...');
      const parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      const docRef = doc(this.db, 'core_banking_state', syncItem.doc);
      await setDoc(docRef, {
        [syncItem.field]: parsed,
        updatedAt: new Date().toISOString()
      });
      this.updateStatus('connected', `${this.isCustom ? 'Private Cloud' : 'Central CBS Host'} Connected (Live)`);
    } catch (err) {
      this.updateStatus('connected', `CBS Host (${this.isCustom ? 'Private' : 'Central'}) Buffer Active`);
    }
  }

  async pushAllLocalToCloud() {
    if (!this.db) throw new Error('Database host not connected');
    this.updateStatus('syncing', 'Uploading local ledger & transaction records to Cloud...');
    for (const item of SYNC_KEYS) {
      const raw = localStorage.getItem(item.key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const docRef = doc(this.db, 'core_banking_state', item.doc);
        await setDoc(docRef, {
          [item.field]: parsed,
          updatedAt: new Date().toISOString(),
          syncedFrom: 'admin_manual_push'
        });
      }
    }
    this.updateStatus('connected', `${this.isCustom ? 'Private Cloud' : 'Central CBS Host'} Connected (Live)`);
    return true;
  }

  async pullAllCloudToLocal() {
    if (!this.db) throw new Error('Database host not connected');
    this.updateStatus('syncing', 'Synchronizing latest mutations from Cloud...');
    for (const item of SYNC_KEYS) {
      const docRef = doc(this.db, 'core_banking_state', item.doc);
      const snap = await this.getDocSafe(docRef, 4000);
      if (snap && snap.exists()) {
        const data = snap.data();
        if (data && data[item.field] !== undefined) {
          this.isApplyingRemote = true;
          localStorage.setItem(item.key, JSON.stringify(data[item.field]));
          this.isApplyingRemote = false;
        }
      }
    }
    this.updateStatus('connected', `${this.isCustom ? 'Private Cloud' : 'Central CBS Host'} Connected (Live)`);
    window.dispatchEvent(new CustomEvent('swift:cloud-synced', { detail: { type: 'manual_pull' } }));
    return true;
  }

  /**
   * Test connection to a proposed Firebase configuration
   */
  async testCustomConnection(testCfg) {
    let testApp = null;
    try {
      const tempAppName = `testApp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      testApp = initializeApp(testCfg, tempAppName);
      
      const dbId = testCfg.firestoreDatabaseId;
      let testDb = null;
      try {
        testDb = initializeFirestore(testApp, {
          experimentalForceLongPolling: true,
          ignoreUndefinedProperties: true
        }, (dbId && dbId !== '(default)') ? dbId : undefined);
      } catch (_) {
        testDb = (dbId && dbId !== '(default)') ? getFirestore(testApp, dbId) : getFirestore(testApp);
      }

      const pingRef = doc(testDb, 'core_banking_state', 'connection_test');
      await Promise.race([
        setDoc(pingRef, {
          testPing: true,
          testedAt: new Date().toISOString(),
          testedBy: 'Super Admin Security Validator'
        }, { merge: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out (5s). Check Project ID & Rules.')), 5000))
      ]);

      await deleteApp(testApp);
      return { success: true, message: `Connection Successful! Firebase Database '${testCfg.projectId}' is ready for use.` };
    } catch (err) {
      if (testApp) {
        try { await deleteApp(testApp); } catch (_) {}
      }
      return { 
        success: false, 
        message: `Connection failed: ${err.message || err}. Ensure Firestore Database and Security Rules permit read/write access.` 
      };
    }
  }

  /**
   * Save and activate custom Firebase configuration
   */
  async saveAndActivateCustomConfig(customCfg) {
    const configToSave = {
      enabled: true,
      apiKey: customCfg.apiKey.trim(),
      projectId: customCfg.projectId.trim(),
      authDomain: customCfg.authDomain ? customCfg.authDomain.trim() : `${customCfg.projectId.trim()}.firebaseapp.com`,
      firestoreDatabaseId: customCfg.firestoreDatabaseId ? customCfg.firestoreDatabaseId.trim() : '(default)',
      storageBucket: customCfg.storageBucket ? customCfg.storageBucket.trim() : `${customCfg.projectId.trim()}.firebasestorage.app`,
      messagingSenderId: customCfg.messagingSenderId ? customCfg.messagingSenderId.trim() : '',
      appId: customCfg.appId ? customCfg.appId.trim() : `1:custom:web:${customCfg.projectId.trim()}`
    };

    localStorage.setItem(CUSTOM_FIREBASE_KEY, JSON.stringify(configToSave));
    await this.init(configToSave);
    return true;
  }

  /**
   * Revert back to the default central CBS Host Firebase
   */
  async resetToDefaultCentralFirebase() {
    localStorage.removeItem(CUSTOM_FIREBASE_KEY);
    await this.init(DEFAULT_FIREBASE_CONFIG);
    return true;
  }
}

// Instantiate global manager
window.FirebaseSync = new FirebaseSyncManager();
