const CACHE="meik-my-dei-pwa-v9";
const ASSETS=["./","./index.html","./manifest.webmanifest","./sw.js","./icon-192.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
self.addEventListener("push",event=>{
  let data={title:"Meik My Dei",body:"Your class is starting now.",url:"./index.html",studio:false};
  try{if(event.data)data={...data,...event.data.json()}}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,silent:false,requireInteraction:true,data:{url:data.url},actions:data.studio?[{action:"checkin",title:"Check in"}]:[]}));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const url=event.action==="checkin"?"https://studiotimetracker.lovable.app/dashboard":(event.notification.data?.url||"./index.html");
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for(const client of list){if(client.url===url&&"focus" in client)return client.focus();}
    if(clients.openWindow)return clients.openWindow(url);
  }));
});
