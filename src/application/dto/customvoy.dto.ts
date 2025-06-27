// // prisma/schema.prisma
// // ... existing User, Trip, Reservation, Hotel, Destination models ...

// model CustomVoyage {
//     id            String    @id @default(uuid())
//     title         String
//     description   String?
//     price         Float
//     duration      String
//     image         String? // The emoji or image URL
//     workflowLink  String?
//     isPrivate     Boolean   @default(false)
//     customData    Json?     // e.g., { flexibility: "high", themes: ["culture", "food"] }
//     itineraryJson Json      // The full JSON from your ReactFlow builder
//     createdAt     DateTime  @default(now())
//     updatedAt     DateTime  @updatedAt
  
//     // Creator of the custom voyage
//     createdByUserId String?
//     createdBy       User?     @relation(fields: [createdByUserId], references: [id])
  
//     // Main destination for filtering/display on map
//     destinationId   String?
//     destination     Destination? @relation(fields: [destinationId], references: [id])
//   }