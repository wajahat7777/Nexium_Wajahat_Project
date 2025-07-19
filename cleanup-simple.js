const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up for simple authentication...\n');

// Remove unnecessary auth pages
const filesToRemove = [
  'frontend/pages/auth/signup.js',
  'frontend/pages/auth/proper-callback.js',
  'frontend/pages/auth/proper-login.js',
  'frontend/pages/auth/simple-login.js',
  'frontend/pages/test-auth.js',
  'frontend/pages/auth/callback.js',
  'cleanup-project.js'
];

filesToRemove.forEach(file => {
  const filePath = path.join('.', file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${file}`);
    } catch (error) {
      console.log(`❌ Failed to remove: ${file}`);
    }
  }
});

console.log('\n✅ Cleanup completed!');
console.log('\n📋 Simple flow:');
console.log('   1. User goes to /signin');
console.log('   2. Enters email and gets magic link');
console.log('   3. Clicks link and goes to /profile');
console.log('   4. Can use daily log from profile page'); 