//Prompts
curl -X POST -H "Content-Type: application/json" -d '{
  "promptTitle": "Your Prompt Title",
  "promptDescription": "Your Prompt Description",
  "promptAuthor": "Your Prompt Author"
}' http://localhost:3000/api/createPrompt

curl -X PUT -H "Content-Type: application/json" -d '{
  "promptTitle": "Updated Prompt Title",
  "promptDescription": "Updated Prompt Description",
  "promptAuthor": "Updated Prompt Author"
}' http://localhost:3000/api/updatePrompt/{uuid}

curl http://localhost:3000/api/getAllPrompts
curl http://localhost:3000/api/getSinglePrompt/{uuid}
curl -X DELETE http://localhost:3000/api/deletePrompt/{uuid}




//Rubrics
curl -X POST -H "Content-Type: application/json" -d '{"title":"new rubric using curl on replit"}' http://localhost:3000/api/createrubric
curl http://localhost:3000/api/rubricdata
curl -X DELETE http://localhost:3000/api/deleterubric/4cfaf24f-c089-4f53-9257-c08c278f46eb
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Updated Title on replit","description":"Updated description"}' http://localhost:3000/api/updaterubric/f330ccdf-86d4-4f9b-97f2-9e2092a919ac

