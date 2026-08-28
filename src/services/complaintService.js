import { INITIAL_COMPLAINTS } from './campusData'

export const fetchComplaints = async () => {
  try {
    const local = localStorage.getItem('campus_complaints')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn(e)
  }
  return INITIAL_COMPLAINTS
}

export const createComplaint = async (newComplaint) => {
  const current = await fetchComplaints()

  const text = (newComplaint.title + ' ' + newComplaint.description).toLowerCase()
  let urgency = 'Medium'
  if (text.includes('urgent') || text.includes('hazard') || text.includes('danger') || text.includes('harassment') || text.includes('ragging') || text.includes('fire')) {
    urgency = 'Critical'
  } else if (text.includes('mess') || text.includes('food') || text.includes('wifi') || text.includes('leak') || text.includes('broken')) {
    urgency = 'High'
  }

  const complaintObj = {
    id: `CMP-${new Date().getFullYear()}-${String(current.length + 1).padStart(3, '0')}`,
    ...newComplaint,
    urgency: newComplaint.urgency || urgency,
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
    timeline: [
      {
        status: 'Submitted',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        note: 'Grievance ticket created by student'
      }
    ],
    adminResponse: 'Your complaint has been acknowledged by the administrative cell and assigned for review.'
  }

  const updated = [complaintObj, ...current]
  try {
    localStorage.setItem('campus_complaints', JSON.stringify(updated))
  } catch (e) {
    console.warn(e)
  }
  return complaintObj
}

export const updateComplaintStatus = async (complaintId, newStatus, responseNote = '') => {
  const current = await fetchComplaints()
  const updated = current.map((c) => {
    if (c.id === complaintId) {
      return {
        ...c,
        status: newStatus,
        adminResponse: responseNote || c.adminResponse,
        timeline: [
          ...c.timeline,
          {
            status: newStatus,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            note: responseNote || `Status updated to ${newStatus}`
          }
        ]
      }
    }
    return c
  })

  try {
    localStorage.setItem('campus_complaints', JSON.stringify(updated))
  } catch (e) {
    console.warn(e)
  }
  return updated
}
