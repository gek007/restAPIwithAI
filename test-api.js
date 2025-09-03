// Simple test script for the API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    console.log('🧪 Testing API...\n');

    // Test 1: Welcome endpoint
    console.log('1. Testing welcome endpoint...');
    const welcomeResponse = await fetch(`${BASE_URL}/`);
    const welcomeData = await welcomeResponse.json();
    console.log('✅ Welcome response:', welcomeData);
    console.log('');

    // Test 2: Signup
    console.log('2. Testing user signup...');
    const signupResponse = await fetch(`${BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const signupData = await signupResponse.json();
    console.log('✅ Signup response:', signupData);
    console.log('');

    // Test 3: Login
    console.log('3. Testing user login...');
    const loginResponse = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    console.log('');

    // Test 4: Get all users
    console.log('4. Testing get all users...');
    const usersResponse = await fetch(`${BASE_URL}/users`);
    const usersData = await usersResponse.json();
    console.log('✅ Users response:', usersData);
    console.log('');

    // Test 5: Get user by ID
    if (signupData.user && signupData.user.id) {
      console.log('5. Testing get user by ID...');
      const userResponse = await fetch(`${BASE_URL}/users/${signupData.user.id}`);
      const userData = await userResponse.json();
      console.log('✅ User by ID response:', userData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
