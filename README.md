# Incia & Arvin's Wedding Website 💍

A comprehensive, bilingual (English & Bengali) wedding website serving as the digital hub for a multi-day wedding celebration. This modern web application provides guests with event information, RSVP management, photo galleries, live streaming, and more.

## ✨ Features

### 🔔 Guest Features
- **Event Information**: Complete wedding schedule with dates, times, and venue details
- **Interactive Maps**: Google Maps integration for all venues
- **RSVP System**: Secure token-based RSVP with dietary preferences and guest count
- **Photo & Video Galleries**: Categorized media albums with guest upload capabilities
- **Live Streaming**: Real-time streaming for each event with countdown timers
- **Travel & Accommodation**: Hotel information, shuttle schedules, and airport pickup details
- **Local Guide**: Travel tips, local customs, dress codes, and emergency contacts
- **Multilingual Support**: English and Bengali language options
- **Contact & Support**: Guest contact forms and FAQ section

### 🛠️ Admin Features
- **Secure Dashboard**: Authentication-protected admin panel
- **Content Management**: Upload, edit, and manage photos/videos with moderation
- **RSVP Management**: Track and manage guest responses
- **Event Management**: Add/edit event schedules and venue information
- **Guest Management**: View guest details, countries, and accommodation info
- **Media Moderation**: Approve/reject guest-uploaded content

### 📱 Technical Features
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Optional dark theme toggle
- **Social Sharing**: Integration with Instagram, Facebook, and other platforms
- **Performance Optimized**: Fast loading with image optimization
- **SEO Friendly**: Optimized for search engines

## 🚀 Tech Stack

- **Frontend**: Next.js 15.4.5, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4, Headless UI, Heroicons
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **File Storage**: Cloudinary for media management
- **Email Service**: Resend for notifications
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Testing**: Jest with React Testing Library
- **Deployment**: GitHub Pages (static) or Hostinger VPS (full-stack)

## 🌐 Live Deployments

### Microsoft Azure (Full-Stack) - **🌟 NEW - Enterprise-Grade Hosting**
- **Deployment**: Automated via GitHub Actions using GitHub-hosted runners (Ubuntu)
- **Setup Time**: 30 minutes
- **Cost**: FREE tier (12 months) then ~$13/month
- **Features**: 
  - ✅ **ALL pages** (Home, Events, Gallery, Live, Travel, Contact, RSVP, Admin)
  - ✅ **Working database** (SQLite - stores RSVP submissions, guest data)
  - ✅ **All API routes** (18 endpoints for forms, auth, data management)
  - ✅ **Admin dashboard** with NextAuth authentication
  - ✅ **Email notifications** (RSVP confirmations, contact messages)
  - ✅ **Image uploads** (Cloudinary integration)
  - ✅ **All images and galleries** working perfectly
  - ✅ **Fully mobile responsive**
  - ✅ **Enterprise reliability** (99.95% SLA)
  - ✅ **Automatic SSL** certificate
  - ✅ **Application Insights** monitoring
  - ✅ **Continuous deployment** from GitHub
- **Quick Setup**: See [`QUICK_DEPLOY_AZURE.md`](QUICK_DEPLOY_AZURE.md) (30-minute guide)
- **Full Guide**: See [`AZURE_DEPLOYMENT_GUIDE.md`](AZURE_DEPLOYMENT_GUIDE.md) (complete documentation)
- **Build**: Uses GitHub-hosted runners (Ubuntu Linux VMs) via GitHub Actions

### Vercel (Full-Stack) - **Fast & Simple** 
- **Deployment**: Automated via GitHub Actions using GitHub-hosted runners (Ubuntu)
- **Setup Time**: 12 minutes
- **Cost**: FREE (no credit card required)
- **Features**: 
  - ✅ **ALL pages** (Home, Events, Gallery, Live, Travel, Contact, RSVP, Admin)
  - ✅ **Working database** (SQLite - stores RSVP submissions, guest data)
  - ✅ **All API routes** (18 endpoints for forms, auth, data management)
  - ✅ **Admin dashboard** with NextAuth authentication
  - ✅ **Email notifications** (RSVP confirmations, contact messages)
  - ✅ **Image uploads** (Cloudinary integration)
  - ✅ **All images and galleries** working perfectly
  - ✅ **Fully mobile responsive**
  - ✅ **Fast loading** with global CDN
  - ✅ **Automatic SSL** certificate
  - ✅ **Continuous deployment** from GitHub
