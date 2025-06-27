import { IsString, IsInt, IsOptional, IsUUID, IsArray, IsNotEmpty, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// For retrieving trips (includes ID)
export class TripDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsString()
  duration: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  season: string;
  
  // Add the missing field
  itinaries: any;

  @IsString()
  @IsOptional()
  imageUrl?: string;
  
  @IsString()
  @IsOptional()
  imagePublicId?: string;

  @IsUUID()
  @IsOptional()
  creatorId?: string;

  @IsBoolean()
  @IsOptional()
  isAgencyTrip?: boolean;
}

// For creating new trips (excludes ID)
export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // If already an array, return it
    if (Array.isArray(value)) {
      return value;
    }
    
    // If it's a string that looks like JSON array
    if (typeof value === 'string') {
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          // If parsing fails, try comma-separated approach
        }
      }
      
      // Handle comma-separated string
      return value.split(',').map(item => item.trim());
    }
    
    // Return empty array as fallback
    return [];
  })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  season: string;
  
  // Add the missing field
  @Transform(({ value }) => {
    // If already a valid object, return it
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    
    // If it's a string that looks like JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return a default object
        return { default: "No itinerary details provided" };
      }
    }
    
    // Return default object as fallback
    return { default: "No itinerary details provided" };
  })
  itinaries: any;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

// For updating existing trips (excludes ID)
export class UpdateTripDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    // If already an array, return it
    if (Array.isArray(value)) {
      return value;
    }
    
    // If it's a string that looks like JSON array
    if (typeof value === 'string') {
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          return JSON.parse(value);
        } catch (e) {
          // If parsing fails, use comma-separated approach
        }
      }
      
      // Handle comma-separated string
      return value.split(',').map(item => item.trim());
    }
    
    // Return empty array as fallback
    return [];
  })
  tags?: string[];

  @IsString()
  @IsOptional()
  season?: string;
  
  @IsOptional()
  @Transform(({ value }) => {
    // If already a valid object, return it
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    
    // If it's a string that looks like JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return a default object
        return { default: "No itinerary details provided" };
      }
    }
    
    // Return default object as fallback
    return { default: "No itinerary details provided" };
  })
  itinaries?: any;

  @IsString()
  @IsOptional()
  shareableLink?: string;
}








//tb3 mn hna type jdid

// // src/trip/dto/trip.dto.ts
// import { IsString, IsInt, IsOptional, IsUUID, IsArray, IsNotEmpty, Min, IsBoolean, IsEnum } from 'class-validator';
// import { Type, Transform } from 'class-transformer';
// import { UserDto } from '../../user/dto/user.dto'; // Assuming user DTO path
// import { DestinationDto } from '../../destination/dto/destination.dto'; // Assuming destination DTO path

// // Define a simple enum for trip types
// export enum TripType {
//   NORMAL = 'normal',
//   CUSTOM = 'custom',
// }

// // Interface for the itinerary data from ReactFlow
// export interface ItineraryData {
//   nodes: any[]; // Define a more specific type if needed, but 'any[]' is fine for JSON
//   edges: any[];
// }

// export class TripDto {
//   @IsUUID()
//   id: string;

//   @IsString()
//   name: string; // Corresponds to 'title' in frontend mapVoyages

//   @IsString()
//   description: string;

//   @IsNumber() // Frontend price is number, so this matches.
//   price: number; // Changed from IsInt to IsNumber

//   @IsString()
//   duration: string;

//   @IsArray()
//   @IsString({ each: true })
//   tags: string[];

//   @IsString()
//   season: string;

//   @IsString()
//   @IsOptional()
//   imageUrl?: string;

//   @IsString()
//   @IsOptional()
//   imagePublicId?: string;

//   @IsUUID()
//   @IsOptional()
//   creatorId?: string; // Corresponds to 'author' or 'createdBy'

//   @Type(() => UserDto) // Include creator details if needed
//   @IsOptional()
//   creator?: UserDto;

//   @IsBoolean()
//   @IsOptional()
//   isAgencyTrip?: boolean; // For normal trips

