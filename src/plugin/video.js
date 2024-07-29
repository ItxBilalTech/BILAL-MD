import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';

const video = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['video', 'ytmp4', 'vid', 'ytmp4doc'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Type This \n\n .video mera nabi mera nabi naat');

    try {
      await m.React("🌹");

      const isUrl = ytdl.validateURL(text);
      await m.React("🖇️");

      const sendVideoMessage = async (videoInfo, finalVideoBuffer) => {
        if (cmd === 'ytmp4doc') {
          const docMessage = {
            document: finalVideoBuffer,
            mimetype: 'video/mp4',
            fileName: `${videoInfo.title}.mp4`,
            caption: `> ${videoInfo.title}\n> KING BILAL-MD`,
          };
          await Matrix.sendMessage(m.from, docMessage, { quoted: m });
        } else {
          const videoMessage = {
            video: finalVideoBuffer,
            mimetype: 'video/mp4',
            caption: `KING BILAL-MD`,
          };
          await Matrix.sendMessage(m.from, videoMessage, { quoted: m });
        }
        await m.React("✔️");
      };

      if (isUrl) {
        const videoStream = ytdl(text, { filter: 'audioandvideo', quality: 'highest' });
        const videoBuffer = [];

        videoStream.on('data', (chunk) => {
          videoBuffer.push(chunk);
        });

        videoStream.on('end', async () => {
          try {
            const finalVideoBuffer = Buffer.concat(videoBuffer);
            const videoInfo = await yts({ videoId: ytdl.getURLVideoID(text) });
            await sendVideoMessage(videoInfo, finalVideoBuffer);
          } catch (err) {
            console.error('Video Not Downloaded Sorry:', err);
            m.reply('Video Not Downloaded Sorry');
            await m.React("😭");
          }
        });
      } else {
        const searchResult = await yts(text);
        const firstVideo = searchResult.videos[0];
        await m.React("🎗️");

        if (!firstVideo) {
          m.reply('Video Not Downloaed Sorry');
          await m.React("😭");
          return;
        }

        const videoStream = ytdl(firstVideo.url, { filter: 'audioandvideo', quality: 'highest' });
        const videoBuffer = [];

        videoStream.on('data', (chunk) => {
          videoBuffer.push(chunk);
        });

        videoStream.on('end', async () => {
          try {
            const finalVideoBuffer = Buffer.concat(videoBuffer);
            await sendVideoMessage(firstVideo, finalVideoBuffer);
          } catch (err) {
            console.error('Video Not Downloaed Sorry:', err);
            m.reply('Video Not Downloaed Sorry');
            await m.React("😭");
          }
        });
      }
    } catch (error) {
      console.error("KING BILAL-MD ERROR !!!:", error);
      m.reply('KING BILAL-MD ERROR !!!');
      await m.React("😭");
    }
  }
};

export default video;
