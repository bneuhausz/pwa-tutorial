import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();
const port = 3000;
let subscription;

app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
  subscription = req.body;
  res.status(201).send();
});

app.post('/notify', (req, res) => {
  const payload = {
    notification: {
      title: 'Notification title',
      body: 'Notification message'
    }
  };

  webpush.sendNotification(subscription, JSON.stringify(payload))
    .then(() => res.status(204).send())
    .catch(err => {
      console.error('Error sending notification:', err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});