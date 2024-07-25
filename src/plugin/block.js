import config from '../../config.cjs';

const block = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['block'];

    if (!validCommands.includes(cmd)) return;
    
    if (!isCreator) return m.reply("*_THIS COMMAND IS ONLY FOR ME OK !_*");

    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    await gss.updateBlockStatus(users, 'block')
      .then((res) => m.reply(`BLOCKED ${users.split('@')[0]} .`))
      .catch((err) => m.reply(`BILAL-MD ERROR !!! ${err}`));
  } catch (error) {
    console.error('*_BILAL-MD ERROR !!!_*', error);
    m.reply('*_BILAL-MD ERROR !!!_*');
  }
};

export default block;
