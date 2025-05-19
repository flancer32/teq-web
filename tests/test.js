
/**
 * Test script for the web server.
 */

import { createServer } from '../src/server.js';

const server = createServer();
server.listen(3001, () => {
    console.log('Test server listening on port 3001');
});
