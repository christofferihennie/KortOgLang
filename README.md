# Kort og Lang

A multiplayer game platform built with Next.js, featuring real-time game management and user authentication.

## Features

- **User Authentication**: Secure authentication powered by Clerk
- **Game Creation**: Create new games with player invitations and location selection
- **Real-time Database**: Convex backend for real-time data synchronization
- **Player Management**: Invite other users to join games
- **Location Selection**: Choose from predefined game locations
- **Game History**: View past games with participants and winners
- **Responsive UI**: Modern interface built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── game/
│   │   │   └── new-game/          # Game creation pages
│   │   ├── game-list.tsx          # Display user's games
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   └── effects/               # Custom React hooks
│   ├── contexts/                  # React context providers
│   └── lib/                       # Utility functions
├── convex/
│   ├── schema.ts                  # Database schema
│   ├── users.ts                   # User management
│   ├── games.ts                   # Game operations
│   ├── locations.ts               # Location queries
│   └── auth.config.ts             # Authentication config
```

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kort-og-lang
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_FRONTEND_API_URL=your_clerk_frontend_api_url
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:

- **users**: User profiles with authentication tokens
- **games**: Game records with location and status
- **gameParticipants**: Many-to-many relationship between users and games
- **locations**: Predefined game locations

## Key Features Implementation

### Authentication Flow
- Users sign in through Clerk
- User data is automatically synced to Convex database
- Authentication state is managed across the application

### Game Creation
- Players can create new games at `/game/new-game`
- Select multiple players from existing users
- Choose from available locations
- Form validation ensures required fields are filled
- Error handling with user-friendly messages

### Real-time Updates
- Game data syncs in real-time across all clients
- Automatic updates when games are created or modified

## Development

The project uses modern development practices:

- **TypeScript**: Full type safety across frontend and backend
- **Form Validation**: Zod schemas with React Hook Form
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Loading indicators for async operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The application can be deployed on Vercel with automatic Convex integration:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on each push to main

## License

This project is under the MIT License.
