import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

// Check if variables exist
console.log('Checking environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Present' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Present' : '❌ Missing');
console.log('API Secret present:', process.env.CLOUDINARY_API_SECRET ? '✅ Yes' : '❌ No');

// Show first few characters of secret for verification (not full for security)
if (process.env.CLOUDINARY_API_SECRET) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  console.log('API Secret starts with:', secret.substring(0, 4) + '...');
  console.log('API Secret length:', secret.length, 'characters');
}

// Configure Cloudinary
console.log('\nConfiguring Cloudinary...');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test the connection with better error handling
console.log('\nTesting Cloudinary connection...');

cloudinary.api.ping()
  .then(result => {
    console.log('✅ SUCCESS! Cloudinary connection verified');
    console.log('Status:', result.status);
    
    // Optional: Try to list a resource
    return cloudinary.api.resources({ 
      type: 'upload',
      max_results: 1 
    });
  })
  .then(result => {
    console.log('✅ Can access resources');
    console.log('Total resources:', result.total_count);
    
    // If you want to test upload
    console.log('\nTesting upload (using demo image)...');
    return cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'test-uploads' }
    );
  })
  .then(uploadResult => {
    console.log('✅ Upload test successful!');
    console.log('Image URL:', uploadResult.secure_url);
    
    // Clean up
    return cloudinary.uploader.destroy(uploadResult.public_id);
  })
  .then(destroyResult => {
    console.log('✅ Test image cleaned up');
    console.log('\n🎉 All tests passed! Your Cloudinary credentials are correct.');
  })
  .catch(error => {
    console.error('\n❌ ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message || 'No message');
    console.error('Error code:', error.http_code);
    console.error('Full error:', error);
    
    // More specific troubleshooting
    console.log('\n🔍 TROUBLESHOOTING:');
    
    if (error.http_code === 401) {
      console.log('👉 Issue: Invalid API Key or Secret');
      console.log('👉 Solution:');
      console.log('   1. Go to Cloudinary Dashboard');
      console.log('   2. Copy API Key and Secret AGAIN');
      console.log('   3. Check for extra spaces or characters');
      console.log('   4. Update .env file and restart');
    } else if (error.message && error.message.includes('Invalid cloud_name')) {
      console.log('👉 Issue: Invalid Cloud Name');
      console.log('👉 Check your CLOUDINARY_CLOUD_NAME in .env');
    } else if (error.name === 'TypeError' && error.message.includes('Cannot read')) {
      console.log('👉 Issue: Configuration not loaded properly');
      console.log('👉 Check: require(\'dotenv\').config() is at the top');
    }
    
    // Show what values we have
    console.log('\n📋 YOUR CURRENT VALUES:');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('API Secret length:', process.env.CLOUDINARY_API_SECRET?.length || 0);
  });