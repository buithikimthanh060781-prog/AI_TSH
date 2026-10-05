/**
 * Auto-Sync Database for Render / Ephemeral Cloud Hosting
 * Supports syncing SQLite database with Supabase Storage (Free 1GB)
 * Keeps SQLite persistent even when Render spins down and wakes up.
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'database.sqlite');
const SUPABASE_URL = process.env.SUPABASE_URL; // e.g. https://xyz.supabase.co
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'database';

let syncTimeout = null;
let isSyncing = false;

/**
 * Download database from cloud storage on startup if exists
 */
async function restoreDatabaseFromCloud() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return false;
  }

  try {
    console.log('🔄 [DB CLOUD SYNC] Đang kiểm tra và tải database từ Supabase Storage...');
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${BUCKET_NAME}/database.sqlite`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      }
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 0) {
        fs.writeFileSync(dbPath, buffer);
        console.log(`✅ [DB CLOUD SYNC] Đã tải thành công database (${buffer.length} bytes) từ Cloud!`);
        return true;
      }
    } else {
      console.log('ℹ️ [DB CLOUD SYNC] Chưa có file database trên Cloud, sẽ sử dụng database cục bộ.');
    }
  } catch (err) {
    console.warn('⚠️ [DB CLOUD SYNC] Không thể tải database từ Cloud:', err.message);
  }
  return false;
}

/**
 * Upload current database to cloud storage
 */
async function backupDatabaseToCloud() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  if (!fs.existsSync(dbPath)) return false;
  if (isSyncing) return false;

  isSyncing = true;
  try {
    const fileData = fs.readFileSync(dbPath);
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${BUCKET_NAME}/database.sqlite`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/x-sqlite3',
        'x-upsert': 'true'
      },
      body: fileData
    });

    if (res.ok) {
      console.log(`☁️ [DB CLOUD SYNC] Đã đồng bộ an toàn database (${fileData.length} bytes) lên Cloud!`);
      isSyncing = false;
      return true;
    } else {
      const txt = await res.text();
      console.warn('⚠️ [DB CLOUD SYNC] Lỗi tải lên Cloud:', txt);
    }
  } catch (err) {
    console.warn('⚠️ [DB CLOUD SYNC] Lỗi kết nối Cloud:', err.message);
  }
  isSyncing = false;
  return false;
}

/**
 * Trigger background upload with debounce
 */
function scheduleCloudBackup(delayMs = 5000) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    backupDatabaseToCloud();
  }, delayMs);
}

// Ensure backup on container shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 [DB CLOUD SYNC] Nhận tín hiệu tắt máy chủ, đang lưu database lên Cloud...');
  await backupDatabaseToCloud();
  process.exit(0);
});

module.exports = {
  restoreDatabaseFromCloud,
  backupDatabaseToCloud,
  scheduleCloudBackup
};
