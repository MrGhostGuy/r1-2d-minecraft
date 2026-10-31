const fs = require('fs');
const path = require('path');
const QRCode = require('C:/Users/kency/Desktop/qr-generator/node_modules/qrcode');

const BASE_URL = 'https://mrghostguy.github.io/r1-2d-minecraft';
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'qr-codes', 'r1-2d-minecraft.png');
const META_OUT = path.join(ROOT, 'docs', 'creation.json');

const qrData = {
  title: '2D Minecraft R1',
  url: BASE_URL + '/',
  description: '2D Minecraft for Rabbit R1: mine, craft, survive, mobs, day and night. By Mr. Ghost.',
  iconUrl: BASE_URL + '/icon.png',
  themeColor: '#2F6B1F'
};

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(META_OUT, JSON.stringify(qrData, null, 2) + '\n', 'utf8');
  await QRCode.toFile(OUT, JSON.stringify(qrData), {
    width: 460, margin: 2, errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  console.log('Created', OUT);
  console.log(JSON.stringify(qrData));
})().catch(e => { console.error(e); process.exit(1); });
