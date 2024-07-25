import cron from 'node-cron';
import moment from 'moment-timezone';

let scheduledTasks = {};

const groupSetting = async (m, gss) => {
  try {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['group'];
    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("**_THIS COMMAND IS ONLY FOR GROUPS OK !");
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botNumber = await gss.decodeJid(gss.user.id);
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("*_MAKE ME ADMIN FIRST !_");
    if (!senderAdmin) return m.reply("*This Command Is Only For Admins !*");

    const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
    if (args.length < 1) return m.reply(`Type This \n (open/close) and optionally a time.\n\nExample:\n*${prefix + cmd} open* or *${prefix + cmd} open 04:00 PM*`);

    const groupSetting = args[0].toLowerCase();
    const time = args.slice(1).join(' ');

    // Handle immediate setting if no time is provided
    if (!time) {
      if (groupSetting === 'close') {
        await gss.groupSettingUpdate(m.from, 'announcement');
        return m.reply("_GROUP CLOSED !_");
      } else if (groupSetting === 'open') {
        await gss.groupSettingUpdate(m.from, 'not_announcement');
        return m.reply("_GROUP OPENED");
      } else {
        return m.reply(`Type This \n "open" to open group and "close" to close group.\n\nExample:\n*${prefix + cmd} open* \n *${prefix + cmd} close*`);
      }
    }

    // Check if the provided time is valid
    if (!/^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(time)) {
      return m.reply(`Type This \n *${prefix + cmd} open 04:00 PM*`);
    }

    // Convert time to 24-hour format
    const [hour, minute] = moment(time, ['h:mm A', 'hh:mm A']).format('HH:mm').split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`;

    console.log(`Scheduling ${groupSetting} at ${cronTime} IST`);

    // Clear any existing scheduled task for this group
    if (scheduledTasks[m.from]) {
      scheduledTasks[m.from].stop();
      delete scheduledTasks[m.from];
    }

    scheduledTasks[m.from] = cron.schedule(cronTime, async () => {
      try {
        console.log(`GROUP ! ${groupSetting} at ${moment().format('HH:mm')} IST`);
        if (groupSetting === 'close') {
          await gss.groupSettingUpdate(m.from, 'announcement');
          await gss.sendMessage(m.from, { text: "_GROUP CLOSED !_" });
        } else if (groupSetting === 'open') {
          await gss.groupSettingUpdate(m.from, 'not_announcement');
          await gss.sendMessage(m.from, { text: "_GROUP OPENED_" });
        }
      } catch (err) {
        console.error('*_BILAL-MD ERROR !!!_*', err);
        await gss.sendMessage(m.from, { text: '*_BILAL-MD ERROR !!!_*' });
      }
    }, {
      timezone: "Asia/Karachi"
    });

    m.reply(`TASK SET "${groupSetting}" at ${time} IST.`);
  } catch (error) {
    console.error('*_BILAL-MD ERROR !!!_*', error);
    m.reply('*_BILAL-MD ERROR !!!_*');
  }
};

export default groupSetting;
