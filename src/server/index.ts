import { createServer, IncomingMessage, ServerResponse } from 'http';
import { inspect } from 'util';
import { handlers } from './handlers';
import { makeRouter } from './handlers/router';

const hostname = '127.0.0.1';
const port = 8080;

createServer(makeRouter(...handlers)).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});