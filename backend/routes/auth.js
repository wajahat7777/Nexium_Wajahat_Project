const express = require('express')
const { supabase, supabaseAdmin } = require('../lib/supabase')
const router = express.Router()

// Health check
router.get('/health', async (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

// Send magic link
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    console.log('Sending magic link for:', email)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    })

    if (error) {
      console.error('Magic link error:', error)
      return res.status(400).json({ error: error.message })
    }

    console.log('Magic link sent successfully')
    res.json({ message: 'Magic link sent to your email' })
  } catch (error) {
    console.error('Magic link error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Handle callback
router.get('/callback', async (req, res) => {
  try {
    console.log('Callback received:', req.query)
    
    const { access_token, refresh_token, error: urlError } = req.query

    if (urlError) {
      console.error('Callback error:', urlError)
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=${urlError}`)
      return
    }

    if (access_token) {
      try {
        // Get user info from token
        const { data: { user }, error: userError } = await supabase.auth.getUser(access_token)
        
        if (userError) {
          console.error('Token validation error:', userError)
          res.redirect(`${process.env.FRONTEND_URL}/signin?error=invalid_token`)
          return
        }

        console.log('User authenticated:', user.id, user.email)
        
        // Create or update user profile in the database
        try {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          } else {
            console.log('Profile created/updated successfully for user:', user.id)
          }
        } catch (profileError) {
          console.error('Profile handling error:', profileError)
        }

        // Redirect to profile with tokens
        const params = new URLSearchParams({
          token: access_token,
          refresh: refresh_token || '',
          user_id: user.id
        })
        res.redirect(`${process.env.FRONTEND_URL}/profile?${params.toString()}`)
      } catch (error) {
        console.error('Token processing error:', error)
        res.redirect(`${process.env.FRONTEND_URL}/signin?error=token_processing_failed`)
      }
    } else {
      console.error('No access token received')
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=invalid_token`)
    }
  } catch (error) {
    console.error('Callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=callback_failed`)
  }
})

// Get user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    res.json({ 
      user,
      profile: profile || null
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router 