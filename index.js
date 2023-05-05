const manifestUri = 'https://localhost:7253/transform/videomanifest/asdf?provider=url&docId=https://bigbuckbunny.blob.core.windows.net/bbb/bigbuckbunny_trailer_flipped.mov&format=dash&part=index'

function initApp() {
  shaka.polyfill.installAll();
  shaka.log.setLevel(shaka.log.Level.V2);
  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  const video = document.getElementById('video');
  const player = new shaka.Player(video);  
  const trace = traceparent.startOrResume(null, {transactionSampleRate: 1.0});

  window.player = player;
  
  player.addEventListener('error', onErrorEvent);

  player.getNetworkingEngine().registerRequestFilter(function(type, request) {
     const span = trace.child();
     request.headers['traceparent'] = span.toString();
  });

  try {
    await player.load(manifestUri, null, 'application/dash+xml');
    console.log('The video has now been loaded!');
  } catch (e) {
    onError(e);
  }
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);