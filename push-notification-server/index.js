import express from 'express';
import webpush from 'web-push';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();
const port = process.env.PORT || 3000;
const subscriptions = [];

app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:8080'
}));
app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
  const ttl = Date.now() + 5 * 60 * 1000;
  subscriptions.push({ sub: req.body, ttl });
  res.status(201).send();
});

app.post('/notify', (req, res) => {
  const now = Date.now();
  for (let i = subscriptions.length - 1; i >= 0; i--) {
    if (subscriptions[i].ttl < now) {
      subscriptions.splice(i, 1);
    }
  }

  const payload = {
    notification: {
      title: 'Test notification'
    }
  };

  Promise.all(subscriptions.map(subscription => webpush.sendNotification(subscription.sub, JSON.stringify(payload))))
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.error('Error while sending push notifications:', err);
      res.sendStatus(500);
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at port: ${port}`);
});