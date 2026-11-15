import React, { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/index.js'
import { ROLES, checkPermission } from '../utils/index.js'

const AuthContext = createContext()

export { ROLES }

export const STATIC_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin',
    name: 'Admin Antasena (PO)',
    role: ROLES.ADMIN_PO,
    division: 'Management & Operations',
  },
  {
    username: 'anggota',
    password: 'anggota',
    name: 'Dian Permana (Developer)',
    role: ROLES.TEAM_MEMBER,
    division: 'Programming & Electrical',
  },
  {
    username: 'alumni',
    password: 'alumni',
    name: 'Ir. Ahmad Reza (Alumni)',
    role: ROLES.ALUMNI_REVIEWER,
    division: 'Alumni Reviewer',
  },
]

const DEFAULT_USERS = [
  { id: 'u1', username: 'admin', name: 'Admin Antasena (PO)', role: ROLES.ADMIN_PO, division: 'Management & Operations' },
  { id: 'u2', username: 'anggota', name: 'Dian Permana (Developer)', role: ROLES.TEAM_MEMBER, division: 'Programming & Electrical' },
  { id: 'u3', username: 'alumni', name: 'Ir. Ahmad Reza (Alumni)', role: ROLES.ALUMNI_REVIEWER, division: 'Alumni Reviewer' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('antasena_user', null)

  /**
   * Autentikasi Kredensial Standar (Username & Password)
   */
  const loginWithCredentials = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase()
    const cleanPass = (password || '').trim()

    const matched = STATIC_CREDENTIALS.find(
      c => c.username.toLowerCase() === cleanUser && c.password === cleanPass
    )

    if (!matched) {
      return {
        success: false,
        error: 'Username atau password salah. Periksa kredensial akun pengujian.',
      }
    }

    const activeUser = {
      id: 'u_' + matched.username,
      username: matched.username,
      name: matched.name,
      role: matched.role,
      division: matched.division,
      lastLogin: new Date().toISOString(),
    }

    setUser(activeUser)
    return {
      success: true,
      user: activeUser,
    }
  }

  const login = (roleOrUsername, passwordOrName = '') => {
    // Jika dipanggil dengan role langsung (backward compatibility)
    if (Object.values(ROLES).includes(roleOrUsername)) {
      const role = roleOrUsername
      const customName = passwordOrName
      const defaultUser = DEFAULT_USERS.find(u => u.role === role) || {
        id: 'u_' + Date.now(),
        username: customName ? customName.toLowerCase().replace(/\s+/g, '.') : 'user',
        name: customName || (role === ROLES.ADMIN_PO ? 'Admin Antasena' : role === ROLES.ALUMNI_REVIEWER ? 'Alumni Senior' : 'Anggota Tim'),
        role,
        division: role === ROLES.ADMIN_PO ? 'Management' : role === ROLES.ALUMNI_REVIEWER ? 'Alumni Reviewer' : 'Programming',
      }

      const activeUser = {
        ...defaultUser,
        name: customName || defaultUser.name,
        role,
        lastLogin: new Date().toISOString(),
      }

      setUser(activeUser)
      return { success: true, user: activeUser }
    }

    // Pemanggilan kredensial username & password
    return loginWithCredentials(roleOrUsername, passwordOrName)
  }

  const logout = () => {
    setUser(null)
  }

  /**
   * Evaluator Hak Akses Granular (RBAC) terpusat via checkPermission
   */
  const can = useCallback(
    (action, resource) => {
      return checkPermission(user?.role, action, resource)
    },
    [user?.role]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        loginWithCredentials,
        logout,
        can,
        availableRoles: Object.values(ROLES),
        defaultUsers: DEFAULT_USERS,
        staticCredentials: STATIC_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
