const express = require('express')
const { supabase, supabaseAdmin } = require('../lib/supabase')
const { authenticateToken } = require('../middleware/auth')
const router = express.Router()

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    console.log('Testing Supabase connection...')
    
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Supabase connection error:', error)
      return res.status(500).json({ 
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message
      })
    }
    
    console.log('Supabase connection successful')
    res.json({ 
      status: 'success',
      message: 'Supabase connection working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed',
      error: error.message
    })
  }
})

// Sign up with magic link
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', {
    method: req.method,
    url: req.url,
    body: req.body
  })
  
  try {
    const { email, first_name, last_name } = req.body

    if (!email) {
      console.log('Email missing in request')
      return res.status(400).json({ 
        error: 'Email is required',
        code: 'MISSING_EMAIL'
      })
    }

    console.log('Processing signup for email:', email)

    // Send magic link for authentication
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          first_name: first_name || '',
          last_name: last_name || ''
        },
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return res.status(400).json({ 
        error: error.message,
        code: 'SIGNUP_FAILED'
      })
    }

    console.log('Magic link sent successfully for:', email)
    res.status(201).json({ 
      message: 'Account created successfully! Please check your email for the magic link.',
      email: email
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ 
      error: 'Failed to create account. Please try again.',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Sign in with magic link
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    console.log('Sending magic link for email:', email)

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

    console.log('Magic link sent successfully for:', email)
    res.json({ message: 'Magic link sent to your email' })
  } catch (error) {
    console.error('Magic link error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Handle magic link callback
router.get('/callback', async (req, res) => {
  try {
    console.log('Callback received with query params:', req.query)
    
    const { access_token, refresh_token, type, error: urlError } = req.query

    if (urlError) {
      console.error('Callback error from URL:', urlError)
      res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=${urlError}`)
      return
    }

    if (type === 'recovery') {
      // Handle password reset
      console.log('Handling password reset callback')
      res.redirect(`${process.env.FRONTEND_URL}/auth/reset-password?token=${access_token}`)
    } else {
      // Handle sign in/sign up
      console.log('Handling sign in/sign up callback')
      if (access_token) {
        // Validate the token and get user info
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser(access_token)
          
          if (userError) {
            console.error('Token validation error:', userError)
            res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=invalid_token`)
            return
          }

          console.log('User authenticated:', user.id)
          
          // Create or update user profile
          try {
            const { error: profileError } = await supabaseAdmin
              .from('profiles')
              .upsert({
                id: user.id,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || '',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })

            if (profileError) {
              console.error('Profile creation error:', profileError)
            } else {
              console.log('Profile created/updated successfully')
            }
          } catch (profileError) {
            console.error('Profile handling error:', profileError)
          }

          // Redirect to frontend with tokens
          const params = new URLSearchParams({
            token: access_token,
            refresh: refresh_token || '',
            user_id: user.id
          })
          res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${params.toString()}`)
        } catch (error) {
          console.error('Token processing error:', error)
          res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=token_processing_failed`)
        }
      } else {
        console.error('No access token received in callback')
        res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=invalid_token`)
      }
    }
  } catch (error) {
    console.error('Callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/auth/signin?error=callback_failed`)
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
    }

    res.json({ 
      user: req.user,
      profile: profile || null
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign out
router.post('/signout', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Signout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({ 
      message: 'Token refreshed successfully',
      session: data.session
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router 