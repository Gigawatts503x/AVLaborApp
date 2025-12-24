# 🚀 LABS REQUEST - AV Labor Coordinator App Build

## YOUR MISSION
Build the **AV Labor Coordinator** application—a complete full-stack event management system with technician scheduling, labor assignments, and automated pay/billing calculations.

**Bottom line**: Everything you need to know is in the supporting documentation. Read them thoroughly. No ambiguity. No back-and-forth. Just build.

---

## 📚 REQUIRED DOCUMENTS (READ ALL THOROUGHLY)

### CRITICAL - Start Here (Read First)
1. **BUILD-BLUEPRINT.md** ← START HERE - High-level overview of what you're building
2. **00-START-HERE.md** ← Then read this - Project orientation + formulas + gotchas
3. **labor_app_rebuild_documentation.md** ← Full technical specification

### Supporting Documents (Reference as Needed)
4. **QUICK_REFERENCE_CARD.md** - One-page cheat sheet, API endpoints, common tasks
5. **labor-app-openapi-3.0.json** - Import into Postman for API testing
6. **labor_app_build_timeline.md** - Exact build order + dependencies
7. **delivery-summary.md** - Success criteria & validation checklist
8. **documentation-index.md** - Navigation guide if you get lost

### Optional but Helpful
9. **documentation-manifest.json** - Machine-readable project metadata
10. **postman-project-outline.md** - Postman setup guide

---

## ⚠️ CRITICAL INSTRUCTION: SCAN DOCUMENTS THOROUGHLY

Before you start coding, you MUST:

- [ ] Read BUILD-BLUEPRINT.md cover-to-cover (5 min)
- [ ] Read 00-START-HERE.md cover-to-cover (10 min)
- [ ] Skim labor_app_rebuild_documentation.md for context (10 min)
- [ ] Bookmark QUICK_REFERENCE_CARD.md for lookups
- [ ] Understand the build order from labor_app_build_timeline.md

**Why?** The documentation answers 95% of questions you might have. Don't ask—search the docs first.

---

## 🎯 WHAT YOU'RE BUILDING

**Full-stack application** with:

### Backend
- Node.js + Express REST API (19+ endpoints)
- SQLite database (auto-initializes)
- Automatic pay calculations (base, OT, DT)
- Real-time billing calculations
- Cascade deletes with referential integrity

### Frontend  
- React application (create-react-app)
- 5 main pages (Dashboard, Technicians, Event Details, Schedule, Settings)
- Real-time state management with EventEmitter
- Dark mode support
- Mobile-responsive design
- Inline editable tables

### Database
- 7 tables (Events, Technicians, Requirements, Assignments, Positions, Settings, summaries)
- Complete relationships with cascade deletes
- Auto-calculated totals

---

## 🔴 THE 25-FIELD ASSIGNMENT PROBLEM (CRITICAL)

**This is the #1 gotcha in this project.**

Creating an assignment requires **ALL 25 fields**. If ANY field is missing → 500 error.

**The 25 fields** (from QUICK_REFERENCE_CARD.md):
```
Core IDs: eventid, technicianid, requirementid
Work Details: position, roomorlocation, hoursworked, assignmentdate, starttime, endtime
Hour Breakdown: basehours, othours, dothours (must sum to hoursworked)
Rate Type & Rates: ratetype, techhourlyrate, techhalfdayrate, techfulldayrate
                  billhourlyrate, billhalfdayrate, billfulldayrate
Calculated Values: calculatedpay, customerbill
Optional: notes
```

**Find more details** in:
- labor_app_rebuild_documentation.md → "Assignment Schema" section
- QUICK_REFERENCE_CARD.md → "Critical: Assignment with 25 Fields"

---

## 📐 CALCULATION RULES (ALL IN DOCUMENTATION)

**Tech Pay Formula**:
```
= (basehours × techhourlyrate)
  + (othours × techhourlyrate × 1.5)
  + (dothours × techhourlyrate × 2.0)
```

**Customer Bill Formula**:
```
= (basehours × billhourlyrate)
  + (othours × billhourlyrate × 1.5)
  + (dothours × billhourlyrate × 2.0)
```

**Hour Thresholds**:
- Base: First 8 hours
- OT: Hours 9-10 (1.5x)
- DT: Hours 20+, OR after 20:00 (8 PM) = 2x

**Complete rules + test cases** in:
- labor_app_rebuild_documentation.md → "Mathematical Calculations"

---

## 🏗️ BUILD ORDER (FOLLOW EXACTLY)

**Phase 1: Backend Foundation** (Database + API)
- Database schema (7 tables)
- Express server + routes (19+ endpoints)
- All CRUD operations
- Calculation logic

**Phase 2: Frontend Foundation** (State + Hooks)
- React app setup
- Global state management (DataStoreContext)
- 7 custom hooks
- API integration layer

**Phase 3: UI Components & Pages**
- 5 main pages
- 3 reusable components
- Editable tables
- Modal forms

