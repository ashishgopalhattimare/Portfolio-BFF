const http = require('http');
const app = require('./backend/app');

// local setup
function configurePort() {
    return process.env.PORT || 3000;
}
const port = configurePort();

// Configure app.js
app.set('port', port);

// Start server
const server = http.createServer(app);
server.listen(port, () => console.log('Server is running'));