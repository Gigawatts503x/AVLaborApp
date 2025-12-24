# Tier 5: Styling System & Entry Points Configuration

## Environment Variables (.env)

```bash
# Backend Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000

# Environment
REACT_APP_ENV=development
```

## Environment Variables (.env.production)

```bash
# Backend Configuration (Production)
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_TIMEOUT=15000

# Environment
REACT_APP_ENV=production
```

---

## Public Files Structure

### public/favicon.ico
- Application icon (place your icon here)
- Size: 32x32 or 64x64 pixels
- Format: ICO or PNG

### public/manifest.json
```json
{
  "short_name": "AV Coordinator",
  "name": "AV Labor Coordinator",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24",
      "type": "image/x-icon"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff"
}
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "serve": "serve -s build"
  }
}
```

---

## CSS File Organization

```
src/styles/
├── index.css                 (Global styles & design tokens)
├── App.css                   (App-specific styles)
├── Dashboard.css             (Dashboard page styles)
├── EventsPage.css            (Events page styles)
├── TechniciansPage.css       (Technicians page styles)
├── EventDetailsPage.css      (Event details page styles)
└── components/
    ├── Button.css            (Button component styles)
    ├── Card.css              (Card component styles)
    ├── FormInput.css         (Form input styles)
    ├── Modal.css             (Modal component styles)
    ├── Table.css             (Table component styles)
    ├── Alert.css             (Alert component styles)
    └── LoadingSpinner.css    (Spinner component styles)
```

---

## File Locations

### Entry Points
- `public/index.html` - HTML entry point
- `src/index.jsx` - React entry point
- `src/App.jsx` - Main app component

### Styles
- `src/styles/index.css` - Global styles (import first!)
- `src/styles/*.css` - Page-specific styles
- `src/styles/components/*.css` - Component styles

### Components
- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/hooks/` - Custom hooks
- `src/utils/` - Utility functions

---

## Import Order

Always import styles in this order:

```javascript
// 1. Global styles first
import './styles/index.css';

// 2. Component styles
import './components/MyComponent.css';

// 3. Page styles (if applicable)
import './pages/MyPage.css';

// 4. React imports
import React from 'react';

// 5. Component imports
import { Button, Card } from '../components';
import MyHook from '../hooks/useMyHook';
```

---

## Development Mode

```bash
# Start development server
npm start

# Runs on http://localhost:3000
# Backend should run on http://localhost:3001
```

---

## Production Build

```bash
# Create optimized production build
npm run build

# Build folder: build/
# Ready for deployment
```

---

## Styling Conventions

### CSS Custom Properties Usage

```css
/* Use design tokens */
color: var(--primary-main);
background: var(--primary-gradient);
font-size: var(--font-size-lg);
padding: var(--spacing-4);
border-radius: var(--radius-base);
box-shadow: var(--shadow-md);
transition: all var(--transition-base);
```

### Responsive Design

```css
/* Mobile-first approach */
.container {
  padding: var(--spacing-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-8);
  }
}

/* Desktop and up */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## Theme Implementation

### Colors Available
- Primary: `--primary-main`, `--primary-dark`, `--primary-light`
- Success: `--success-color`
- Error: `--error-color`
- Warning: `--warning-color`
- Info: `--info-color`
- Neutral: `--color-gray-100` through `--color-gray-700`

### Spacing Scale
```
0 → 0
1 → 0.25rem (4px)
2 → 0.5rem (8px)
3 → 0.75rem (12px)
4 → 1rem (16px)
6 → 1.5rem (24px)
8 → 2rem (32px)
12 → 3rem (48px)
16 → 4rem (64px)
20 → 5rem (80px)
24 → 6rem (96px)
```

---

## Troubleshooting

### Styles Not Applied
1. Check import order (global styles first)
2. Verify CSS file path is correct
3. Check browser DevTools for CSS errors
4. Clear browser cache

### Layout Issues
1. Check `box-sizing: border-box` is set
2. Verify flexbox/grid syntax
3. Test responsive breakpoints
4. Use DevTools to inspect elements

### Performance
1. Minify CSS in production
2. Use CSS variables to reduce redundancy
3. Avoid inline styles
4. Remove unused CSS

---

## Design System Features

✅ Comprehensive color palette  
✅ Responsive typography  
✅ Flexible spacing scale  
✅ Predefined shadows & transitions  
✅ Z-index management  
✅ Print styles  
✅ Utility classes  
✅ Accessibility-first approach  
