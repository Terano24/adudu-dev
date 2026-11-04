import { useEffect, useState } from 'react'
import { getBacklog } from '../../services/backlogService.js'

export default function BacklogList() {
  const [items, setItems] = useState([])
  useEffect(() => { getBacklog().then(setItems) }, [])

  return (
    <table>
      <thead>
        <tr><th>ID</th><th>Tipe</th><th>Judul</th><th>Divisi</th><th>Status</th><th>Poin</th></tr>
      </thead>
      <tbody>
        {items.map(i => (
          <tr key={i.id}>
            <td>{i.id}</td><td>{i.type}</td><td>{i.title}</td>
            <td>{i.division}</td><td>{i.status}</td><td>{i.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
