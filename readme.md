## Open AI server
This is a server that has an endpoint for calling the openAI API
It also has a folder called static for serving static files

```
prompt-server % node server.js
```
Run on locahlhost:3000


The vue essay review site is in a different project


## Running on a hosted server
Build the vue project then copy it into this server's static dist folder, then run this server
```
essay-vue % npm run build
```

## Runnign locally
Use cors-backdoor to allow the vue project to call this server's API
```
cors-backdoor --target http://localhost:3000/
```

Run the vue essay porject in dev mode
This will run on  locahlhost:8080
```
essay-vue % npm run serve
```

Run this server
```
prompt-server % node server.js
```