import SftpClient from 'ssh2-sftp-client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, posix } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const config = {
  host: process.env.SFTP_HOST,
  port: Number(process.env.SFTP_PORT || 2222),
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASS,
  readyTimeout: 30000,
};

const REMOTE_BASE = process.env.SFTP_REMOTE_BASE || '/';

if (!config.host || !config.username || !config.password) {
  console.error('Missing SFTP_HOST / SFTP_USER / SFTP_PASS env vars');
  process.exit(1);
}

function walk(dir, prefix = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const localPath = resolve(dir, name);
    const remoteRel = prefix ? posix.join(prefix, name) : name;
    const s = statSync(localPath);
    if (s.isDirectory()) {
      out.push({ type: 'dir', remoteRel });
      out.push(...walk(localPath, remoteRel));
    } else {
      out.push({ type: 'file', localPath, remoteRel });
    }
  }
  return out;
}

const sftp = new SftpClient();

try {
  console.log(`Connecting to ${config.host}:${config.port} as ${config.username}...`);
  await sftp.connect(config);

  const cwd = await sftp.cwd();
  console.log(`Connected. Remote CWD: ${cwd}`);

  console.log(`Listing ${REMOTE_BASE}:`);
  const rootList = await sftp.list(REMOTE_BASE);
  for (const e of rootList) {
    console.log(`  ${e.type === 'd' ? '[DIR]' : '     '} ${e.name}`);
  }

  const entries = walk(distDir);
  const localFileSet = new Set(
    entries.filter(e => e.type === 'file').map(e => e.remoteRel.replace(/\\/g, '/'))
  );

  const assetsRemote = posix.join(REMOTE_BASE, 'assets');
  if (await sftp.exists(assetsRemote)) {
    const remoteAssets = await sftp.list(assetsRemote);
    for (const e of remoteAssets) {
      if (e.type === '-' && !localFileSet.has(`assets/${e.name}`)) {
        const stale = posix.join(assetsRemote, e.name);
        await sftp.delete(stale);
        console.log(`  del   ${stale}`);
      }
    }
  }

  console.log(`\nUploading ${entries.filter(e => e.type === 'file').length} files to ${REMOTE_BASE} ...`);

  for (const entry of entries) {
    const remoteFull = posix.join(REMOTE_BASE, entry.remoteRel).replace(/\\/g, '/');
    if (entry.type === 'dir') {
      const exists = await sftp.exists(remoteFull);
      if (!exists) {
        await sftp.mkdir(remoteFull, true);
        console.log(`  mkdir ${remoteFull}`);
      }
    } else {
      await sftp.fastPut(entry.localPath, remoteFull);
      console.log(`  put   ${remoteFull}`);
    }
  }

  console.log('\nDeploy complete.');
} catch (err) {
  console.error('Deploy failed:', err.message);
  process.exitCode = 1;
} finally {
  try { await sftp.end(); } catch {}
}
