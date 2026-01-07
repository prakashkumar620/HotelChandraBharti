#!/usr/bin/env node

const http = require('http');

function testLogin() {
  const postData = JSON.stringify({
    email: 'testuser@gmail.com',
    password: 'testuser123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/test-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`Status: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\nResponse:');
      try {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } catch (e) {
        console.log(data);
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem: ${e.message}`);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

console.log('🧪 Testing /test-login endpoint...\n');
testLogin();
