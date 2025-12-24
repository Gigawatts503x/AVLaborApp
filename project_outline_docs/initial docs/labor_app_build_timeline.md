# Labor Coordination App - Build Timeline & Credit Optimization
## For Perplexity Labs/Research Thread Efficiency

**Goal**: Complete rebuild from scratch with maximum code artifact density and minimum credits spent.

---

## 🎯 RECOMMENDED BUILD STRATEGY

### Single Thread Execution Plan (Most Efficient)
**Thread 1**: Backend Core + Frontend Setup (Request both full files at once)  
**Thread 2**: Pages Implementation (Request multiple pages in single response)  
**Thread 3**: Hooks & Utilities (Request all custom hooks together)  
**Thread 4**: Styling & Polish (Request CSS files with consolidation)

**Estimated Credits for Full Rebuild**: 12-15 (depending on detail level)

---

## 📋 BUILD CHECKLIST: EXECUTION ORDER

### TIER 1: FOUNDATION (2 requests)

#### Request 1.1: Database & Server Setup
**Files to Create**:
- backend/config/database.js - Query/run wrappers
- backend/setup/initDb.js - Table schemas + initialization
- backend/server.js - Express server entry point
- backend/package.json - Dependencies

**Ask Perplexity**:
> Create these 4 backend files for SQLite-based labor coordination app. Include better-sqlite3 setup, all table definitions (events, technicians, eventrequirements, eventassignments, settings, positions), indexes, and sample data initialization.

---

#### Request 1.2: Backend Routes (Full API)
**Files to Create**:
- backend/routes/index.js - ALL 25+ endpoints

**Ask Perplexity**:
> Create comprehensive Express routes for all CRUD operations. Include events, technicians, requirements, assignments (with parameter validation for all 25 fields), positions, and settings endpoints. Add extensive logging for debugging.

---

### TIER 2: FRONTEND FOUNDATION (2 requests)

#### Request 2.1: API Utility & Configuration
**Files to Create**:
- frontend/src/utils/api.js - All fetch functions
- frontend/src/utils/rateCalculator.js - Rate/pay calculations

**Ask Perplexity**:
> Create frontend API utility with all CRUD functions using axios. Include rateCalculator.js with functions for: calculateHoursBreakdown (handles day/overnight/DT window), calculateTechPayout, calculateBilling. Add proper error handling and console logging.

---

#### Request 2.2: Custom Hooks (State Management)
**Files to Create**: 7 hook files
- frontend/src/hooks/useDataStore.js
- frontend/src/hooks/useAssignments.js
- frontend/src/hooks/useRequirements.js
- frontend/src/hooks/useTechnicians.js
- frontend/src/hooks/useEvents.js
- frontend/src/hooks/useSettings.js
- frontend/src/hooks/useAllAssignments.js

**Ask Perplexity**:
> Create 7 custom hooks for React that manage app state. useDataStore is the centralized state (localStorage fallback). Other hooks provide CRUD operations for specific entities. All should integrate with API utility and provide loading/error states.

---

### TIER 3: PAGES (2 requests)

#### Request 3.1: Dashboard & Tech Management
**Files to Create**:
- frontend/src/pages/Dashboard.js
- frontend/src/pages/Technicians.js

**Ask Perplexity**:
> Create Dashboard.js with analytics cards (total events, tech hours, revenue). Create Technicians.js with full CRUD table including inline editing, sorting, filtering. Use existing hooks for data.

---

#### Request 3.2: Schedule Grid & Events
**Files to Create**:
- frontend/src/pages/ScheduleGrid.js
- frontend/src/pages/ScheduleGrid-Table.js
- frontend/src/pages/ScheduleGrid-Gantt.js
- frontend/src/pages/EventDetails.js

**Ask Perplexity**:
> Create schedule grid system with table and Gantt views. Create EventDetails.js page with requirements and assignments sections including automatic pay calculation.

---

### TIER 4: COMPONENTS (1 request)

#### Request 4.1: Editable Components
**Files to Create**:
- frontend/src/components/EditableCell.js
- frontend/src/components/EditableSelectCell.js

**Ask Perplexity**:
> Create two React components: EditableCell for inline text editing (blur to save), EditableSelectCell for dropdown selection. Both should integrate with parent onChange callbacks.

---

### TIER 5: STYLING & CONFIG (1 request)

#### Request 5.1: App Entry Points
**Files to Create**:
- frontend/src/App.js
- frontend/src/index.js
- frontend/package.json

**Ask Perplexity**:
> Create App.js with routing to all pages (Dashboard, Technicians, EventDetails, ScheduleGrid). Create index.js React entry. Create package.json with all dependencies.

