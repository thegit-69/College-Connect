import { INITIAL_SUBJECTS, INITIAL_TIMETABLE, INITIAL_ASSIGNMENTS } from './campusData'

export const fetchSubjects = async () => {
  try {
    const local = localStorage.getItem('campus_subjects')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn('Local storage read error', e)
  }
  return INITIAL_SUBJECTS
}

export const saveSubjects = async (subjects) => {
  try {
    localStorage.setItem('campus_subjects', JSON.stringify(subjects))
  } catch (e) {
    console.warn('Local storage write error', e)
  }
  return subjects
}

export const fetchTimetable = async () => {
  try {
    const local = localStorage.getItem('campus_timetable')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn('Local storage read error', e)
  }
  return INITIAL_TIMETABLE
}

export const fetchAssignments = async () => {
  try {
    const local = localStorage.getItem('campus_assignments')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn('Local storage read error', e)
  }
  return INITIAL_ASSIGNMENTS
}

export const submitAssignment = async (assignmentId) => {
  const assignments = await fetchAssignments()
  const updated = assignments.map((asg) =>
    asg.id === assignmentId
      ? {
          ...asg,
          status: 'Submitted',
          submittedDate: new Date().toISOString().split('T')[0],
        }
      : asg
  )
  try {
    localStorage.setItem('campus_assignments', JSON.stringify(updated))
  } catch (e) {
    console.warn(e)
  }
  return updated
}

export const calculateSgpaProjection = (grades) => {
  let totalCredits = 0
  let weightedPoints = 0

  grades.forEach((g) => {
    totalCredits += Number(g.credits) || 0
    weightedPoints += (Number(g.credits) || 0) * (Number(g.expectedGradePoints) || 0)
  })

  if (totalCredits === 0) return 0
  return Number((weightedPoints / totalCredits).toFixed(2))
}
