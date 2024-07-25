import generateProfilePicture from '../generateProfilePicture.js'; // Import the generateProfilePicture function
import { writeFile, unlink } from 'fs/promises';
import config from '../../config.cjs';

const setProfilePicture = async (m, gss) => {
  const botNumber = await gss.decodeJid(gss.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['setppfull', 'setfullprofilepic', 'fullpp', 'setppbot', 'pp'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("*_THIS COMMAND IS ONLY FOR ME OK !_*");
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`_FIRST MENTION THE PHOTO AND TYPE \n\n ${prefix + cmd}`);
    }

    try {
      const media = await m.quoted.download(); // Download the media from the quoted message
      if (!media) throw new Error('*_BILAL-MD ERROR !!!_*');

      const filePath = `./${Date.now()}.png`;
      await writeFile(filePath, media);

      try {
        const { img } = await generateProfilePicture(media); // Generate profile picture
        await gss.query({
          tag: 'iq',
          attrs: {
            to: botNumber,
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [{
            tag: 'picture',
            attrs: {
              type: 'image'
            },
            content: img
          }]
        });
        m.reply('_PROFILE PIC CHANGED_');
      } catch (err) {
        throw err;
      } finally {
        await unlink(filePath); // Clean up the downloaded file
      }
    } catch (error) {
      console.error('*_BILAL-MD ERROR !!!_*', error);
      m.reply('*_BILAL-MD ERROR !!!_*');
    }
  }
};

export default setProfilePicture;
