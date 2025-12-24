# ⚡ QUICK REFERENCE CARD - Labor App Developer Guide
## One-Page Cheat Sheet for Developers

---

## 🗂️ FILE ORGANIZATION

```
backend/
├── config/database.js          # SQLite query wrappers
├── setup/initDb.js             # Schema + init data
├── routes/index.js             # All 19+ endpoints
├── server.js                   # Express entry point
└── package.json

frontend/
├── src/
│   ├── utils/
│   │   ├── api.js              # All CRUD functions
│   │   └── rateCalculator.js   # Hours/pay calculations
│   ├── hooks/
│   │   ├── useDataStore.js     # Central state
│   │   ├── useAssignments.js, useRequirements.js, etc.
│   ├── pages/
│   │   ├── Dashboard.js, Technicians.js, EventDetails.js
│   │   └── ScheduleGrid.js (+ Table.js, Gantt.js)
│   ├── components/
│   │   ├── EditableCell.js, EditableSelectCell.js
│   └── App.js / index.js
└── package.json
```

---

## 📊 DATA MODELS (7 Tables)

### events
```
id, name, clientname, clientcontact, clientphone, clientemail,
clientaddress, ponumber, startdate, enddate,
totaltechpayout, totallaborcost, totalcustomerbilling
```

### technicians
```
id, name, phone, email, ratetype (hourly|half-day|full-day),
techhourlyrate, techhalfdayrate, techfulldayrate,
billhourlyrate, billhalfdayrate, billfulldayrate
```

### eventrequirements
```
id, eventid, requirementdate, requirementenddate,
roomorlocation, settime, starttime, endtime, striketime,
position, techsneeded (default: 1)
```

### eventassignments (⚠️ CRITICAL: 25 FIELDS)
```
id, eventid, technicianid, requirementid, position, roomorlocation,
hoursworked, basehours, othours, dothours,
ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
billhourlyrate, billhalfdayrate, billfulldayrate,
calculatedpay, customerbill, notes,
assignmentdate, starttime, endtime
```

### settings
```
id, halfdayhours: 5, fulldayhours: 10,
otthreshold: 10, dotthreshold: 20, dotstarthour: 20,
techbaserate: 50, customerbaserate: 75
```

### positions
```
id, name
```

---

## 🧮 CALCULATIONS QUICK REFERENCE

### Hours Breakdown
```javascript
// Input: startTime: "15:00", endTime: "01:00" (overnight)
// Output:
{
  totalHours: 10,
  baseHours: 10,        // first 10 hours
  otHours: 0,           // hours 10+ (at 1.5x)
  dtHours: 3            // hours in 20:00-04:00 (at 2.0x)
}
```

**Algorithm:**
1. If endTime < startTime → add 24 hours (overnight)
2. baseHours = min(totalHours, otthreshold)
3. otHours = max(0, totalHours - otthreshold)
4. dtHours = hours overlapping 20:00-04:00 window

### Tech Payout
```javascript
const pay = (basehours * techhourlyrate) +
            (othours * techhourlyrate * 1.5) +
            (dthours * techhourlyrate * 2.0)
// Example: (10 * $50) + (0 * $50 * 1.5) + (3 * $50 * 2.0) = $800
```

### Customer Billing
```javascript
const bill = (basehours * billhourlyrate) +
             (othours * billhourlyrate * 1.5) +
             (dthours * billhourlyrate * 2.0)
// Example: (10 * $75) + (0 * $75 * 1.5) + (3 * $75 * 2.0) = $1,200
```

### Margin
```
margin = (bill - pay) / bill × 100%
// Example: ($1,200 - $800) / $1,200 = 33.3%
```

---

## 🔌 API ENDPOINTS (Quick Reference)

### Events
- `GET /events` → list
- `POST /events` → create
- `GET /events/:id` → single
- `PUT /events/:id` → update
- `DELETE /events/:id` → delete (cascades!)

### Technicians
- `GET /technicians` → list
- `POST /technicians` → create
- `PUT /technicians/:id` → update
- `DELETE /technicians/:id` → delete

### Requirements
- `GET /events/:eventid/requirements` → list for event
- `POST /requirements` → create (needs eventId)
- `PATCH /requirements/:id` → update
- `DELETE /requirements/:id` → delete

### Assignments (⚠️ REQUIRES ALL 25 FIELDS)
- `GET /assignments` → all
- `GET /events/:eventid/assignments` → for event
- `POST /assignments` → create
- `PATCH /assignments/:id` → update
- `DELETE /assignments/:id` → delete

