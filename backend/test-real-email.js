const { supabase } = require('./lib/supabase')

async function testRealEmail() {
  console.log('🧪 Testing with real email...\n')
  
  try {
    // Use a real email address
    const realEmail = 'wajahatcru@gmail.com' // Replace with your real email
    
    console.log('�� Testing magic link with:', realEmail)
    
    const { error } = await supabase.auth.signInWithOtp({
      email: realEmail,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    })
    
    if (error) {
      console.log('❌ Magic link error:', error.message)
      console.log('💡 Try using your actual email address')
    } else {
      console.log('✅ Magic link sent successfully!')
      console.log('📧 Check your email for the magic link')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testRealEmail() 