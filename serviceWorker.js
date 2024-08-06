const sudokuPlayPwa = "sudoku-play-pwa"
const assets = [
    "/",
    "/index.html",
    "/src/css/style.css",
    "/src/js/main.js",
    "/src/js/main-engine-gen.js",
    "/src/js/main-engine-solver.js",
    "/public/banner.png",
    "/public/0.png",
    "/public/easy.png",
    "/public/expert.png",
    "/public/favicon.ico",
    "/public/hard.png",
    "/public/medium.png",
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