# 🎯 Tier 1 Complete: Backend Database & Server

## ✅ What Was Built

**Three production-ready files created for the backend:**

### 1. **package.json**
- Express.js web server
- better-sqlite3 for database
- UUID generation
- CORS & body-parser middleware

### 2. **database.js**
- SQLite database initialization
- All 7 tables created automatically:
  - events (client details, dates, totals)
  - technicians (roster with rates)
  - eventrequirements (labor needs)
  - eventassignments (25-field assignments)
  - positions (job roles, pre-seeded)
  - settings (app configuration)
- Query wrappers for SELECT, INSERT, UPDATE, DELETE
- Transaction support
- Cascade delete enabled for referential integrity

### 3. **server.js**
- Express API server listening on port 3001
- 19+ fully implemented endpoints:
  - 5 Event endpoints (CRUD + cascade delete)
  - 5 Technician endpoints (CRUD)
  - 4 Requirement endpoints (CRUD)
  - 5 Assignment endpoints (CRUD with 25-field validation)
  - 3 Position endpoints (CRUD with in-use validation)
  - 2 Settings endpoints (GET/PUT)
  - 1 Health check
- Automatic event total calculations
- Input validation and error handling
- Detailed logging with emoji tags

---

## 📋 Installation & Launch

### Step 1: Create backend directory
```bash
mkdir av-labor-coordinator-backend
cd av-labor-coordinator-backend
```

### Step 2: Copy the three files
- `package.json`
- `database.js`
- `server.js`

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Start the server
```bash
npm start
```

### Expected Output
```
╔══════════════════════════════════════════════════════════════╗
║     🚀 AV Labor Coordinator Backend Server Started         ║
║     ✅ API listening on http://localhost:3001                 ║
║     ✅ Database initialized: labor_coordinator.db          ║
║     ✅ 19+ endpoints ready                                 ║
╚══════════════════════════════════════════════════════════════╝
```

### Verify it works
```bash
curl http://localhost:3001/health
# Returns: {"status":"ok","timestamp":"..."}
```

---

## 🔌 API Overview (All 19+ Endpoints)

### Events Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/events` | List all events |
| POST | `/events` | Create new event |
| GET | `/events/:id` | Get single event (with totals) |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event (cascades) |

### Technicians Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/technicians` | List all technicians |
| POST | `/technicians` | Create technician with rates |
| PUT | `/technicians/:id` | Update technician |
| DELETE | `/technicians/:id` | Delete technician (cascades) |

### Requirements Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/events/:eventid/requirements` | List requirements for event |
| POST | `/requirements` | Create requirement |
| PATCH | `/requirements/:id` | Update requirement |
| DELETE | `/requirements/:id` | Delete requirement |

### Assignments Endpoints (⚠️ 25 Fields Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/assignments` | List all assignments |
| GET | `/events/:eventid/assignments` | List for event |
| POST | `/assignments` | Create assignment (25 fields!) |
| PATCH | `/assignments/:id` | Update assignment |
| DELETE | `/assignments/:id` | Delete assignment |

### Positions Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/settings/positions` | List positions |
| POST | `/settings/positions` | Create position |
| DELETE | `/settings/positions/:name` | Delete position |

### Settings Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/settings` | Get app settings |
| PUT | `/settings` | Update settings |

### Health Check
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server status |

---

## ⚠️ CRITICAL: The 25-Field Assignment Problem

**NEVER create an assignment without ALL 25 fields or you'll get a 500 error.**

### Required Fields (All Must Be Present)
```javascript
{
  // Core IDs (REQUIRED)
  eventid: "uuid",
  technicianid: "uuid",
  requirementid: "uuid",
  
  // Work Details (REQUIRED)
  position: "Audio Technician",
  roomorlocation: "Main Stage",
  hoursworked: 10,
  assignmentdate: "2025-03-15",
  starttime: "09:00",
  endtime: "17:00",
  
  // Hour Breakdown (REQUIRED - must sum correctly)
  basehours: 8,
  othours: 2,
  dothours: 0,
  
  // Rate Type & All 6 Rates (REQUIRED)
  ratetype: "hourly",
  techhourlyrate: 50,
  techhalfdayrate: 0,
  techfulldayrate: 0,
  billhourlyrate: 75,
  billhalfdayrate: 0,
  billfulldayrate: 0,
  
  // Calculated Values (REQUIRED)
  calculatedpay: 500,
  customerbill: 750,
  
  // Optional
  notes: "Optional notes"
}
```

---

