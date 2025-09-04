import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true, filter: (srcPath) => {
    const ignorePatterns = [
      'node_modules', 'dist', 'build', '.next', '.turbo', '.nx', '.parcel-cache', '.cache', 'coverage', 'pnpm-store', '.DS_Store', '.env', '.log', '.vscode', '.idea'
    ];
    return !ignorePatterns.some(pattern => srcPath.includes(pattern));
  }});
}

copyDir('bolt-workdir/marketing/src', 'apps/marketing/src');
copyDir('bolt-workdir/shared', 'packages/shared/src');
