# Overview

Ma3k is a comprehensive Arabic digital services platform that provides website development, e-commerce solutions, educational platforms, branding services, and digital tools. The platform offers a complete service marketplace with integrated payment processing (PayPal, bank transfers, and multiple Saudi payment methods), order management, and customer support systems. Built as a full-stack web application with React frontend and Node.js/Express backend, it features a modern UI with Arabic RTL support and professional service portfolio management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack Query for server state management, providing caching, background updates, and optimistic updates
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming and Arabic RTL support
- **Typography**: Tajawal font for Arabic text with Inter as fallback for enhanced readability

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and schema management
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot module replacement with Vite for fast development cycles

## Payment Integration
- **PayPal SDK**: Official PayPal Server SDK for secure payment processing with sandbox/production environment switching
- **Local Payment Methods**: Support for Saudi payment systems (STC Pay, UR Pay, Alinma Pay) with manual verification workflow
- **Bank Transfers**: Traditional bank transfer support with receipt verification via WhatsApp integration

## Data Models
- **Users**: Basic authentication system with username/password
- **Services**: Categorized service catalog with pricing and descriptions
- **Orders**: Complete order lifecycle management from creation to completion
- **Invoices**: Automated invoice generation linked to orders
- **Consultations**: Customer inquiry and consultation request handling
- **Messages**: Internal messaging system for customer communication

## UI/UX Design Patterns
- **RTL Support**: Full right-to-left layout support for Arabic content
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Library**: Consistent design system using Shadcn/ui components
- **Theme System**: CSS custom properties for flexible theming and brand consistency
- **Loading States**: Optimistic updates and loading indicators for better user experience

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and connection pooling
- **Drizzle Kit**: Database migration and schema management tool

## Payment Processors
- **PayPal**: International payment processing with official server SDK integration
- **Saudi Payment Systems**: STC Pay, UR Pay, and Alinma Pay for local market support

## Communication Services
- **WhatsApp Business API**: Customer communication and payment receipt verification
- **Email Services**: Order confirmations and customer notifications (configured via environment variables)

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type checking and enhanced developer experience
- **ESLint/Prettier**: Code quality and formatting tools

## UI Libraries
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Modern icon library for consistent iconography
- **Font Awesome**: Additional icon set for specialized icons

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Type-safe CSS class variants
- **clsx**: Conditional CSS class composition
- **nanoid**: Unique ID generation for orders and invoices