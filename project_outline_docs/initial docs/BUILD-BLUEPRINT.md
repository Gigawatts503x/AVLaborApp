# Labor Coordination App - Complete Build Blueprint

## 🎯 PROJECT OVERVIEW

**AV Labor Coordinator** is a full-stack web application for managing event technician scheduling, labor assignments, and automated billing calculations.

**What it does:**
- Schedule AV technicians across multiple events
- Assign technicians to specific roles/requirements per day
- Auto-calculate technician pay (with overtime/double-time rules)
- Auto-calculate customer billing (different rate structure)
- Track event profitability in real-time
- Manage technician roster with rate variations

**Tech Stack:**
- **Frontend**: React (create-react-app) with custom CSS
- **Backend**: Node.js + Express + SQLite
- **Database**: SQLite (auto-initializes, no setup needed)
- **Deployment**: Single localhost server (development mode)

---

## 📋 WHAT THE NEXT THREAD WILL BUILD

### Phase 1: Backend Foundation
**Goal**: Create working API with database & calculations

Files needed:
- `database.js` - SQLite setup & schema
- `initDb.js` - Database initialization with sample data
- `server.js` - Express server entry point
- `routes/index.js` - All 19+ API endpoints
- `package.json` - Dependencies

**Deliverable**: Fully functional REST API listening on `http://localhost:3001/api` with:
- ✅ Event CRUD operations
- ✅ Technician roster management
- ✅ Labor requirements creation
- ✅ Assignment creation (25 required fields!)
- ✅ Automatic OT/DT rate calculations
- ✅ Settings management

---

### Phase 2: Frontend Foundation
**Goal**: Create React components & state management

Files needed:
- `src/App.js` - Main app wrapper
- `src/hooks/` - All custom hooks (7 total)
- `src/utils/` - Helper functions (rateCalculator, dateUtils, api.js)
- `src/context/` - Global state management

**Custom Hooks to Build** (copy from attached files):
1. `useEvents.js` - Fetch & manage events
2. `useTechnicians.js` - Fetch & manage technicians  
3. `useRequirements.js` - Fetch & manage requirements
4. `useAssignments.js` - Fetch & manage assignments
5. `useAllAssignments.js` - Bulk assignments fetch
6. `useSettings.js` - App settings management
7. `useScheduleSync.js` - Real-time schedule sync

**Context/State**:
- `DataStoreContext.js` - Global data + EventEmitter for real-time updates
- `useDataStore.js` - Hook to access global state

**Utilities**:
- `api.js` - All HTTP calls to backend
- `rateCalculator.js` - Client-side validation of pay calculations
- `dateUtils.js` - Date formatting helpers

**Deliverable**: React app with:
- ✅ Complete state management layer
- ✅ All API integration ready
- ✅ Real-time data synchronization
- ✅ Calculation validation on client side

---

### Phase 3: UI Components & Pages
**Goal**: Build interactive user interface

**Pages** (5 main):
1. **Dashboard.js** - View/Edit events, see metrics
   - Event list with total tech payout, customer billing, margin
   - Quick actions (create event, view details)

2. **Technicians.js** - Manage technician roster
   - Add/edit/delete technicians
   - Set rates (hourly, half-day, full-day)
   - Tech rates vs. customer billing rates

3. **EventDetails.js** - Detailed event management
   - Event info (client details, dates)
   - Requirements table (read/edit)
   - Assignments table (read/edit) ← **CRITICAL COMPLEXITY**
   - Totals display (tech payout, billing, revenue, margin)

4. **ScheduleGrid.js** - Visual schedule (2 variants)
   - Table view: Calendar grid showing technicians by day
   - Gantt view: Timeline visualization
   - Toggle between day, week, month views

5. **Settings.js** - App configuration
   - OT threshold, DT threshold settings
   - DT start hour (e.g., 20:00 = after 8 PM)
   - Base rates for hourly/half-day/full-day
   - Position management (add/remove roles)

**Reusable Components** (3 critical):
1. **EditableCell.js** - Single-cell inline edit
   - Used in tables for quick updates
   - Blur-to-save pattern

2. **EditableSelectCell.js** - Dropdown cell editor
   - Used for position/technician selection
   - Pre-populated options

3. **EventEmitter.js** - Real-time event system
   - Notifies all components when data changes
   - Used for sync across browser tabs/windows

