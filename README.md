# News Admin Dashboard

This is the administrative dashboard for the News Website project, designed for editors, journalists, and administrators to manage content and users.

## Overview

The News Admin Dashboard is a secure, role-based administrative interface that complements the main news website. It provides tools for content management, user administration, and publishing workflows.

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Apollo Client for GraphQL
- React Hook Form
- HeadlessUI
- HeroIcons

### Authentication & Authorization
- NextAuth.js
- JWT-based authentication
- Role-based access control (ADMIN, EDITOR, JOURNALIST)

## Project Structure

```
news-dashboard/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/      # Login page
│   │   │   └── register/   # Registration page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   └── auth/
│   │       └── AuthForm.tsx # Reusable auth component
│   └── types/
│       └── user.ts         # TypeScript definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

## Features

### Implemented Features
- Basic project setup and configuration
- Authentication UI (Login/Register)
- Form validation with React Hook Form
- Role-based user registration
- Modern, responsive UI with Tailwind CSS

### Planned Features
- Dashboard layout for authenticated users
- News article management
- User management
- Category management
- Media upload and management
- Analytics and reporting
- Workflow management
- API integration with backend

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd news-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Required environment variables are defined in `.env.example`. Copy this file to `.env` and update the values accordingly.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Organization

- `src/app/*` - Next.js 14 app router pages and layouts
- `src/components/*` - Reusable React components
- `src/types/*` - TypeScript type definitions

## Authentication

The dashboard implements role-based authentication with three user types:
- **Admin**: Full system access
- **Editor**: Content management and publishing rights
- **Journalist**: Content creation and basic management rights

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Projects

- [News Website Frontend](https://github.com/oguzhanural/news) - Main news website for readers
- [News Backend](https://github.com/oguzhanural/news/tree/main/backend) - GraphQL API backend

## Contact

Oğuzhan Ural - [GitHub](https://github.com/oguzhanural)