//   // --- New fields for Custom Voyages ---
//   @IsEnum(TripType)
//   @IsOptional()
//   type?: TripType; // "normal" or "custom"

//   @IsString()
//   @IsOptional()
//   workflowLink?: string;

//   @IsBoolean()
//   @IsOptional()
//   isPrivate?: boolean;

//   @IsOptional()
//   customData?: any; // For flexible JSON data like { flexibility: "high", themes: ["culture", "food"] }

//   // Use 'any' or a more specific interface for complex JSON from ReactFlow
//   @IsOptional()
//   itineraryJson?: ItineraryData; // The actual nodes and edges data

//   @IsUUID()
//   @IsOptional()
//   destinationId?: string;

//   @Type(() => DestinationDto) // Nested destination DTO
//   @IsOptional()
//   destination?: DestinationDto;
// }

// export class CreateTripDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   description: string;

//   @IsNumber() // Changed from IsInt to IsNumber
//   @Min(0)
//   @Type(() => Number)
//   price: number;

//   @IsString()
//   @IsNotEmpty()
//   duration: string;

//   @IsArray()
//   @IsString({ each: true })
//   @Transform(({ value }) => {
//     if (Array.isArray(value)) return value;
//     if (typeof value === 'string') {
//       try {
//         return JSON.parse(value);
//       } catch (e) {
//         return value.split(',').map(item => item.trim());
//       }
//     }
//     return [];
//   })
//   tags: string[];

//   @IsString()
//   @IsNotEmpty()
//   season: string;

//   @IsString()
//   @IsOptional()
//   imageUrl?: string;

//   @IsUUID()
//   @IsOptional()
//   creatorId?: string; // User ID of the creator

//   @IsBoolean()
//   @IsOptional()
//   isAgencyTrip?: boolean = true; // Default to true for normal trips

//   // --- Fields for Custom Voyages (optional here as they might be set by a specific custom trip endpoint) ---
//   @IsEnum(TripType)
//   @IsOptional()
//   type?: TripType = TripType.NORMAL; // Default to normal for this DTO

//   @IsString()
//   @IsOptional()
//   workflowLink?: string;

//   @IsBoolean()
//   @IsOptional()
//   isPrivate?: boolean;

//   @IsOptional()
//   customData?: any;

//   @IsOptional()
//   itineraryJson?: ItineraryData; // The actual nodes and edges data

//   @IsUUID()
//   @IsOptional()
//   destinationId?: string;
// }

// export class UpdateTripDto {
//   @IsString()
//   @IsOptional()
//   name?: string;

//   @IsString()
//   @IsOptional()
//   description?: string;

//   @IsNumber() // Changed from IsInt to IsNumber
//   @Min(0)
//   @IsOptional()
//   @Type(() => Number)
//   price?: number;

//   @IsString()
//   @IsOptional()
//   duration?: string;

//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (Array.isArray(value)) return value;
//     if (typeof value === 'string') {
//       try {
//         return JSON.parse(value);
//       } catch (e) {
//         return value.split(',').map(item => item.trim());
//       }
//     }
//     return [];
//   })
//   tags?: string[];

//   @IsString()
//   @IsOptional()
//   season?: string;

//   @IsOptional()
//   @IsString() // If imageUrl is part of update
//   imageUrl?: string;

//   @IsOptional()
//   @IsUUID()
//   creatorId?: string;

//   @IsOptional()
//   @IsBoolean()
//   isAgencyTrip?: boolean;

//   // --- Fields for Custom Voyages (optional in update) ---
//   @IsEnum(TripType)
//   @IsOptional()
//   type?: TripType;

//   @IsString()
//   @IsOptional()
//   workflowLink?: string;

//   @IsBoolean()
//   @IsOptional()
//   isPrivate?: boolean;

//   @IsOptional()
//   customData?: any;

//   @IsOptional()
//   itineraryJson?: ItineraryData; // The actual nodes and edges data

//   @IsUUID()
//   @IsOptional()
//   destinationId?: string;
// }