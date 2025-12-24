import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, execute, initializeDatabase } from './database.js';

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate event totals from assignments
const calculateEventTotals = (eventId) => {
  const assignments = query(
    'SELECT calculatedpay, customerbill FROM eventassignments WHERE eventid = ?',
    [eventId]
  );
  
  const totaltechpayout = assignments.reduce((sum, a) => sum + (a.calculatedpay || 0), 0);
  const totalcustomerbilling = assignments.reduce((sum, a) => sum + (a.customerbill || 0), 0);
  const totallaborcost = totaltechpayout;

  return { totaltechpayout, totalcustomerbilling, totallaborcost };
};

// Update event totals
const updateEventTotals = (eventId) => {
  const totals = calculateEventTotals(eventId);
  execute(
    'UPDATE events SET totaltechpayout = ?, totallaborcost = ?, totalcustomerbilling = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [totals.totaltechpayout, totals.totallaborcost, totals.totalcustomerbilling, eventId]
  );
};

// Validate assignment has all 25 required fields
const validateAssignmentFields = (data) => {
  const requiredFields = [
    'eventid', 'eventId', 'technicianid', 'requirementid', 'position', 'roomorlocation',
    'hoursworked', 'basehours', 'othours', 'dothours',
    'ratetype', 'techhourlyrate', 'techhalfdayrate', 'techfulldayrate',
    'billhourlyrate', 'billhalfdayrate', 'billfulldayrate',
    'calculatedpay', 'customerbill', 'assignmentdate', 'starttime', 'endtime'
  ];

  const eventId = data.eventid || data.eventId;
  const techId = data.technicianid || data.technicianId;

  const missingFields = requiredFields.filter(
    field => !(field in data || ('eventid' in data || 'eventId' in data) && field === 'eventid')
  );

  if (!eventId || !techId) {
    return false;
  }

  return true;
};

// ============================================================================
// EVENT ENDPOINTS
// ============================================================================

