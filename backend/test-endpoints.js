// Test the actual login endpoint
const axios = require('axios');
const RECAPTCHA_SECRET = '6LfCHD8sAAAAADPmuglFefkpLns2iR8uj5p6ar4q';

async function testLoginEndpoint() {
  console.log('🧪 Testing User Login Endpoint\n');

  try {
    // Test 1: Without CAPTCHA token
    console.log('Test 1: Login WITHOUT CAPTCHA token');
    console.log('─'.repeat(50));
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: 'testuser@gmail.com',
        password: 'testuser123',
        captchaToken: ''
      }, { validateStatus: () => true });
      
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(res.data, null, 2));
      console.log('Expected: 400 error - "Please complete CAPTCHA"\n');
    } catch (err) {
      console.log('Error:', err.message);
    }

    // Test 2: With invalid CAPTCHA token
    console.log('Test 2: Login WITH INVALID CAPTCHA token');
    console.log('─'.repeat(50));
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: 'testuser@gmail.com',
        password: 'testuser123',
        captchaToken: 'invalid_token_12345'
      }, { validateStatus: () => true });
      
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(res.data, null, 2));
      console.log('Expected: 400 error - "CAPTCHA verification failed"\n');
    } catch (err) {
      console.log('Error:', err.message);
    }

    // Test 3: Without email
    console.log('Test 3: Login WITH CAPTCHA but NO EMAIL');
    console.log('─'.repeat(50));
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: '',
        password: 'testuser123',
        captchaToken: 'some_token'
      }, { validateStatus: () => true });
      
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(res.data, null, 2));
      console.log('Expected: 400 error\n');
    } catch (err) {
      console.log('Error:', err.message);
    }

    // Test 4: Non-existent user
    console.log('Test 4: Login NON-EXISTENT USER (should try user after admin fails)');
    console.log('─'.repeat(50));
    console.log('Note: This will fail CAPTCHA so will show CAPTCHA error first');
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: 'nonexistent@gmail.com',
        password: 'anypassword',
        captchaToken: 'invalid'
      }, { validateStatus: () => true });
      
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(res.data, null, 2));
      console.log('');
    } catch (err) {
      console.log('Error:', err.message);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }

  process.exit(0);
}

testLoginEndpoint();
