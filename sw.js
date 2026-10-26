/* Service Worker der Handy-App: haelt die App-Dateien offline vor.
   STAND ersetzt werkzeuge/app_veroeffentlichen.py durch Version und Pruefsumme
   der Dateien. Aendert sich eine Datei, aendert sich damit auch sw.js, der
   Browser installiert den neuen Worker und holt alles neu — sonst behielte das
   Handy die alte Fassung. Die Daten des Protokolls liegen NICHT hier, sondern
   im Speicher der Seite; ein neuer Stand loescht sie nicht. */
"use strict";
const STAND = "1.9.0-d6e0a90fe488";
const CACHE = "koerper-protokoll-" + STAND;
const DATEIEN = ["./", "index.html", "naehrwerte.js", "manifest.webmanifest", "app-192.png", "app-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(namen => Promise.all(namen.filter(n => n.startsWith("koerper-protokoll-") && n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
// Zuerst aus dem Speicher: die App soll ohne Netz starten. Neues kommt ueber
// einen neuen STAND, nicht ueber jede einzelne Anfrage.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request)));
});