**Deliverable**: Fully interactive UI with:
- ✅ All 5 pages functional
- ✅ Real-time edits persisted to backend
- ✅ Visual feedback on calculations
- ✅ Responsive design (mobile-friendly CSS)
- ✅ Dark mode support

---

### Phase 4: Styling & Polish
**Goal**: Professional, polished UI

CSS Architecture:
- `App.css` - Global styles & layout
- Page-specific CSS files (Dashboard.css, EventDetails.css, etc.)
- `table-dark-mode.css` - Dark mode variants
- Responsive breakpoints (mobile, tablet, desktop)

Features:
- ✅ Dark mode toggle (localStorage persistence)
- ✅ Accessible forms & tables
- ✅ Loading states & error handling
- ✅ Mobile-responsive layout
- ✅ Print-friendly reports

---

## 🔧 CRITICAL TECHNICAL DETAILS

### The 25-Field Assignment Problem
Creating an assignment requires **ALL 25 fields**, even though only 15 are "logically" needed. This is the #1 gotcha.

**Required Fields**:
```
Core IDs:
- eventid, technicianid, requirementid

Work Details:
- position, roomorlocation
- hoursworked, assignmentdate, starttime, endtime

Hour Breakdown:
- basehours, othours, dothours
- (Must add to hoursworked exactly!)

Rate Type & Rates:
- ratetype (hourly/half-day/full-day)
- techhourlyrate, techhalfdayrate, techfulldayrate
- billhourlyrate, billhalfdayrate, billfulldayrate

Calculated Values:
- calculatedpay (tech payout)
- customerbill (customer invoice)
- notes (optional)
```

**⚠️ If ANY field is missing → 500 error, assignment not created**

### Calculation Rules

**Hour Classification**:
- Base: First 8 hours per day (or per half-day/full-day rate)
- OT: Hours 9-10 (1.5x rate)
- DT: Hours 20+, OR after 20:00 (8 PM) = 2x rate

**Tech Pay**:
```
= (basehours × techhourlyrate) 
  + (othours × techhourlyrate × 1.5)
  + (dothours × techhourlyrate × 2.0)
```

**Customer Bill**:
```
= (basehours × billhourlyrate)
  + (othours × billhourlyrate × 1.5)
  + (dothours × billhourlyrate × 2.0)
```

**Event Totals** (auto-calculated):
```
totaltechpayout = SUM(calculatedpay) for all assignments
totalcustomerbilling = SUM(customerbill) for all assignments
totallaborcost = totaltechpayout (same thing)
```

### Data Relationships

```
Event
├─ Has many Requirements (cleanup via cascade delete)
├─ Totals are auto-calculated from Assignments
└─ Has many Assignments (via Requirements)

Requirement
├─ Belongs to one Event
├─ Specifies role, location, date, time
├─ References how many techs needed
└─ Has many Assignments (cleanup via cascade delete)

Technician
└─ Has many Assignments
   (assigned across multiple events)

Assignment
├─ Belongs to Event (via requirement)
├─ Belongs to Technician
├─ Belongs to Requirement
├─ Contains all work + payment details
└─ Calculations based on Technician rates
```

### Database Schema

**7 Tables**:

1. **Events** (13 fields)
   - id, name, clientname, clientcontact, clientphone, clientemail, clientaddress
   - ponumber, startdate, enddate
   - totaltechpayout, totallaborcost, totalcustomerbilling (auto-calculated)

2. **Technicians** (11 fields)
   - id, name, phone, email, ratetype
   - techhourlyrate, techhalfdayrate, techfulldayrate
   - billhourlyrate, billhalfdayrate, billfulldayrate

3. **Positions** (2 fields)
   - id, name (roles like "Audio Tech", "Camera Op")

4. **Requirements** (11 fields)
   - id, eventid, requirementdate, requirementenddate
   - roomorlocation, settime, starttime, endtime, striketime
   - position, techsneeded

5. **Assignments** (25 fields)
   - All fields listed in "25-Field Assignment Problem" section above

6. **Settings** (8 fields)
   - id, halfdayhours (default 5), fulldayhours (default 10)
   - otthreshold (default 10), dotthreshold (default 20)
   - dotstarthour (default 20), techbaserate (50), customerbaserate (75)

