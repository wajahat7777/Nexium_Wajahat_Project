const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    console.log('API Client initialized with base URL:', this.baseURL)
  }

  // Helper method to get auth token
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  // Helper method to remove auth token
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = this.getAuthToken()
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const fullUrl = `${this.baseURL}${endpoint}`
    console.log('Making API request:', {
      url: fullUrl,
      method: options.method || 'GET',
      body: options.body,
      headers: config.headers
    })

    try {
      const response = await fetch(fullUrl, config)
      
      console.log('API response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error response:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API success response:', data)
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async signup(email, password = null, first_name = '', last_name = '') {
    console.log('Signup called with:', { email, password: password ? '***' : null, first_name, last_name })
    
    const body = password 
      ? { email, password, first_name, last_name }
      : { email, first_name, last_name }
    
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async signin(email, password) {
    const response = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.session?.access_token) {
      this.setAuthToken(response.session.access_token)
    }
    
    return response
  }

  async checkUserExists(email) {
    return this.request('/auth/check-user', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async sendMagicLink(email) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async signout() {
    try {
      await this.request('/auth/signout', {
        method: 'POST',
      })
    } finally {
      this.removeAuthToken()
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async refreshToken(refreshToken) {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    
    if (response.session?.access_token) {
      this.setAuthToken(response.session.access_token)
    }
    
    return response
  }

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Daily logs endpoints
  async createDailyLog(logData) {
    return this.request('/daily-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    })
  }

  async getDailyLogs(limit = 50, page = 1) {
    const params = new URLSearchParams({ limit, page })
    return this.request(`/daily-logs?${params}`)
  }

  async getDailyLog(id) {
    return this.request(`/daily-logs/${id}`)
  }

  async updateDailyLog(id, updates) {
    return this.request(`/daily-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteDailyLog(id) {
    return this.request(`/daily-logs/${id}`, {
      method: 'DELETE',
    })
  }

  async getDailyLogsByDateRange(startDate, endDate) {
    return this.request(`/daily-logs/range/${startDate}/${endDate}`)
  }

  async getMoodStats(days = 30) {
    const params = new URLSearchParams({ days })
    return this.request(`/daily-logs/stats/mood?${params}`)
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profiles')
  }

  async createProfile(profileData) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    })
  }

  async updateProfile(updates) {
    return this.request('/profiles', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async updatePreferences(preferences) {
    return this.request('/profiles/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ preferences }),
    })
  }

  async getProfileStats() {
    return this.request('/profiles/stats')
  }

  // AI endpoints
  async getAISuggestion(mood, notes) {
    return this.request('/ai/suggestion', {
      method: 'POST',
      body: JSON.stringify({ mood, notes }),
    })
  }

  // New: Get AI suggestion from external service (n8n/Hugging Face)
  async getExternalAISuggestion(mood, notes) {
    return this.request('/ai/external-suggestion', {
      method: 'POST',
      body: JSON.stringify({ mood, notes }),
    })
  }

  // New: Send data to n8n webhook for processing
  async sendToN8nWebhook(data) {
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    
    if (!n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        auth_token: this.getAuthToken()
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send data to n8n webhook')
    }

    return response.json()
  }

  async getAIInsights(days = 30) {
    const params = new URLSearchParams({ days })
    return this.request(`/ai/insights?${params}`)
  }

  async getAITrends(period = 'week') {
    const params = new URLSearchParams({ period })
    return this.request(`/ai/trends?${params}`)
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }

  // New: Check if external AI service is available
  async checkExternalAIService() {
    try {
      const response = await fetch(`${this.baseURL}/ai/external-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` })
        },
        body: JSON.stringify({ mood: 'Good', notes: 'Test connection' })
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()

export default apiClient

// Export individual methods for convenience
export const {
  signup,
  signin,
  checkUserExists,
  sendMagicLink,
  signout,
  getCurrentUser,
  refreshToken,
  resetPassword,
  createDailyLog,
  getDailyLogs,
  getDailyLog,
  updateDailyLog,
  deleteDailyLog,
  getDailyLogsByDateRange,
  getMoodStats,
  getProfile,
  createProfile,
  updateProfile,
  updatePreferences,
  getProfileStats,
  getAISuggestion,
  getExternalAISuggestion,
  sendToN8nWebhook,
  getAIInsights,
  getAITrends,
  healthCheck,
  checkExternalAIService,
} = apiClient 