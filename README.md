# TeachNiche

A creator-centric learning marketplace platform that enables educators to share and monetize their knowledge through video lessons.

Developed by Jaymin West

## Features

- 🎓 Create and sell video-based lessons
- 💰 Secure payments via Stripe Connect
- 🎥 Professional video hosting through Vimeo
- 🔐 Authentication and user management with Supabase
- 💻 Modern, responsive interface built with Next.js

## Tech Stack

- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: Python/FastAPI
- Authentication & Database: Supabase
- Payment Processing: Stripe Connect
- Video Hosting: Vimeo

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## Development Setup

1. Clone the repository

2. Create environment files:
   - Copy `.env.example` to `.env.dev` for development
   - Copy `.env.example` to `.env.prod` for production

3. Development Environment:
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

4. Production Environment:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

## Local Development (Without Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev    # Start development server
npm test      # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Environment Variables

- Development: `.env.dev`
- Production: `.env.prod`

Note: Environment files contain sensitive information and should not be committed to version control.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT License
