# Frontend Authentication App

This project is a Vue 3-based frontend application built with Vite. It provides a robust authentication system, including features like user registration, login, logout, and token-based session management.

## Features

- **User Authentication**: Register, login, and logout functionality.
- **Token Management**: Access and refresh token handling with secure cookies.
- **Protected Routes**: Restrict access to certain pages based on authentication status.
- **Responsive Design**: Built with TailwindCSS for a responsive and modern UI.
- **State Management**: Pinia is used for managing authentication state.
- **API Integration**: Axios is used for communication with the backend API.

## Project Structure

```
frontend-auth/
├── public/                # Static assets
├── src/
│   ├── assets/            # CSS, images, and other assets
│   ├── components/        # Reusable Vue components
│   │   ├── auth/          # Authentication-related components
│   │   ├── layout/        # Layout components like header and footer
│   │   ├── ui/            # UI components like buttons and inputs
│   ├── composables/       # Reusable Vue composables
│   ├── plugins/           # Vue plugins (e.g., auth plugin)
│   ├── router/            # Vue Router configuration
│   ├── services/          # API service modules
│   ├── store/             # Pinia store for state management
│   ├── types/             # TypeScript interfaces and types
│   ├── utils/             # Utility functions
│   ├── views/             # Page-level components
│   ├── App.vue            # Root Vue component
│   ├── main.ts            # Application entry point
├── .env.development       # Environment variables for development
├── .env.production        # Environment variables for production
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
└── vite.config.ts         # Vite configuration
```

## Environment Variables

The application uses environment variables for configuration. These are defined in `.env.development` and `.env.production` files.

### Example `.env` Variables

```env
VITE_API_URL='http://localhost:3000' # Backend API URL
VITE_SECURE_COOKIES=true            # Use secure cookies in production
VITE_COOKIE_TTL_DAYS=1              # Cookie expiration in days
VITE_TOKEN_KEY='auth_token'         # Access token key
VITE_REFRESH_TOKEN_KEY='auth_refresh_token' # Refresh token key
VITE_TOKEN_EXPIRY_KEY='auth_token_expiry'   # Token expiry key
```

## Project Setup

1. Clone the repository:

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.development` and `.env.production` files and update them as needed.
   - `.env.development` example
   ```env
   VITE_API_URL='http://localhost:3000' # Backend URL
   VITE_SECURE_COOKIES=false
   VITE_ACCESS_COOKIE_TTL_DAYS=1 # Days
   VITE_REFRESH_COOKIE_TTL_DAYS=7 # Days

   VITE_TOKEN_KEY='auth_token'
   VITE_REFRESH_TOKEN_KEY='auth_refresh_token'
   VITE_TOKEN_EXPIRY_KEY='auth_token_expiry'
```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Scripts

- **Start Development Server**:
  ```sh
  npm run dev
  ```
- **Build for Production**:
  ```sh
  npm run build
  ```
- **Preview Production Build**:
  ```sh
  npm run preview
  ```
- **Type Check**:
  ```sh
  npm run type-check
  ```
- **Lint and Fix**:
  ```sh
  npm run lint
  ```

## Authentication Flow

1. **Registration**:
   - Users can register using the `/signup` route.
   - Password validation ensures strong passwords.

2. **Login**:
   - Users can log in using the `/signin` route.
   - Tokens are stored securely in cookies.

3. **Token Refresh**:
   - Tokens are automatically refreshed before expiry.

4. **Logout**:
   - Users can log out, which clears tokens and redirects to the login page.

## API Endpoints

The application communicates with the backend API using the following endpoints:

- **POST** `/api/auth/signup`: Register a new user.
- **POST** `/api/auth/signin`: Log in a user.
- **POST** `/api/auth/refresh`: Refresh access token.
- **POST** `/api/auth/logout`: Log out the user.
- **GET** `/api/users/profile`: Fetch the current user's profile.

## Styling

- **TailwindCSS**: Used for utility-first styling.
- **Custom CSS**: Additional styles are defined in `src/assets/base.css` and `src/assets/main.css`.

## TypeScript Support

- TypeScript is fully integrated into the project.
- Interfaces for authentication and user data are defined in `src/types/auth.interface.ts`.

## Deployment

1. Build the application:
   ```sh
   npm run build
   ```

2. Serve the `dist/` directory using a static file server or deploy it to a hosting platform like Vercel or Netlify.


## Enhancements

The following features can be implemented as enhancements:

### Auth

1. **Forgot Password**:
   - Implement a password recovery flow with email-based reset links.

2. **Remeber me**:
    - Refactor the saving of the `refreshToken` functionallity to based on user selection

3. **User Roles and Permissions**:
   - Implement role-based access control (RBAC) to manage user permissions.

### UI

1. **Notifications**:
    - Impelemnt more user frindly notifications (e.g. Successful registration, etc.)
