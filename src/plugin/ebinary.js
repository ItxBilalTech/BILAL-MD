import { eBinary } from '../../lib/binary.cjs';

const ebinary = async (m, gss) => {
const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['ebinary'];

   if (validCommands.includes(cmd)) {
         if (!text) return m.reply('Type This \n\n ${prefix + cmd} BILAL MD');
         let db = await eBinary(text)
         m.reply(db)
   }
};

export default ebinary;
