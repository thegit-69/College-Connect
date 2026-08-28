import { INITIAL_AI_RECOMMENDATIONS } from './campusData'

export const fetchAiRecommendations = async (studentProfile, events = []) => {
  if (events && events.length > 0) {
    const studentInterests = studentProfile?.interests || ['AI/ML', 'Web Dev', 'Cloud']
    const studentSkills = studentProfile?.skills || ['Python', 'React']

    const dynamicRecs = events.map((ev) => {
      let score = 70
      const evTags = ev.tags || [ev.eventType || 'Technical']

      const hasInterestMatch = evTags.some((t) =>
        studentInterests.some((i) => i.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(i.toLowerCase()))
      )
      if (hasInterestMatch) score += 20

      const hasSkillMatch = studentSkills.some((s) =>
        (ev.title + ' ' + (ev.description || '')).toLowerCase().includes(s.toLowerCase())
      )
      if (hasSkillMatch) score += 9

      return {
        id: `REC-${ev.id}`,
        title: ev.title,
        type: ev.eventType || 'Event',
        matchScore: Math.min(99, score),
        matchReason: hasInterestMatch
          ? `High match with your preferred domains (${evTags.join(', ')}) and CSE major.`
          : 'Popular event among your peers and department.',
        date: ev.eventDate || 'Upcoming',
        mode: ev.eventMode || 'OFFLINE',
        tags: evTags,
        actionUrl: `/events/${ev.id}`,
        urgency: ev.seatsLeft ? `Only ${ev.seatsLeft} seats left!` : 'Open for registration'
      }
    })

    return [...dynamicRecs.sort((a, b) => b.matchScore - a.matchScore), ...INITIAL_AI_RECOMMENDATIONS]
  }

  return INITIAL_AI_RECOMMENDATIONS
}
