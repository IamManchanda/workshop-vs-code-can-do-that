const API_BASE = "https://lifx-lamp-api.azurewebsites.net/api";

// define variables
let app = document.getElementById("app");
let goButton = document.getElementById("goButton");
let lampInput = document.getElementById("colorInput");
let currentColor = document.getElementById("currentColor");
let bulb = document.getElementById("bulb");
let online = window.navigator.onLine;

class Application {
  /**
   * Initalize the page and websocket connection
   */

  constructor() {
    const online = window.navigator.onLine;

    goButton.addEventListener("click", async () => {
      const color = lampInput.value;
      this.setColor(color);
    });

    if (online) {
      this.init();
    } else {
      console.log("App is offline. Lamp API will not be used.");
    }
  }

  // #region class Methods
  async init() {
    // initialize signalR hub (websockets connection)
    let connection = new signalR.HubConnectionBuilder()
      .withUrl(API_BASE)
      .build();

    // receives the "colorChanged" web socket event
    connection.on("colorChanged", (hex) => {
      // update the bulb color
      this.updateColor(hex);
    });

    // start the websocket connection
    await connection.start();
  }

  updateColor(hex) {
    bulb.style = `fill: #${hex};`;
    currentColor.textContent = `#${hex}`;
  }

  /**
   * Calls the API to update the lamp color
   * @param {string} color
   */
  async setColor(color) {
    const hexNoHash = color.substring(1, color.length);
    // if we're online, update the lamp
    if (online) {
      fetch(`${API_BASE}/setColor?color=${hexNoHash}`);
      await fetch(`${API_BASE}/setColor?color=${hexNoHash}`);
    } else {
      // if we're offline, update the color
      bulb.style = `fill: #${hexNoHash};`;
      currentColor.textContent = `#${hexNoHash}`;
    }
  }
  // #endregion
}

export default Application;