### Positions
- `GET /settings/positions` → list
- `POST /settings/positions` → create
- `DELETE /settings/positions/:name` → delete (URL-encoded)

### Settings
- `GET /settings` → get
- `PUT /settings` → update

---

## 🎯 COMMON TASKS

### Create Complete Assignment (Correct Way)
```javascript
// Step 1: Calculate hours
const hours = rateCalculator.calculateHoursBreakdown(startTime, endTime)

// Step 2: Get tech rates
const tech = await api.getTechnician(technicianid)

// Step 3: Calculate pay and billing
const pay = rateCalculator.calculateTechPayout({
  ...hours,
  techhourlyrate: tech.techhourlyrate,
  ratetype: tech.ratetype
})

// Step 4: Create assignment with ALL 25 fields
const assignment = await api.createAssignment({
  eventId: eventid,           // ✅ REQUIRED
  technicianid: technicianid, // ✅ REQUIRED
  requirementid, position, roomorlocation,
  hoursworked: hours.totalHours,
  basehours: hours.baseHours,
  othours: hours.otHours,
  dothours: hours.dtHours,
  ratetype: tech.ratetype,
  techhourlyrate, techhalfdayrate, techfulldayrate,
  billhourlyrate, billhalfdayrate, billfulldayrate,
  calculatedpay: pay,
  customerbill: billing,
  notes, assignmentdate, starttime, endtime
})
```

---

## ✅ DO's & DON'Ts

### ✅ DO
- Include all 25 fields when creating assignment
- Let rateCalculator handle overnight shift logic
- Use eventId OR eventid (API normalizes both)
- Test with provided test data
- Check console logs (emoji tags help)
- Validate times are HH:MM format
- Remember double-time is 20:00-04:00 fixed

### ❌ DON'T
- Create assignment with < 25 fields (500 error)
- Manually calculate DT hours (tricky with overlap)
- Use 12-hour time format (must be 24-hour)
- Assume positions can always delete (409 if in use)
- Create requirement without eventId
- Expect rate to auto-recalculate (cached on assignment)
- Ignore overnight shift flag (endTime < startTime)

---

## 🧪 TEST DATA

### Technician
```json
{
  "name": "Alice Smith",
  "phone": "555-0100",
  "email": "alice@example.com",
  "ratetype": "hourly",
  "techhourlyrate": 50,
  "techhalfdayrate": 0,
  "techfulldayrate": 0,
  "billhourlyrate": 75,
  "billhalfdayrate": 0,
  "billfulldayrate": 0
}
```

### Assignment (Minimal - 15:00-01:00)
```json
{
  "eventId": "event-id",
  "technicianid": "tech-id",
  "requirementid": "req-id",
  "position": "A1",
  "hoursworked": 10,
  "basehours": 10,
  "othours": 0,
  "dothours": 3,
  "ratetype": "hourly",
  "techhourlyrate": 50,
  "techhalfdayrate": 0,
  "techfulldayrate": 0,
  "billhourlyrate": 75,
  "billhalfdayrate": 0,
  "billfulldayrate": 0,
  "calculatedpay": 800,
  "customerbill": 1200,
  "assignmentdate": "2025-03-15",
  "starttime": "15:00",
  "endtime": "01:00"
}
```

---

## 🔍 DEBUGGING TIPS

| Error | Cause | Fix |
|-------|-------|-----|
| 400 Bad Request | Missing required fields | Check POST payload (eventId, technicianid) |
| 500 Parameter Mismatch | Assignment missing fields | Add all 25 fields to POST body |
| 409 Conflict | Position in use or duplicate | Delete requirements first |
| 404 Not Found | ID doesn't exist | Verify UUID is correct |
| State empty | Hooks not initialized | Check useDataStore loading state |
| Calc wrong | Algorithm issue | Test with provided test case |
| Time ignored | Format wrong | Must be HH:MM 24-hour |

---

## 🎯 SUCCESS CHECKLIST

- [ ] Server starts: `npm start` (port 3001)
- [ ] Frontend loads: `npm run start`
- [ ] Can create event
- [ ] Can add technician
- [ ] Can add requirement
- [ ] Can add assignment (all 25 fields!)
- [ ] Pay matches test data
- [ ] Schedule grid displays
- [ ] Filters and sorts work
- [ ] Dark mode works

**Print & keep nearby!** 📌
