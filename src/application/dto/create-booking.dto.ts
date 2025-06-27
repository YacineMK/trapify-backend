// // src/booking/dto/create-booking.dto.ts

// import {
//     IsUUID,
//     IsNumber,
//     Min,
//     IsString,
//     IsEmail,
//     IsPhoneNumber,
//     IsNotEmpty,
//     ValidateNested,
//     IsOptional,
//     Matches,
//   } from 'class-validator';
//   import { Type } from 'class-transformer';
  
//   // --- Nested DTOs for Personal and Payment Info ---
  
//   export class PersonalInfo {
//     @IsString()
//     @IsNotEmpty()
//     firstName: string;
  
//     @IsString()
//     @IsNotEmpty()
//     lastName: string;
  
//     @IsEmail()
//     email: string;
  
//     @IsString() // Using IsString for phone numbers to allow various formats
//     @IsOptional() // Made optional based on your frontend's canProceed logic which only checks first name and email for step 1
//     // @IsPhoneNumber() // Uncomment if you want strict phone number validation (requires 'libphonenumber-js')
//     phone?: string;
//   }
  
//   export class PaymentInfo {
//     @IsString()
//     @IsNotEmpty()
//     // Basic validation for card number - more complex regex can be used for specific card types
//     @Matches(/^[0-9]{13,19}$/, { message: 'Card number must be 13-19 digits' })
//     cardNumber: string;
  
//     @IsString()
//     @IsNotEmpty()
//     // MM/YY format
//     @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Expiry date must be in MM/YY format' })
//     expiryDate: string;
  
//     @IsString()
//     @IsNotEmpty()
//     // CVV can be 3 or 4 digits
//     @Matches(/^[0-9]{3,4}$/, { message: 'CVV must be 3 or 4 digits' })
//     cvv: string;
  
//     @IsString()
//     @IsNotEmpty()
//     cardholderName: string;
//   }
  
//   // --- Main CreateBookingDto ---
  
//   export class CreateBookingDto {
//     @IsUUID()
//     voyageId: string; // The ID of the trip/voyage being booked
  
//     @IsNumber()
//     @Min(1)
//     @Type(() => Number) // Ensure this is transformed to a number
//     numberOfPeople: number;
  
//     // For the ID document, we will handle this as a file upload separately
//     // so it won't be part of the main JSON DTO.
//     // The backend will receive the DTO fields as JSON and the file as multipart/form-data.
  
//     @ValidateNested()
//     @Type(() => PersonalInfo) // Apply transformation for nested objects
//     personalInfo: PersonalInfo;
  
//     @ValidateNested()
//     @Type(() => PaymentInfo) // Apply transformation for nested objects
//     paymentInfo: PaymentInfo;
  
//     @IsString()
//     @IsOptional()
//     specialRequests?: string;
  
//     @IsNumber()
//     @Min(0)
//     @Type(() => Number) // Ensure this is transformed to a number
//     totalAmount: number;
//   }