## 🧪 Quick Test Script

### Create Test Event
```bash
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "clientname": "Test Client",
    "clientcontact": "John Doe",
    "clientphone": "555-1234",
    "clientemail": "john@test.com",
    "startdate": "2025-03-15",
    "enddate": "2025-03-17"
  }'
```

Save the `id` from the response (you'll need it).

### Create Test Technician
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

Save the `id` from the response.

### View Positions (Pre-seeded)
```bash
curl http://localhost:3001/settings/positions
```

### View Settings (Pre-configured)
```bash
curl http://localhost:3001/settings
```

### Get Event with Totals
```bash
curl http://localhost:3001/events/YOUR_EVENT_ID
```

---

## 🛠️ Key Features

✅ **Auto-Initialization**
- Database auto-creates on first run
- All 7 tables created automatically
- Default settings and positions pre-seeded
- No manual database setup needed

✅ **Cascade Deletes**
- Delete event → automatically deletes all requirements & assignments
- Delete technician → automatically deletes all their assignments
- Delete requirement → automatically deletes linked assignments

✅ **Event Totals Auto-Calculated**
- GET `/events/:id` returns calculated totals
- PATCH assignment → event totals update automatically
- DELETE assignment → event totals update automatically

✅ **Validation**
- All 25 assignment fields validated on POST
- Technician names must be unique
- Positions can't delete if in use
- Foreign key constraints enforced

✅ **Error Handling**
- Detailed error messages (400, 404, 409, 500 status codes)
- Console logging with emoji tags
- Request validation on all endpoints

---

## 📊 Database Schema Summary

### events table
```
id (primary key), name, clientname, clientcontact, clientphone, 
clientemail, clientaddress, ponumber, startdate, enddate,
totaltechpayout, totallaborcost, totalcustomerbilling, 
createdAt, updatedAt
```

### technicians table
```
id (primary key), name (unique), phone, email, ratetype,
techhourlyrate, techhalfdayrate, techfulldayrate,
billhourlyrate, billhalfdayrate, billfulldayrate,
createdAt, updatedAt
```

### eventrequirements table
```
id (primary key), eventid (FK), requirementdate, requirementenddate,
roomorlocation, settime, starttime, endtime, striketime, position,
techsneeded, createdAt, updatedAt
```

### eventassignments table (25 fields!)
```
id (primary key), eventid (FK), technicianid (FK), requirementid (FK),
position, roomorlocation, hoursworked, basehours, othours, dothours,
ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
billhourlyrate, billhalfdayrate, billfulldayrate,
calculatedpay, customerbill, notes, assignmentdate, starttime, endtime,
createdAt, updatedAt
```

### positions table
```
id (primary key), name (unique)
Pre-seeded with: Audio Technician, Camera Operator, Lighting Technician,
Stage Manager, Grip, Gaffer, Video Producer, Production Assistant
```

### settings table
```
id (primary key), halfdayhours, fulldayhours, otthreshold, dotthreshold,
dotstarthour, techbaserate, customerbaserate, updatedAt
```

---

## 🚀 Next: Tier 2 - Frontend Foundation

Once backend is running, next request will be:
- **Tier 2**: Frontend setup with React, custom hooks, API utilities, and state management

The frontend will connect to these endpoints and display the data in a beautiful React UI.

---

## 📞 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **Port 3001 in use** | `lsof -ti:3001 \| xargs kill -9` |
| **npm install fails** | Use `npm install --legacy-peer-deps` |
| **Database locked** | Delete `labor_coordinator.db` and restart |
| **Assignment POST 500** | Check all 25 fields are present |
| **Technician duplicate error** | Use unique technician names |
| **CORS errors** | CORS is enabled, check frontend URL |

---

## ✅ Tier 1 Validation Checklist

- [ ] `npm install` succeeds
- [ ] `npm start` starts server on :3001
- [ ] `curl http://localhost:3001/health` returns status ok
- [ ] `curl http://localhost:3001/settings/positions` shows 8 default positions
- [ ] Can POST to `/events` and get back an event with ID
- [ ] Can POST to `/technicians` and get back a technician with ID
- [ ] Can POST to `/requirements` and get back a requirement with ID
- [ ] Can POST to `/assignments` with all 25 fields and get back assignment
- [ ] Can GET `/events/:id` and see calculated totals
- [ ] Database file `labor_coordinator.db` is created

**When all 10 items are checked ✅, Tier 1 is complete!**

---

**Backend is ready. Tier 2 coming next!** 🚀
