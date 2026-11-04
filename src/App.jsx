import { Routes, Route, NavLink } from 'react-router-dom'
import BacklogPage from './pages/BacklogPage.jsx'
import DependencyPage from './pages/DependencyPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'

export default function App() {
  return (
    <>
      <nav>
        <NavLink to="/">Product Backlog</NavLink>
        <NavLink to="/dependencies">Dependency Board</NavLink>
        <NavLink to="/progress">Progress & Burndown</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<BacklogPage />} />
          <Route path="/dependencies" element={<DependencyPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </>
  )
}
