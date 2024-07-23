import config from '../../config.cjs';

// Main command function
const anticallcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'anticall') {
    if (!isCreator) return m.reply("_THIS COMMAND IS ONLY FOR ME_");
    let responseMessage;

    if (text === 'on') {
      config.REJECT_CALL = true;
      responseMessage = "ANTI CALL ACTIVATED";
    } else if (text === 'off') {
      config.REJECT_CALL = false;
      responseMessage = "ANTI CALL DE-ACTIVATED";
    } else {
      responseMessage = "Example:\n- type `anticall on` to activate Anti-Call \n- type `anticall off` to De-Activate Anti-Call";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("BIL-MD ERROR !!!", error);
      await Matrix.sendMessage(m.from, { text: 'BIL-MD ERROR !!!' }, { quoted: m });
    }
  }
};

export default anticallcommand;
