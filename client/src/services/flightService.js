import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class FlightService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/flights`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async getAllFlights() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getFilteredFlights(filters) {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    
    const response = await this.api.get('/filter', { params });
    return response.data;
  }

  async getUserFlight(userId) {
    const response = await this.api.get('/user-flight', { params: { userId } });
    return response.data;
  }

  async getUserFlightStatus(userId) {
    const response = await this.api.get('/user-flight/status', { params: { userId } });
    return response.data;
  }

  async getRebookingOptions(userId) {
    const response = await this.api.get('/user-flight/rebooking-options', { params: { userId } });
    return response.data;
  }

  async bookFlight(userId, flightId) {
    const response = await this.api.post('/user-flight/rebook', {
      userId,
      newFlightId: flightId
    });
    return response.data;
  }

  async cancelFlight(userId) {
    const response = await this.api.post('/user-flight/cancel', { userId });
    return response.data;
  }
}

export default new FlightService();