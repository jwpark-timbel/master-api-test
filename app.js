'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  const start = process.hrtime.bigint();

  const payload = {
    status: 'ok',
    uptime: process.uptime(),
  };

  const end = process.hrtime.bigint();
  payload.response_time_ms = Number(end - start) / 1_000_000;

  res.json(payload);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
