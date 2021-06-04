// Author : Aditya Rathore
// Description: Agora Web Stream implementation to multiplex webcam and screen streams
// Blog Link:
//

// Initializing global stream variables
let userVideoStream;
let redUL, redLL, greenLL, greenUL, blueLL, blueUL;
let offset = 50;
let userScreenStream;
let globalStream; // One that is actually streamed
// enter app Id here
let appId = "*********************************";

hex = document.getElementById("color").value;

redLL = hexToRgb(hex).r;
greenLL = hexToRgb(hex).g;
blueLL = hexToRgb(hex).b;

redUL = hexToRgb(hex).r;
greenUL = hexToRgb(hex).g;
blueUL = hexToRgb(hex).b;

// Webcam canvas init (offscreen)
let cameraElement = document.createElement("video");
cameraElement.style =
  "opacity:0;position:fixed;z-index:-1;left:-100000;top:-100000;";
document.body.appendChild(cameraElement);

// Screen canvas init (offscreen)
let screenElement = document.createElement("video");
screenElement.style =
  "opacity:0;position:fixed;z-index:-1;left:-100000;top:-100000;";
document.body.appendChild(screenElement);

// Stream canvas init (offscreen , will be used to multiplex the streams)
let streamCanvas = document.createElement("canvas");
streamCanvas.height = 1080;
streamCanvas.width = 1920;
userCameraHeight = 960;
userCameraWidth = 540;
streamCanvas.style =
  "opacity:0;position:fixed;z-index:-1;left:-100000;top:-100000;";
scaleFactor = 10;
let streamCanvasType = streamCanvas.getContext("2d");

// Container to put remote stream
let remoteContainer = document.getElementById("remoteStream");

let client = AgoraRTC.createClient({
  mode: "live",
  codec: "h264",
});

// Function to handle fail events
let handlefail = function (err) {
  window.alert("Error Encountered : " + err);
  console.log(err);
};

// Initializing client
// Function to add/append video streams to remoteContainer
function addVideoStream(streamId) {
  let streamdiv = document.createElement("div");
  streamdiv.id = streamId;
  streamdiv.style.height = "380px";
  remoteContainer.appendChild(streamdiv);
}

// Function to remove video stream
function RemoveVideoStream(streamId) {
  let stream = evt.stream;
  stream.stop();
  let remDiv = document.getElementById(stream.getId());
  remDiv.parentNode.removeChild(remDiv);

  console.log("Remote stream is removed" + stream.getId());
}

client.on("stream-removed", RemoveVideoStream);

client.on("peer-leave", RemoveVideoStream);

