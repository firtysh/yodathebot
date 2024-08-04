const WAWebJs = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ytDlpBinaryPath = path.resolve(__dirname, "../bin/yt-dlp"); // Replace with the relative path

function validateAndCleanYouTubeUrl(url) {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\?v=|.+\/)?([^&=%\?]{11})(\?.+)?$/;
  const match = url.match(youtubeRegex);

  if (match) {
    // const baseUrl = match[0];
    const videoId = match[6];
    // return `https://youtu.be/${videoId}`;
    return videoId;
  } else {
    return null; // Return null if the URL is not valid
  }
}

function getVideoInfo(videoUrl) {
  return new Promise((resolve, reject) => {
    const ytDlpProcess = spawn(ytDlpBinaryPath, [
      "-f",
      "bestaudio",
      "--print",
      '{"title": "%(title)s", "filesize": %(filesize)s}',
      videoUrl,
    ]);

    let output = "";

    ytDlpProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    ytDlpProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp process exited with code ${code}`));
      } else {
        try {
          const jsonOutput = JSON.parse(output.trim());
          resolve(jsonOutput);
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      }
    });
  });
}

/**
 * Downloads from youtube.
 *
 * @param {Object} options - The options object.
 * @param {WAWebJs.Message} options.m - The wwabjs message object.
 * @param {string} options.arg - The argument string.
 */
const download = async ({ m, arg }) => {
  const argFragments = arg.split(/\s+/);

  const videoCode = validateAndCleanYouTubeUrl(argFragments[0]);

  const info = await getVideoInfo(videoCode);

  if (!videoCode) return await m.reply("Please provide a valid url");
  const ytDlpProcess = spawn(ytDlpBinaryPath, [
    "-f",
    "bestaudio",
    "--extract-audio",
    "--audio-format",
    "mp3",
    "-o",
    "-",
    videoCode,
  ]);

  await m.reply("Please wait your request is being processed")
  const logFileStream = fs.createWriteStream(
    path.resolve(__dirname, `../logs/ytdlp/${videoCode}.txt`),
    { flags: "a" }
  );

  const chunks = [];

  ytDlpProcess.stdout.setEncoding("base64");
  ytDlpProcess.stdout.on("data", (data) => {
    chunks.push(data);
  });

  // Handle errors from yt-dlp
  ytDlpProcess.stderr.on("data", (data) => {
    logFileStream.write(data);
  });

  // Handle yt-dlp process close
  ytDlpProcess.on("close", async (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
    await m.reply("Process Completed upload starting...")
    const media = new MessageMedia(
      "audio/mpeg",
      chunks.join(""),
      `${info.title}.mp3`,
      info.filesize
    );
    return await m.reply(media, m.from, { sendMediaAsDocument: true });
  });
};

module.exports = { download };
