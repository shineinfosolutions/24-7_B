import cloudinary from "./config/cloudinary.js";

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    
    // Test configuration
    console.log('📋 Current config:');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key ? '✅ Set' : '❌ Missing');
    console.log('API Secret:', cloudinary.config().api_secret ? '✅ Set' : '❌ Missing');
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
  }
}

testCloudinary();