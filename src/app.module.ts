import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './auth/config/typeorm.config';
import { GeocodingModule } from './geocoding/geocoding.module';
@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), AuthModule, GeocodingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
