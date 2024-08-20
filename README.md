# GatherHub Backend

Welcome to the backend of the GatherHub project, a community event management application. This backend provides APIs for creating, managing, and registering for events, using a variety of modern technologies.

## Technologies Used

- **Node.js** and **Express.js**: For building the RESTful APIs.
- **TypeScript**: For type-safe code.
- **Prisma**: For ORM and database interactions.
- **PostgreSQL**: For database management.
- **Zod**: For data validation.
- **JSON Web Tokens (JWT)**: For authentication and authorization.

## Features

- **Event Management**: Create, update, and delete events.
- **User Registration**: Register and manage user information.
- **Event Registration**: Register users for events.
- **Authentication & Authorization**: Secure endpoints with JWT-based authentication.

## API Endpoints

### Authentication

- **POST /login**: Authenticate a user and return a JWT token.

### Events

- **POST /events**: Create a new event.
- **GET /events/:id**: Retrieve details of a specific event.
- **PUT /events/:id**: Update a specific event.
- **DELETE /events/:id**: Delete a specific event.

### Registrations

- **POST /registrations/:id**: Register a user for an event.
- **DELETE /registrations/:id**: Unregister a user from an event.
- **GET /registrations/:id**: Retrieve registration details by ID.


## Live link 
 https://rxhxul-gatherhub.vercel.app/login