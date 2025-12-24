# 📥 TIER 2 FRONTEND - ALL FILES READY FOR DOWNLOAD

## 🎯 Download These 9 Files

Your production-ready frontend foundation consists of **9 files**:

---

## ✅ FILE LISTING

### **1. frontend-package.json** (35 lines)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
```
**What it is**: NPM dependencies configuration  
**Where to use**: Package file for npm install  
**Contains**: React, routing, HTTP, UUID packages

---

### **2. api.js** (150+ lines)
**What it is**: API client layer with all endpoints  
**Where to use**: `src/utils/api.js`  
**Contains**:
- Axios client instance
- Request/response interceptors (logging)
- eventsAPI (5 methods)
- techniciansAPI (5 methods)
- requirementsAPI (4 methods)
- assignmentsAPI (5 methods)
- positionsAPI (3 methods)
- settingsAPI (2 methods)
- healthAPI (1 method)

**Use in components**:
```javascript
import { eventsAPI, assignmentsAPI } from './utils/api';
const events = await eventsAPI.getAll();
```

---

### **3. rateCalculator.js** (200+ lines)
**What it is**: Rate and payment calculation utilities  
**Where to use**: `src/utils/rateCalculator.js`  
**Contains**:
- calculateHoursBreakdown() - Base/OT/DT logic
- calculateTechPayout() - Tech pay formula
- calculateBilling() - Customer billing formula
- calculateMargin() - Profit margin calculation
- formatCurrency() - Currency display
- formatHours() - Hours display
- testRateCalculator() - Test/validation

**Use in components**:
```javascript
import { calculateHoursBreakdown, calculateTechPayout } from './utils/rateCalculator';
const hours = calculateHoursBreakdown('15:00', '01:00');
const pay = calculateTechPayout({ ...hours, techhourlyrate: 50 });
```

---

### **4. DataStoreContext.js** (150+ lines)
**What it is**: Central state management context  
**Where to use**: `src/hooks/DataStoreContext.js`  
**Contains**:
- DataStoreContext definition
- DataStoreProvider component
- State for 6 entities (events, technicians, requirements, assignments, positions, settings)
- Helper methods (getById, getByEventId, etc.)
- Event total calculations
- Loading/error states

**Wrap your app**:
```javascript
import { DataStoreProvider } from './hooks/DataStoreContext';

function App() {
  return (
    <DataStoreProvider>
      <YourComponent />
    </DataStoreProvider>
  );
}
```

---

### **5. useEvents.js** (100+ lines)
**What it is**: Event management hook  
**Where to use**: `src/hooks/useEvents.js`  
**Provides**:
- fetchEvents() - Fetch all events
- createEvent(data) - Create event
- updateEvent(id, data) - Update event
- deleteEvent(id) - Delete event
- getEventById(id) - Helper
- getEventTotals(eventId) - Helper

**Use in components**:
```javascript
import { useEvents } from './hooks/useEvents';

