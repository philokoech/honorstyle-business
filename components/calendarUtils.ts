import { Appointment } from '../types';

interface AppointmentWithPos extends Appointment {
  h_pos: number;
  h_total: number;
}

export const processAppointmentsForLayout = (appointmentsForProfessional: Appointment[]): AppointmentWithPos[] => {
  if (!appointmentsForProfessional || appointmentsForProfessional.length === 0) {
    return [];
  }

  // Sort by start time, then by end time. This provides a stable and predictable order for processing.
  const sortedAppts = [...appointmentsForProfessional].sort((a, b) => {
    if (a.start.getTime() !== b.start.getTime()) {
      return a.start.getTime() - b.start.getTime();
    }
    return a.end.getTime() - b.end.getTime();
  });
  
  const processed: AppointmentWithPos[] = [];
  
  // First pass: Determine horizontal position (h_pos) for each appointment.
  // This is a greedy algorithm that places each appointment in the first available column from the left.
  for (const appt of sortedAppts) {
    let h_pos = 0;
    let placed = false;
    
    while (!placed) {
        // An appointment collides if its time range overlaps with another appointment in the same column.
        // We check for `p.end > appt.start` (and vice-versa) to ensure appointments that touch at the boundaries are not considered overlapping.
        const isColliding = processed.some(p => 
            p.h_pos === h_pos && 
            p.start.getTime() < appt.end.getTime() &&
            p.end.getTime() > appt.start.getTime()
        );

        if (!isColliding) {
            placed = true;
        } else {
            h_pos++;
        }
    }
    processed.push({ ...appt, h_pos, h_total: 1 });
  }

  // Second pass: Determine the total number of horizontal slots (h_total) required for each group of overlapping appointments.
  for (const appt of processed) {
      // Find all appointments that overlap with the current one.
      const overlappingAppts = processed.filter(p => 
          p.id !== appt.id &&
          p.start.getTime() < appt.end.getTime() && 
          p.end.getTime() > appt.start.getTime()
      );

      // The group includes the current appointment and all its overlapping neighbors.
      const allInGroup = [appt, ...overlappingAppts];
      // The total number of columns needed for this group is determined by the maximum horizontal position (`h_pos`) within that group.
      const maxHPos = Math.max(...allInGroup.map(a => a.h_pos));
      
      // Update h_total for every appointment in the group to ensure they all have the same width denominator.
      for(const item of allInGroup) {
        item.h_total = Math.max(item.h_total, maxHPos + 1);
      }
  }

  return processed;
};
