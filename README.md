# Edu Smart - JavaScript Version

A comprehensive Edu Smart system built with React and JavaScript, featuring role-based dashboards for administrators, teachers, students, and parents, with full Arabic RTL support and internationalization.

## 🎯 Project Status

This project has been **partially converted** from TypeScript to JavaScript. Core infrastructure files have been converted to JavaScript, with a conversion script provided for remaining files.

### ✅ Converted Files (JavaScript)
- Core configuration (Vite, routes)
- All context providers (Auth, Theme, Sidebar, Language, MockData)
- Utility libraries
- Mock data

### 📝 Remaining Files (TypeScript)
- UI components (~50 files)
- Page components (~100 files)
- Layout components

**To complete the conversion**, run the provided script (see Quick Start below).

## 🚀 Quick Start

### 1. Complete the TypeScript to JavaScript Conversion

```bash
# Option A: Dry run first (see what will be converted)
node convert-ts-to-js.mjs --dry-run

# Option B: Run the actual conversion
node convert-ts-to-js.mjs

# Option C: Verbose mode for detailed output
node convert-ts-to-js.mjs --verbose
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run Development Server

```bash
npm run build
# The app will be built and ready to deploy
```

## 📁 Project Structure

```
edusmart/
├── src/
│   ├── app/
│   │   ├── components/       # React components
│   │   │   ├── layout/       # Layout components (Navbar, Sidebar, etc.)
│   │   │   ├── ui/           # UI components (shadcn/ui)
│   │   │   └── ...
│   │   ├── context/          # Context providers ✅ (JS)
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── SidebarContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── lib/              # Utilities and configuration ✅ (JS)
│   │   │   ├── i18n.js       # Internationalization
│   │   │   ├── mockData.js   # Mock data
│   │   │   └── utils.js      # Helper functions
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   ├── teacher/      # Teacher dashboard pages
│   │   │   ├── student/      # Student dashboard pages
│   │   │   ├── parent/       # Parent dashboard pages
│   │   │   ├── public/       # Public pages (landing, login)
│   │   │   └── shared/       # Shared pages
│   │   ├── App.jsx           # Main App component ✅ (JS)
│   │   └── routes.jsx        # React Router configuration ✅ (JS)
│   ├── context/              # Additional contexts ✅ (JS)
│   │   └── MockDataContext.jsx
│   ├── lib/                  # Shared utilities ✅ (JS)
│   │   └── utils.js
│   └── styles/               # CSS files
│       ├── fonts.css
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
├── vite.config.js            # Vite configuration ✅ (JS)
├── package.json
└── convert-ts-to-js.mjs      # Conversion script
```

## 🌟 Features

### Role-Based Access Control
- **Admin Dashboard**: Manage students, teachers, parents, classes, subjects, timetables, and more
- **Teacher Portal**: Manage lessons, homework, exams, attendance, and student grades
- **Student Portal**: View schedule, subjects, homework, grades, and communicate with teachers
- **Parent Portal**: Monitor children's attendance, grades, homework, and school payments

### Multilingual Support (i18n)
- ✅ Full English and Arabic translations
- ✅ RTL (Right-to-Left) layout support for Arabic
- ✅ Dynamic language switching
- ✅ Persistent language preference

### Modern UI/UX
- 🎨 Dark/Light theme support
- 📱 Fully responsive design
- 🎯 Clean and intuitive interface
- ♿ Accessible components (shadcn/ui)

### Data Management
- 📊 Mock data for development
- 🔄 Ready for real API integration
- 💾 Context-based state management
- 🗄️ Structured data models

## 🛠️ Technology Stack

- **Framework**: React 18.3.1
- **Language**: JavaScript (ESNext)
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router 7.13.0
- **Internationalization**: react-i18next 16.5.4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Form Handling**: React Hook Form 7.55.0

## 📚 Key Libraries

### UI & Styling
- `tailwindcss` - Utility-first CSS framework
- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icon library
- `clsx` + `tailwind-merge` - Conditional styling

### State Management
- React Context API
- Custom hooks

### Internationalization
- `i18next` - i18n framework
- `react-i18next` - React bindings for i18next

### Data Visualization
- `recharts` - Chart library

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 🌐 Internationalization (i18n)

The project uses `react-i18next` for translations. All translations are centralized in `/src/app/lib/i18n.js`.

### Adding New Translations

1. Edit `/src/app/lib/i18n.js`
2. Add keys to both `en` and `ar` translation objects
3. Use in components with the `useTranslation` hook:

```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('myKey')}</h1>;
}
```

### Language Switching

```javascript
import { useLanguage } from './context/LanguageContext';

function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useLanguage();
  
  return (
    <button onClick={() => changeLanguage(currentLanguage === 'en' ? 'ar' : 'en')}>
      {currentLanguage === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
```

## 🎨 Theming

The project supports light and dark themes via `ThemeContext`.

```javascript
import { useTheme } from './context/ThemeContext';

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## 🔐 Authentication

Authentication is handled via `AuthContext` with role-based access control.

```javascript
import { useAuth } from './context/AuthContext';

function ProtectedComponent() {
  const { user, role, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

### Available Roles
- `admin` - Full system access
- `teacher` - Teacher portal access
- `student` - Student portal access
- `parent` - Parent portal access

## 📖 Development Guide

### Adding a New Page

1. Create the page component in `/src/app/pages/{role}/`
2. Add route in `/src/app/routes.jsx`
3. Add navigation link in appropriate sidebar/navbar
4. Add translations in `/src/app/lib/i18n.js`

Example:

```javascript
// 1. Create /src/app/pages/admin/NewPage.jsx
export function NewPage() {
  return <div>My New Page</div>;
}

// 2. Add to /src/app/routes.jsx
import { NewPage } from './pages/admin/NewPage';

// In routes array:
{ path: 'admin/new-page', Component: NewPage }

// 3. Add translation key
// In i18n.js, add: newPage: 'New Page'
```

### Adding a New Component

1. Create component in `/src/app/components/`
2. Export component
3. Import and use where needed

```javascript
// /src/app/components/MyComponent.jsx
export function MyComponent({ title }) {
  return <div>{title}</div>;
}

// Usage
import { MyComponent } from './components/MyComponent';
<MyComponent title="Hello" />
```

## 🧪 Testing

After conversion, test these critical areas:

- [ ] Authentication flow (all roles)
- [ ] Language switching (EN ↔ AR)
- [ ] Theme switching (Light ↔ Dark)
- [ ] RTL layout (Arabic)
- [ ] Navigation between pages
- [ ] Form submissions
- [ ] Data display in tables/cards
- [ ] Responsive design (mobile/tablet/desktop)

## 🐛 Common Issues & Solutions

### Issue: Import errors after conversion
**Solution**: Check that all imports point to `.jsx` or `.js` files, not `.tsx` or `.ts`

### Issue: "React is not defined"
**Solution**: Ensure `import React from 'react'` is at the top of each component file

### Issue: Styling not applied
**Solution**: Verify Tailwind CSS classes and check `/src/styles/tailwind.css` is imported

### Issue: i18n keys not found
**Solution**: Check `/src/app/lib/i18n.js` has all required translation keys

## 📄 License

All rights reserved. © 2024

## 🤝 Contributing

This is a private Edu Smart project. For modifications or enhancements, please follow the clean architecture principles and maintain code quality.

## 📞 Support

For questions or issues:
1. Check the documentation files in the project root
2. Review the TypeScript to JavaScript conversion guide
3. Test with the provided mock data first

## 🎓 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [react-i18next](https://react.i18next.com/)
- [shadcn/ui](https://ui.shadcn.com/)
