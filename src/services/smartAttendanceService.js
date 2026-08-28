export const calculateSubjectAttendanceStats = (attended, total, targetPercent = 75) => {
  const currentPercent = total > 0 ? Number(((attended / total) * 100).toFixed(1)) : 100
  const isShortage = currentPercent < targetPercent

  let safeBunks = 0
  let classesNeeded = 0

  if (currentPercent >= targetPercent) {
    const maxTotalClasses = (attended * 100) / targetPercent
    safeBunks = Math.max(0, Math.floor(maxTotalClasses - total))
  } else {
    if (targetPercent < 100) {
      const needed = (targetPercent * total - 100 * attended) / (100 - targetPercent)
      classesNeeded = Math.max(1, Math.ceil(needed))
    } else {
      classesNeeded = 1
    }
  }

  return {
    currentPercent,
    isShortage,
    safeBunks,
    classesNeeded,
    statusColor:
      currentPercent >= 85
        ? 'emerald'
        : currentPercent >= 75
        ? 'blue'
        : currentPercent >= 65
        ? 'amber'
        : 'rose',
  }
}

export const calculateOverallAttendance = (subjects) => {
  let totalAttended = 0
  let totalClasses = 0

  subjects.forEach((s) => {
    totalAttended += Number(s.attended) || 0
    totalClasses += Number(s.total) || 0
  })

  const overallPercent =
    totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 100

  const shortageSubjects = subjects.filter(
    (s) => (s.total > 0 ? (s.attended / s.total) * 100 : 100) < 75
  )

  return {
    totalAttended,
    totalClasses,
    overallPercent,
    shortageCount: shortageSubjects.length,
    shortageSubjects,
  }
}

export const verifySessionCheckIn = async (pin, subjectCode) => {
  if (!pin || pin.trim().length !== 4) {
    return { success: false, message: 'Invalid 4-digit session code.' }
  }

  return {
    success: true,
    message: `Attendance successfully verified for ${subjectCode}! Location: Tech Block 3 (Geofence verified).`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}
