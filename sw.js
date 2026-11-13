// Service worker: primero red (así siempre ves la versión más nueva) y, sin conexión, usa la copia guardada.
const C='habitos-v1';
const BASE=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(BASE)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(
  fetch(r,{cache:'no-cache'}).then(res=>{
   if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}
   return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
 );
});
