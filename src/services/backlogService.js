import { SEED_BACKLOG } from '../data/seedData.js'

export async function getBacklog() {
  return SEED_BACKLOG.items
}

export async function getEpics() {
  return SEED_BACKLOG.epics
}
