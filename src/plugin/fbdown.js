import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import pkgg from 'nayan-media-downloader';
const { ndown } = pkgg;


const fbSearchResultsMap = new Map();
let fbSearchIndex = 1; 

const facebookCommand = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['facebook', 'fb', 'fbdl','fc'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('_First Go To your Facebook App And Copy The Video Link and Type \n\n *.fb* Link Paste Here');
    }

    try {
      await m.React("✔️");


      const fbData = await ndown(text);
      if (!fbData.status) {
        await m.reply('*_BILAL-MD ERROR !!!_*');
        await m.React("❌");
        return;
      }

      fbSearchResultsMap.set(fbSearchIndex, fbData);

      const sections = [{
        title: 'QUALITY',
        rows: fbData.data.map((video, index) => ({
          header: '',
          title: `DOWNLOAD ${video.resolution}`,
          description: '',
          id: `media_${index}_${fbSearchIndex}`
        }))
      }];

      const buttons = [{
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: 'SELECT QUALITY',
          sections: sections
        })
      }];

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*BILAL-MD FB VIDEO*`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "*|💞| BY |💞| BILAL |💞| MD |💞|*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                 ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/05e1fde9eea24516fd6e0.jpg` } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("✔️");

      fbSearchIndex += 1; 
    } catch (error) {
      console.error("*_BILAL-MD ERROR !!!_*", error);
      await m.reply('*_BILAL-MD ERROR !!!_*');
      await m.React("❌");
    }
  } else if (selectedId) { 
    if (selectedId.startsWith('media_')) {
      const parts = selectedId.split('_');
      const qualityIndex = parseInt(parts[1]);
      const key = parseInt(parts[2]);
      const selectedMedia = fbSearchResultsMap.get(key);

      if (selectedMedia) {
        try {
          const videoUrl = selectedMedia.data[qualityIndex].url;
          let finalMediaBuffer, mimeType, content;

          finalMediaBuffer = await getStreamBuffer(videoUrl);
          mimeType = 'video/mp4';

          const fileSizeInMB = finalMediaBuffer.length / (1024 * 1024);

          if (fileSizeInMB <= 300) {
            content = { video: finalMediaBuffer, mimetype: 'video/mp4', caption: '> © Powered by KING-BILAL-MD' };
            await Matrix.sendMessage(m.from, content, { quoted: m });
          } else {
            await m.reply('_This Video Mbs Size Is Up To 300 MB_ \n _I Can't DownloaThis Video Sorry_');
          }
        } catch (error) {
          console.error("*_BILAL-MD ERROR !!!_*", error);
          await m.reply('*_BILAL-MD ERROR !!!_*');
          await m.React("❌");
        }
      }
    }
  }
};

const getStreamBuffer = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export default facebookCommand;
