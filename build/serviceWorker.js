const sudokuPlayPwa = "sudoku-play-pwa"
const assets = [
    "/",
    "/index.html",
    "/style.min.css",
    "/scripts.min.js",
    "/public/banner.png",
    "/public/0.png",
    "/public/easy.png",
    "/public/expert.png",
    "/public/favicon.ico",
    "/public/hard.png",
    "/public/medium.png",
    "/public/insane.png",
    "/public/icons/icon-72x72.png",
    "/public/icons/icon-96x96.png",
    "/public/icons/icon-128x128.png",
    "/public/icons/icon-144x144.png",
    "/public/icons/icon-152x152.png",
    "/public/icons/icon-192x192.png",
    "/public/icons/icon-384x384.png",
    "/public/icons/icon-512x512.png",
    "/public/audio/click.mp3",
    "/public/audio/game-over.mp3",
    "/public/audio/game-start.mp3",
    "/public/audio/game-win.mp3",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(sudokuPlayPwa).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})