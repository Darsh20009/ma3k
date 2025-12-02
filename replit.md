# Overview

Ma3k (معك) is a comprehensive Arabic digital services platform that provides website development, e-commerce solutions, educational programming courses, project management, and employee productivity tools. The platform serves three distinct user types: Students (for educational courses), Clients (for web development projects), and Employees (with administrative tools). It features an innovative website creation form, integrated payment processing (PayPal with USD conversion, Stripe, bank transfers, and Saudi payment methods), automated invoice generation, course management system, and a complete service marketplace with luxury design and Arabic RTL support.

## Recent Changes (December 2, 2025)

### PostgreSQL Database Migration
- **Database Storage**: Migrated from JSON file storage to PostgreSQL database using Drizzle ORM
- **DatabaseStorage Class**: Created new `server/database-storage.ts` implementing IStorage interface with full PostgreSQL support
- **Auto-Initialization**: Database automatically initializes with default services, courses, and discount codes
- **Fallback Support**: System falls back to JsonStorage if database is unavailable
- **Schema Sync**: Database schema pushed using `drizzle-kit push`

### Storage Architecture
- **Dual Storage System**: Application now supports both PostgreSQL (production) and JSON file (fallback)
- **Database Storage**: Full CRUD operations for all 17 data models (users, services, orders, etc.)
- **Type Safety**: Complete TypeScript integration with Drizzle ORM for type-safe database operations

## Previous Changes (November 30, 2025)

### Session State Management & Cart Persistence
- **CartContext Hydration**: Implemented automatic loading of cartItems and discountCode from localStorage on app startup
- **Persistent Storage**: Cart data now persists across page reloads and browser sessions
- **Auto-Save System**: CartContext uses useEffect hooks to automatically save items and discounts to localStorage whenever they change
- **Loading State**: Added isLoading state to cart page to show loading message while data is being restored from storage
- **Session Recovery**: Customer can close browser and return later - all cart data and customer info preserved
- **Internal Linking**: Fixed navigation flow - users can now add products, navigate away, and return with cart intact

### Pricing and Checkout Features  
- **Dynamic Pricing Tiers**: Added step 2.5 in services page for restaurant/café service (monthly: 235 SAR, yearly: 399 SAR)
- **Discount Integration**: Fixed all discount calculations - payment now uses discountedPrice throughout
- **Payment Summary**: Added discount display in payment page showing savings amount and percentage
- **Order Preservation**: Last order details saved in localStorage for user reference

## Previous Changes (October 23, 2025)
- **Authentication System Enhancement**: Added `isLoading` state to AuthContext to prevent race conditions during authentication hydration
- **Protected Pages Fix**: Updated all dashboard pages (students, clients, employees) to properly wait for AuthContext loading before redirecting
- **Employee Dashboard Modernization**: Removed legacy localStorage-based authentication and migrated to centralized AuthContext
- **PayPal Configuration**: Configured PayPal client ID to use environment variables (VITE_PAYPAL_CLIENT_ID) for proper integration
- **Services Page Registration**: Added mandatory client registration before adding services to cart with comprehensive form
- **Dashboard Authentication**: All three dashboards now use unified AuthContext for consistent authentication and session management
- **Code Quality**: Eliminated all legacy authentication code and localStorage dependencies in favor of centralized auth system

# User Preferences

Preferred communication style: Simple, everyday language. User prefers direct problem-solving without extra explanations.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack Query for server state, CartContext for cart/discount state with localStorage persistence
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming and Arabic RTL support
- **Typography**: Tajawal font for Arabic text with Inter as fallback for enhanced readability
- **Storage**: localStorage for session persistence (cart items, customer info, discount codes)

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and schema management
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot module replacement with Vite for fast development cycles

## Payment Integration
- **PayPal SDK**: Official PayPal Server SDK with automatic SAR to USD conversion for international payments
- **Local Payment Methods**: Support for Saudi payment systems (STC Pay, UR Pay, Alinma Pay) with manual verification workflow
- **Bank Transfers**: Traditional bank transfer support with receipt verification via WhatsApp integration
- **Invoice System**: Automated HTML invoice generation with downloadable receipts for customers
- **Discount System**: Discount code validation with percentage-based savings and persistent application

## Data Models
- **Users**: Basic authentication system with username/password
- **Services**: Updated service catalog with competitive pricing (400-1499 SAR range)
- **Orders**: Complete order lifecycle management from creation to completion
- **Invoices**: Automated invoice generation with HTML download functionality
- **Website Forms**: Customer specification collection with HTML/CSS template generation
- **Consultations**: Customer inquiry and consultation request handling
- **Messages**: Internal messaging system for customer communication
- **Discount Codes**: Code-based discounts with percentage values and expiration dates

## UI/UX Design Patterns
- **RTL Support**: Full right-to-left layout support for Arabic content
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Library**: Consistent design system using Shadcn/ui components
- **Theme System**: CSS custom properties for flexible theming and brand consistency
- **Loading States**: Optimistic updates and loading indicators for better user experience
- **Session Persistence**: Automatic cart and customer data preservation across sessions

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
- **Framer Motion**: Animation library for smooth transitions
- **wouter**: Lightweight routing library for client-side navigation
