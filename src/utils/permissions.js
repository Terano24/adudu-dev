export const ROLES = {
  ADMIN_PO: 'Admin/PO',
  TEAM_MEMBER: 'Anggota Tim',
  ALUMNI_REVIEWER: 'Alumni Reviewer',
}

/**
 * Centralized RBAC permission evaluator
 * Enforces PBI-001 acceptance criteria:
 * - Admin/PO: Full access
 * - Anggota Tim: Can create, edit, move, delete card
 * - Alumni Reviewer: Cannot create, move, or delete card; can view, review, and comment
 */
export function checkPermission(role, action, resource) {
  if (!role) return false

  if (role === ROLES.ADMIN_PO) {
    return true
  }

  if (role === ROLES.TEAM_MEMBER) {
    // PBI-008/009: review & persetujuan hanya untuk PO dan Alumni/Mitra
    if (['review', 'approve'].includes(action)) return false
    // PBI-010: hanya PO yang dapat mengubah isi checklist DoD
    if (resource === 'dod' && action === 'manage') return false
    if (resource === 'card') {
      if (['create', 'edit', 'move', 'delete'].includes(action)) return true
    }
    if (resource === 'backlog') {
      return action === 'view'
    }
    return true
  }

  if (role === ROLES.ALUMNI_REVIEWER) {
    if (resource === 'card') {
      if (['create', 'delete', 'move'].includes(action)) return false
      // Alumni Reviewer bertindak sebagai mitra: dapat menyetujui/meminta revisi (PBI-009)
      if (['view', 'review', 'comment', 'approve'].includes(action)) return true
    }
    if (resource === 'review' || resource === 'comment') {
      return true
    }
    if (resource === 'backlog' && action === 'manage') {
      return false
    }
    return action === 'view'
  }

  return false
}
