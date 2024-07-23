import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("_THIS COMMAND IS ONLY FOR ME_");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_REACT = true;
      responseMessage = "AUTO_REACT ACTIVATED";
    } else if (text === 'off') {
      config.AUTO_REACT = false;
      responseMessage = "AUTO_REACT ACTIVED";
    } else {
      responseMessage = "Example \n- Type `autoreact on` to activate auto-reacys \n- type `autoreact off`to De-activate Auto-React";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("BIL-MD ERROR !!!", error);
      await Matrix.sendMessage(m.from, { text: 'BIL-MD ERROR !!!' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
