import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoread') {
    if (!isCreator) return m.reply("**_THIS COMMAND IS ONLY FOR ME OK !_*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_READ = true;
      responseMessage = "_AUTO MESSAGE SEEN ACTIVATED_";
    } else if (text === 'off') {
      config.AUTO_READ = false;
      responseMessage = "AUTO MESSAGE SEEN DE-ACTIVATED";
    } else {
      responseMessage = "Type This\n- `autoread on`: To Activate Auto Message Seen\n- `autoread off`: To DE-Activate Auto Message Seen";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("*_BILAL-MD ERROR !!!_*", error);
      await Matrix.sendMessage(m.from, { text: '*_BILAL-MD ERROR !!!_*' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
