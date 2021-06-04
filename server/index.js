const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const { Client } = require('pg');

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const client = new Client({
  user: 'stephane',
  host: 'localhost',
  database: 'tchat',
  password: 'croo2021',
  port: 5432,
});

client.connect();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('route get');
});

app.post('/', async (req, res) => {
  const findUser = await client.query(
    'SELECT id FROM "user" WHERE email = $1',
    [req.body.email]
  );

  let userId = findUser?.rows[0]?.id || null;

  console.log('userId', userId);
  if (findUser.rows.length === 0) {
    userId = await client.query(
      'INSERT INTO "user" (name, email) VALUES($1, $2) RETURNING id',
      [req.body.name, req.body.email]
    );

    await client.query(
      'INSERT INTO comment (user_comment, user_id) VALUES($1, $2)',
      [req.body.comment, userId.rows[0].id]
    );
  } else {
    await client.query(
      'INSERT INTO comment (user_comment, user_id) VALUES($1, $2)',
      [req.body.comment, userId]
    );
  };

  res.send({
    data: {
      userId: req.body.userId || userId,
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment
    }
  });

  io.emit("comment", {
    userId: req.body.userId || userId,
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment
  });
});

io.on('connection', () => {
  console.log('a user is connected');
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});