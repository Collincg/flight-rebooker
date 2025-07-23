const validateUserId = (req, res, next) => {
  const userId = req.query.userId || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  if (typeof userId !== 'string' || userId.length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Invalid user ID format'
    });
  }

  next();
};

const validateFlightId = (req, res, next) => {
  const flightId = req.body.newFlightId || req.params.flightId;
  
  if (!flightId) {
    return res.status(400).json({
      success: false,
      error: 'Flight ID is required'
    });
  }

  if (typeof flightId !== 'string' || flightId.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Invalid flight ID format'
    });
  }

  next();
};

const validateFlightFilters = (req, res, next) => {
  const { origin, destination, departureTime, airline, layovers } = req.query;
  
  if (layovers && (isNaN(layovers) || layovers < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Layovers must be a non-negative number'
    });
  }

  if (departureTime && isNaN(Date.parse(departureTime))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid departure time format'
    });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  next();
};

module.exports = {
  validateUserId,
  validateFlightId,
  validateFlightFilters,
  sanitizeInput
};