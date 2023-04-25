const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const fallbackPage = "./fallback.html";

const assets = [
	"./index.html",
	"./app.js",
	"./assets/css/main.css",
	"./manifest.json",
	"./fallback.html",
];

const limitCacheSize = async (cacheName, numAllowedFiles) => {
	// Open the specified cache
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();
	// If the number of files exceeds the limit
	if (keys.length > numAllowedFiles) {
		// Delete the oldest file and call the function again until the limit is reached
		await cache.delete(keys[0]);
		await limitCacheSize(cacheName, numAllowedFiles);
	}
};

self.addEventListener("install", (event) => {
	event.waitUntil(
		// Add assets files to static cache
		caches.open(staticCacheName).then((cache) => {
			// Add an array of assets files to cache
			cache.addAll(assets);
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			// Return an array of promises (one promise for each file)
			return Promise.all(
				keys
					// Filter out any cache collections that are not part of the current cache version
					.filter((key) => key !== staticCacheName && key !== dynamicCacheName)
					// Map the filtered array and delete the files
					.map((key) => caches.delete(key))
			);
		})
	);
});

// Fetch event listener
self.addEventListener("fetch", (event) => {
	// Limit the size of the dynamic cache
	limitCacheSize(dynamicCacheName, 2);

	// If the request is not over http/https, ignore it
	if (!(event.request.url.indexOf("http") === 0)) return;

	event.respondWith(
		caches.match(event.request).then((cacheRes) => {
			// If the cache has the requested resource, return it
			if (cacheRes) {
				return cacheRes;
			} else if (event.request.headers.get("accept").includes("text/html")) {
				// If the request is for an HTML file, return the fallback page
				return caches.match("./fallback.html");
			} else {
				// Otherwise, fetch the resource and add it to the dynamic cache
				return fetch(event.request).then((fetchRes) => {
					return caches.open(dynamicCacheName).then((cache) => {
						cache.put(event.request.url, fetchRes.clone());
						limitCacheSize(dynamicCacheName, 2);
						return fetchRes;
					});
				});
			}
		})
	);
});
