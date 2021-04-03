//Edit this
const config = {
  websocket_addr: 'localhost:4444',
  websocket_passwd: 'pass',
};

//Import required libs
const Chroma = require("razer-chroma-nodejs");
const OBSWebSocket = require('obs-websocket-js');

//Create state
var state = {
  sceneOrder: [],
  currentScenes: {
    program: 1,
    preview: 1
  }
};

//Set up the websocket connection
const obs = new OBSWebSocket();
obs.connect({
  address: config.websocket_addr,
  password: config.websocket_passwd
}).catch(err => {
  if (err) console.log('s')
}).then(() => {
  console.log("we should be connected")
  //Get our scenes
  obs.sendCallback('GetSceneList', {}, (err, data) => {
    if (err) console.log(err)
    for (i = 0; i < data["scenes"].length; i++) {
      state.sceneOrder[i] = data["scenes"][i].name;
    }
    //state.sceneOrder = data["scenes"]
    console.log(state.sceneOrder)
  })
})

//Initialize razer chroma before we do anything else
Chroma.util.init(() => {
  //Clear any currently running effects
  Chroma.effects.clear()

  obs.on('SwitchScenes', data => {
    state.currentScenes.program = state.sceneOrder.indexOf(data["scene-name"]) + 1
    sceneChromaUpdate()
  })

  obs.on('PreviewSceneChanged', data => {
    state.currentScenes.preview = state.sceneOrder.indexOf(data["scene-name"]) + 1
    console.log(state.currentScenes)
    sceneChromaUpdate()
  })
  //Utility functions
  function sceneChromaUpdate() {
    Chroma.effects.keyboard.setEffect("CHROMA_CUSTOM", [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, pgmColor(1), pgmColor(2), pgmColor(3), pgmColor(4), pgmColor(5), pgmColor(6), pgmColor(7), pgmColor(8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, prvColor(1), prvColor(2), prvColor(3), prvColor(4), prvColor(5), prvColor(6), prvColor(7), prvColor(8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, pgmColor(9), pgmColor(10), pgmColor(11), pgmColor(12), pgmColor(13), pgmColor(14), pgmColor(15), pgmColor(16), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, prvColor(9), prvColor(10), prvColor(11), prvColor(12), prvColor(13), prvColor(14), prvColor(15), prvColor(16), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
  }

  function pgmColor(num) {
    if (state.currentScenes.program == num) {
      return Chroma.colors.RED
    } else {
      return Chroma.colors.WHITE
    }
  }

  function prvColor(num) {
    if (state.currentScenes.preview == num) {
      return Chroma.colors.GREEN
    } else {
      return Chroma.colors.WHITE
    }
  }
});