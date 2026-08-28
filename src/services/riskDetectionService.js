export const evaluateStudentRisk = (studentProfile, subjects, assignments) => {
  let attendancePenalty = 0
  let academicPenalty = 0
  let assignmentPenalty = 0
  let riskFactors = []

  const overallAtt = studentProfile.overallAttendance || 80
  if (overallAtt < 65) {
    attendancePenalty = 40
    riskFactors.push({
      category: 'Attendance Critical',
      severity: 'high',
      description: `Overall attendance is at ${overallAtt}%, which is below the condonation limit (65%). Risk of semester bar.`,
      action: 'Apply for medical/OD condonation immediately with supporting documentation.'
    })
  } else if (overallAtt < 75) {
    attendancePenalty = 25
    riskFactors.push({
      category: 'Attendance Shortage',
      severity: 'medium',
      description: `Overall attendance is at ${overallAtt}%, below mandatory 75% threshold.`,
      action: 'Attend all upcoming classes for next 10 days without absence.'
    })
  }

  const lowSubjects = subjects.filter((s) => (s.total > 0 ? (s.attended / s.total) * 100 : 100) < 75)
  if (lowSubjects.length > 0) {
    attendancePenalty = Math.max(attendancePenalty, lowSubjects.length * 10)
    lowSubjects.forEach((sub) => {
      const pct = ((sub.attended / sub.total) * 100).toFixed(1)
      riskFactors.push({
        category: 'Subject Shortage',
        severity: 'medium',
        description: `${sub.name} (${sub.code}) attendance is at ${pct}% (< 75%).`,
        action: `Attend the next ${Math.ceil((0.75 * sub.total - sub.attended) / 0.25)} consecutive classes in ${sub.code}.`
      })
    })
  }

  let lowMarksSubjects = subjects.filter((s) => s.internalMarks < 18)
  if (lowMarksSubjects.length >= 2) {
    academicPenalty = 25
    riskFactors.push({
      category: 'Internal Assessment Risk',
      severity: 'medium',
      description: `${lowMarksSubjects.length} subjects have internal marks below 70% threshold.`,
      action: 'Schedule remedial / tutoring session with course instructors.'
    })
  } else if (lowMarksSubjects.length === 1) {
    academicPenalty = 12
  }

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length
  if (pendingCount >= 3) {
    assignmentPenalty = 20
    riskFactors.push({
      category: 'Assignment Delinquency',
      severity: 'high',
      description: `${pendingCount} assignments are currently pending or near deadline.`,
      action: 'Prioritize nearest assignment submission before deadline.'
    })
  } else if (pendingCount > 0) {
    assignmentPenalty = pendingCount * 6
  }

  const totalRiskScore = Math.min(100, Math.round(attendancePenalty + academicPenalty + assignmentPenalty))

  let riskTier = 'LOW'
  let riskColor = 'emerald'
  let summary = 'Student is in good academic standing with healthy attendance and performance.'

  if (totalRiskScore >= 70) {
    riskTier = 'CRITICAL'
    riskColor = 'rose'
    summary = 'Immediate mentor and HOD intervention recommended. High probability of exam eligibility loss.'
  } else if (totalRiskScore >= 45) {
    riskTier = 'HIGH'
    riskColor = 'amber'
    summary = 'Multiple risk indicators flagged in attendance and coursework completion. Corrective action needed.'
  } else if (totalRiskScore >= 20) {
    riskTier = 'MODERATE'
    riskColor = 'blue'
    summary = 'Minor flags detected in specific subjects, but overall academic trajectory is recoverable.'
  }

  return {
    score: totalRiskScore,
    tier: riskTier,
    color: riskColor,
    summary,
    breakdown: {
      attendanceRisk: Math.min(40, attendancePenalty),
      academicRisk: Math.min(30, academicPenalty),
      assignmentRisk: Math.min(20, assignmentPenalty),
      engagementRisk: 5,
    },
    riskFactors: riskFactors.length > 0 ? riskFactors : [
      {
        category: 'All Metrics On Track',
        severity: 'low',
        description: 'Attendance, internal marks, and assignment submissions are within optimal ranges.',
        action: 'Maintain consistent attendance and keep up active project work.'
      }
    ],
    roadmap: [
      { step: 1, title: 'Fix Subject Attendance Shortage in CS605', timeline: 'Next 7 Days', status: 'Priority' },
      { step: 2, title: 'Submit Supervised Learning AI Assignment', timeline: 'By Sep 05', status: 'Pending' },
      { step: 3, title: 'Attend Compiler Design Clinic / Mentorship', timeline: 'Sep 06 (Sat)', status: 'Recommended' },
      { step: 4, title: 'Review Mid-term 2 Preparation Plan with Mentor', timeline: 'Sep 10', status: 'Scheduled' }
    ]
  }
}
