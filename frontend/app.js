document
  .getElementById("youtubeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const url = document.getElementById("youtubeURL").value;
    const videoId = extractVideoID(url);
    if (videoId) {
      fetch(`/getAudioURL?videoId=${videoId}`)
        .then((response) => response.text())
        .then((audioUrl) => {
          setAudioSource(audioUrl);
        })
        .catch((error) => console.error("Error fetching audio URL:", error));
    } else {
      alert("Invalid YouTube URL");
    }
  });

function extractVideoID(url) {
  const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function setAudioSource(audioUrl) {
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src = audioUrl;
}
