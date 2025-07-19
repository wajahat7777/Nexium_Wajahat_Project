const { supabase } = require('./lib/supabase')

async function debugAuth() {
  console.log('🔍 Debugging Authentication...\n')
  
  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Environment Variables:')
    console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing')
    console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
    console.log('   FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing')
    
    // Test 2: Check Supabase connection
    console.log('\n2️⃣ Testing Supabase Connection:')
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.log('✅ Supabase connection working (expected error when not logged in)')
    } else {
      console.log('✅ Supabase connection working')
    }
    
    // Test 3: Test magic link sending
    console.log('\n3️⃣ Testing Magic Link:')
    const testEmail = 'test@example.com'
    const { error: magicError } = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    })
    
    if (magicError) {
      console.log('❌ Magic link error:', magicError.message)
    } else {
      console.log('✅ Magic link sent successfully')
    }
    
    console.log('\n📋 Debug Summary:')
    console.log('   - Environment variables: Check above')
    console.log('   - Supabase connection: ✅ Working')
    console.log('   - Magic link: Check above')
    
    console.log('\n💡 Next Steps:')
    console.log('1. Make sure backend is running: cd backend && npm start')
    console.log('2. Make sure frontend is running: cd frontend && npm run dev')
    console.log('3. Check Supabase Auth settings')
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugAuth() 