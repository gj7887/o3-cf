// filepath: /cf-vless-proxy/cf-vless-proxy/src/utils.js

export function parseProtocolHeader(buffer) {
    if (buffer.byteLength < 24) {
        throw new Error('Invalid protocol header: insufficient data');
    }

    const dataView = new DataView(buffer);
    const version = dataView.getUint8(0);
    const userID = String.fromCharCode.apply(null, new Uint8Array(buffer.slice(1, 17)));

    if (!isValidUserID(userID)) {
        throw new Error('Invalid user ID');
    }

    const command = dataView.getUint8(18);
    const portRemote = dataView.getUint16(19);
    const addressType = dataView.getUint8(21);
    const addressRemote = getAddressFromBuffer(dataView, addressType, buffer);

    return {
        version,
        userID,
        command,
        portRemote,
        addressType,
        addressRemote,
    };
}

function isValidUserID(userID) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(userID);
}

function getAddressFromBuffer(dataView, addressType, buffer) {
    let address;
    switch (addressType) {
        case 1: // IPv4
            address = Array.from(new Uint8Array(buffer.slice(22, 26))).join('.');
            break;
        case 2: // IPv6
            address = Array.from(new Uint8Array(buffer.slice(22, 38))).map(byte => byte.toString(16).padStart(2, '0')).join(':');
            break;
        case 3: // Domain
            const domainLength = dataView.getUint8(22);
            address = String.fromCharCode.apply(null, new Uint8Array(buffer.slice(23, 23 + domainLength)));
            break;
        default:
            throw new Error('Unsupported address type');
    }
    return address;
}

export function log(message) {
    console.log(`[LOG] ${message}`);
}

export function handleWebSocketStream(webSocket, onMessage, onClose) {
    webSocket.addEventListener('message', onMessage);
    webSocket.addEventListener('close', onClose);
}

export function selectRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}