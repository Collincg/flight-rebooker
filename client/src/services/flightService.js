import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class FlightService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/flights`,
      timeout: 90000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      config.startTime = Date.now();
      return config;
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
    return this._makeRequestWithColdStartMessage(() => this.api.get('/'));
  }

  async getFilteredFlights(filters) {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    
    return this._makeRequestWithColdStartMessage(() => this.api.get('/filter', { params }));
  }

  async getUserFlight(userId) {
    return this._makeRequestWithColdStartMessage(() => this.api.get('/user-flight', { params: { userId } }));
  }

  async getUserFlightStatus(userId) {
    return this._makeRequestWithColdStartMessage(() => this.api.get('/user-flight/status', { params: { userId } }));
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

  async _makeRequestWithColdStartMessage(requestFn) {
    let coldStartWarning = null;

    const coldStartTimeout = setTimeout(() => {
      if (window.showToast) {
        coldStartWarning = window.showToast('info', 'Waking up server... This may take up to 90 seconds on first load.');
      }
    }, 3000);

    try {
      const response = await requestFn();
      clearTimeout(coldStartTimeout);
      
      if (coldStartWarning && window.hideToast) {
        window.hideToast(coldStartWarning);
      }
      
      return response.data;
    } catch (error) {
      clearTimeout(coldStartTimeout);
      
      if (coldStartWarning && window.hideToast) {
        window.hideToast(coldStartWarning);
      }
      
      throw error;
    }
  }
}

export default new FlightService();