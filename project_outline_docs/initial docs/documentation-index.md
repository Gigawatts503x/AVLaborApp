# Documentation Index & Learning Path
## How to Use All 8 Documents Effectively

---

## 📚 COMPLETE DOCUMENT INDEX

| Document | Length | Time | Purpose | Best For |
|----------|--------|------|---------|----------|
| 00_START_HERE.md | 405 lines | 15 min | Entry point, quick navigation | Everyone (read first!) |
| QUICK_REFERENCE_CARD.md | 446 lines | 10 min | Developer cheat sheet | Developers building |
| labor_app_rebuild_documentation.md | 987 lines | 45 min | Technical deep-dive | Understanding system |
| labor_app_openapi_3.0.yaml | 1,132 lines | 30 min | API specification | API integration |
| labor_app_build_timeline.md | 363 lines | 20 min | Build strategy + templates | Project planning |
| README_DOCUMENTATION_INDEX.md | 422 lines | 15 min | Learning paths + glossary | Navigation help |
| DELIVERY_SUMMARY.md | 315 lines | 10 min | Requirements verification | Project tracking |
| DOCUMENTATION_MANIFEST.json | 379 lines | 5 min | Machine-readable index | Tools/automation |

**Total**: 3,440 lines, ~2.5 hours of comprehensive documentation

---

## 🎯 LEARNING PATHS (Pick One)

### Path A: "I Just Want to Build It" (2.5 hours)
**Best for**: Developers who learn by doing

1. **START_HERE.md** (15 min)
   - Read: Quick Navigation section
   - Jump to: QUICK_REFERENCE_CARD.md

2. **QUICK_REFERENCE_CARD.md** (10 min)
   - Skim: File Organization, Data Models
   - Study: Calculations Quick Reference
   - Memorize: The 25 assignment fields

3. **build_timeline.md** (20 min)
   - Read: Recommended Build Strategy
   - Follow: TIER 1-5 checklist exactly

4. **BUILD** (3-4 hours)
   - Use QUICK_REFERENCE_CARD.md as your desk reference
   - Check rebuild_documentation.md when stuck on calculations
   - Validate with test data provided

**Total Time**: 5-6 hours

---

### Path B: "I Want to Understand Everything" (4 hours)
**Best for**: Architects, technical leads, thorough learners

1. **START_HERE.md** (15 min)
   - Read: Complete document

2. **README_DOCUMENTATION_INDEX.md** (This file) (20 min)
   - Read: Key Concepts section
   - Bookmark: Glossary

3. **rebuild_documentation.md** (60 min)
   - Section 1: Priority Matrix (5 min)
   - Section 2: Database Schema (15 min)
   - Section 3: Mathematical Calculations (20 min)
   - Section 4: API Contract (15 min)
   - Section 5: Component Architecture (5 min)

4. **build_timeline.md** (20 min)
   - Understand: Credit estimation
   - Study: Dependency graph

5. **QUICK_REFERENCE_CARD.md** (10 min)
   - Use as quick lookup

6. **BUILD** (2-3 hours)
   - You'll understand why you're doing each step

**Total Time**: 6-7 hours

---

### Path C: "I Just Need the API" (1.5 hours)
**Best for**: Frontend engineers integrating existing backend

1. **START_HERE.md** (15 min)
   - Skip to: "I'm Doing API Integration" section

2. **labor_app_openapi_3.0.yaml** (30 min)
   - Import to Postman
   - Test 3-4 endpoints

3. **QUICK_REFERENCE_CARD.md** (10 min)
   - Study: API ENDPOINTS section
   - Copy: TEST DATA section

4. **Integrate** (30 min)
   - Use API utility provided
   - Reference: Test data from QUICK_REFERENCE_CARD

**Total Time**: 1.5 hours

---

### Path D: "I'm Managing This Project" (1 hour)
**Best for**: Project managers, stakeholders

1. **DELIVERY_SUMMARY.md** (15 min)
   - All 10 requirements ✅ checked

