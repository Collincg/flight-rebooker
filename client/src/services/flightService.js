import axios from 'axios';
import { supabase } from '../config/supabase';

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

    this.api.interceptors.request.use(async (config) => {
      config.startTime = Date.now();
      
      // Add auth token for protected endpoints
      if (this._needsAuth(config.url)) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
      
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

  _needsAuth(url) {
    // Endpoints that require authentication
    const protectedEndpoints = ['/user-flight'];
    return protectedEndpoints.some(endpoint => url.includes(endpoint));
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

  async getUserFlight() {
    return this._makeRequestWithColdStartMessage(() => this.api.get('/user-flight'));
  }

  async getUserFlightStatus() {
    return this._makeRequestWithColdStartMessage(() => this.api.get('/user-flight/status'));
  }

  async getRebookingOptions() {
    const response = await this.api.get('/user-flight/rebooking-options');
    return response.data;
  }

  async bookFlight(flightId) {
    const response = await this.api.post('/user-flight/rebook', {
      newFlightId: flightId
    });
    return response.data;
  }

  async cancelFlight() {
    const response = await this.api.post('/user-flight/cancel', {});
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