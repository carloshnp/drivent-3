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

## Tests

### GET /hotels 

1. 401 token 
  - no token
  - invalid token
  - no session for token 
2. when token is valid 
  - 404 no enrollment
  - 404 no ticket
  - 404 no hotel
  - 402 unpaid ticket
  - 402 remote ticket 
  - 402 no hotel included
3. OK
  - 200 get hotels list 

### GET /hotels/:hotelId 

1. 401 token
  - no token 
  - invalid token
  - no session for token
2. when token is valid 
  - 404 no enrollment
  - 404 no ticket 
  - 404 no hotel
  - 402 unpaid ticket 
  - 402 remote ticket 
  - 402 no hotel included
3. OK 
  - 200 get hotel and rooms