// Helper functions to initialize user web streams
function getUserVideo() {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

function getUserScreen() {
  return navigator.mediaDevices.getDisplayMedia();
}

// Draw function responsible for drawing each frame of the stream
function drawVideo() {
  streamCanvasType.drawImage(
    cameraElement,
    0,
    0,
    streamCanvas.width,
    streamCanvas.height
  );
  const frame = streamCanvasType.getImageData(
    0,
    0,
    streamCanvas.width,
    streamCanvas.height
  );

  const length = frame.data.length;
  const data = frame.data;

  for (let i = 0; i < length; i += 4) {
    // if (i % streamCanvas.width == 0) i += streamCanvas.width + 1;
    // if (i > length) break;
    const red = data[i + 0];
    const green = data[i + 1];
    const blue = data[i + 2];
    if (
      green > greenLL &&
      green < greenUL &&
      red > redLL &&
      red < redUL &&
      blue > blueLL &&
      blue < blueUL
    ) {
      data[i + 3] = 0;
    }
  }
  streamCanvasType.putImageData(frame, 0, 0);
}

// Main driver function
async function streamMultiplexer() {
  // init user streams and append to DOM tree
  userVideoStream = await getUserVideo();
  cameraElement.srcObject = userVideoStream;
  cameraElement.play();

  streamCanvas.height = userVideoStream
    .getVideoTracks()[0]
    .getSettings().height;
  streamCanvas.width = userVideoStream.getVideoTracks()[0].getSettings().width;

  camFrameRate = userVideoStream.getVideoTracks()[0].getSettings().frameRate;

  drawInterval = 1000 / camFrameRate;

  video2 = document.createElement("video");
  video2.srcObject = userVideoStream;
  video2.play();

  // Init base canvas
  document.body.appendChild(streamCanvas);
  streamCanvasType.fillRect(0, 0, streamCanvas.width, streamCanvas.height);

  // Draw frames
  setInterval(drawVideo, drawInterval);

  // Get video stream from canvas
  mergedStream = streamCanvas.captureStream(camFrameRate);

  tracks = mergedStream.getVideoTracks();

  // Add tracks to global stream
  globalStream.addTrack(tracks[0]);
}

document.getElementById("stream").onclick = function () {
  let channelName = document.getElementById("ChannelName").value;
  let userName = document.getElementById("userName").value;
  let appId = document.getElementById("appid").value;
  console.log(appId);
  let token = document.getElementById("token").value;

  if (appId == "") {
    appId = window.prompt("Please enter an appid");
  }

  client.init(
    appId,
    () => console.log("AgoraRTC Client initialized"),
    handlefail
  );

  // Adding listeners
  client.on("stream-added", function (evt) {
    client.subscribe(evt.stream, handlefail);
  });

  client.on("stream-subscribed", function (evt) {
    console.log("I was called");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });

  client.join(
    token || null,
    channelName,
    userName,
    () => {
      // Init stream without a video track
      var publicStream = AgoraRTC.createStream({
        video: false,
        audio: true,
        screen: false,
      });
      globalStream = publicStream;
      publicStream.init(function () {
        publicStream.play("SelfStream");
        client.publish(publicStream);
      });

      streamMultiplexer();
    },
    handlefail
  );
};

document.getElementById("join").onclick = function () {
  let channelName = document.getElementById("ChannelName").value;
  let userName = document.getElementById("userName").value;

  if (appId == "") {
    appId = window.prompt("Please enter an appid");
  }

  client.init(
    appId,
    () => console.log("AgoraRTC Client initialized"),
    handlefail
  );

  // Adding listeners
  client.on("stream-added", function (evt) {
    client.subscribe(evt.stream, handlefail);
  });

  client.on("stream-subscribed", function (evt) {
    console.log("I was called");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });

  client.join(
    null,
    channelName,
    userName,
    () => {
      var gameStream = AgoraRTC.createStream({
        video: true,
        audio: true,
        screen: false,
      });
      globalStream = gameStream;
      gameStream.init(function () {
        gameStream.play("SelfStream");
        client.publish(gameStream);
      });
      console.log(`App id: ${appId}\nChannel id: ${channelName}`);
    },
    handlefail
  );
};

document.getElementById("leave").onclick = function () {
  client.leave(function () {
    console.log("Channel Left");
  }, handlefail);
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
document.getElementById("color").onchange = function (e) {
  redLL = hexToRgb(e.target.value).r - offset / 2;
  greenLL = hexToRgb(e.target.value).g - offset / 2;
  blueLL = hexToRgb(e.target.value).b - offset / 2;

  redUL = hexToRgb(e.target.value).r + offset / 2;
  greenUL = hexToRgb(e.target.value).g + offset / 2;
  blueUL = hexToRgb(e.target.value).b + offset / 2;
};

document.getElementById("offset").onchange = function (e) {
  offset = parseInt(e.target.value);

  console.log("Before" + redUL);
  hex = document.getElementById("color").value;

  redLL = hexToRgb(hex).r;
  greenLL = hexToRgb(hex).g;
  blueLL = hexToRgb(hex).b;

  redUL = hexToRgb(hex).r;
  greenUL = hexToRgb(hex).g;
  blueUL = hexToRgb(hex).b;

  redLL = redLL - offset / 2;
  greenLL = greenLL - offset / 2;
  blueLL = blueLL - offset / 2;

  redUL = redUL + offset / 2;
  greenUL = greenUL + offset / 2;
  blueUL = blueUL + offset / 2;

  console.log("After" + redUL);
};

// document.getElementById("redLL").onchange = function (e) {
//   redLL = e.target.value;
// };
// document.getElementById("redUL").onchange = function (e) {
//   redUL = e.target.value;
// };

// document.getElementById("blueLL").onchange = function (e) {
//   blueLL = e.target.value;
// };
// document.getElementById("blueUL").onchange = function (e) {
//   blueUL = e.target.value;
// };

// document.getElementById("greenLL").onchange = function (e) {
//   greenLL = e.target.value;
// };

// document.getElementById("greenUL").onchange = function (e) {
//   greenUL = e.target.value;
//   console.log("I am called");
// };
