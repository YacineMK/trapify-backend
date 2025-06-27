import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { TripRepository } from "@infrastructure/repository/TripRepository";
import { Trip } from "@prisma/client"; // Remove TripStatus from here
import { CloudinaryService } from "@infrastructure/cloudinary/cloudinary.service";
import { CreateTripDto, UpdateTripDto, TripStatus } from "@application/dto/trip.dto"; // Import TripStatus from dto
import { UserRoles } from "@prisma/client";

@Injectable()
export class TripService {
    constructor(
        private readonly tripRepository: TripRepository,
        private readonly cloudinaryService: CloudinaryService
    ) {}
    
    // Update the createTrip method
    async createTrip(tripData: CreateTripDto, userId: string, isAdmin: boolean): Promise<Trip> {
        // Parse price from string to number if needed
        if (typeof tripData.price === 'string') {
            tripData.price = parseInt(tripData.price, 10);
        }
        
        // Parse tags from string to array if needed
        if (typeof tripData.tags === 'string') {
            try {
                // Handle case when tags is a JSON string
                const tagsStr = tripData.tags as string;
                if (tagsStr.startsWith('[') && tagsStr.endsWith(']')) {
                    tripData.tags = JSON.parse(tagsStr);
                } 
                // Handle case when tags is a comma-separated string
                else {
                    tripData.tags = (tripData.tags as string).split(',').map(tag => tag.trim());
                }
            } catch (error) {
                // If parsing fails, convert to array with single item
                tripData.tags = [tripData.tags as unknown as string];
            }
        }
        
        // Add creator information and status based on role
        const tripWithCreator = {
            ...tripData,
            creatorId: userId,
            isAgencyTrip: isAdmin,
            status: isAdmin ? TripStatus.APPROVED : TripStatus.PENDING
        };
        
        return await this.tripRepository.excuteCreate(tripWithCreator);
    }
    
    // Also update the createTripWithImage method
    async createTripWithImage(tripData: CreateTripDto, userId: string, isAdmin: boolean, file?: Express.Multer.File): Promise<Trip> {
        // Parse price from string to number if needed
        if (typeof tripData.price === 'string') {
            tripData.price = parseInt(tripData.price, 10);
        }
        
        // Parse tags from string to array if needed
        if (typeof tripData.tags === 'string') {
            try {
                const tagsStr = tripData.tags as string;
                // Handle case when tags is a JSON string
                if (tagsStr.startsWith('[') && tagsStr.endsWith(']')) {
                    tripData.tags = JSON.parse(tagsStr);
                } 
                // Handle case when tags is a comma-separated string
                else {
                    tripData.tags = tagsStr.split(',').map(tag => tag.trim());
                }
            } catch (error) {
                // If parsing fails, convert to array with single item
                tripData.tags = [tripData.tags as unknown as string];
            }
        }
        
        // Ensure itineraryJson is a valid JSON object
        if (!tripData.itineraryJson) {
            tripData.itineraryJson = { nodes: [], edges: [] };
        }
        
        // Handle case where itineraryJson might be a string
        if (typeof tripData.itineraryJson === 'string') {
            try {
                tripData.itineraryJson = JSON.parse(tripData.itineraryJson as string);
            } catch (e) {
                tripData.itineraryJson = { nodes: [], edges: [] };
            }
        }
        
        // Add creator information and status based on role
        const tripWithCreator = {
            ...tripData,
            creatorId: userId,
            isAgencyTrip: isAdmin,
            status: isAdmin ? TripStatus.APPROVED : TripStatus.PENDING
        };
        
        // First create the trip
        const trip = await this.tripRepository.excuteCreate(tripWithCreator);
        
        // If there's an image file, upload it and update the trip
        if (file) {
            // Upload image to Cloudinary
            const result = await this.cloudinaryService.uploadImage(file, 'trips');
            
            // Update trip with image URL
            return this.tripRepository.excuteUpdateImage(trip.id, {
                imageUrl: result.secure_url,
                imagePublicId: result.public_id
            });
        }
        
        // Return the trip without image
        return trip;
    }
    
