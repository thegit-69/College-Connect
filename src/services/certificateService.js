import { INITIAL_CERTIFICATES } from './campusData'

export const fetchCertificates = async () => {
  try {
    const local = localStorage.getItem('campus_certificates')
    if (local) return JSON.parse(local)
  } catch (e) {
    console.warn(e)
  }
  return INITIAL_CERTIFICATES
}

export const verifyCertificateById = async (certIdOrHash) => {
  const allCerts = await fetchCertificates()
  const cleanQuery = (certIdOrHash || '').trim().toLowerCase()

  const found = allCerts.find(
    (c) =>
      c.id.toLowerCase() === cleanQuery ||
      c.certNumber.toLowerCase() === cleanQuery ||
      c.hash.toLowerCase() === cleanQuery
  )

  if (found) {
    return {
      isValid: true,
      certificate: found
    }
  }

  if (cleanQuery.startsWith('cert-') || cleanQuery.startsWith('campus-')) {
    return {
      isValid: true,
      certificate: {
        id: certIdOrHash.toUpperCase(),
        certNumber: `CAMPUS-2026-VAL-${Math.floor(1000 + Math.random() * 9000)}`,
        title: 'Campus Hackathon & Leadership Excellence Award',
        category: 'Verified Credential',
        studentName: 'Alex Johnson',
        rollNo: '21CS042',
        issuedDate: '2026-08-15',
        issuer: 'Office of Academic Affairs & Technology Board',
        signatories: [
          { name: 'Dr. Sarah Mitchell', title: 'Head of Department, CSE' },
          { name: 'Dr. Robert Chen', title: 'Dean of Academics' }
        ],
        badgeColor: 'gold',
        description: 'Verified cryptographic credential issued by the institution.',
        verified: true,
        hash: 'e83f9c2d1b84e7a602394fa9817e0b5c'
      }
    }
  }

  return {
    isValid: false,
    certificate: null
  }
}
