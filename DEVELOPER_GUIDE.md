# Edu Smart - Developer Quick Reference Guide

## 🚀 Quick Start

### Project Structure
```
/src/app
├── components/
│   ├── common/          # Reusable components (NEW!)
│   ├── layout/          # Layout components
│   ├── ui/              # shadcn/ui components
│   └── auth/            # Auth-related components
├── context/             # React Context providers
├── lib/                 # Utilities and constants
│   ├── uiConstants.js   # Design tokens (NEW!)
│   ├── safeHelpers.js   # Safe utility functions (NEW!)
│   ├── utils.js         # General utilities
│   ├── mockData.js      # Mock data
│   └── i18n.js          # Internationalization
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── teacher/         # Teacher pages
│   ├── student/         # Student pages
│   ├── parent/          # Parent pages
│   └── public/          # Public pages (login, etc.)
└── styles/              # Global styles
```

---

## 📦 Common Components Usage

### Import Pattern
```javascript
import { StatCard, PageHeader, EmptyState, StatusBadge, LoadingSpinner } from '../components/common';
```

### StatCard
```javascript
<StatCard
  title="Total Students"
  value={150}
  description="Active this semester"
  icon={Users}
  trend="up"
  trendLabel="+12%"
  onClick={() => navigate('/students')}
  valueColor="text-indigo-600 dark:text-indigo-400"
/>
```

### PageHeader
```javascript
<PageHeader
  title="Student Management"
  description="View and manage student records"
  showBack={true}
  backTo="/admin/dashboard"
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button>Add Student</Button>
    </>
  }
/>
```

### EmptyState
```javascript
<EmptyState
  icon={FileText}
  title="No assignments yet"
  description="Create your first assignment to get started"
  action={() => navigate('/teacher/homework/add')}
  actionLabel="Create Assignment"
/>
```

### StatusBadge
```javascript
<StatusBadge status="present" />
<StatusBadge status="completed" label="Done" />
<AttendanceBadge status="present" />
<CompletionBadge status="completed" />
<ClassStatusBadge status="ongoing" />
```

### LoadingSpinner
```javascript
// Inline spinner
<LoadingSpinner size="md" text="Loading data..." />

// Full screen spinner
<LoadingSpinner fullScreen={true} text="Please wait..." />

// Button spinner
<Button disabled>
  <ButtonSpinner className="mr-2" />
  Loading...
</Button>
```

### DataTable
```javascript
const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { 
    header: 'Status', 
    accessor: 'status',
    align: 'center',
    render: (row) => <StatusBadge status={row.status} />
  },
];

<DataTable
  columns={columns}
  data={students}
  onRowClick={(row) => navigate(`/student/${row.id}`)}
  emptyMessage="No students found"
/>
```

---

## 🎨 Design Tokens

### Import Constants
```javascript
import { COLORS, SPACING, SHADOWS, STATUS_COLORS, COMPONENT_STYLES } from '../lib/uiConstants';
```

### Using Colors
```javascript
const buttonStyle = {
  backgroundColor: COLORS.primary.DEFAULT,
  color: 'white',
};

// Or use Tailwind classes (recommended)
className="bg-indigo-600 hover:bg-indigo-700"
```

### Using Status Colors
```javascript
// Already applied in StatusBadge, but you can use directly:
const statusClass = STATUS_COLORS.present;
// Returns: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
```

### Component Styles
```javascript
// Get pre-configured styles
const cardClass = COMPONENT_STYLES.card.base;
const buttonPrimary = COMPONENT_STYLES.button.variants.primary;
```

---

## 🛡️ Safe Helpers

### Import Pattern
```javascript
import {
  safeGet,
  safeJsonParse,
  safeLocalStorageGet,
  ensureArray,
  safeFormatDate,
  isEmpty,
  truncate,
  debounce,
  throttle,
} from '../lib/safeHelpers';
```

### Safe Object Access
```javascript
// Instead of: user.profile.name (might crash)
const userName = safeGet(user, 'profile.name', 'Guest');
```

### Safe JSON Operations
```javascript
// Parse
const data = safeJsonParse(jsonString, {});

// Stringify
const jsonStr = safeJsonStringify(data, '{}');
```

### Safe localStorage
```javascript
// Get
const theme = safeLocalStorageGet('theme', 'light');

// Set
safeLocalStorageSet('theme', 'dark');

// Remove
safeLocalStorageRemove('theme');
```

### Array Helpers
```javascript
// Ensure array
const items = ensureArray(value); // Always returns array

// Safe first/last
const first = safeFirst(array, null);
const last = safeLast(array, null);
```

### Date Formatting
```javascript
const formatted = safeFormatDate(new Date(), 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
```