2. **START_HERE.md** (10 min)
   - Read: Key Numbers to Remember
   - Focus on: Completion Checklist

3. **build_timeline.md** (20 min)
   - Understand: 5 tiers
   - Note: 10-15 credits, 3-4 hours

4. **QUICK_REFERENCE_CARD.md** (5 min)
   - Understand: DO's and DON'Ts

5. **Track**: Use completion checklist from START_HERE

**Total Time**: 1 hour

---

## 🔑 KEY CONCEPTS

### The Core Calculation
```
Tech pays: (base_hours × rate) + (ot_hours × rate × 1.5) + (dt_hours × rate × 2.0)
Client billed: (base_hours × rate) + (ot_hours × rate × 1.5) + (dt_hours × rate × 2.0)
```

### Critical Business Logic
1. **Base hours**: First 10 hours (configurable in settings)
2. **Overtime**: Hours 10+ at 1.5x rate
3. **Double-Time**: Hours 20:00-04:00 at 2.0x rate (always)
4. **Overnight shifts**: 15:00-01:00 = 10 hours (endTime < startTime means next day)

### The Assignment (25 Fields = Critical)
- If you're missing even one field → 500 error
- All 25 MUST be present in POST payload
- Examples: id, eventid, technicianid, requirementid, position, roomorlocation, hoursworked, basehours, othours, dothours, ratetype, techhourlyrate, techhalfdayrate, techfulldayrate, billhourlyrate, billhalfdayrate, billfulldayrate, calculatedpay, customerbill, notes, assignmentdate, starttime, endtime

### Data Model Hierarchy
```
Event (1)
├─ Requirements (many)
│  └─ Assignments (many per requirement)
├─ Technician (many, via assignments)
└─ Settings (1, app-level)
```

---

## 🚀 PRACTICAL WORKFLOW EXAMPLES

### Example 1: Create Full Assignment
```
1. Get technician rates (api.getTechnician)
2. Calculate hours (rateCalculator.calculateHoursBreakdown)
3. Calculate tech pay (rateCalculator.calculateTechPayout)
4. Calculate customer bill (same formula, different rates)
5. POST assignment with all 25 fields
6. Verify: assignment.calculatedpay matches calculation
```

### Example 2: Handle Overnight Shift
```
startTime: "22:00"
endTime: "06:00"
→ totalHours = 8 (next day)
→ baseHours = 8 (under 10h threshold)
→ otHours = 0
→ dtHours = 4 (22:00-04:00 is 6h, but assignment is 8h total)
```

### Example 3: Update Technician Rates
```
PUT /technicians/:id
{ techhourlyrate: 55 }
→ Existing assignments retain old rate (frozen at creation)
→ Only NEW assignments use new rate
```

---

## ⚠️ CRITICAL POINTS

1. **Assignment Fields**: ALL 25 required or POST returns 500
2. **Delete Cascading**: DELETE event → cascades to requirements → cascades to assignments
3. **Overnight Shifts**: endTime < startTime means next day (add 24h)
4. **Rate Freezing**: Rates frozen on assignment creation (not updated when tech rates change)
5. **DT Window**: Fixed 20:00-04:00 (configurable in settings)
6. **Positions**: Can't delete if used by requirements (409 error)

---

## 🧪 VALIDATION TEST CASES

### Test 1: Hours Breakdown (15:00-01:00)
```
Input: "15:00" to "01:00"
Expected: baseHours: 10, otHours: 0, dtHours: 3
How to verify: 
  - 15:00 to 20:00 = 5 hours (base)
  - 20:00 to 01:00 = 5 hours (DT, because in 20:00-04:00 window)
  - Total: 10 hours
  - DT hours: 5 hours in DT window
  - OH: 0 (we're at exactly threshold)
```

### Test 2: Tech Payout
```
Input: baseHours: 10, otHours: 0, dtHours: 3, rate: $50/hr
Formula: (10 × $50) + (0 × $50 × 1.5) + (3 × $50 × 2.0)
Expected: $800
```

