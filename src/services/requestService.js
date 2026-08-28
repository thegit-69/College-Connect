import { INITIAL_REQUESTS } from './campusData'

export const fetchRequests = async () => {
  try {
    const local = localStorage.getItem('campus_requests')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn(e)
  }
  return INITIAL_REQUESTS
}

export const createRequest = async (requestData) => {
  const current = await fetchRequests()
  const reqId = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  const token = `CAMPUS-AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

  const newRequest = {
    id: reqId,
    ...requestData,
    status: 'Pending',
    appliedAt: new Date().toISOString().split('T')[0],
    reviewer: requestData.type === 'Hostel Gate Pass' ? 'Hostel Warden' : 'Dept. HOD / Class Advisor',
    comments: 'Request submitted and queued for approval.',
    attachments: requestData.attachments || [],
    token,
    qrData: `${requestData.type.replace(/\s+/g, '_').toUpperCase()}-${reqId}-${token}`
  }

  const updated = [newRequest, ...current]
  try {
    localStorage.setItem('campus_requests', JSON.stringify(updated))
  } catch (e) {
    console.warn(e)
  }
  return newRequest
}

export const updateRequestStatus = async (requestId, newStatus, comments = '') => {
  const current = await fetchRequests()
  const updated = current.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: newStatus,
          comments: comments || (newStatus === 'Approved' ? 'Approved by authority.' : 'Rejected.')
        }
      : r
  )

  try {
    localStorage.setItem('campus_requests', JSON.stringify(updated))
  } catch (e) {
    console.warn(e)
  }
  return updated
}
