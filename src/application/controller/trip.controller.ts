import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, HttpStatus, UploadedFile, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { LoggingInterceptor } from "@application/interceptors/logging.interceptor";
import { ResponseHandler } from "@application/interfaces/response";
import { Context, LoggerService } from "@domain/services/logger.service";
import { TripService } from "@domain/services/Trip.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTripDto } from "@application/dto/trip.dto";

@Controller('trips')
@UseInterceptors(LoggingInterceptor)
export class TripController {
    private Log: LoggerService = new LoggerService('TripController');
    
    constructor(
        private readonly tripService: TripService,
        private readonly responseHandler: ResponseHandler
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, cb) => {
            if (!file || !file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    async createTrip(
        @Body() tripData: CreateTripDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const context: Context = {
            module: 'TripController',
            method: 'createTrip'
        };
        this.Log.logger('Creating trip with image', context);
        
        const createdTrip = await this.tripService.createTripWithImage(tripData, file);
        
        this.Log.logger('Trip created successfully with image', context);
        return ResponseHandler.success(
            createdTrip, 
            'Trip created successfully with image', 
            'success', 
            HttpStatus.CREATED
        );
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    }))
    async uploadTripImage(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        
        const context: Context = {
            module: 'TripController',
            method: 'uploadTripImage'
        };
        
        this.Log.logger(`Updating image for trip ID: ${id}`, context);
        const result = await this.tripService.uploadImage(id, file);
        this.Log.logger('Image updated successfully', context);
        
        return ResponseHandler.success(result, 'Image updated successfully', 'success', HttpStatus.OK);
    }

    @Get()
    async findAllTrips() {
        const context: Context = {
            module: 'TripController',
            method: 'findAllTrips'
        };
        this.Log.logger('Finding all trips', context);
        const trips = await this.tripService.findAllTrips();
        this.Log.logger('Trips found successfully', context);
        return ResponseHandler.success(trips, 'Trips found successfully', 'success', HttpStatus.OK);
    }

    @Get(':id')
    async findOneTrip(@Param('id') id: string) {
        const context: Context = {
            module: 'TripController',
            method: 'findOneTrip'
        };
        this.Log.logger(`Finding trip with ID: ${id}`, context);
        const trip = await this.tripService.findOneTrip(id);
        this.Log.logger('Trip found successfully', context);
        return ResponseHandler.success(trip, 'Trip found successfully', 'success', HttpStatus.OK);
    }

    @Delete(':id')
    async deleteTrip(@Param('id') id: string) {
        const context: Context = {
            module: 'TripController',
            method: 'deleteTrip'
        };
        this.Log.logger(`Deleting trip with ID: ${id}`, context);
        const trip = await this.tripService.deleteTrip(id);
        this.Log.logger('Trip deleted successfully', context);
        return ResponseHandler.success(trip, 'Trip deleted successfully', 'success', HttpStatus.OK);
    }
}