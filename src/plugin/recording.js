import config from '../../config.cjs';

const autorecordingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'recording') {
    if (!isCreator) return m.reply("*_THIS COMMAND IS ONLY FOR ME OK !_*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_RECORDING = true;
      responseMessage = "_AUTO RECORDING SHOW DE-ACTIVATED_";
    } else if (text === 'off') {
      config.AUTO_RECORDING = false;
      responseMessage = "AUTO RECORDING SHOW DE-ACTIVATED_";
    } else {
      responseMessage = "Type This:\n- `recording on`: To Activate Auto Recording Show\n- `recording off`: To De-Activate auto Recording show";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("*_BILAL-MD ERROR !!!_*", error);
      await Matrix.sendMessage(m.from, { text: '*_BILAL-MD ERROR !!!_*' }, { quoted: m });
    }
  }
};

export default autorecordingCommand;
