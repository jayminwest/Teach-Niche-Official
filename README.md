# Project Name

A full-stack application with Next.js frontend and Python backend.

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## Development Setup

1. Clone the repository

2. Create environment files:
   - Copy .env.example to .env.dev for development
   - Copy .env.example to .env.prod for production

3. Development Environment:
   - Run the application in development mode with hot-reloading: 
     docker-compose up --build
   - Access frontend at http://localhost:3000
   - Access backend at http://localhost:8000

4. Production Environment:
   - Run the application in production mode:
     docker-compose -f docker-compose.prod.yml up --build
   - Access frontend at http://localhost:3000
   - Access backend at http://localhost:8000

## Local Development (Without Docker)

1. Frontend:
   - Navigate to frontend directory
   - Install dependencies: npm install
   - Start development server: npm run dev
   - Run tests: npm test
   - Run tests in watch mode: npm run test:watch
   - Generate test coverage report: npm run test:coverage

2. Backend:
   - Navigate to backend directory
   - Create virtual environment
   - Install dependencies: pip install -r requirements.txt
   - Start server: python main.py

## Environment Variables

Development: .env.dev
Production: .env.prod

Do not commit environment files to version control.
