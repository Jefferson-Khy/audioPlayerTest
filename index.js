const http = require("http");
const play = require("play-dl");
const fs = require("fs");
const path = require("path");
const url = require("url"); // Import the 'url' module

// Function to stream audio from YouTube
async function getYouTubeAudioURL(youtubeURL) {
  try {
    let video = await play.video_info(youtubeURL);
    let stream = await play.stream_from_info(video);
    return stream.url;
  } catch (error) {
    console.error("Error fetching audio URL:", error);
    return null;
  }
}

// Function to serve static files (HTML, JS, CSS, etc.)
function serveStaticFile(filePath, contentType, response) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      response.writeHead(500);
      response.end(`Server Error: ${err.code}`);
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
}

// Create an HTTP server
http
  .createServer(async (req, res) => {
    if (req.url.startsWith("/getAudioURL")) {
      // Extract the video ID from the query parameters
      const query = url.parse(req.url, true).query;
      const videoId = query.videoId;
      const audioURL = await getYouTubeAudioURL(
        `https://www.youtube.com/watch?v=${videoId}`
      );

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(audioURL);
    } else if (req.url === "/app.js") {
      // Serve the JavaScript file
      const jsFilePath = path.join(__dirname, "frontend", "app.js");
      serveStaticFile(jsFilePath, "text/javascript", res);
    } else {
      // Serve the HTML file
      const htmlFilePath = path.join(__dirname, "frontend", "index.html");
      serveStaticFile(htmlFilePath, "text/html", res);
    }
  })
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
