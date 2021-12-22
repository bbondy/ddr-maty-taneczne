let deviceFilter = { vendorId: 26215, productId: 49158 };
let requestParams = { filters: [deviceFilter] };

function handleConnectedDevice(e) {
  console.log("Device connected: " + e.device.productName);
}

function handleDisconnectedDevice(e) {
  console.log("Device disconnected: " + e.device.productName);
}

var ddrDirections = {
    Down: 8,
    Up: 4,
    Left: 1,
    Right: 2
}

var lastDirection = 0

function simulateKeyDown(key, code) {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        code: key,
        keyCode: code,
        which: code,
        bubbles: true
    }));
}

function simulateKeyUp(key, code) {
    window.dispatchEvent(new KeyboardEvent('keyup', {
        key,
        code: key,
        keyCode: code,
        which: code,
        bubbles: true
    }));
}

function translateDirectionToKeyDown(lastDirection, direction) {
    if ((direction & ddrDirections.Down) && !(lastDirection & ddrDirections.Down)) {
        simulateKeyDown('ArrowDown', 40)
    } else if (!(direction & ddrDirections.Down) && (lastDirection & ddrDirections.Down)) {
        simulateKeyUp('ArrowDown', 40)
    }

    if ((direction & ddrDirections.Up) && !(lastDirection & ddrDirections.Up)) {
        simulateKeyDown('ArrowUp', 38)
    } else if (!(direction & ddrDirections.Up) && (lastDirection & ddrDirections.Up)) {
        simulateKeyUp('ArrowUp', 38)
    }

    if ((direction & ddrDirections.Left) && !(lastDirection & ddrDirections.Left)) {
        simulateKeyDown('ArrowLeft', 37)
    } else if (!(direction & ddrDirections.Left) && (lastDirection & ddrDirections.Left)) {
        simulateKeyUp('ArrowLeft', 37)
    }

    if ((direction & ddrDirections.Right) && !(lastDirection & ddrDirections.Right)) {
        simulateKeyDown('ArrowRight', 39)
    } else if (!(direction & ddrDirections.Right) && (lastDirection & ddrDirections.Right)) {
        simulateKeyUp('ArrowRight', 39)
    }
}

function handleInputReport(e) {
  const direction = new Uint8Array(e.data.buffer)[0]
  translateDirectionToKeyDown(lastDirection, direction)
  lastDirection = direction
}

navigator.hid.addEventListener("connect", handleConnectedDevice);
navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);

function init() {
    const button = document.createElement('button')
    button.innerHTML = 'Connect'
    button.style.position = 'absolute'
    button.style.top = 0
    button.style.left = 0
    document.body.appendChild(button)
    button.addEventListener('click', () => {
        button.style.display = 'none'
        navigator.hid.requestDevice(requestParams).then((devices) => {
            if (devices.length == 0) return;
            const device = devices[0]
            device.open().then(() => {
                device.addEventListener("inputreport", handleInputReport);
            });
        });
    })
}

init()