---

## 💡 QUICK REQUEST TEMPLATES

### Backend Database Setup
```
Task: Create backend database layer for labor coordination app
Files: database.js, initDb.js, server.js, package.json
Requirements:
  - SQLite with better-sqlite3
  - 7 tables with foreign keys
  - All indexes
  - Sample data
```

### Frontend API & Calculations
```
Task: Create frontend API integration and rate calculators
Files: api.js, rateCalculator.js
Requirements:
  - Axios with error interceptors
  - All CRUD functions
  - Hours breakdown: base, OT (after 10h), DT (20:00-04:00)
  - Handle overnight shifts
  - Tech payout: base×rate + ot×rate×1.5 + dt×rate×2.0
```

### Custom Hooks
```
Task: Create custom React hooks for state management
Files: 7 hooks in frontend/src/hooks/
Requirements:
  - useDataStore: Central store (localStorage fallback)
  - Other hooks provide CRUD operations
  - All integrate with API utility
  - Provide loading/error states
```

---

## 🧪 TEST DATA (For Validation)

### Test Technician
```json
{
  "name": "Alice Smith",
  "techhourlyrate": 50,
  "billhourlyrate": 75
}
```

### Test Assignment (15:00-01:00 = 10h)
- Expected: 10 base, 0 OT, 3 DT
- Tech Pay: (10×$50) + (0×$50×1.5) + (3×$50×2.0) = **$800**
- Bill: (10×$75) + (0×$75×1.5) + (3×$75×2.0) = **$1,200**
- Margin: $400 (33.3%)

---

## 📊 CREDIT ESTIMATION BY PHASE

| Phase | Requests | Est. Credits |
|-------|----------|--------------|
| Tier 1: DB Setup | 2 | 2-3 |
| Tier 2: Frontend Core | 2 | 2-3 |
| Tier 3: Pages | 2 | 2-3 |
| Tier 4: Components | 1 | 1-2 |
| Tier 5: Configuration | 1 | 1-2 |
| **TOTAL** | **10** | **10-15** |

---

## 🔄 DEPENDENCY GRAPH (Build Order MUST Follow This)

```
backend/config/database.js ←─┐
backend/setup/initDb.js ←───┤→ backend/routes/index.js
                            ↓
frontend/src/utils/api.js ←─┐
frontend/src/utils/rateCalculator.js ─┤→ frontend/src/hooks/*.js
                                    ↓
            frontend/src/pages/*.js
                                    ↓
            frontend/src/App.js
                                    ↓
            frontend/src/index.js
```

**CRITICAL**: Never request pages before hooks/utils are specified!

---

## ✅ VALIDATION CHECKLIST

After each phase, verify:

- [ ] All required files created
- [ ] No TypeErrors or missing imports
- [ ] API responses match schema
- [ ] Pages render without errors
- [ ] Hooks integrate with central state
- [ ] Calculations produce expected values
- [ ] Console has no red errors
- [ ] Drag-and-drop works (if applicable)
- [ ] Filter/sort functions work
- [ ] Rate calculations match test data

---

## 🚀 OPTIMIZED BUILD TIPS

1. **Request Multiple Files Per Thread**
   - Ask for 3-5 related files in single request
   - Example: "Create these 5 hooks..." → saves credits

2. **Use Design System Efficiently**
   - Provide existing CSS in request context
   - Ask to consolidate rather than recreate

3. **Batch Related Endpoints**
   - Ask for ALL routes at once

4. **Pre-validate with Mock Data**
   - Test sample API calls BEFORE moving to next tier
   - Prevents rework

---

## 🎯 SUCCESS CRITERIA

**Full rebuild is complete when:**

1. ✅ Backend server starts (`npm start` on port 3001)
2. ✅ Frontend builds (`npm run start`)
3. ✅ Can create event → requirement → technician → assignment
4. ✅ Pay calculations auto-calculate correctly
5. ✅ Data persists after page refresh
6. ✅ All CRUD operations work
7. ✅ Filters and sorting functional
8. ✅ Schedule grid shows Gantt + Table views
9. ✅ No console errors
10. ✅ Dark mode toggles

---

## 📞 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| API 400 error on assignment | Ensure all 25 fields present |
| Hours not calculating | Verify rateCalculator handles overnight |
| State not syncing | Check useDataStore localStorage fallback |
| Page blank | Verify hooks loading correctly |
| Styling broken | Verify CSS design system variables |

---

**Estimated Build Time**: 3-4 hours for full rebuild with optimal execution!
