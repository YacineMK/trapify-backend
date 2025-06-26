import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { Trip } from "@prisma/client";
import { TripDto } from '@application/dto/trip.dto';

@Injectable()
export class TripRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}
    
    /**
     * Creates a new trip in the database
     */
    async excuteCreate(tripData: Omit<TripDto, 'id'>): Promise<Trip> {
        return this.prisma.trip.create({
            data: tripData,  // Add the missing data argument
        });
    }
    
    /**
     * Updates trip image url
     */
    async excuteUpdateImage(id: string, imageData: { imageUrl: string, imagePublicId?: string }): Promise<Trip> {
        return this.prisma.trip.update({
            where: { id },
            data: imageData,
        });
    }
    
    /**
     * Finds all trips in the database
     */
    async excuteFind(): Promise<Trip[]> {
        return this.prisma.trip.findMany();
    }
    
    /**
     * Finds a trip by its ID
     */
    async excuteFindOne(id: string): Promise<Trip | null> {
        return this.prisma.trip.findUnique({
            where: { id },
        });
    }
    
    /**
     * Deletes a trip by its ID
     */
    async excuteDelete(id: string): Promise<Trip> {
        return this.prisma.trip.delete({
            where: { id },
        });
    }
}