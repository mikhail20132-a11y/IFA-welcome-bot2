
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data');
const file = path.join(dir, 'settings.json');

function load() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '{}');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return {}; }
}
function save(data) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function get(guildId) { return load()[guildId] || {}; }
function set(guildId, patch) {
  const data = load();
  data[guildId] = { ...(data[guildId] || {}), ...patch };
  save(data);
  return data[guildId];
}
module.exports = { get, set };
