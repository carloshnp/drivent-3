# Routes to create

## GET /hotels

1. Authorization middleware
  - Token verification
2. 404 validation middleware
3. 402 validation middleware
4. Get all hotels
  - `try` hotels-service
  - `catch` NOT_FOUND
5. Service hotels
  - `await` repository
  - Verify if hotels list exist
6. Repository hotels
  - `prisma.hotels.findMany()`

## GET /hotels/:hotelId

1.Authorization middleware
2. 404 validation middleware
3. 402 validation middleware
4. Get hotel rooms by hotel id
  - `try` hotelId hotel-service
  - `catch` NOT_FOUND
5. Service hotels 
  - `await` repository 
  - Verify if hotel exist 
6. Repository hotel
  - `prisma.hotels.findUnique()`
