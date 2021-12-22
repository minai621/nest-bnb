import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import * as config from 'config';

const apiConfig = config.get('apiKey');
@Injectable()
export class GeocodingService {
  constructor(private httpService: HttpService) {}
  async getLocation(query: any) {
    const latitude = query.latitude;
    const longitude = query.longitude;
    try {
      const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiConfig.key}`;
      const { data } = await axios.get(URL);
      const addressComponent = data.results[0].address_components;
      const { lat, lng } = data.results[0].geometry.location;
      const result = {
        latitude: lat,
        longitude: lng,
        country: addressComponent[4].long_name,
        city: addressComponent[3].long_name,
        district: addressComponent[2].long_name,
        streetAddress: `${addressComponent[1].long_name} ${addressComponent[0].long_name}`,
        postcode: addressComponent[5].long_name,
      };
      return result;
    } catch (e) {
      console.log(e + 'error');
    }
  }
}