### Performance Helpers
```javascript
// Debounce (wait for user to stop typing)
const handleSearch = debounce((query) => {
  searchAPI(query);
}, 300);

// Throttle (limit execution rate)
const handleScroll = throttle(() => {
  loadMore();
}, 500);
```

### String Helpers
```javascript
// Check if empty
if (isEmpty(value)) { /* ... */ }

// Truncate
const short = truncate('Long text here', 20, '...');

// Capitalize
const capitalized = capitalize('hello'); // "Hello"
```

---

## 🌍 Internationalization

### Using Translation
```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return <h1>{t('welcome')}</h1>;
}
```

### RTL/LTR Aware Styling
```javascript
// Conditional classes
className={`${isRTL ? 'pr-4' : 'pl-4'}`}

// Flexbox direction
className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}

// Text alignment
className={`${isRTL ? 'text-right' : 'text-left'}`}

// Icons
const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
```

---

## 🎭 Context Usage

### Auth Context
```javascript
import { useAuth } from '../context/AuthContext';

function Component() {
  const { user, role, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <div>Welcome, {user.name}</div>;
}
```

### Attendance Context
```javascript
import { useAttendance } from '../context/AttendanceContext';

function Component() {
  const { sessions, studentStatus, startSession, endSession, completeStudentAttendance } = useAttendance();
  
  // Start session
  startSession(classId, 'manual', { correctNumber: 42 });
  
  // End session
  endSession(classId);
  
  // Complete student attendance
  completeStudentAttendance(classId, 'qr');
}
```

### Theme Context
```javascript
import { useTheme } from '../context/ThemeContext';

function Component() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
```

---

## 🎨 Styling Best Practices

### Dark Mode Support
Always include dark mode variants:
```javascript
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

### Responsive Design
Use mobile-first approach:
```javascript
className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
className="p-4 sm:p-6 md:p-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Hover States
Always provide feedback:
```javascript
className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
```

### Focus States
For accessibility:
```javascript
className="focus:outline-none focus:ring-2 focus:ring-indigo-500"
```

---

## 📋 Common Patterns

### Page Layout
```javascript
export function MyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDescription')}
        showBack={true}
        actions={<Button>Action</Button>}
      />
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total" value="100" icon={Users} />
      </div>
      
      {/* Content */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Form Pattern
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Handle form submission
};
```

### List Rendering (Safe)
```javascript
{Array.isArray(items) && items.length > 0 ? (
  items.map((item, index) => (
    <div key={item.id || index}>
      {item.name}
    </div>
  ))
) : (
  <EmptyState
    title="No items"
    description="Add your first item"
    action={handleAdd}
    actionLabel="Add Item"
  />
)}
```

---

## 🔍 Debugging Tips

### Console Logs
```javascript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### React DevTools
- Install React DevTools extension
- Use Components tab to inspect props/state
- Use Profiler to find performance issues

### Network Tab
- Check API calls in browser DevTools
- Verify request/response data
- Check for errors

---

## ✅ Checklist for New Pages

- [ ] Import required components from `common`
- [ ] Add dark mode classes (`dark:*`)
- [ ] Add responsive classes (`sm:`, `md:`, `lg:`)
- [ ] Add RTL/LTR support if text-heavy
- [ ] Use `safeGet()` for nested data access
- [ ] Add `Array.isArray()` check before `.map()`
- [ ] Use `isEmpty()` for conditional rendering
- [ ] Add loading states with `LoadingSpinner`
- [ ] Add empty states with `EmptyState`
- [ ] Add error boundaries if critical
- [ ] Test in both light and dark mode
- [ ] Test in both English and Arabic
- [ ] Test on mobile, tablet, desktop

---

## 📚 Additional Resources

### Tailwind CSS
- Docs: https://tailwindcss.com/docs
- Dark Mode: https://tailwindcss.com/docs/dark-mode
- Responsive: https://tailwindcss.com/docs/responsive-design

### shadcn/ui
- Components: https://ui.shadcn.com/
- Themes: https://ui.shadcn.com/themes

### React Router
- Docs: https://reactrouter.com/

### i18next
- Docs: https://www.i18next.com/

---

## 💡 Pro Tips

1. **Always use the common components** - They're optimized and consistent
2. **Check uiConstants.js** before creating custom styles
3. **Use safeHelpers** for any risky operations
4. **Test dark mode** during development, not after
5. **Use the DevTools** React extension for debugging
6. **Keep components small** - Single responsibility principle
7. **Extract logic** to custom hooks when possible
8. **Document complex logic** with comments
9. **Use meaningful variable names** - `userData` not `d`
10. **Follow the existing patterns** in the codebase

---

**Happy Coding! 🚀**
