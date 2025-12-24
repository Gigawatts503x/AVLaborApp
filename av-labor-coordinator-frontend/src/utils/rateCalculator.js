/**
 * Rate Calculator - Handles all time and payment calculations
 * 
 * Key Formulas:
 * - Hours breakdown: base (0-10), OT (10-20 at 1.5x), DT (20+ or 20:00-04:00 at 2.0x)
 * - Tech Pay: (base × techhourlyrate) + (ot × techhourlyrate × 1.5) + (dt × techhourlyrate × 2.0)
 * - Customer Bill: (base × billhourlyrate) + (ot × billhourlyrate × 1.5) + (dt × billhourlyrate × 2.0)
 */

/**
 * Convert time string (HH:MM) to minutes since midnight
 * @param {string} timeStr - Time in HH:MM format (24-hour)
 * @returns {number} Minutes since midnight
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Calculate hours breakdown (base, OT, DT)
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {number} otThreshold - Hours before OT kicks in (default: 10)
 * @param {number} dtThreshold - Hours before DT kicks in (default: 20)
 * @param {number} dtStartHour - Hour when night DT begins (default: 20)
 * @returns {object} { totalHours, baseHours, otHours, dtHours }
 */
export const calculateHoursBreakdown = (
  startTime,
  endTime,
  otThreshold = 10,
  dtThreshold = 20,
  dtStartHour = 20
) => {
  const startMin = timeToMinutes(startTime);
  let endMin = timeToMinutes(endTime);

  // Handle overnight shift (endTime < startTime)
  if (endMin <= startMin) {
    endMin += 24 * 60; // Add 24 hours
  }

  const totalMinutes = endMin - startMin;
  const totalHours = totalMinutes / 60;

  // Calculate base hours (first otThreshold hours)
  const baseHours = Math.min(totalHours, otThreshold);

  // Calculate OT hours (otThreshold to dtThreshold)
  const otHours = Math.max(0, Math.min(totalHours, dtThreshold) - otThreshold);

  // Calculate DT hours (hours after dtThreshold OR in DT window 20:00-04:00)
  let dtHours = Math.max(0, totalHours - dtThreshold);

  // Also count DT for hours in the night window (dtStartHour to 04:00)
  const dtWindowStart = dtStartHour * 60;
  const dtWindowEnd = 4 * 60; // 04:00

  // For overnight shifts, DT window spans midnight
  let dtFromWindow = 0;
  if (startMin < dtWindowStart && endMin > dtWindowStart) {
    // Shift enters DT window
    const dtStartInShift = dtWindowStart - startMin;
    const dtEndInShift = Math.min(endMin - startMin, dtWindowStart - startMin + (24 * 60 - dtWindowStart + dtWindowEnd));
    dtFromWindow = Math.max(0, (dtEndInShift - dtStartInShift) / 60);
  }

  // Use whichever gives more DT hours (threshold-based or window-based)
  dtHours = Math.max(dtHours, dtFromWindow);

  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    baseHours: parseFloat(baseHours.toFixed(2)),
    otHours: parseFloat(otHours.toFixed(2)),
    dtHours: parseFloat(dtHours.toFixed(2)),
  };
};

/**
 * Calculate technician payout
 * @param {object} params - { baseHours, otHours, dtHours, techhourlyrate }
 * @returns {number} Total tech payout
 */
export const calculateTechPayout = ({
  baseHours = 0,
  otHours = 0,
  dtHours = 0,
  techhourlyrate = 0,
}) => {
  const basePay = baseHours * techhourlyrate;
  const otPay = otHours * techhourlyrate * 1.5;
  const dtPay = dtHours * techhourlyrate * 2.0;
  
  const total = basePay + otPay + dtPay;
  return parseFloat(total.toFixed(2));
};

/**
 * Calculate customer billing
 * @param {object} params - { baseHours, otHours, dtHours, billhourlyrate }
 * @returns {number} Total customer billing
 */
export const calculateBilling = ({
  baseHours = 0,
  otHours = 0,
  dtHours = 0,
  billhourlyrate = 0,
}) => {
  const baseBill = baseHours * billhourlyrate;
  const otBill = otHours * billhourlyrate * 1.5;
  const dtBill = dtHours * billhourlyrate * 2.0;
  
  const total = baseBill + otBill + dtBill;
  return parseFloat(total.toFixed(2));
};

/**
 * Calculate profit margin
 * @param {number} billing - Customer billing amount
 * @param {number} payout - Tech payout amount
 * @returns {number} Margin percentage (0-100)
 */
export const calculateMargin = (billing, payout) => {
  if (billing === 0) return 0;
  const margin = ((billing - payout) / billing) * 100;
  return parseFloat(margin.toFixed(2));
};

/**
 * Format currency for display
 * @param {number} amount - Amount in dollars
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format hours to 2 decimal places
 * @param {number} hours - Hours as decimal
 * @returns {string} Formatted hours string
 */
export const formatHours = (hours) => {
  return parseFloat(hours).toFixed(2);
};

/**
 * Test the rate calculator with known values
 * @returns {object} Test results
 */
export const testRateCalculator = () => {
  // Test case: 15:00-01:00 (10 hours, with 3 DT hours)
  const hours = calculateHoursBreakdown('15:00', '01:00');
  const techPay = calculateTechPayout({
    ...hours,
    techhourlyrate: 50,
  });
  const bill = calculateBilling({
    ...hours,
    billhourlyrate: 75,
  });
  const margin = calculateMargin(bill, techPay);

  console.log('🧪 Rate Calculator Test:');
  console.log('  Input: 15:00-01:00');
  console.log('  Expected: 10h total, 10 base, 0 OT, 3 DT');
  console.log('  Actual:', hours);
  console.log('  Tech Pay (at $50/hr): $' + techPay, '(expected: $800)');
  console.log('  Bill (at $75/hr): $' + bill, '(expected: $1,200)');
  console.log('  Margin:', margin + '%', '(expected: 33.33%)');

  return {
    hours,
    techPay,
    bill,
    margin,
    passed: 
      hours.totalHours === 10 &&
      hours.baseHours === 10 &&
      hours.otHours === 0 &&
      hours.dtHours === 3 &&
      techPay === 800 &&
      bill === 1200,
  };
};

export default {
  calculateHoursBreakdown,
  calculateTechPayout,
  calculateBilling,
  calculateMargin,
  formatCurrency,
  formatHours,
  testRateCalculator,
};
