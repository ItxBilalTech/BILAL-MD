import pkg from "nayan-media-downloader";
const { GDLink } = pkg;

const gdriveDownload = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['gdrive', 'gd', 'gddownload'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('_FIRST GET THE GOOGLE DRIVE FILE LINK AND TYPE_ \n\n *${prefix + cmd} Link Paste Here');

    try {
      await m.React('🕘');

      const gdriveUrl = text;
      const gdriveInfo = await GDLink(gdriveUrl);

      if (gdriveInfo && gdriveInfo.status && gdriveInfo.data) {
        const mediaUrl = gdriveInfo.data;
        const caption = `*|💞| BY |💞| BILAL |💞| MD |💞|*`;

        // Inferring the file type based on the file extension
        const extension = mediaUrl.split('.').pop().toLowerCase();

        // Send the media using Matrix.sendMedia
        await Matrix.sendMedia(m.from, mediaUrl, extension, caption, m);

        await m.React('✔️');
      } else {
        throw new Error('*_BILAL-MD ERROR !!!_*');
      }
    } catch (error) {
      console.error('*_BILAL-MD ERROR !!!_*', error.message);
      m.reply('*_BILAL-MD ERROR !!!_*');
      await m.React('❌');
    }
  }
};

export default gdriveDownload;
