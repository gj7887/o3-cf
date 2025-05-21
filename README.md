# VLESS Proxy Service

## Overview
This project implements a VLESS protocol proxy service using Cloudflare Workers. It supports WebSocket transport and provides a flexible configuration system for users. The service is designed to route traffic efficiently while maintaining a clear and structured codebase.

## Project Structure
```
cf-vless-proxy
├── src
│   ├── worker.js        # Main entry point for the Cloudflare Worker
│   ├── config.js        # Configuration settings for the proxy service
│   └── utils.js         # Utility functions for supporting functionality
├── public
│   └── index.html       # User interface for configuring the proxy service
├── package.json         # npm configuration file with dependencies and scripts
├── wrangler.toml        # Configuration for deploying the Cloudflare Worker
└── README.md            # Documentation for the project
```

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd cf-vless-proxy
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Configure the Worker**
   Edit the `src/config.js` file to set your user ID, proxy server addresses, and SOCKS5 settings as needed.

4. **Deploy the Worker**
   Use Wrangler to deploy the Cloudflare Worker:
   ```bash
   wrangler publish
   ```

## Usage Guidelines
- Access the proxy service through the provided endpoint after deployment.
- Use the web interface located at `public/index.html` to configure proxy settings and view the current status.
- Ensure that your proxy server addresses are valid and reachable.

## VLESS Protocol
VLESS (VMess Less) is a protocol designed for proxying traffic with enhanced security and performance. This implementation allows for seamless integration with WebSocket connections, making it suitable for various applications.

## WebSocket Support
The proxy service supports WebSocket connections, enabling real-time communication and efficient data transfer. Ensure that your client applications are configured to use WebSocket for optimal performance.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.