    async uploadImage(id: string, file: Express.Multer.File): Promise<Trip> {
        // First check if trip exists
        const trip = await this.tripRepository.excuteFindOne(id);
        if (!trip) {
            throw new NotFoundException(`Trip with ID ${id} not found`);
        }
        
        // Upload image to Cloudinary
        const result = await this.cloudinaryService.uploadImage(file, 'trips');
        
        // Update trip with image URL
        return this.tripRepository.excuteUpdateImage(id, {
            imageUrl: result.secure_url,
            // You might want to store the public_id for deletion later
            imagePublicId: result.public_id
        });
    }
    
    async findAllTrips(userRole?: UserRoles): Promise<Trip[]> {
        // If admin, show all trips
        if (userRole === UserRoles.Admin) {
            return await this.tripRepository.excuteFind();
        }
        
        // For regular users, only show approved trips
        return await this.tripRepository.findApprovedTrips();
    }
    
    async findOneTrip(id: string): Promise<Trip> {
        const trip = await this.tripRepository.excuteFindOne(id);
        if (!trip) {
            throw new NotFoundException(`Trip with ID ${id} not found`);
        }
        return trip;
    }
    
    async deleteTrip(id: string): Promise<Trip> {
        const trip = await this.tripRepository.excuteFindOne(id);
        if (!trip) {
            throw new NotFoundException(`Trip with ID ${id} not found`);
        }
        
        // If trip has an image, delete it from Cloudinary
        if (trip.imagePublicId) {
            await this.cloudinaryService.deleteImage(trip.imagePublicId);
        }
        
        return await this.tripRepository.excuteDelete(id);
    }
    
    async updateTrip(id: string, tripData: UpdateTripDto, userId: string, isAdmin: boolean): Promise<Trip> {
        // First check if trip exists
        const trip = await this.findOneTrip(id);
        
        // Check if user is the creator or an admin
        if (trip.creatorId !== userId && !isAdmin) {
            throw new ForbiddenException('You do not have permission to update this trip');
        }
        
        // Process price if provided
        if (tripData.price !== undefined && typeof tripData.price === 'string') {
            tripData.price = parseInt(tripData.price, 10);
        }
        
        // Process tags if provided
        if (tripData.tags) {
            if (typeof tripData.tags === 'string') {
                try {
                    const tagsStr = tripData.tags as string;
                    if (tagsStr.startsWith('[') && tagsStr.endsWith(']')) {
                        tripData.tags = JSON.parse(tagsStr);
                    } else {
                        tripData.tags = tagsStr.split(',').map(tag => tag.trim());
                    }
                } catch (error) {
                    tripData.tags = [tripData.tags as unknown as string];
                }
            }
        }
        
        // Process itinaries if provided
        if (tripData.itineraryJson) {
            if (typeof tripData.itineraryJson === 'string') {
                try {
                    tripData.itineraryJson = JSON.parse(tripData.itineraryJson as string);
                } catch (e) {
                    tripData.itineraryJson = { nodes: [], edges: [] };
                }
            }
        }
        
        // Update the trip
        return this.tripRepository.excuteUpdate(id, tripData);
    }

    // Add this method to TripService
    async findTripsByStatus(status: TripStatus): Promise<Trip[]> {
        return this.tripRepository.findByStatus(status);
    }

    // Add this method to your TripService class

    async updateTripStatus(id: string, status: TripStatus, userId: string): Promise<Trip> {
        // First check if trip exists
        const trip = await this.findOneTrip(id);
        
        // Check if user is an admin
        if (userId) {
            // You might want to add user verification here
            // This could involve a user repository lookup to confirm admin status
            // For now, we'll assume the @Roles decorator handles this at controller level
        }
        
        // Update the trip status
        return this.tripRepository.excuteUpdate(id, { status });
    }
}