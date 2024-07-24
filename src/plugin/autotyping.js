import config from '../../config.cjs';

const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autotyping') {
    if (!isCreator) return m.reply("*THIS COMMAND IS ONLY FOR ME**");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_TYPING = true;
      responseMessage = "_AUTO TYPING ACTIVATED_";
    } else if (text === 'off') {
      config.AUTO_TYPING = false;
      responseMessage = "AUTO TYPING DE-ACTIVATED";
    } else {
      responseMessage = "Type This \n\n *.autotyping* on";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("BILAL-MD ERROR !!!:", error);
      await Matrix.sendMessage(m.from, { text: 'BILAL-MD ERROR !!!' }, { quoted: m });
    }
  }
};

export default autotypingCommand;
