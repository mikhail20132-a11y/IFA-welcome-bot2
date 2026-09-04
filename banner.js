
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

async function makeBanner({ username, memberNumber, type }) {
  const bg = await loadImage(path.join(__dirname, '..', 'assets', 'ifa-banner.png'));
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg, 0, 0, bg.width, bg.height);

  const g = ctx.createLinearGradient(0, bg.height * 0.55, 0, bg.height);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(18,5,20,0.75)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, bg.width, bg.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,.75)';
  ctx.shadowBlur = 12;

  ctx.font = '700 38px Arial';
  ctx.fillText(type === 'welcome' ? 'WELCOME TO IFA' : 'FAREWELL', bg.width/2, bg.height-110);

  ctx.font = '700 56px Arial';
  ctx.fillText(String(username).slice(0, 24), bg.width/2, bg.height-58);

  ctx.font = '700 22px Arial';
  ctx.fillStyle = 'rgba(255,255,255,.95)';
  ctx.fillText(
    type === 'welcome' ? `MEMBER #${memberNumber}` : 'IMPERIAL FOOTBALL ASSOCIATION',
    bg.width/2, bg.height-22
  );

  const dir = path.join(__dirname, '..', 'generated');
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `${type}-${Date.now()}.png`);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  return out;
}
module.exports = { makeBanner };