**Phase 4: Styling & Polish**
- CSS architecture
- Dark mode
- Responsive design
- Mobile optimization

**Phase 5: Integration & Testing**
- Frontend ↔ Backend communication
- Real-time sync
- Validation & error handling
- Test scenario (11 step validation)

**Exact step-by-step in**: labor_app_build_timeline.md

---

## ✅ SUCCESS CRITERIA (Know When You're Done)

### Backend Working
- [ ] Server starts: `node server.js` → listening on :3001
- [ ] GET /events → returns array
- [ ] POST /events → creates with ID
- [ ] POST /technicians → creates with all rates
- [ ] POST /requirements → creates for event
- [ ] POST /assignments → creates with ALL 25 fields, auto-calculates
- [ ] All CRUD ops work (GET, PUT/PATCH, DELETE)
- [ ] Cascade deletes work
- [ ] GET /events/{id} → calculates & returns totaltechpayout, totalcustomerbilling

### Frontend Working
- [ ] `npm start` → React app loads, no errors
- [ ] Dashboard shows event list
- [ ] Can create events (form modal)
- [ ] Can create technicians with rates
- [ ] Can add requirements to events
- [ ] Can create assignments
- [ ] Real-time calculations display correctly
- [ ] Dark mode toggle works
- [ ] Responsive on mobile
- [ ] State persists across page refreshes (from API)

### Integration Working
- [ ] Frontend ↔ Backend communication flawless
- [ ] Real-time edits persist immediately
- [ ] Calculations on frontend match backend exactly
- [ ] No console errors
- [ ] No broken API calls

### Test Scenario (11-step validation)
1. Create event: "Annual Conference 2025"
2. Create 3 technicians with different rates
3. Add 10 requirements across 3 days
4. Create 15 assignments (various hour combos)
5. Verify: Event totals = sum of assignment pays
6. Edit 1 assignment's hours
7. Verify: Event totals update automatically
8. Delete 1 technician
9. Verify: Assignments deleted cascade correctly
10. Change OT threshold in settings
11. Verify: Calculations recalculate for all assignments

**Full checklist in**: delivery-summary.md

---

## 🔍 IF YOU GET STUCK

**Before asking for help, follow this:**

1. **Check BUILD-BLUEPRINT.md** → "Critical Technical Details" section
2. **Check QUICK_REFERENCE_CARD.md** → Search for your component/endpoint
3. **Check labor_app_rebuild_documentation.md** → Full specification with examples
4. **Check labor-app-openapi-3.0.json** → Compare your request/response format
5. **Check documentation-index.md** → Navigation guide if lost

**Example**: If you don't know the Assignments schema:
→ See labor_app_rebuild_documentation.md → "Assignment Schema" section
→ Or QUICK_REFERENCE_CARD.md → "Assignment Fields"

---

## 📞 COMMON QUESTIONS (ALL ANSWERED IN DOCS)

| Question | Answer Location |
|----------|-----------------|
| Where do I start? | BUILD-BLUEPRINT.md + 00-START-HERE.md |
| What's the database schema? | labor_app_rebuild_documentation.md → "Database Schema" |
| What are all 19+ API endpoints? | labor-app-openapi-3.0.json (or QUICK_REFERENCE_CARD.md) |
| What's the 25-field assignment issue? | BUILD-BLUEPRINT.md + QUICK_REFERENCE_CARD.md |
| How do OT/DT calculations work? | labor_app_rebuild_documentation.md → "Mathematical Calculations" |
| What's the build order? | labor_app_build_timeline.md |
| How do I know it's done? | delivery-summary.md → "Success Criteria" |
| What hooks do I need? | BUILD-BLUEPRINT.md → "Phase 2: Frontend Foundation" |
| What pages do I build? | BUILD-BLUEPRINT.md → "Phase 3: UI Components & Pages" |
| What's the data flow? | labor_app_rebuild_documentation.md → "Data Relationships" |

---

## 📊 PROJECT STATS

| Metric | Value |
|--------|-------|
| Backend Tables | 7 |
| API Endpoints | 19+ |
| Frontend Pages | 5 |
| Custom Hooks | 7 |
| Reusable Components | 3+ |
| Required Assignment Fields | 25 (⚠️ ALL REQUIRED) |
| Calculation Types | 3 (base, OT, DT) |
| Success Criteria | 20+ |
| Total Documentation | 8 main files + 2 JSON |
| Estimated Build Time | 3-4 hours (depending on Labs efficiency) |

---

## 🎓 LEARNING PATHS (IF YOU NEED ORIENTATION)

**Path 1: Fast Track (New to project)**
1. BUILD-BLUEPRINT.md (5 min)
2. 00-START-HERE.md (10 min)
3. QUICK_REFERENCE_CARD.md (5 min)
4. Start building (follow labor_app_build_timeline.md)

