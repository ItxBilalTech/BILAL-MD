import fetch from 'node-fetch';
import config from '../../config.cjs';

const downloadAndSendMedia = async (m, Matrix) => {
  if (!config.AUTO_DL) return;  // Exit early if AUTO_DL is false

  const text = m.body.trim();

  if (!/^https?:\/\//.test(text)) {
    return;
  }

  try {
    const supportedDomains = ['youtube.com', 'youtu.be', 'instagram.com', 'facebook.com', 'tiktok.com', 'drive.google.com'];
    const urlObj = new URL(text);
    const domain = urlObj.hostname.replace('www.', '');

    if (supportedDomains.some(d => domain.includes(d))) {
      const apiUrl = `https://ethixdl-003a39444563.herokuapp.com/download?url=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const result = await res.json();

      if (result.status) {
        const mediaData = result.data;
        const caption = `*|💞| BY |💞| BILAL |💞| MD |💞|*`;

        if (mediaData.low) {
          const mediaUrl = mediaData.low;
          const extension = mediaUrl.split('.').pop().toLowerCase();

          await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);
          await m.React('✔️');
        } else {
        }
      } else {
      }
    } else {
    }
  } catch (error) {
    console.error('*_BILAL-MD ERROR !!!_*', error.message);
    m.reply('*_BILAL-MD ERROR !!!_*');
    await m.React('❌');
  }
};

export default downloadAndSendMedia;
