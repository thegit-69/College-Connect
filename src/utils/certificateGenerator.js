/**
 * High-Resolution Certificate Generator & Exporter
 * Generates an official, print-ready university certificate with seals and signatures
 */

export const generateAndDownloadCertificate = async (cert, studentProfile) => {
  const canvas = document.createElement('canvas')
  const width = 1600
  const height = 1130
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Background Parchment / Cream Texture
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // Outer Ornate Border
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 14
  ctx.strokeRect(30, 30, width - 60, height - 60)

  // Inner Gold Accent Border
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 3
  ctx.strokeRect(46, 46, width - 92, height - 92)

  // Corner Ornaments
  const cornerSize = 40
  ctx.fillStyle = '#d97706'
  ctx.fillRect(46, 46, cornerSize, 4)
  ctx.fillRect(46, 46, 4, cornerSize)
  ctx.fillRect(width - 46 - cornerSize, 46, cornerSize, 4)
  ctx.fillRect(width - 50, 46, 4, cornerSize)
  ctx.fillRect(46, height - 50, cornerSize, 4)
  ctx.fillRect(46, height - 46 - cornerSize, 4, cornerSize)
  ctx.fillRect(width - 46 - cornerSize, height - 50, cornerSize, 4)
  ctx.fillRect(width - 50, height - 46 - cornerSize, 4, cornerSize)

  // University Header
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 26px serif'
  ctx.textAlign = 'center'
  ctx.fillText('CAMPUS CONNECT UNIVERSITY OF TECHNOLOGY', width / 2, 130)

  ctx.fillStyle = '#64748b'
  ctx.font = '14px sans-serif'
  ctx.fillText('DEPARTMENT OF ACADEMIC AFFAIRS & STUDENT LIFE', width / 2, 160)

  // Divider Line with Star
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 220, 185)
  ctx.lineTo(width / 2 + 220, 185)
  ctx.stroke()

  ctx.fillStyle = '#d97706'
  ctx.font = '18px sans-serif'
  ctx.fillText('★  ★  ★', width / 2, 190)

  // Main Certificate Title
  ctx.fillStyle = '#09090b'
  ctx.font = '900 48px serif'
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 260)

  ctx.fillStyle = '#64748b'
  ctx.font = 'italic 20px serif'
  ctx.fillText('This is proudly presented to', width / 2, 315)

  // Student Name
  const recipientName = studentProfile?.name || cert.studentName || 'Alex Johnson'
  ctx.fillStyle = '#1e3a8a'
  ctx.font = 'bold 44px serif'
  ctx.fillText(recipientName.toUpperCase(), width / 2, 385)

  // Student Roll & Department
  const recipientRoll = studentProfile?.rollNo || cert.rollNo || '21CS042'
  const recipientDept = studentProfile?.department || 'Computer Science & Engineering'
  ctx.fillStyle = '#475569'
  ctx.font = '600 16px sans-serif'
  ctx.fillText(`Roll No: ${recipientRoll}  •  ${recipientDept}`, width / 2, 425)

  // Achievement Description
  ctx.fillStyle = '#334155'
  ctx.font = '18px serif'
  ctx.fillText('for exceptional performance and meritorious achievement in', width / 2, 490)

  // Certificate Event Title
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText(cert.title, width / 2, 550)

  // Detailed Description wrapped
  ctx.fillStyle = '#64748b'
  ctx.font = '16px sans-serif'
  const desc = cert.description || 'Awarded in recognition of outstanding scholastic excellence and technical merit.'
  ctx.fillText(desc, width / 2, 605)

  // Category & Issuer
  ctx.fillStyle = '#475569'
  ctx.font = '14px sans-serif'
  ctx.fillText(`Category: ${cert.category}  |  Organized by: ${cert.issuer}`, width / 2, 645)

  // Golden Official Seal on LHS
  const sealX = width / 2 - 340
  const sealY = 820
  ctx.beginPath()
  ctx.arc(sealX, sealY, 55, 0, Math.PI * 2)
  ctx.fillStyle = '#fef3c7'
  ctx.fill()
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#b45309'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText('OFFICIAL', sealX, sealY - 14)
  ctx.fillText('CAMPUS', sealX, sealY + 2)
  ctx.fillText('SEAL', sealX, sealY + 18)

  // Signatories on RHS and LHS
  const sig1 = cert.signatories?.[0] || { name: 'Dr. Sarah Mitchell', title: 'Head of Department' }
  const sig2 = cert.signatories?.[1] || { name: 'Prof. Kevin Vance', title: 'Dean of Student Affairs' }

  // Signatory 1
  const sig1X = width / 2 - 100
  const sigY = 840
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sig1X - 110, sigY - 20)
  ctx.lineTo(sig1X + 110, sigY - 20)
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px serif'
  ctx.fillText(sig1.name, sig1X, sigY)
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText(sig1.title, sig1X, sigY + 20)

  // Signatory 2
  const sig2X = width / 2 + 230
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(sig2X - 110, sigY - 20)
  ctx.lineTo(sig2X + 110, sigY - 20)
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px serif'
  ctx.fillText(sig2.name, sig2X, sigY)
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText(sig2.title, sig2X, sigY + 20)

  // Footer Certificate Info & Issue Date
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(100, 940)
  ctx.lineTo(width - 100, 940)
  ctx.stroke()

  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Certificate No: ${cert.certNumber || 'CAMPUS-2026-CERT'}`, 100, 980)
  ctx.fillText(`Issue Date: ${cert.issuedDate || new Date().toISOString().split('T')[0]}`, 100, 1005)

  ctx.textAlign = 'right'
  ctx.fillText('Campus Connect Digital Academic Registry', width - 100, 980)
  ctx.fillText('Verified University Credential', width - 100, 1005)

  // Convert to downloadable image file
  const dataUrl = canvas.toDataURL('image/png', 1.0)
  const link = document.createElement('a')
  const fileName = `${(cert.certNumber || 'Certificate').replace(/\s+/g, '_')}_${recipientName.replace(/\s+/g, '_')}.png`
  link.download = fileName
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