7. **Event Summaries** (optional, calculated on-read)
   - Not stored; calculated from Assignments when Event is fetched

---

## 📚 DOCUMENTATION FILES PROVIDED

### For the Build Thread

**START HERE** → `00-START-HERE.md`
- Entry point for any builder
- Quick paths based on role (developer, architect, manager)
- Core formula explanation
- Success validation checklist

**QUICK REFERENCE** → `QUICK_REFERENCE_CARD.md`
- 1-page API cheat sheet
- Data models at a glance
- Common tasks with code examples
- API endpoints list with HTTP method

**COMPLETE SPEC** → `labor_app_rebuild_documentation.md`
- Full technical reference
- Database schema with SQL
- All calculations with test cases
- Component architecture
- API contract (request/response examples)

**API SPEC** → `labor-app-openapi-3.0.json`
- Importable into Postman/Swagger
- All 19+ endpoints formally defined
- Request/response schemas
- Example payloads for each endpoint

**BUILD PLAN** → `labor_app_build_timeline.md`
- Recommended 5-tier build strategy
- Execution order & dependencies
- 10 optimized Perplexity Labs requests (copy-paste ready)
- Credit estimation (12-15 total)
- Validation checklist per tier

**NAVIGATION** → `documentation-index.md`
- 4 different learning paths (2-6 hours each)
- Glossary of all terms
- Workflow examples
- Test case validation

**PROJECT SUMMARY** → `delivery-summary.md`
- Requirement-by-requirement verification
- Status matrix with document locations
- Metrics (lines, examples, endpoints)
- Quality assurance checklist

**MACHINE-READABLE** → `documentation-manifest.json`
- Complete project metadata
- All documents indexed
- Learning path sequences
- Statistics (total lines, credits, time)

---

## 🚀 HOW TO USE WITH PERPLEXITY LABS

### Recommended Workflow

**For the Next Thread:**

1. **Provide these files**:
   - `00-START-HERE.md` (orientation)
   - `QUICK_REFERENCE_CARD.md` (quick lookup)
   - `labor_app_rebuild_documentation.md` (complete spec)
   - `labor-app-openapi-3.0.json` (API spec)

2. **Use the build timeline**:
   - Request 1-2: Backend database + routes (copy from build_timeline.md)
   - Request 3-4: Frontend hooks + state management
   - Request 5-6: Dashboard + event pages
   - Request 7-8: Technicians + Settings pages
   - Request 9-10: Styling + polish

3. **Labs Request Template**:
   ```
   [Provide START-HERE + QUICK_REFERENCE + documentation.md + openapi.json]
   
   Build [specific tier/component] using the provided specs.
   
   Required deliverables:
   - [List specific files]
   - [List specific functionality]
   - [List success criteria]
   ```

---

## ✅ SUCCESS CRITERIA (Everything Working)

### Backend Complete
- [ ] Server starts: `node server.js` → listening on :3001
- [ ] GET /events → returns array (can be empty)
- [ ] POST /events → creates event with ID
- [ ] POST /technicians → creates with all rates
- [ ] POST /requirements → creates for event
- [ ] POST /assignments → creates with all 25 fields, auto-calculates pay
- [ ] All CRUD operations work (GET single, PUT/PATCH, DELETE)
- [ ] Cascade deletes work (delete event → deletes requirements & assignments)
- [ ] GET /events/{id} → shows totaltechpayout, totalcustomerbilling (calculated)

### Frontend Complete
- [ ] `npm start` → React app loads
- [ ] Dashboard shows events list
- [ ] Can create event (form modal)
- [ ] Can create technician + set rates
- [ ] Can add requirements to event
- [ ] Can create assignments (all 25 fields)
- [ ] Real-time calculations display correctly
- [ ] Dark mode toggle works
- [ ] Responsive on mobile (no horizontal scroll)
- [ ] State persists across page refreshes (from API)

### Integration Complete
- [ ] Frontend ↔ Backend communication works
- [ ] Real-time edits persist
- [ ] Calculations on frontend match backend
- [ ] No console errors
- [ ] No broken API calls

### Test Scenario
1. Create event: "Annual Conference 2025"
2. Create 3 technicians with different rates
3. Add 10 requirements across 3 days
4. Create 15 assignments (various hour combinations)
5. Verify: Event totals = sum of all assignment pays
6. Edit 1 assignment's hours
7. Verify: Event totals update automatically
8. Delete 1 technician
9. Verify: Assignments deleted cascade correctly
10. Change OT threshold in settings
11. Verify: Calculations recalculate for all assignments

