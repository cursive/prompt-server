## Open AI server
This is a server that has an endpoint for calling the openAI API
It also has a folder called static for serving static files

## key files & folders
- **api/openaiAPI.js** receives the prompt, sends it to OpenAi and gets the feedback and comments in return
- **data/promptData.json** has the josn obhect thatincldues the prompt, rubruc and essay
- **static/public/dist** constinas the built version of the vue project (the source itself is a different project)
- **.env** holds the API keys
- **server.js** is this web server

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