function EventsPage() {
  const { events, isLoading, createEvent, deleteEvent } = useEvents();
  // ...
}
```

---

### **6. useTechnicians.js** (80+ lines)
**What it is**: Technician management hook  
**Where to use**: `src/hooks/useTechnicians.js`  
**Provides**:
- fetchTechnicians()
- createTechnician(data)
- updateTechnician(id, data)
- deleteTechnician(id)
- getTechnicianById(id)

---

### **7. useRequirements.js** (80+ lines)
**What it is**: Labor requirements hook  
**Where to use**: `src/hooks/useRequirements.js`  
**Provides**:
- fetchRequirements(eventId)
- createRequirement(data)
- updateRequirement(id, eventId, data)
- deleteRequirement(id, eventId)
- getRequirementsByEventId(eventId)
- getRequirementById(id)

---

### **8. useAssignments.js** (90+ lines)
**What it is**: Assignment management hook  
**Where to use**: `src/hooks/useAssignments.js`  
**Provides**:
- fetchAssignments(eventId)
- createAssignment(data) ⚠️ ALL 25 FIELDS REQUIRED
- updateAssignment(id, eventId, data)
- deleteAssignment(id, eventId)
- getAssignmentsByEventId(eventId)
- getAssignmentsByTechnicianId(techId)
- getAssignmentById(id)

---

### **9. useSettings.js** (100+ lines)
**What it is**: Settings and positions hook  
**Where to use**: `src/hooks/useSettings.js`  
**Provides**:
- fetchSettings()
- updateSettings(data)
- fetchPositions()
- createPosition(data)
- deletePosition(name)

---

## 🏗️ DIRECTORY STRUCTURE

```
src/
├── utils/
│   ├── api.js                    (150 lines)
│   └── rateCalculator.js         (200 lines)
├── hooks/
│   ├── DataStoreContext.js       (150 lines)
│   ├── useEvents.js              (100 lines)
│   ├── useTechnicians.js         (80 lines)
│   ├── useRequirements.js        (80 lines)
│   ├── useAssignments.js         (90 lines)
│   └── useSettings.js            (100 lines)
├── App.js
├── index.js
└── package.json (updated with frontend-package.json)
```

---

## 🚀 INSTALLATION

### Step 1: Create React App
```bash
npx create-react-app av-labor-coordinator-frontend
cd av-labor-coordinator-frontend
```

### Step 2: Create Directories
```bash
mkdir -p src/utils src/hooks
```

### Step 3: Copy Files
- **frontend-package.json** → Update your `package.json`
- **api.js** → `src/utils/api.js`
- **rateCalculator.js** → `src/utils/rateCalculator.js`
- **DataStoreContext.js** → `src/hooks/DataStoreContext.js`
- **useEvents.js** → `src/hooks/useEvents.js`
- **useTechnicians.js** → `src/hooks/useTechnicians.js`
- **useRequirements.js** → `src/hooks/useRequirements.js`
- **useAssignments.js** → `src/hooks/useAssignments.js`
- **useSettings.js** → `src/hooks/useSettings.js`

### Step 4: Install Dependencies
```bash
npm install
# or
npm install --legacy-peer-deps
```

### Step 5: Start Development Server
```bash
npm start
```

---

## 📊 WHAT'S IMPLEMENTED

✅ **API Layer** (150+ lines)
- Axios HTTP client
- Request/response interceptors
- 24+ API methods
- Environment variable support
- Error handling

✅ **Rate Calculator** (200+ lines)
- Hours breakdown (base/OT/DT)
- Tech payout calculation
- Customer billing calculation
- Profit margin
- Format helpers
- Test function

✅ **State Management** (150+ lines)
- Central DataStoreContext
- 6 entity stores
- Helper methods
- Callback updates
- Loading/error states

✅ **Custom Hooks** (450+ lines, 6 total)
- useEvents - Event CRUD
- useTechnicians - Technician CRUD
- useRequirements - Requirement CRUD
- useAssignments - Assignment CRUD
- useSettings - Settings & positions
- Auto-refresh on mutations

---

## 🔌 QUICK API USAGE

```javascript
// Import what you need
import { eventsAPI, assignmentsAPI } from './utils/api';
import { calculateHoursBreakdown, calculateTechPayout } from './utils/rateCalculator';
import { useEvents, useAssignments } from './hooks';

// In your component
const { events, createEvent } = useEvents();
const { assignments, createAssignment } = useAssignments();

// Use API directly
const allEvents = await eventsAPI.getAll();
const newEvent = await eventsAPI.create({ name: 'Event' });

// Use hooks (recommended)
await createEvent({ name: 'Event', clientname: 'Client' });

// Use calculator
const hours = calculateHoursBreakdown('15:00', '01:00');
const pay = calculateTechPayout({ ...hours, techhourlyrate: 50 });
```

---

## 💾 FILE SIZES

| File | Lines | Size |
|------|-------|------|
| frontend-package.json | 35 | ~1 KB |
| api.js | 150+ | ~5 KB |
| rateCalculator.js | 200+ | ~8 KB |
| DataStoreContext.js | 150+ | ~5 KB |
| useEvents.js | 100+ | ~3 KB |
| useTechnicians.js | 80+ | ~2.5 KB |
| useRequirements.js | 80+ | ~2.5 KB |
| useAssignments.js | 90+ | ~3 KB |
| useSettings.js | 100+ | ~3.5 KB |
| **TOTAL** | **1,200+** | **~33 KB** |

All files lightweight and efficient.

---

## ⚠️ CRITICAL REQUIREMENTS

1. **Backend Running**: Ensure backend is running on `http://localhost:3001`
2. **API Base URL**: Set `REACT_APP_API_URL` environment variable if different
3. **DataStoreProvider**: Wrap entire app with context provider
4. **25-Field Assignments**: Always provide all 25 fields when creating assignments
5. **Auto-Refresh**: All mutations automatically refresh the list (don't re-fetch manually)

---

## 🧪 TESTING

### Test API Connection
```javascript
import { healthAPI } from './utils/api';

const health = await healthAPI.check();
// Should return { status: 'ok', timestamp: '...' }
```

### Test Calculator
```javascript
import { testRateCalculator } from './utils/rateCalculator';

testRateCalculator();
// Logs test results to console
// All tests should pass
```

---

## 🎯 NEXT STEPS

1. Download all 9 files
2. Follow installation steps above
3. Test API connection with healthAPI
4. Test calculator with testRateCalculator
5. Wrap app with DataStoreProvider
6. Start building UI pages (Tier 3)

---

## 📥 DOWNLOAD CHECKLIST

- [ ] frontend-package.json
- [ ] api.js
- [ ] rateCalculator.js
- [ ] DataStoreContext.js
- [ ] useEvents.js
- [ ] useTechnicians.js
- [ ] useRequirements.js
- [ ] useAssignments.js
- [ ] useSettings.js

**All 9 files ready!** ✅

---

**Tier 2: Production Ready Foundation** 🚀

Ready for Tier 3 (UI Pages & Components)
