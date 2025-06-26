import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';
import { CloudinaryModule } from '@infrastructure/cloudinary/cloudinary.module';
import { UserController } from '@application/controller/user.controller';
import { TripController } from '@application/controller/trip.controller';
import { ReservationController } from '@application/controller/reservation.controller';
import { AuthController } from '@application/controller/auth.controller';
import { UserService } from '@domain/services/User.service';
import { TripService } from '@domain/services/Trip.service';
import { ReservationService } from '@domain/services/reservation.service';
import { AuthService } from '@domain/services/auth.service';
import { UserRepository } from '@infrastructure/repository/user.repository';
import { TripRepository } from '@infrastructure/repository/TripRepository';
import { ReservationRepository } from '@infrastructure/repository/Reservation';
import { ResponseHandler } from '@application/interfaces/response';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@application/guards/auth.guard';
import { RoleGuard } from '@application/guards/role.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CloudinaryModule,
  ],
  controllers: [
    UserController,
    TripController,
    ReservationController,
    AuthController
  ],
  providers: [
    UserService,
    TripService,
    ReservationService,
    AuthService,
    UserRepository,
    TripRepository,
    ReservationRepository,
    ResponseHandler,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
