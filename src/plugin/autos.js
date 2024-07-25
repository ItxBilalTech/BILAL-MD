import config from '../../config.cjs';

// Main command function
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();
  
  const validCommands = ['autostatus', 'autosview', 'statusseen'];

 if (validCommands.includes(cmd)){
   if (!isCreator) return m.reply("*_THIS COMMAND IS ONLY FOR ME OK !_*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_STATUS_SEEN = true;
      responseMessage = "_AUTO STATUS SEEN ACTIVATED_";
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = false;
      responseMessage = "_AUTO STATUS SEEN DE-ACTIVATED_";
    } else {
      responseMessage = `Usage:\n- *${prefix + cmd} ON:* To Activate Auto Status Seen\n- *${prefix + cmd} off:* To De-Activate Auto Status Seen`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("*_BILAL-MD ERROR !!!_*", error);
      await Matrix.sendMessage(m.from, { text: '*_BILAL-MD ERROR !!!_*' }, { quoted: m });
    }
  }
};

export default anticallCommand;
