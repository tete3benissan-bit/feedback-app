const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database('feedback');
const container = database.container('messages');

app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>Feedback Client</title></head>
    <body>
      <h1>Soumettre un Feedback</h1>
      <form method="POST" action="/api/feedback">
        <input name="email" placeholder="Votre email" required /><br/><br/>
        <textarea name="message" placeholder="Votre message" required></textarea><br/><br/>
        <button type="submit">Envoyer</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/api/feedback', async (req, res) => {
  const { email, message } = req.body;
  const item = {
    id: Date.now().toString(),
    email,
    message,
    date: new Date().toISOString()
  };
  await container.items.create(item);
  res.send('<h2>Merci pour votre feedback !</h2>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
