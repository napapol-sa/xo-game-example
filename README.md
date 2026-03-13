# XO Game Example

This is a Next.js project that demonstrates a simple Tic-Tac-Toe game with user authentication (Google OAuth), score tracking, game logging, and a global leaderboard, all backed by a PostgreSQL database and containerized with Docker.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your system:

*   **Node.js**: (LTS version recommended) for running Next.js and npm commands.
*   **Docker** and **Docker Compose**: For containerizing the application and its database.

### Environment Variables

The application requires several environment variables for its configuration, especially for database connection and NextAuth.

1.  **Create a `.env` file**: In the root directory of the project, create a file named `.env`.

2.  **Add the following variables** to your `.env` file:
    ```dotenv
    DATABASE_URL="postgresql://user:password@db:5432/xo_db?schema=public"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET_HERE"
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET_HERE"
    ```
    *   `DATABASE_URL`: Connection string for the PostgreSQL database. When running with Docker Compose, `db` refers to the PostgreSQL service.
    *   `NEXTAUTH_URL`: The base URL of your Next.js application (e.g., `http://localhost:3000`).
    *   `NEXTAUTH_SECRET`: A secret used by NextAuth.js to sign and encrypt session tokens. **Generate a strong, random string** for this. You can use `openssl rand -base64 32` in your terminal to generate one.
    *   `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: These are obtained from the Google Cloud Console when setting up OAuth 2.0 credentials for your application.

### Installation & Deployment with Docker Compose

This project uses Docker Compose to manage both the Next.js application and its PostgreSQL database.

1.  **Ensure Docker is running** on your machine.

2.  **Build and start the services**:
    Open your terminal in the project's root directory and run the following command:
    ```bash
    npm run docker:up
    ```
    This command will:
    *   Build the Next.js application Docker image.
    *   Start a PostgreSQL database container.
    *   Run Prisma migrations to set up the database schema.
    *   Start the Next.js application.

3.  **Access the application**:
    Once the services are up and running, open your web browser and navigate to:
    `http://localhost:3000`

    You can now sign in with your Google account and start playing!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!