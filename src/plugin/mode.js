import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const modeCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

    if (cmd === 'mode') {
        if (!isCreator) {
            await Matrix.sendMessage(m.from, { text: "*this command is only for me Ok !*" }, { quoted: m });
            return;
        }

        if (['public', 'private'].includes(text)) {
            if (text === 'public') {
                Matrix.public = true;
                m.reply('BILAL-MD WORK_TYPE CHANGED TO *public*');
            } else if (text === 'private') {
                Matrix.public = false;
                m.reply('BILAL-MD WORK_TYPE CHANGED TO *private*');
            } else {
                m.reply("Type This \n *.mode* public");
            }
        } else {
            m.reply("BILAL-MD ERROR !!!");
        }
    }
};

export default modeCommand;
