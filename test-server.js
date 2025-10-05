import express from 'express';
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.get('/healthz', (req, res) => {
  res.json({ ok: true, message: 'Health check passed' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
