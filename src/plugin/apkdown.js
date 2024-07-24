import { search, download } from 'aptoide-scraper';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const apkMap = new Map();
let apkIndex = 1; // Global index for APKs

const searchAPK = async (m, Matrix) => {
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

  const validCommands = ['apk', 'searchapk', 'apkdl', 'app'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('_TYPE THIS \n\n *.apk* car racing game');

    try {
      await m.React("✔️");


      let searchResult = await search(text);
      const topAPKs = searchResult.slice(0, 10);

      if (topAPKs.length === 0) {
        m.reply('Apk Not Found Sorry');
        await m.React("❌");
        return;
      }

      const apkButtons = await Promise.all(topAPKs.map(async (apk, index) => {
        const uniqueId = `apk_${apkIndex + index}`;
        const apkDetails = await download(apk.id); 
        apkMap.set(uniqueId, {
          ...apk,
          size: apkDetails.size 
        });
        return {
          "header": "",
          "title": `😍 ${apk.name}`, 
          "description": `Size: ${apkDetails.size}`,
          "id": uniqueId 
        };
      }));

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*😈 APK DOWNLOADER 😈* \n\n *SELECT APK* \n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "*|💞| BY |💞| BILAL |💞| MD |💞|*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: `https://i.ibb.co/vhXYBxQ/BILAL-MD-PIC.jpg` } }, { upload: Matrix.waUploadToServer })),
                title: ``,
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "SELECT APK",
                      sections: [
                        {
                          title: "BILAL-MD",
                          highlight_label: "SEARCHED",
                          rows: apkButtons
                        },
                      ]
                    })
                  }
                ],
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


      apkIndex += topAPKs.length;
    } catch (error) {
      console.error("BILAL-MD ERROR !!!", error);
      m.reply('BILAL-MD ERROR !!!');
      await m.React("❌");
    }
  } else if (selectedId) { 
    const selectedAPK = apkMap.get(selectedId);

    if (selectedAPK) {
      try {
        const apkDetails = await download(selectedAPK.id); 
        const url = apkDetails.dllink;
        const iconUrl = apkDetails.icon;
        const size = apkDetails.size;

        await Matrix.sendMessage(m.from, { image: { url: iconUrl }, caption: `*👑 APK 👑*\n\n*💞 NAME:* ${selectedAPK.name}\n *💞 SIZE:* ${size}\n *|💞| BY |💞| BILAL |💞| MD |💞|*` }, { quoted: m });

  
        const apkMessage = {
          document: { url },
          mimetype: 'application/vnd.android.package-archive',
          fileName: `${selectedAPK.name}.apk`
        };

        await Matrix.sendMessage(m.from, apkMessage, { quoted: m });
      } catch (error) {
        console.error("BILAL-MD ERROR !!!", error);
        m.reply('BILAL-MD ERROR !!!');
      }
    } else {
    }
  }
};

export default searchAPK;
