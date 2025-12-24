# 🚀 AV Labor Coordinator - Backend (Tier 1) Installation & Setup

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Expected output:
```
╔══════════════════════════════════════════════════════════════╗
║     🚀 AV Labor Coordinator Backend Server Started         ║
║     ✅ API listening on http://localhost:3001                 ║
║     ✅ Database initialized: labor_coordinator.db          ║
║     ✅ 19+ endpoints ready                                 ║
╚══════════════════════════════════════════════════════════════╝
```

### 3. Verify Server is Running
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

---

## 📦 Files Included

- **package.json** - Dependencies (express, better-sqlite3, uuid, cors, body-parser)
- **database.js** - SQLite setup, table schemas, query wrappers
- **server.js** - Express server with 19+ API endpoints

---

## 🗄️ Database

### Auto-Initialized Tables (7 total)
1. **events** - Client details, dates, totals
2. **technicians** - Roster with hourly/half-day/full-day rates
3. **eventrequirements** - Labor needs by date/time/position
4. **eventassignments** - Technician assignments with 25 fields (⚠️ ALL REQUIRED)
5. **positions** - Available job roles (pre-seeded with 8 defaults)
6. **settings** - App configuration (OT threshold, DT window, base rates)

**Database file**: `labor_coordinator.db` (auto-created on first run)

---

## 🔌 API Endpoints (19+)

### Events (5 endpoints)
- `GET /events` - List all
- `POST /events` - Create
- `GET /events/:id` - Get single (with calculated totals)
- `PUT /events/:id` - Update
- `DELETE /events/:id` - Delete (cascades to requirements & assignments)

### Technicians (5 endpoints)
- `GET /technicians` - List all
- `POST /technicians` - Create with rates
- `PUT /technicians/:id` - Update
- `DELETE /technicians/:id` - Delete (cascades to assignments)

### Requirements (4 endpoints)
- `GET /events/:eventid/requirements` - List for event
- `POST /requirements` - Create
- `PATCH /requirements/:id` - Update
- `DELETE /requirements/:id` - Delete

### Assignments (5 endpoints) ⚠️ ALL 25 FIELDS REQUIRED
- `GET /assignments` - List all
- `GET /events/:eventid/assignments` - List for event
- `POST /assignments` - Create (validates all 25 fields)
- `PATCH /assignments/:id` - Update
- `DELETE /assignments/:id` - Delete

### Positions (3 endpoints)
- `GET /settings/positions` - List
- `POST /settings/positions` - Create
- `DELETE /settings/positions/:name` - Delete (fails if in use)

### Settings (2 endpoints)
- `GET /settings` - Get config
- `PUT /settings` - Update (OT threshold, DT window, base rates)

### Health Check (1 endpoint)
- `GET /health` - Server status

---

## ⚠️ CRITICAL: Assignment POST Requires All 25 Fields

If ANY field is missing from an assignment POST request, you'll get a 500 error.

**Required fields:**
```
Core IDs: eventid, technicianid, requirementid
Work Details: position, roomorlocation, hoursworked, assignmentdate, starttime, endtime
Hour Breakdown: basehours, othours, dothours
Rate Type & Rates: ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
                  billhourlyrate, billhalfdayrate, billfulldayrate
Calculated Values: calculatedpay, customerbill
Optional: notes
```

---

## 🧪 Test the Backend

### 1. Create Event
```bash
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Annual Conference 2025",
    "clientname": "Acme Corp",
    "clientcontact": "John Doe",
    "clientphone": "555-0100",
    "clientemail": "john@acme.com",
    "startdate": "2025-03-15",
    "enddate": "2025-03-17"
  }'
```

### 2. Create Technician
```bash
curl -X POST http://localhost:3001/technicians \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "phone": "555-0101",
    "email": "alice@example.com",
    "ratetype": "hourly",
    "techhourlyrate": 50,
    "techhalfdayrate": 0,
    "techfulldayrate": 0,
    "billhourlyrate": 75,
    "billhalfdayrate": 0,
    "billfulldayrate": 0
  }'
```

### 3. Create Requirement
```bash
curl -X POST http://localhost:3001/requirements \
  -H "Content-Type: application/json" \
  -d '{
    "eventid": "YOUR_EVENT_ID",
    "requirementdate": "2025-03-15",
    "roomorlocation": "Main Stage",
    "starttime": "09:00",
    "endtime": "17:00",
    "position": "Audio Technician",
    "techsneeded": 2
  }'
```

### 4. Create Assignment (⚠️ ALL 25 FIELDS)
```bash
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "eventid": "YOUR_EVENT_ID",
    "technicianid": "YOUR_TECHNICIAN_ID",
    "requirementid": "YOUR_REQUIREMENT_ID",
    "position": "Audio Technician",
    "roomorlocation": "Main Stage",
    "hoursworked": 10,
    "basehours": 8,
    "othours": 2,
    "dothours": 0,
    "ratetype": "hourly",
    "techhourlyrate": 50,
    "techhalfdayrate": 0,
    "techfulldayrate": 0,
    "billhourlyrate": 75,
    "billhalfdayrate": 0,
    "billfulldayrate": 0,
    "calculatedpay": 500,
    "customerbill": 750,
    "assignmentdate": "2025-03-15",
    "starttime": "09:00",
    "endtime": "17:00"
  }'
```

---

## 🔄 Features Implemented

✅ **Database Initialization** - Auto-creates schema on startup  
✅ **Foreign Key Cascading** - Delete event → deletes requirements & assignments  
✅ **Event Totals** - Auto-calculated from assignments  
✅ **25-Field Assignment Validation** - Prevents partial submissions  
✅ **Position Management** - Can't delete positions in use  
✅ **Settings Management** - Configurable thresholds and rates  
✅ **Error Handling** - Detailed error responses with status codes  
✅ **Request Logging** - Console logs with emoji tags for debugging  

---

## 🚀 Next Steps

1. **Frontend Foundation (Tier 2)** - React setup, hooks, API utilities
2. **UI Pages (Tier 3)** - Dashboard, Technicians, EventDetails, ScheduleGrid
3. **Components (Tier 4)** - EditableCell, EditableSelectCell
4. **Styling (Tier 5)** - CSS, dark mode, responsive design

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3001 already in use** | Kill process: `lsof -ti:3001 \| xargs kill -9` |
| **npm install fails** | Use `npm install --legacy-peer-deps` |
| **Database locked error** | Delete `labor_coordinator.db` and restart |
| **Assignment POST returns 500** | Ensure all 25 fields are present |
| **Technician name duplicate error** | Use unique names |

---

**Backend Tier 1 Complete!** ✅ Ready for Tier 2 (Frontend Foundation)