**Path 2: Deep Dive (Want everything)**
1. BUILD-BLUEPRINT.md (full)
2. 00-START-HERE.md (full)
3. labor_app_rebuild_documentation.md (full)
4. labor-app-openapi-3.0.json (review all endpoints)
5. labor_app_build_timeline.md (understand dependencies)
6. Start building

**Path 3: Focused Build (Already know what you need)**
1. Skim BUILD-BLUEPRINT.md
2. Read your assigned phase in labor_app_build_timeline.md
3. Reference labor_app_rebuild_documentation.md as needed
4. Use QUICK_REFERENCE_CARD.md for quick lookups
5. Build that phase

---

## 💡 KEY PROJECT INSIGHTS

**What Makes This Complex** (understand before starting):
1. **25-field assignments** - Must provide ALL fields or 500 error
2. **Calculation accuracy** - OT/DT math must be exact (it's billing $$)
3. **Data relationships** - Cascade deletes, referential integrity
4. **Rate variations** - Different rates for hourly/half-day/full-day
5. **Real-time sync** - Changes in one tab notify other tabs

**What's Already Solved** (you don't need to figure out):
✅ Complete database schema with SQL
✅ All calculation formulas with test cases
✅ API contract with request/response examples
✅ Component architecture planned
✅ Success criteria defined
✅ Build order mapped with dependencies

**What You Build**:
❌ Backend database initialization
❌ Express routes (19+ endpoints)
❌ React components (5 pages + 3 reusable)
❌ Custom hooks (7 total)
❌ CSS/styling (responsive + dark mode)
❌ Real-time sync (EventEmitter)
❌ Integration testing (validate all works together)

---

## 📋 YOUR DELIVERABLES

### Phase 1 (Backend)
- ✅ Working Express API on :3001
- ✅ SQLite database with 7 tables
- ✅ All 19+ CRUD endpoints
- ✅ Calculation logic (base/OT/DT)
- ✅ Cascade deletes

### Phase 2 (Frontend Foundation)
- ✅ React app with state management
- ✅ 7 custom hooks fully functional
- ✅ API integration layer complete
- ✅ Real-time EventEmitter system

### Phase 3 (UI)
- ✅ 5 main pages built
- ✅ 3+ reusable components
- ✅ Editable tables with inline save
- ✅ Modal forms for creation
- ✅ All interactions working

### Phase 4 (Polish)
- ✅ Professional CSS
- ✅ Dark mode toggle
- ✅ Mobile responsive
- ✅ Loading states
- ✅ Error handling

### Phase 5 (Integration)
- ✅ Frontend ↔ Backend seamless
- ✅ All 11 test scenario steps pass
- ✅ No console errors
- ✅ Production-ready code

---

## 🚀 START NOW

### Step 1: Read Documents (30 minutes)
```
1. BUILD-BLUEPRINT.md (5 min)
2. 00-START-HERE.md (10 min)
3. labor_app_rebuild_documentation.md skim (10 min)
4. Bookmark QUICK_REFERENCE_CARD.md
```

### Step 2: Understand Build Order (5 minutes)
```
Read: labor_app_build_timeline.md
Understand: Which phase you're building first
```

### Step 3: Build (3-4 hours)
```
Follow labor_app_build_timeline.md step-by-step
Reference docs as needed
Validate with delivery-summary.md checklist
```

### Step 4: Test (30 minutes)
```
Run the 11-step test scenario from delivery-summary.md
Verify all success criteria pass
```

---

## ❓ ONE FINAL NOTE

**Everything you need to know is in the documentation.**

No ambiguity. No guessing. No "but what about...?" — the answer is in the docs.

If you have a question:
1. Search the docs
2. If not found, ask

But 95% of answers are already there.

---

## 📞 QUESTIONS BEFORE YOU START?

You have all the documentation. Read it thoroughly. If something is unclear after reading:

**Document unclear?** → Tell me which section and I'll clarify.
**Want to clarify a formula?** → It's in labor_app_rebuild_documentation.md
**Want API details?** → Import labor-app-openapi-3.0.json into Postman
**Unsure of build order?** → Follow labor_app_build_timeline.md exactly

---

## ✅ FINAL CHECKLIST BEFORE YOU START

- [ ] Downloaded all 10 supporting documents
- [ ] Read BUILD-BLUEPRINT.md completely
- [ ] Read 00-START-HERE.md completely
- [ ] Skimmed labor_app_rebuild_documentation.md
- [ ] Bookmarked QUICK_REFERENCE_CARD.md
- [ ] Understand the 25-field assignment requirement
- [ ] Know the calculation formulas (base/OT/DT)
- [ ] Understand the 7-table database schema
- [ ] Know the 5 main pages you're building
- [ ] Understand build order (Phase 1 → Phase 5)
- [ ] Know the success criteria (20+ checkpoints)
- [ ] Ready to build without asking questions

---

**BUILD WELL. EVERYTHING IS DOCUMENTED. GOOD LUCK.** 🚀