---

## 📦 FILES SUMMARY

| File | Purpose | Type |
|------|---------|------|
| **00-START-HERE.md** | Entry point, orientation | Markdown |
| **QUICK_REFERENCE_CARD.md** | Quick lookup, cheat sheet | Markdown |
| **labor_app_rebuild_documentation.md** | Complete technical spec | Markdown |
| **labor-app-openapi-3.0.json** | API specification (Postman-importable) | JSON |
| **labor_app_build_timeline.md** | Build strategy, requests, credits | Markdown |
| **documentation-index.md** | Navigation, learning paths | Markdown |
| **delivery-summary.md** | Requirement verification, metrics | Markdown |
| **documentation-manifest.json** | Machine-readable metadata | JSON |
| **postman-project-outline.md** | Postman-specific setup guide | Markdown |
| **labor-app-openapi-3.0.yaml** | Alternative YAML spec (for reference) | YAML |

---

## 💡 KEY INSIGHTS FOR THE NEXT THREAD

### What Makes This Complex
1. **25-field assignments** - Must provide all fields or 500 error
2. **Calculation accuracy** - OT/DT math must be exact (billing $$)
3. **Data relationships** - Cascade deletes, referential integrity
4. **Rate variations** - Different rates for hourly/half-day/full-day
5. **Real-time sync** - Changes in one tab notify other tabs

### What's Already Solved (in documentation)
✅ Complete database schema
✅ All calculation formulas with test cases
✅ API contract with examples
✅ Component architecture
✅ Learning paths (don't need to figure it out)
✅ Success criteria (know when done)
✅ Build order (dependencies mapped)

### What Still Needs Building
❌ Backend database initialization
❌ Express routes (19+ endpoints)
❌ React components (5 pages)
❌ Custom hooks (7 total)
❌ CSS/styling
❌ Real-time sync between tabs
❌ Integration testing

---

## 🎯 NEXT STEPS FOR YOU

1. **Provide all .md files** to the next Labs thread
2. **Start with 00-START-HERE.md** section
3. **Follow the build_timeline.md** requests in order
4. **Use labor_app_rebuild_documentation.md** for any clarifications
5. **Reference QUICK_REFERENCE_CARD.md** for quick lookups
6. **Validate using delivery-summary.md** success criteria

**Estimated total build time**: 3-4 hours (using 10-12 Labs requests)

---

## ❓ COMMON QUESTIONS FOR THE NEXT THREAD

**"Where do I start?"**
→ Read 00-START-HERE.md, then follow build_timeline.md

**"What's the database schema?"**
→ See labor_app_rebuild_documentation.md section: "Complete Database Schema"

**"What are all the API endpoints?"**
→ Use labor-app-openapi-3.0.json (import into Postman) OR QUICK_REFERENCE_CARD.md

**"What's the 25-field assignment issue?"**
→ See QUICK_REFERENCE_CARD.md "Critical: Assignment with 25 Fields" section

**"How do calculations work?"**
→ See labor_app_rebuild_documentation.md "Mathematical Calculations" section

**"What's the build order?"**
→ Follow labor_app_build_timeline.md, Tier 1 through Tier 5

**"How do I know it's done?"**
→ Check delivery-summary.md success criteria

---

## 📞 SUPPORT FOR THE NEXT THREAD

If issues arise:
1. **Check 00-START-HERE.md** "Critical Gotchas" section
2. **Search QUICK_REFERENCE_CARD.md** for the component/endpoint
3. **Review labor_app_rebuild_documentation.md** complete spec
4. **Compare to openapi.json** for correct request/response format
5. **Run test scenario** from success criteria section above

---

**This document IS the project blueprint. Everything the next thread needs is in the provided .md files.**

**You don't need to brief them beyond saying:**

> "Build the AV Labor Coordinator app following the specs in these files. Start with 00-START-HERE.md and follow the build_timeline.md. Everything you need to know is documented."

**They'll have:**
✅ Complete spec
✅ All calculations
✅ API contract
✅ Database schema
✅ Build order
✅ Success criteria
✅ Test scenarios

**No ambiguity. No back-and-forth. Just build.**
