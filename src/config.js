// filepath: /cf-vless-proxy/cf-vless-proxy/src/config.js

const userID = 'd342d11e-d424-4583-b36e-524ab1f0afa4';

const proxyIPs = [
    'cdn.xn--b6gac.eu.org:443',
    'cdn-all.xn--b6gac.eu.org:443'
];

let socks5Address = '';
let socks5Relay = false;

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

function parseSocks5Address(address) {
    const parts = address.split('@');
    if (parts.length === 2) {
        const [credentials, hostPort] = parts;
        const [username, password] = credentials.split(':');
        return { username, password, hostPort };
    }
    return { hostPort: parts[0] };
}

export {
    userID,
    proxyIPs,
    socks5Address,
    socks5Relay,
    isValidUUID,
    parseSocks5Address
};