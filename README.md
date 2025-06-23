# 🐔 Poultry Store Management System

A comprehensive React-based web application designed to manage all aspects of a poultry business, including inventory management, employee administration, sales tracking, supplier management, and detailed reporting.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)
![DaisyUI](https://img.shields.io/badge/DaisyUI-Latest-5A0EF8)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality

- **Dashboard Analytics**: Real-time business metrics, sales charts, and KPI tracking
- **Inventory Management**: Product catalog, stock tracking, low-stock alerts
- **Employee Management**: Staff directory, role-based access, performance tracking
- **Sales Management**: Order processing, payment tracking, sales analytics
- **Supplier Management**: Vendor relationships, purchase orders, supplier analytics
- **Reports & Analytics**: Comprehensive reporting with data visualization
- **Store Management**: Multi-location support, store configuration

### 🔐 Security & Authentication

- **JWT Authentication**: Secure login/logout with token management
- **Role-Based Access**: Admin, Manager, Employee permission levels
- **Protected Routes**: Secure page access based on authentication status
- **Session Management**: Automatic token refresh and session validation

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Notifications**: Toast messages for user feedback
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: Graceful error boundaries and user-friendly messages
- **Loading States**: Smooth user experience with loading indicators

### 📊 Data Management

- **RESTful API Integration**: Complete service layer for backend communication
- **State Management**: Context API for global state management
- **Data Caching**: Efficient data fetching with custom hooks
- **Real-time Updates**: Live data synchronization

## 🛠 Technology Stack

### Frontend Framework

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool with Hot Module Replacement (HMR)
- **React Router v7**: Modern routing with data loading

### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on Tailwind
- **Lucide React**: Modern icon library
- **Heroicons**: Additional icon set

### Data Visualization

- **Recharts**: Composable charting library
- **Custom Charts**: Sales trends, inventory analytics

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Git**: Version control

### State Management

- **React Context**: Global state management
- **Custom Hooks**: Reusable logic abstraction
- **Local Storage**: Persistent user preferences

## 📁 Project Structure

```
Frontend/
├── public/                     # Static assets
│   ├── assets/                # Product images and media
│   └── vite.svg              # Vite logo
├── src/
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   │   ├── FormInput.jsx         # Form input with validation
│   │   │   ├── MetricCard.jsx        # Dashboard metric display
│   │   │   ├── StockCard.jsx         # Inventory stock display
│   │   │   ├── Toast.jsx             # Notification component
│   │   │   ├── ToastContainer.jsx    # Toast management
│   │   │   └── ToastContext.jsx      # Toast context provider
│   │   ├── layout/           # Layout components
│   │   │   └── AdminLayout.jsx       # Main admin layout
│   │   ├── common/           # Common components
│   │   │   ├── ErrorBoundary.jsx     # Error handling
│   │   │   └── ProtectedRoute.jsx    # Route protection
│   │   ├── Navbar.jsx               # Top navigation
│   │   ├── Sidebar.jsx              # Side navigation
│   │   └── SalesSummary.jsx         # Sales chart component
│   ├── hooks/                # Custom React hooks
│   │   ├── useApi.jsx               # API data fetching
│   │   ├── useAuth.jsx              # Authentication state
│   │   ├── useForm.jsx              # Form management
│   │   └── useToast.jsx             # Toast notifications
│   ├── pages/                # Page components
│   │   ├── admin/            # Admin dashboard pages
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── Employee.jsx          # Employee management
│   │   │   ├── Inventory.jsx         # Product inventory
│   │   │   ├── Sales.jsx             # Sales management
│   │   │   ├── Reports.jsx           # Analytics & reports
│   │   │   ├── Supplier.jsx          # Supplier management
│   │   │   └── ManageStore.jsx       # Store configuration
│   │   ├── LoginForm.jsx            # User login
│   │   ├── SignUpForm.jsx           # User registration
│   │   └── ApiTestPage.jsx          # API testing (dev only)
│   ├── services/             # API service layer
│   │   ├── api.js                   # Base API service
│   │   ├── authService.js           # Authentication APIs
│   │   ├── inventoryService.js      # Inventory APIs
│   │   ├── employeeService.js       # Employee APIs
│   │   ├── salesService.js          # Sales APIs
│   │   └── reportsService.js        # Reports APIs
│   ├── utils/                # Utility functions
│   │   ├── validation.js            # Form validation
│   │   ├── testConnection.js        # API testing utilities
│   │   └── devTools.js              # Development tools
│   ├── constants/            # App constants
│   │   └── mockData.js              # Mock data for development
│   ├── config/               # Configuration
│   │   └── environment.js           # Environment variables
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
└── README.md                # Project documentation
```

## 🚀 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn** 1.22+)
- **Git** for version control

### Step-by-Step Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/poultry-store-management.git
   cd poultry-store-management/Frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit environment variables
   nano .env  # or use your preferred editor
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application**
   ```
   Open your browser and navigate to: http://localhost:5173
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Application Configuration
VITE_APP_NAME=Poultry Store Management
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_ENABLE_DEBUG=true
VITE_ENABLE_API_TESTING=true

# Authentication Configuration
VITE_TOKEN_EXPIRY=24h
VITE_REFRESH_THRESHOLD=300000
```

### Build Configuration

The project uses **Vite** for building. Configuration is in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

## 📖 Usage

### 🔐 Authentication Flow

1. **Registration**: New users can register with email and password
2. **Login**: Existing users authenticate with credentials
3. **Dashboard Access**: Authenticated users access the admin dashboard
4. **Role-Based Features**: Different features based on user roles

### 🏠 Dashboard Overview

The main dashboard provides:

- **Sales Metrics**: Revenue, profit, expenses tracking
- **Inventory Status**: Stock levels, low-stock alerts
- **Recent Activity**: Latest transactions and updates
- **Quick Actions**: Fast access to common tasks

### 📦 Inventory Management

- **Product Catalog**: Add, edit, delete products
- **Stock Tracking**: Real-time inventory levels
- **Image Management**: Product photo uploads
- **Categories**: Organize products by category
- **Search & Filter**: Quick product discovery

### 👥 Employee Management

- **Staff Directory**: Complete employee information
- **Role Assignment**: Manage user permissions
- **Department Organization**: Group by departments
- **Access Control**: Security and permission management

### 📊 Sales & Reports

- **Sales Processing**: Handle customer transactions
- **Payment Tracking**: Multiple payment methods
- **Analytics**: Visual reports and charts
- **Export Options**: PDF and Excel report generation

## 🔌 API Integration

### Service Architecture

The application uses a layered service architecture:

```javascript
// Base API Service
import { apiService } from "./services/api";

// Feature-Specific Services
import { authService } from "./services/authService";
import { inventoryService } from "./services/inventoryService";
import { employeeService } from "./services/employeeService";
```

### Authentication Integration

```javascript
// Login Example
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    // Handle successful login
  } catch (error) {
    // Handle login error
  }
};
```

### Data Fetching

```javascript
// Using Custom Hook
const Dashboard = () => {
  const { data, loading, error } = useApi(inventoryService.getProducts);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductList products={data} />;
};
```

### Backend Endpoints

The frontend expects the following API endpoints:

```
Authentication:
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me

Inventory:
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/low-stock

Employees:
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id

Sales:
GET    /api/sales
POST   /api/sales
GET    /api/sales/stats

Reports:
GET    /api/reports/dashboard
GET    /api/reports/sales
GET    /api/reports/inventory
```

## 🧪 Testing

### API Testing

The application includes a built-in API testing dashboard:

1. **Access Testing Page**: `/api-test` (development only)
2. **Run Individual Tests**: Test specific endpoints
3. **Comprehensive Testing**: Run all tests in sequence
4. **Console Testing**: Use browser console for quick tests

```javascript
// Console Testing Examples
await testAPI.connection(); // Test backend connection
await testAPI.auth(); // Test authentication
await testAPI.products(); // Test products endpoint
await testAPI.all(); // Run all tests
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Dashboard data loading
- [ ] Product CRUD operations
- [ ] Employee management
- [ ] Sales processing
- [ ] Report generation
- [ ] Mobile responsiveness
- [ ] Error handling

## 🔄 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests (if configured)
npm run test:api     # API integration tests
```

### Git Workflow

```bash
# Feature Development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Code Review & Merge
# Create Pull Request
# Review and merge to main
```

### Code Standards

- **Components**: PascalCase naming
- **Files**: camelCase for utilities, PascalCase for components
- **Functions**: camelCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE
- **CSS**: Tailwind utility classes preferred

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# The build output will be in the 'dist' directory
ls dist/
```

### Deployment Options

#### 1. **Netlify Deployment**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### 2. **Vercel Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### 3. **Static File Server**

```bash
# Serve the built files
npx serve -s dist -l 3000
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Poultry Store Management
VITE_ENABLE_DEBUG=false
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork the Repository**
2. **Clone Your Fork**

   ```bash
   git clone https://github.com/yourusername/poultry-store-management.git
   ```

3. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Changes**

   - Follow the code standards
   - Add appropriate tests
   - Update documentation

5. **Commit Changes**

   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to Branch**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create Pull Request**

### Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Backend Connection Errors**

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify environment variables
echo $VITE_API_BASE_URL
```

#### 2. **Build Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### 3. **Authentication Issues**

```bash
# Clear browser storage
# Open DevTools > Application > Storage > Clear Storage
```

#### 4. **Styling Issues**

```bash
# Rebuild Tailwind CSS
npm run build:css

# Check Tailwind configuration
npx tailwindcss --help
```

### Performance Optimization

- **Code Splitting**: Use React.lazy() for large components
- **Image Optimization**: Compress product images
- **Bundle Analysis**: Use `npm run build:analyze`
- **Caching**: Implement service worker for offline support

### Debug Mode

Enable debug mode in development:

```env
VITE_ENABLE_DEBUG=true
```

This enables:

- Console logging
- API request/response logging
- Performance timing
- Error details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Poultry Store Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the blazing fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **DaisyUI** for the beautiful component library
- **Recharts** for the charting capabilities
- **Lucide Icons** for the icon library

## 📞 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🎯 Roadmap

### Phase 1 (Current)

- [x] Core dashboard functionality
- [x] Inventory management
- [x] Employee management
- [x] Basic authentication
- [x] API integration layer

### Phase 2 (Planned)

- [ ] Advanced reporting and analytics
- [ ] Real-time notifications
- [ ] Mobile app integration
- [ ] Advanced user permissions
- [ ] Backup and restore functionality

### Phase 3 (Future)

- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] Automated testing suite

---

**Built with ❤️ for efficient poultry business management**

_Last updated: December 2024_
