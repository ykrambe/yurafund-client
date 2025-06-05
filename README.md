# YuraFund Client

A modern frontend application built with Nuxt 3, designed to work with a Golang backend.

## 🚀 Features

- **Nuxt 3** - The intuitive Vue framework
- **Tailwind CSS** - Utility-first CSS framework
- **Nuxt UI** - Beautiful and accessible UI components
- **Pinia** - State management for Vue
- **ESLint** - Code linting and formatting
- **Nuxt Fonts** - Web font optimization
- **Nuxt Image** - Image optimization
- **TypeScript** - Type safety

## 📋 Prerequisites

- Node.js 22.x
- npm or yarn
- Golang backend running on `localhost:8080`

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:8080
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
yurafund-client/
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS imports
├── components/               # Vue components
├── composables/
│   └── useApi.ts            # API utility composable
├── layouts/                 # Nuxt layouts
├── pages/
│   ├── index.vue           # Homepage
│   └── login.vue           # Login page
├── stores/
│   └── auth.ts             # Pinia auth store
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## 🔧 Configuration

### API Integration

The application is configured to connect to your Golang backend:

- **Development:** `http://localhost:8080`
- **Production:** Configure via environment variables

### State Management

Pinia stores are located in the `stores/` directory. Example usage:

```typescript
// In your component
const authStore = useAuthStore()

// Login user
await authStore.login({ email, password })

// Check authentication status
if (authStore.isAuthenticated) {
  // User is logged in
}
```

### API Calls

Use the `useApi` composable for API calls:

```typescript
// In your component
const { api } = useApi()

// Make API call
const data = await api('/api/endpoint')
```

## 🎨 Styling

- **Tailwind CSS** for utility classes
- **Nuxt UI** for pre-built components
- Custom styles in `assets/css/main.css`

## 📝 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run typecheck
```

## 🔗 Backend Integration

This frontend is designed to work with a Golang backend. Make sure your backend:

1. Runs on `localhost:8080` (development)
2. Implements CORS for frontend domain
3. Provides the expected API endpoints
4. Returns JSON responses

### Expected API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- Add your other endpoints here...

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `.output` directory** to your hosting provider

3. **Set environment variables** for production:
   ```env
   NUXT_PUBLIC_API_BASE=https://your-backend-domain.com
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
