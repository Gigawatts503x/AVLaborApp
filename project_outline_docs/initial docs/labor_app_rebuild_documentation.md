# Labor Coordination App - Complete Technical Reference Manual
## Master Reference for All Technical Details

---

## 📋 PRIORITY MATRIX

### ✅ PRIORITY 1: COMPLETE (MVP - All Documented)
- ✅ Event Management (CRUD, client details, dates)
- ✅ Technician Roster (CRUD, rates by type)
- ✅ Labor Requirements (CRUD, date/time/position/count)
- ✅ Assignments (CRUD, all 25 fields with calculations)
- ✅ Rate Calculation (hours breakdown, pay formulas)
- ✅ Billing (customer rates, margin tracking)
- ✅ Dashboard (analytics, quick stats)
- ✅ Schedule Grid (table view, filtering, sorting)
- ✅ Settings (app-level configuration, positions)
- ✅ Dark Mode (complete toggle)

### 📅 PRIORITY 2: NOT YET STARTED
- [ ] Real-time Sync (WebSocket/polling)
- [ ] Invoicing (PDF generation, client delivery)
- [ ] Reports (revenue analysis, tech performance)
- [ ] Export (CSV, Excel)
- [ ] Multi-user (authentication, permissions)
- [ ] Payment Integration (Stripe, PayPal)

---

## 🗄️ DATABASE SCHEMA (COMPLETE)

### events
```sql
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  clientname TEXT,
  clientcontact TEXT,
  clientphone TEXT,
  clientemail TEXT,
  clientaddress TEXT,
  ponumber TEXT,
  startdate TEXT,
  enddate TEXT,
  totaltechpayout REAL DEFAULT 0,
  totallaborcost REAL DEFAULT 0,
  totalcustomerbilling REAL DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### technicians
```sql
CREATE TABLE IF NOT EXISTS technicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  phone TEXT,
  email TEXT,
  ratetype TEXT CHECK(ratetype IN ('hourly', 'half-day', 'full-day')),
  techhourlyrate REAL,
  techhalfdayrate REAL,
  techfulldayrate REAL,
  billhourlyrate REAL,
  billhalfdayrate REAL,
  billfulldayrate REAL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### eventrequirements
```sql
CREATE TABLE IF NOT EXISTS eventrequirements (
  id TEXT PRIMARY KEY,
  eventid TEXT NOT NULL,
  requirementdate TEXT,
  requirementenddate TEXT,
  roomorlocation TEXT,
  settime TEXT,
  starttime TEXT NOT NULL,
  endtime TEXT NOT NULL,
  striketime TEXT,
  position TEXT,
  techsneeded INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(eventid) REFERENCES events(id) ON DELETE CASCADE
);
```

### eventassignments (⚠️ CRITICAL: ALL 25 FIELDS)
```sql
CREATE TABLE IF NOT EXISTS eventassignments (
  id TEXT PRIMARY KEY,
  eventid TEXT NOT NULL,
  technicianid TEXT NOT NULL,
  requirementid TEXT,
  position TEXT,
  roomorlocation TEXT,
  hoursworked REAL,
  basehours REAL,
  othours REAL,
  dothours REAL,
  ratetype TEXT,
  techhourlyrate REAL,
  techhalfdayrate REAL,
  techfulldayrate REAL,
  billhourlyrate REAL,
  billhalfdayrate REAL,
  billfulldayrate REAL,
  calculatedpay REAL,
  customerbill REAL,
  notes TEXT,
  assignmentdate TEXT,
  starttime TEXT,
  endtime TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(eventid) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY(technicianid) REFERENCES technicians(id) ON DELETE CASCADE,
  FOREIGN KEY(requirementid) REFERENCES eventrequirements(id) ON DELETE CASCADE
);
```

### settings
```sql
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY,
  halfdayhours INTEGER DEFAULT 5,
  fulldayhours INTEGER DEFAULT 10,
  otthreshold INTEGER DEFAULT 10,
  dotthreshold INTEGER DEFAULT 20,
  dotstarthour INTEGER DEFAULT 20,
  techbaserate REAL DEFAULT 50,
  customerbaserate REAL DEFAULT 75,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### positions
```sql
CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);
```

---

## 🧮 MATHEMATICAL CALCULATIONS (COMPLETE)

### Hours Breakdown Algorithm
**Input**: startTime (HH:MM), endTime (HH:MM)  
**Output**: baseHours, otHours, dtHours

**Process**:
1. If endTime < startTime → overnight shift (add 24 hours to endTime)
2. totalHours = (endTime - startTime) / 60
3. baseHours = min(totalHours, otthreshold) [default: 10]
4. otHours = max(0, totalHours - otthreshold)
5. dtHours = hours in DT window (20:00-04:00)

**Example**: 15:00 - 01:00
- Total: 10 hours (overnight)
- Base: 10 hours (under threshold)
- OT: 0 hours (under 10h)
- DT: 3 hours (20:00-01:00)

### Tech Payout Calculation
```
Tech Pay = (baseHours × techhourlyrate) 
         + (otHours × techhourlyrate × 1.5) 
         + (dtHours × techhourlyrate × 2.0)
