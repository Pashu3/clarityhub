import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface GeolocationResult {
  city: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeolocationService {
  private cache = new Map<string, { result: GeolocationResult; timestamp: number }>();
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  async getLocationFromIp(ip: string): Promise<GeolocationResult | null> {
    // Return null for localhost and private IPs
    if (['127.0.0.1', '::1', 'localhost'].includes(ip) || 
        /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(ip)) {
      return {
        city: 'Local',
        country: 'Local',
        continent: 'Local',
        latitude: 0,
        longitude: 0,
      };
    }

    // Check cache first
    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    try {
      // Using ipapi.co service (free tier has limits)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      
      if (response.data.error) {
        return null;
      }
      
      const result: GeolocationResult = {
        city: response.data.city,
        country: response.data.country_name,
        continent: response.data.continent_code,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      };
      
      // Cache the result
      this.cache.set(ip, { result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Error getting geolocation data:', error.message);
      return null;
    }
  }

  formatLocation(location: GeolocationResult | null): string {
    if (!location) return 'Unknown';
    return `${location.city}, ${location.country}`;
  }
}