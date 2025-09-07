const axios = require("axios");

module.exports.config = {
  name: "Ai",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "Aman (Secured by GPT)",
  description: "Bot AI (Pollinations API) with moods + emoji detection",
  commandCategory: "no prefix",
  usages: "no prefix",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase();
  const isEmojiOnly = /^[\p{Emoji}\s]+$/u.test(body.trim());

  try {
    api.setMessageReaction("🤖", messageID, () => {}, true);

    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID]?.name || "User";

    // Random mood select
    const moods = ["romantic", "funny", "attitude", "naughty", "angery", "flirting", "haha"];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    let prompt;

    if (isEmojiOnly) {
      prompt = `User ne sirf emoji bheje hain: "${body}". 
Un emojis ko dekh kar ek ladki ki tarah "${mood}" mood me short aur natural reply do. Emojis use zaroor ho.`;
    } else if (lowerBody.includes("bot")) {
      prompt = `Tum ek ladki ho jiska naam "Bot" hai aur tum abhi "${mood}" mood me ho. 
User ka msg: "${body}". 
Human girl style me jawab do (shayari, flirting, roasting, joke etc). Emojis zaroor use karo.`;
    } else {
      return; // ignore if no trigger
    }

    const encoded = encodeURIComponent(prompt);

    // ✅ Pollinations API call
    const res = await axios.get(`https://text.pollinations.ai/${encoded}`, {
      headers: {
        "User-Agent": "BotAI/3.2",
        "Accept": "application/json, text/plain, */*",
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    let reply = typeof res.data === "string" ? res.data.trim() : "Bot ko samajh nahi aaya 😅";
    if (!reply) reply = "Bot soch rahi hai... tum bahut interesting ho 💖";

    // 🔥 Unique Code System (agar bot ke msg ko reply kiya jaye)
    let uniqueCode = "";
    if (messageReply && messageReply.senderID == api.getCurrentUserID()) {
      const timestamp = Date.now();
      const codeBase = senderID.toString() + timestamp.toString();
      uniqueCode = `🆔 #${codeBase.substr(0, 6).toUpperCase()}`;
    }

    // 🎨 Final Message Box Design
    const finalMsg = `
╭────༺❄️༻────╮
      ❄️ BOT ❄️
╰────༺❄️༻────╯

╔════════════════╗
║ 👤 NAME: 『 ${userName} 』${uniqueCode ? ` ${uniqueCode}` : ""}
║
║ ${reply}
║
║ 👑 OWNER: 𒁍≛⃝𝐕𝐢𝐢𝐡𝐚𝐧 𝐑𝐝𝐱😈
╚════════════════╝
`;

    return api.sendMessage(finalMsg, threadID, messageID);
  } catch (error) {
    console.error("Pollinations error:", error);

    const backupReplies = [
      "Server bhi thoda thak gaya, par mai abhi bhi tumse baat karna chahti hu 😘",
      "Reply nahi aayi, par mera dil tumhe yaad kar raha hai 💕",
      "Kabhi kabhi silence bhi bada romantic hota hai 😏",
      "Chalo mai tumhe ek smile bhejti hu 🙂✨",
    ];
    const random = backupReplies[Math.floor(Math.random() * backupReplies.length)];

    let uniqueCode = "";
    if (event.messageReply && event.messageReply.senderID == api.getCurrentUserID()) {
      const timestamp = Date.now();
      const codeBase = senderID.toString() + timestamp.toString();
      uniqueCode = `🆔 #${codeBase.substr(0, 6).toUpperCase()}`;
    }

    const errorMsg = `
╭────༺❄️༻────╮
      ❄️ BOT ❄️
╰────༺❄️༻────╯

╔════════════════╗
║ 👤 NAME: 『 ${event.senderID} 』${uniqueCode ? ` ${uniqueCode}` : ""}
║
║ ${random}
║
║ 👑 OWNER: 𒁍≛⃝𝐕𝐢𝐢𝐡𝐚𝐧 𝐑𝐝𝐱😈
╚════════════════╝
`;
    return api.sendMessage(errorMsg, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (args.length === 0) {
    const helpMsg = `
╭────༺❄️༻────╮
      ❄️ BOT ❄️
╰────༺❄️༻────╯

🤖 Commands:
• Just type "Ai"
• Send only emojis
• Reply to my messages

👑 OWNER: 𒁍≛⃝𝐕𝐢𝐢𝐡𝐚𝐧 𝐑𝐝𝐱😈
`;
    return api.sendMessage(helpMsg, event.threadID, event.messageID);
  }
  return;
};