```

**Example**: baseHours=10, otHours=0, dtHours=3, rate=$50
- Tech Pay = (10 × $50) + (0 × $75) + (3 × $100) = $500 + $0 + $300 = **$800**

### Customer Billing Calculation
```
Bill = (baseHours × billhourlyrate) 
     + (otHours × billhourlyrate × 1.5) 
     + (dtHours × billhourlyrate × 2.0)
```

**Example**: baseHours=10, otHours=0, dtHours=3, rate=$75
- Bill = (10 × $75) + (0 × $112.50) + (3 × $150) = $750 + $0 + $450 = **$1,200**

### Profit Margin
```
Margin = (Bill - TechPay) / Bill × 100%
```

**Example**: ($1,200 - $800) / $1,200 = 33.3%

### Event Totals
```
Event.totaltechpayout = SUM(all assignment.calculatedpay)
Event.totalcustomerbilling = SUM(all assignment.customerbill)
Event.totallaborcost = Event.totaltechpayout (same thing)
```

---

## 🔌 FULL API CONTRACT (19+ ENDPOINTS)

### Events Endpoints

**GET /events** - List all events
```
Response: Array<Event>
```

**POST /events** - Create event
```
Payload: { name, clientname, clientcontact, ... }
Response: Event (201)
```

**GET /events/:id** - Get single event
```
Response: Event
```

**PUT /events/:id** - Update event
```
Payload: { name, clientname, ... }
Response: Event
```

**DELETE /events/:id** - Delete event (cascades to requirements & assignments)
```
Response: { success: true }
```

### Technicians Endpoints (similar CRUD)
- **GET /technicians**
- **POST /technicians**
- **PUT /technicians/:id**
- **DELETE /technicians/:id**

### Requirements Endpoints
- **GET /events/:eventid/requirements** - List for event
- **POST /requirements** - Create (requires eventId)
- **PATCH /requirements/:id** - Update
- **DELETE /requirements/:id** - Delete (cascades to assignments)

### Assignments Endpoints (⚠️ 25 FIELDS REQUIRED)
- **GET /assignments** - All assignments
- **GET /events/:eventid/assignments** - For event
- **POST /assignments** - Create (eventId + technicianid required)
- **PATCH /assignments/:id** - Update
- **DELETE /assignments/:id** - Delete

### Positions Endpoints
- **GET /settings/positions** - List positions
- **POST /settings/positions** - Create
- **DELETE /settings/positions/:name** - Delete (fails if in use)

### Settings Endpoints
- **GET /settings** - Get all settings
- **PUT /settings** - Update settings

---

## 💾 COMPONENT ARCHITECTURE

### State Management
```
useDataStore (central)
├─ useAssignments (entity-specific)
├─ useRequirements (entity-specific)
├─ useTechnicians (entity-specific)
├─ useEvents (entity-specific)
└─ useSettings (entity-specific)
```

### Page Structure
```
App.js (router)
├─ Dashboard (analytics)
├─ Technicians (roster CRUD)
├─ EventDetails (event + requirements + assignments)
├─ ScheduleGrid (table + Gantt views)
└─ Settings (app configuration)
```

### Reusable Components
- EditableCell (text editing)
- EditableSelectCell (dropdown selection)

---

## ✅ VALIDATION PATTERNS

### Assignment POST Validation
1. **eventId** (required, UUID format)
2. **technicianid** (required, UUID format)
3. **All 25 fields** (or explicit null values)
4. **Time format**: HH:MM (24-hour)
5. **Hours consistency**: basehours + othours + dthours ≤ hoursworked

### Requirement Validation
1. **eventId** (required)
2. **starttime** (required, HH:MM format)
3. **endtime** (required, HH:MM format)
4. **endtime > starttime** or overnight

### Technician Validation
1. **name** (required, unique)
2. **ratetype**: hourly | half-day | full-day
3. **Rate consistency**: all 6 rates should be > 0

---

## 🧪 TESTING STRATEGIES

### Unit Tests (rateCalculator.js)
- Hours breakdown with day shifts
- Hours breakdown with overnight shifts
- Tech payout at different rate types
- Customer billing calculations
- Edge cases (0 hours, fractional hours)

### Integration Tests
- Create event → requirement → assignment flow
- Cascade delete (event deletes requirements + assignments)
- State synchronization across components
- Filter and sort operations

### Contract Tests
- API responses match OpenAPI schema
- All required fields present
- Error codes correct (400, 404, 409, 500)

---

## 🚀 DEPLOYMENT CHECKLIST

Before production:
- [ ] Database backup strategy configured
- [ ] Environment variables set (API_URL, NODE_ENV)
- [ ] Error logging enabled (console.log with emoji tags)
- [ ] CORS configured (if needed)
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] SSL/TLS enabled
- [ ] HTTPS enforcement

---

## 📝 KNOWN GAPS / PRIORITY 2

- Real-time updates (WebSocket/polling)
- Multi-technician assignments per requirement
- Technician availability calendar
- Automatic invoice generation
- Payment processing
- User authentication/permissions
- Audit trail
- Bulk operations
- Export (PDF, CSV, Excel)

---

**See labor_app_openapi_3.0.yaml for complete API specification**
