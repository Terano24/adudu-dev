import { useEffect, useState } from 'react'
import { getBacklog } from '../../services/backlogService.js'

export default function BacklogList() {
  const [items, setItems] = useState([])
  useEffect(() => { getBacklog().then(setItems) }, [])

  return (
    <table>
      <thead>
        <tr><th>ID</th><th>Epic</th><th>User Story</th><th>Prioritas</th><th>Poin</th><th>Sprint</th><th>Status</th><th>Dependensi</th></tr>
      </thead>
      <tbody>
        {items.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td><td>{i.epic}</td><td>{i.title}</td><td>{i.priority}</td>
            <td>{i.points}</td><td>{i.sprint}</td><td>{i.status}</td><td>{i.dependsOn.join(', ') || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
