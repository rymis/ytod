import * as esbuild from 'esbuild'
import http from 'node:http'
import { spawn } from 'node:child_process';

// Start esbuild's server on a random local port
// esbuild src/index.js --bundle --minify --sourcemap --jsx-factory=mCreateElement --jsx-fragment=mFragment --outfile=dist/index.js 
// tailwindcss -i ./src/styles.css -o dist/styles.css -m
let ctx = await esbuild.context({
    entryPoints: ['src/index.js'],
    sourcemap: true,
    bundle: true,
    outfile: '../ytod/wwwroot/index.js',
    minify: true,
    sourcemap: true,
    jsxFactory: "mCreateElement",
    jsxFragment: "mFragment",
})

ctx.watch();

// The return value tells us where esbuild's local server is
let { host, port } = await ctx.serve({
    servedir: "../ytod/wwwroot/",
})

let tailwind = spawn("npx",
    [ "tailwindcss", "-i", "./src/styles.css", "--watch", "-o", "../ytod/wwwroot/index.css", "-m" ],
    { detach: true });

// Then start a proxy server on port 3000
http.createServer((req, res) => {
    const options = {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    }

    if (req.url.startsWith("/ytod/api")) {
        options.port = 12345;
    }

    // Forward each incoming request to esbuild
    const proxyReq = http.request(options, proxyRes => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
    })

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true })
}).listen(3000)