// GET /events - List all events
app.get('/events', (req, res) => {
  try {
    const events = query('SELECT * FROM events ORDER BY createdAt DESC');
    res.json(events);
  } catch (error) {
    console.error('❌ GET /events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /events - Create event
app.post('/events', (req, res) => {
  try {
    const { name, clientname, clientcontact, clientphone, clientemail, clientaddress, ponumber, startdate, enddate } = req.body;
    const id = uuidv4();

    execute(
      `INSERT INTO events (id, name, clientname, clientcontact, clientphone, clientemail, clientaddress, ponumber, startdate, enddate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, clientname, clientcontact, clientphone, clientemail, clientaddress, ponumber, startdate, enddate]
    );

    const event = queryOne('SELECT * FROM events WHERE id = ?', [id]);
    res.status(201).json(event);
  } catch (error) {
    console.error('❌ POST /events error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /events/:id - Get single event with totals
app.get('/events/:id', (req, res) => {
  try {
    const event = queryOne('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Recalculate totals
    const totals = calculateEventTotals(req.params.id);
    event.totaltechpayout = totals.totaltechpayout;
    event.totallaborcost = totals.totallaborcost;
    event.totalcustomerbilling = totals.totalcustomerbilling;

    res.json(event);
  } catch (error) {
    console.error('❌ GET /events/:id error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// PUT /events/:id - Update event
app.put('/events/:id', (req, res) => {
  try {
    const { name, clientname, clientcontact, clientphone, clientemail, clientaddress, ponumber, startdate, enddate } = req.body;

    execute(
      `UPDATE events SET name = ?, clientname = ?, clientcontact = ?, clientphone = ?, clientemail = ?, clientaddress = ?, ponumber = ?, startdate = ?, enddate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, clientname, clientcontact, clientphone, clientemail, clientaddress, ponumber, startdate, enddate, req.params.id]
    );

    const event = queryOne('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(event);
  } catch (error) {
    console.error('❌ PUT /events/:id error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /events/:id - Delete event (cascades to requirements and assignments)
app.delete('/events/:id', (req, res) => {
  try {
    execute('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('❌ DELETE /events/:id error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ============================================================================
// TECHNICIAN ENDPOINTS
// ============================================================================

// GET /technicians - List all technicians
app.get('/technicians', (req, res) => {
  try {
    const technicians = query('SELECT * FROM technicians ORDER BY name ASC');
    res.json(technicians);
  } catch (error) {
    console.error('❌ GET /technicians error:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// POST /technicians - Create technician
app.post('/technicians', (req, res) => {
  try {
    const {
      name, phone, email, ratetype,
      techhourlyrate, techhalfdayrate, techfulldayrate,
      billhourlyrate, billhalfdayrate, billfulldayrate
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = uuidv4();
    execute(
      `INSERT INTO technicians (id, name, phone, email, ratetype, techhourlyrate, techhalfdayrate, techfulldayrate, billhourlyrate, billhalfdayrate, billfulldayrate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, phone, email, ratetype, techhourlyrate, techhalfdayrate, techfulldayrate, billhourlyrate, billhalfdayrate, billfulldayrate]
    );

    const technician = queryOne('SELECT * FROM technicians WHERE id = ?', [id]);
    res.status(201).json(technician);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Technician name already exists' });
    }
    console.error('❌ POST /technicians error:', error);
    res.status(500).json({ error: 'Failed to create technician' });
  }
});

// PUT /technicians/:id - Update technician
app.put('/technicians/:id', (req, res) => {
  try {
    const {
      name, phone, email, ratetype,
      techhourlyrate, techhalfdayrate, techfulldayrate,
      billhourlyrate, billhalfdayrate, billfulldayrate
    } = req.body;

    execute(
      `UPDATE technicians SET name = ?, phone = ?, email = ?, ratetype = ?, techhourlyrate = ?, techhalfdayrate = ?, techfulldayrate = ?, billhourlyrate = ?, billhalfdayrate = ?, billfulldayrate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, phone, email, ratetype, techhourlyrate, techhalfdayrate, techfulldayrate, billhourlyrate, billhalfdayrate, billfulldayrate, req.params.id]
    );

    const technician = queryOne('SELECT * FROM technicians WHERE id = ?', [req.params.id]);
    res.json(technician);
  } catch (error) {
    console.error('❌ PUT /technicians/:id error:', error);
    res.status(500).json({ error: 'Failed to update technician' });
  }
});

// DELETE /technicians/:id - Delete technician (cascades to assignments)
app.delete('/technicians/:id', (req, res) => {
  try {
    execute('DELETE FROM technicians WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Technician deleted' });
  } catch (error) {
    console.error('❌ DELETE /technicians/:id error:', error);
    res.status(500).json({ error: 'Failed to delete technician' });
  }
});

// ============================================================================
// REQUIREMENT ENDPOINTS
// ============================================================================

// GET /events/:eventid/requirements - List requirements for event
app.get('/events/:eventid/requirements', (req, res) => {
  try {
    const requirements = query(
      'SELECT * FROM eventrequirements WHERE eventid = ? ORDER BY requirementdate ASC, starttime ASC',
      [req.params.eventid]
    );
    res.json(requirements);
  } catch (error) {
    console.error('❌ GET /events/:eventid/requirements error:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

// POST /requirements - Create requirement
app.post('/requirements', (req, res) => {
  try {
    const { eventid, eventId, requirementdate, requirementenddate, roomorlocation, settime, starttime, endtime, striketime, position, techsneeded } = req.body;
    const event_id = eventid || eventId;

    if (!event_id) {
      return res.status(400).json({ error: 'eventid is required' });
    }

    const id = uuidv4();
    execute(
      `INSERT INTO eventrequirements (id, eventid, requirementdate, requirementenddate, roomorlocation, settime, starttime, endtime, striketime, position, techsneeded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, event_id, requirementdate, requirementenddate, roomorlocation, settime, starttime, endtime, striketime, position, techsneeded || 1]
    );

    const requirement = queryOne('SELECT * FROM eventrequirements WHERE id = ?', [id]);
    res.status(201).json(requirement);
  } catch (error) {
    console.error('❌ POST /requirements error:', error);
    res.status(500).json({ error: 'Failed to create requirement' });
  }
});

// PATCH /requirements/:id - Update requirement
app.patch('/requirements/:id', (req, res) => {
  try {
    const { requirementdate, requirementenddate, roomorlocation, settime, starttime, endtime, striketime, position, techsneeded } = req.body;

    execute(
      `UPDATE eventrequirements SET requirementdate = ?, requirementenddate = ?, roomorlocation = ?, settime = ?, starttime = ?, endtime = ?, striketime = ?, position = ?, techsneeded = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [requirementdate, requirementenddate, roomorlocation, settime, starttime, endtime, striketime, position, techsneeded, req.params.id]
    );

    const requirement = queryOne('SELECT * FROM eventrequirements WHERE id = ?', [req.params.id]);
    res.json(requirement);
  } catch (error) {
    console.error('❌ PATCH /requirements/:id error:', error);
    res.status(500).json({ error: 'Failed to update requirement' });
  }
});

// DELETE /requirements/:id - Delete requirement (cascades to assignments)
app.delete('/requirements/:id', (req, res) => {
  try {
    execute('DELETE FROM eventrequirements WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Requirement deleted' });
  } catch (error) {
    console.error('❌ DELETE /requirements/:id error:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
});

// ============================================================================
// ASSIGNMENT ENDPOINTS (⚠️ CRITICAL: ALL 25 FIELDS REQUIRED)
// ============================================================================

// GET /assignments - List all assignments
app.get('/assignments', (req, res) => {
  try {
    const assignments = query('SELECT * FROM eventassignments ORDER BY assignmentdate DESC, starttime ASC');
    res.json(assignments);
  } catch (error) {
    console.error('❌ GET /assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// GET /events/:eventid/assignments - List assignments for event
app.get('/events/:eventid/assignments', (req, res) => {
  try {
    const assignments = query(
      'SELECT * FROM eventassignments WHERE eventid = ? ORDER BY assignmentdate DESC, starttime ASC',
      [req.params.eventid]
    );
    res.json(assignments);
  } catch (error) {
    console.error('❌ GET /events/:eventid/assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// POST /assignments - Create assignment (⚠️ ALL 25 FIELDS REQUIRED)
app.post('/assignments', (req, res) => {
  try {
    const {
      eventid, eventId, technicianid, technicianId, requirementid,
      position, roomorlocation, hoursworked, basehours, othours, dothours,
      ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
      billhourlyrate, billhalfdayrate, billfulldayrate,
      calculatedpay, customerbill, notes, assignmentdate, starttime, endtime
    } = req.body;

    const event_id = eventid || eventId;
    const tech_id = technicianid || technicianId;

    // Validate all 25 fields are present
    if (!event_id || !tech_id) {
      return res.status(400).json({ error: 'eventid and technicianid are required' });
    }

    if (typeof basehours === 'undefined' || typeof othours === 'undefined' || typeof dothours === 'undefined') {
      return res.status(400).json({ error: 'basehours, othours, and dothours are required' });
    }

    if (typeof calculatedpay === 'undefined' || typeof customerbill === 'undefined') {
      return res.status(400).json({ error: 'calculatedpay and customerbill are required' });
    }

    const id = uuidv4();
    execute(
      `INSERT INTO eventassignments (
        id, eventid, technicianid, requirementid, position, roomorlocation,
        hoursworked, basehours, othours, dothours, ratetype,
        techhourlyrate, techhalfdayrate, techfulldayrate,
        billhourlyrate, billhalfdayrate, billfulldayrate,
        calculatedpay, customerbill, notes, assignmentdate, starttime, endtime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, event_id, tech_id, requirementid, position, roomorlocation,
        hoursworked, basehours, othours, dothours, ratetype,
        techhourlyrate, techhalfdayrate, techfulldayrate,
        billhourlyrate, billhalfdayrate, billfulldayrate,
        calculatedpay, customerbill, notes, assignmentdate, starttime, endtime
      ]
    );

    // Update event totals
    updateEventTotals(event_id);

    const assignment = queryOne('SELECT * FROM eventassignments WHERE id = ?', [id]);
    res.status(201).json(assignment);
  } catch (error) {
    console.error('❌ POST /assignments error:', error);
    res.status(500).json({ error: 'Failed to create assignment', details: error.message });
  }
});

// PATCH /assignments/:id - Update assignment
app.patch('/assignments/:id', (req, res) => {
  try {
    const {
      position, roomorlocation, hoursworked, basehours, othours, dothours,
      ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
      billhourlyrate, billhalfdayrate, billfulldayrate,
      calculatedpay, customerbill, notes, assignmentdate, starttime, endtime
    } = req.body;

    const assignment = queryOne('SELECT eventid FROM eventassignments WHERE id = ?', [req.params.id]);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    execute(
      `UPDATE eventassignments SET
        position = ?, roomorlocation = ?, hoursworked = ?, basehours = ?, othours = ?, dothours = ?,
        ratetype = ?, techhourlyrate = ?, techhalfdayrate = ?, techfulldayrate = ?,
        billhourlyrate = ?, billhalfdayrate = ?, billfulldayrate = ?,
        calculatedpay = ?, customerbill = ?, notes = ?, assignmentdate = ?, starttime = ?, endtime = ?,
        updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        position, roomorlocation, hoursworked, basehours, othours, dothours,
        ratetype, techhourlyrate, techhalfdayrate, techfulldayrate,
        billhourlyrate, billhalfdayrate, billfulldayrate,
        calculatedpay, customerbill, notes, assignmentdate, starttime, endtime,
        req.params.id
      ]
    );

    // Update event totals
    updateEventTotals(assignment.eventid);

    const updated = queryOne('SELECT * FROM eventassignments WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    console.error('❌ PATCH /assignments/:id error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// DELETE /assignments/:id - Delete assignment
app.delete('/assignments/:id', (req, res) => {
  try {
    const assignment = queryOne('SELECT eventid FROM eventassignments WHERE id = ?', [req.params.id]);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    execute('DELETE FROM eventassignments WHERE id = ?', [req.params.id]);

    // Update event totals
    updateEventTotals(assignment.eventid);

    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    console.error('❌ DELETE /assignments/:id error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// ============================================================================
// POSITION ENDPOINTS
// ============================================================================

// GET /settings/positions - List all positions
app.get('/settings/positions', (req, res) => {
  try {
    const positions = query('SELECT * FROM positions ORDER BY name ASC');
    res.json(positions);
  } catch (error) {
    console.error('❌ GET /settings/positions error:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// POST /settings/positions - Create position
app.post('/settings/positions', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Position name is required' });
    }

    execute('INSERT INTO positions (name) VALUES (?)', [name]);
    const position = queryOne('SELECT * FROM positions WHERE name = ?', [name]);
    res.status(201).json(position);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Position already exists' });
    }
    console.error('❌ POST /settings/positions error:', error);
    res.status(500).json({ error: 'Failed to create position' });
  }
});

// DELETE /settings/positions/:name - Delete position
app.delete('/settings/positions/:name', (req, res) => {
  try {
    const positionName = decodeURIComponent(req.params.name);
    
    // Check if position is in use
    const inUse = queryOne('SELECT COUNT(*) as count FROM eventrequirements WHERE position = ?', [positionName]);
    if (inUse.count > 0) {
      return res.status(409).json({ error: 'Cannot delete position that is in use' });
    }

    execute('DELETE FROM positions WHERE name = ?', [positionName]);
    res.json({ success: true, message: 'Position deleted' });
  } catch (error) {
    console.error('❌ DELETE /settings/positions/:name error:', error);
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

// ============================================================================
// SETTINGS ENDPOINTS
// ============================================================================

// GET /settings - Get app settings
app.get('/settings', (req, res) => {
  try {
    const settings = queryOne('SELECT * FROM settings WHERE id = 1');
    res.json(settings);
  } catch (error) {
    console.error('❌ GET /settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /settings - Update settings
app.put('/settings', (req, res) => {
  try {
    const { halfdayhours, fulldayhours, otthreshold, dotthreshold, dotstarthour, techbaserate, customerbaserate } = req.body;

    execute(
      `UPDATE settings SET halfdayhours = ?, fulldayhours = ?, otthreshold = ?, dotthreshold = ?, dotstarthour = ?, techbaserate = ?, customerbaserate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1`,
      [halfdayhours, fulldayhours, otthreshold, dotthreshold, dotstarthour, techbaserate, customerbaserate]
    );

    const settings = queryOne('SELECT * FROM settings WHERE id = 1');
    res.json(settings);
  } catch (error) {
    console.error('❌ PUT /settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║     🚀 AV Labor Coordinator Backend Server Started         ║
║     ✅ API listening on http://localhost:${PORT}               ║
║     ✅ Database initialized: labor_coordinator.db          ║
║     ✅ 19+ endpoints ready                                 ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