### Test 3: Customer Billing
```
Input: Same hours, rate: $75/hr
Formula: (10 × $75) + (0 × $75 × 1.5) + (3 × $75 × 2.0)
Expected: $1,200
```

### Test 4: Overnight Shift
```
Input: "23:00" to "07:00"
Expected: baseHours: 8, otHours: 0, dtHours: 5
  - 23:00 to 00:00 = 1 hour (DT)
  - 00:00 to 04:00 = 4 hours (DT)
  - 04:00 to 07:00 = 3 hours (base)
  - Total DT: 5 hours, Base: 3 hours
  - But wait... that's 8 hours total, baseHours should be 8?
  - YES: first 8 hours of any shift are "base", DT is ADDITIONAL multiplier
```

---

## 📊 PROGRESS TRACKING

### Setup Phase
- [ ] Read START_HERE
- [ ] Choose learning path
- [ ] Skim QUICK_REFERENCE_CARD

### Understanding Phase
- [ ] Understand data models (7 tables)
- [ ] Understand calculations (hours, pay, billing)
- [ ] Understand API (19+ endpoints)
- [ ] Understand component architecture

### Building Phase
- [ ] Database ready
- [ ] API endpoints ready
- [ ] Frontend hooks ready
- [ ] Pages ready
- [ ] Styling complete

### Testing Phase
- [ ] All CRUD operations work
- [ ] Calculations match test data
- [ ] No console errors
- [ ] Dark mode works
- [ ] Responsive on mobile

### Delivery Phase
- [ ] All 15 success criteria met
- [ ] Code ready for production
- [ ] Documentation complete
- [ ] Ready for client handoff

---

## 📞 GLOSSARY

**Base Hours**: First 10 hours of any shift (or threshold in settings)  
**DT (Double-Time)**: Hours 20:00-04:00 at 2.0x pay rate  
**OT (Overtime)**: Hours beyond threshold (10h) at 1.5x pay rate  
**Margin**: Profit percentage = (billing - payout) / billing × 100%  
**Overnight Shift**: Assignment where endTime < startTime (wraps to next day)  
**Technician**: Employee assigned to requirements  
**Requirement**: Labor need for specific date/time/position  
**Assignment**: Technician assigned to requirement with calculated pay  

---

## ✅ SUCCESS CRITERIA (15 ITEMS)

When you've completed the rebuild, verify:

1. [ ] Server starts without errors (npm start)
2. [ ] Frontend compiles (npm run start)
3. [ ] Can create event with all client details
4. [ ] Can add requirements to event
5. [ ] Can create technicians with rates
6. [ ] Can assign technicians to requirements
7. [ ] Pay calculates automatically
8. [ ] Calculations match test data exactly
9. [ ] Can view schedule in table and Gantt views
10. [ ] Can filter and sort assignments
11. [ ] Data persists after page refresh
12. [ ] No red console errors (warnings OK)
13. [ ] All CRUD operations (Create, Read, Update, Delete) work
14. [ ] Dark mode toggle works
15. [ ] Responsive layout on mobile

**When all 15 ✅ : REBUILD COMPLETE! 🎉**

---

## 🎯 HOW TO USE EACH DOCUMENT

| Need | Document | Section |
|------|----------|---------|
| Quick overview | START_HERE | Everything |
| Quick lookup | QUICK_REFERENCE_CARD | Any section |
| Technical details | rebuild_documentation | Specific section |
| API integration | labor_app_openapi_3.0.yaml | Endpoint definition |
| Build plan | build_timeline | TIER N checklist |
| Understand system | rebuild_documentation | Architecture |
| Project status | DELIVERY_SUMMARY | Requirements |
| Machine index | DOCUMENTATION_MANIFEST.json | Parse JSON |

---

**Questions? Check the document most relevant to your role (Path A, B, C, or D above)**
