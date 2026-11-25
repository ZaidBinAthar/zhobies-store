const fs = require('fs');
const path = require('path');

function search(dir, results = []) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['node_modules', '.git', 'dist'].includes(item)) continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      search(full, results);
    } else if (/\.(jsx?|tsx?|html|json|md|sql)$/.test(item)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/zhobie|zohaib/i.test(line)) {
          results.push(`${full}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
  return results;
}

const res = search('.');
console.log(res.join('\n'));