- **Quick Setup**: See [`QUICK_DEPLOY_VERCEL.md`](QUICK_DEPLOY_VERCEL.md) (12-minute guide)
- **Full Guide**: See [`VERCEL_DEPLOYMENT_GUIDE.md`](VERCEL_DEPLOYMENT_GUIDE.md) (complete documentation)
- **Build**: Uses GitHub-hosted runners (Ubuntu Linux VMs) via GitHub Actions

### GitHub Pages (Static) - **For Simple Static Site** ⚡
- **URL**: [https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/](https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/)
- **Deployment**: Automated via GitHub Actions
- **Features**: 
  - ✅ All informational pages (Home, Events, Gallery, Live, Travel, Contact, RSVP)
  - ✅ Working RSVP form (via Web3Forms - email notifications)
  - ✅ Working Contact form (via Web3Forms - email notifications)
  - ✅ All images and photo galleries
  - ✅ Event schedules with venue information
  - ✅ Fully mobile responsive
  - ✅ Fast loading (static export)
- **Limitations**:
  - ❌ No admin panel (requires server)
  - ❌ No database storage (forms send emails only)
  - ❌ No authentication system
  - ❌ No API routes
- **Quick Setup**: See [`QUICK_DEPLOY_GITHUB_PAGES.md`](QUICK_DEPLOY_GITHUB_PAGES.md) (5 minutes)
- **Full Guide**: See [`GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md`](GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md)

### Hostinger VPS (Full-Stack Alternative)
- **Features**:
  - ✅ Everything from Azure/Vercel
  - ✅ Uses MySQL instead of SQLite
  - ✅ Media uploads with Cloudinary
  - ✅ Advanced RSVP management
- **Setup Guide**: See `HOSTINGER_VPS_DEPLOYMENT_PLAN.md`

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL database
- Cloudinary account (for media storage)
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syed-reza98/Sharothee-Wedding.git
   cd Sharothee-Wedding/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/wedding_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Resend
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 Deployment

### Hostinger VPS Deployment

1. **Server Setup**
   - Ubuntu 20.04+ VPS
   - Node.js 18+ installed
   - MySQL database setup
   - Nginx as reverse proxy
   - SSL certificate (Let's Encrypt)

2. **Environment Configuration**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DATABASE_URL="mysql://username:password@hostname:3306/wedding_db"
   export NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   npm run start
   ```

4. **Process Management**
   Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "wedding-website" -- start
   pm2 startup
   pm2 save
   ```

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── package.json
```

## 🚀 Deployment

### GitHub Pages (Static Site) - Automated Deployment

The website automatically deploys to GitHub Pages via GitHub Actions on every push to `main`.

#### Quick Deploy (5 minutes)

1. **Get Web3Forms API Key** (free at https://web3forms.com)
2. **Add GitHub Secret**: `WEB3FORMS_ACCESS_KEY` in repository settings
3. **Enable GitHub Pages**: Settings → Pages → Source: GitHub Actions
4. **Push to main**: Deployment starts automatically

**Live URL**: [https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/](https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/)

#### Documentation

- **Quick Start**: [`QUICK_DEPLOY_GITHUB_PAGES.md`](QUICK_DEPLOY_GITHUB_PAGES.md) - 5-minute setup guide
- **Full Guide**: [`GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md`](GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md) - Complete documentation
- **Testing**: [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - Post-deployment verification checklist

#### Manual Build

```bash
# Static build (excludes API routes and admin pages)
cd client
npm run build:static

# Output is in client/out directory
```

#### Verify Deployment

```bash
# Run automated verification script
bash scripts/verify-deployment.sh https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia
```

### Hostinger VPS (Full-Stack)

For full functionality with API routes, authentication, and database:

```bash
# Follow VPS deployment instructions
# See HOSTINGER_VPS_DEPLOYMENT_PLAN.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

