const { supabase } = require('../config/supabase')

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No authorization token provided' 
      })
    }

    const token = authHeader.split(' ')[1]
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid or expired token' 
      })
    }

    req.user = user
    req.userId = user.id
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Authentication verification failed' 
    })
  }
}

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null
    req.userId = null
    return next()
  }

  try {
    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    req.user = error ? null : user
    req.userId = error ? null : user?.id
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    req.user = null
    req.userId = null
  }
  
  next()
}

module.exports = {
  verifyToken,
  optionalAuth
}