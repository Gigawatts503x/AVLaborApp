# Labor Coordination App - Postman Project Outline

## Project Overview
Build a complete API testing collection for the AV Labor Coordinator event scheduling and invoicing system with automatic rate calculations, technician roster management, and billing analytics.

## Quick Facts
- **Base URL**: `http://localhost:3001/api`
- **Total Endpoints**: 19+
- **Data Models**: 7 schemas
- **Resource Types**: 6 (Events, Technicians, Requirements, Assignments, Settings, Positions)

## API Resource Structure

### 1. EVENTS (5 endpoints)
- `GET /events` - List all events
- `POST /events` - Create new event
- `GET /events/{id}` - Get specific event
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event (cascades)

### 2. TECHNICIANS (5 endpoints)
- `GET /technicians` - List all technicians
- `POST /technicians` - Create technician
- `GET /technicians/{id}` - Get specific technician
- `PUT /technicians/{id}` - Update technician
- `DELETE /technicians/{id}` - Delete technician

### 3. REQUIREMENTS (4 endpoints)
- `GET /events/{eventid}/requirements` - List requirements for event
- `POST /requirements` - Create requirement
- `PATCH /requirements/{id}` - Update requirement
- `DELETE /requirements/{id}` - Delete requirement (cascades)

### 4. ASSIGNMENTS (5 endpoints) ⚠️ CRITICAL
- `GET /assignments` - List all assignments
- `GET /events/{eventid}/assignments` - List assignments for event
- `POST /assignments` - Create assignment (requires ALL 25 fields!)
- `PATCH /assignments/{id}` - Update assignment
- `DELETE /assignments/{id}` - Delete assignment

### 5. SETTINGS (2 endpoints)
- `GET /settings` - Get app settings
- `PUT /settings` - Update app settings

### 6. POSITIONS (3 endpoints)
- `GET /settings/positions` - List positions
- `POST /settings/positions` - Create position
- `DELETE /settings/positions/{name}` - Delete position

## Key Calculation Formulas
- **Base Hours**: 8 hours standard
- **Overtime (OT)**: Hours > 10/day = 1.5x rate
- **Double Time (DT)**: Hours > 20/day OR after 8 PM = 2x rate
- **Tech Pay**: Base hours × hourly rate + OT + DT
- **Customer Bill**: Same calculation, using billing rates (higher than tech rates)

## Critical Implementation Notes

### Assignment Creation (25 Required Fields)
```
MUST include ALL 25 fields:
- eventid, technicianid, requirementid
- position, roomorlocation
- hoursworked, basehours, othours, dothours
- ratetype (hourly/half-day/full-day)
- techhourlyrate, techhalfdayrate, techfulldayrate
- billhourlyrate, billhalfdayrate, billfulldayrate
- calculatedpay, customerbill
- notes, assignmentdate, starttime, endtime
```

### Event Data Flow
1. Create Event (client info + dates)
2. Add Requirements (positions needed per day/time)
3. Assign Technicians to Requirements
4. System auto-calculates pay and billing
5. Query totals from Event object

### Data Persistence
- **Backend**: SQLite database (no setup needed, auto-initializes)
- **Frontend**: localStorage for UI state
- All data persists between sessions

## Test Data Setup (Quick Start)
### Create Sample Event
```json
{
  "name": "Annual Conference 2025",
  "clientname": "Tech Events Inc",
  "clientcontact": "John Manager",
  "startdate": "2025-12-21",
  "enddate": "2025-12-23"
}
```

### Create Sample Technician
```json
{
  "name": "Alex Johnson",
  "phone": "555-0123",
  "email": "alex@example.com",
  "ratetype": "hourly",
  "techhourlyrate": 50,
  "billhourlyrate": 75
}
```

### Create Sample Requirement
```json
{
  "eventid": "[event-id-from-step-1]",
  "requirementdate": "2025-12-21",
  "position": "Audio Tech",
  "starttime": "08:00",
  "endtime": "18:00",
  "roomorlocation": "Main Hall",
  "techsneeded": 2
}
```

### Create Sample Assignment (ALL 25 FIELDS!)
```json
{
  "eventid": "[event-id]",
  "technicianid": "[tech-id]",
  "requirementid": "[req-id]",
  "position": "Audio Tech",
  "roomorlocation": "Main Hall",
  "hoursworked": 10,
  "basehours": 8,
  "othours": 2,
  "dothours": 0,
  "ratetype": "hourly",
  "techhourlyrate": 50,
  "techhalfdayrate": 200,
  "techfulldayrate": 400,
  "billhourlyrate": 75,
  "billhalfdayrate": 300,
  "billfulldayrate": 600,
  "calculatedpay": 500,
  "customerbill": 750,
  "assignmentdate": "2025-12-21",
  "starttime": "08:00",
  "endtime": "18:00",
  "notes": "Setup complete, good performance"
}
```

## Testing Workflow

### Phase 1: Foundation Setup
1. **POST /events** → Save event ID
2. **POST /technicians** → Save technician IDs (create 3-5)
3. **GET /settings** → Review default settings

### Phase 2: Schedule Creation
4. **POST /requirements** → Add 5-10 requirements for the event
5. **GET /events/{eventid}/requirements** → Verify they're there

### Phase 3: Assignments & Calculations
6. **POST /assignments** → Create assignments with ALL 25 fields
7. **GET /assignments** → Verify calculations
8. **PATCH /assignments/{id}** → Update hours and verify recalculation
9. **GET /events/{id}** → Check totals (totaltechpayout, totalcustomerbilling)

### Phase 4: Settings Management
10. **PUT /settings** → Adjust OT threshold, DT threshold
11. **POST /settings/positions** → Add custom positions
12. **GET /settings/positions** → Verify positions

## Expected Response Codes
- **200**: Success (GET, PUT, PATCH)
- **201**: Created (POST)
- **400**: Invalid input
- **404**: Not found
- **409**: Conflict (position in use)
- **500**: Server error (missing required fields in assignment)

## Postman Collection Tips
- Save event/technician IDs in environment variables for reuse
- Use `tests` tab to verify calculations
- Create a request chain so each step feeds into the next
- Use `Pre-request Script` to auto-generate UUIDs
- Check JSON responses for calculated values

---

**💡 Pro Tip**: After importing, run requests in this order:
1. Events → Technicians → Settings (setup)
2. Requirements (add to event)
3. Assignments (test with all 25 fields)
4. Re-GET Event to see totals update

**⚠️ CRITICAL**: Assignment creation will FAIL if any of the 25 fields are missing. No partials allowed!
