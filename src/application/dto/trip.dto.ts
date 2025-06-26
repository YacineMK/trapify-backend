import { IsString, IsInt, IsOptional, IsUUID, IsArray, IsNotEmpty, Min } from 'class-validator';

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

  @IsString()
  @IsOptional()
  imageUrl?: string;
  
  @IsString()
  @IsOptional()
  imagePublicId?: string;
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
  price: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  season: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}