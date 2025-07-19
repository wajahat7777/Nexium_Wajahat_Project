const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up project files...\n');

// Files to remove from root directory
const rootFilesToRemove = [
  'QUICK_FIX_AUTHENTICATION.md',
  'INTEGRATION_GUIDE.md',
  'start-and-test.js'
];

// Files to remove from backend directory
const backendFilesToRemove = [
  // Markdown files
  'FIX_AUTHENTICATION_FINAL.md',
  'DEBUG_AUTHENTICATION.md',
  'FIX_MAGIC_LINK.md',
  'FIX_AUTHENTICATION.md',
  'DEBUG_GUIDE.md',
  'configure-supabase-callback.md',
  'README.md',
  
  // Test files
  'test-configuration.js',
  'test-database-access.js',
  'test-magic-link-flow.js',
  'debug-callback.js',
  'configure-supabase-auth.js',
  'debug-auth-issue.js',
  'test-backend-simple.js',
  'test-auth-complete.js',
  'test-backend-health.js',
  'test-supabase-config.js',
  'test-backend.js',
  'test-magic-link.js',
  'test-database.js',
  'test-complete.js',
  'test-signup.js',
  'test-health.js',
  'test-supabase.js',
  'apply-schema.js',
  'setup-database.js',
  
  // Example config
  'config.env.example'
];

// Function to remove files
function removeFiles(fileList, directory) {
  console.log(`📁 Cleaning ${directory} directory...`);
  
  fileList.forEach(file => {
    const filePath = path.join(directory, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`   ✅ Removed: ${file}`);
      } catch (error) {
        console.log(`   ❌ Failed to remove: ${file} - ${error.message}`);
      }
    } else {
      console.log(`   ⚠️  File not found: ${file}`);
    }
  });
}

// Remove files from root directory
removeFiles(rootFilesToRemove, '.');

// Remove files from backend directory
removeFiles(backendFilesToRemove, './backend');

console.log('\n✅ Cleanup completed!');
console.log('\n📋 Remaining essential files:');
console.log('   - backend/server.js');
console.log('   - backend/routes/');
console.log('   - backend/middleware/');
console.log('   - backend/lib/');
console.log('   - backend/config.env');
console.log('   - backend/supabase-schema.sql');
console.log('   - frontend/');
console.log('   - README.md');

console.log('\n🚀 You can now run:');
console.log('   cd backend && npm start');
console.log('   cd frontend && npm run dev'); 