// filepath: /cf-vless-proxy/cf-vless-proxy/src/worker.js
// This file is the main entry point for the Cloudflare Worker. It handles incoming requests, processes VLESS protocol headers, manages WebSocket connections, and routes traffic through the proxy.

import { connect } from 'cloudflare:sockets';
import { isValidUUID, parseSocks5Address } from './config.js';
import { handleProtocolHeader, makeReadableWebSocketStream, log } from './utils.js';

let userID = 'your-uuid-here'; // Replace with your UUID
const proxyIPs = ['proxy1.example.com:443', 'proxy2.example.com:443']; // Replace with your proxy addresses
let socks5Address = ''; // SOCKS5 proxy address
let socks5Relay = false; // SOCKS5 relay mode

if (!isValidUUID(userID)) {
    throw new Error('Invalid UUID');
}

export default {
    async fetch(request, env, _ctx) {
        try {
            const url = new URL(request.url);
            const requestedPath = url.pathname.substring(1); // Remove leading slash

            if (request.headers.get('Upgrade') !== 'websocket') {
                return handleHttpRequest(request, requestedPath);
            } else {
                return await handleWebSocketRequest(request);
            }
        } catch (err) {
            return new Response(err.toString(), { status: 500 });
        }
    },
};

async function handleHttpRequest(request, requestedPath) {
    // Handle HTTP requests and return appropriate responses
    if (requestedPath === 'status') {
        return new Response(JSON.stringify({ status: 'running' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response('Not Found', { status: 404 });
}

async function handleWebSocketRequest(request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    server.accept();

    const readableStream = makeReadableWebSocketStream(server);
    readableStream.pipeTo(new WritableStream({
        async write(chunk) {
            const { hasError, addressRemote, portRemote } = handleProtocolHeader(chunk, userID);
            if (hasError) {
                throw new Error('Invalid protocol header');
            }
            const tcpSocket = await connect({ hostname: addressRemote, port: portRemote });
            const writer = tcpSocket.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
        },
    }));

    return new Response(null, { status: 101, webSocket: client });
}