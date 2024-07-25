import config from '../../config.cjs';

const deleteMessage = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['del', 'delete'];

    if (validCommands.includes(cmd)) {
      if (!isCreator) {
        return m.reply("*_THIS COMMAND IS ONLY FOR ME OK !_*");
      }

      if (!m.quoted) {
        return m.reply('First Mention any Message And Type \n\n *.del*');
      }

      const key = {
        remoteJid: m.from,
        id: m.quoted.key.id,
        participant: m.quoted.key.participant || m.quoted.key.remoteJid
      };

      await gss.sendMessage(m.from, { delete: key });
    }
  } catch (error) {
    console.error('*_BILAL-MD ERROR !!!_*', error);
    m.reply('*_BILAL-MD ERROR !!!_*');
  }
};

export default deleteMessage;
