import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
export class GeocodingController {
  constructor(private geoCodingService: GeocodingService) {}
  @Get('/location')
  getLocation(@Query() query: any) {
    return this.geoCodingService.getLocation(query);
  }
}
