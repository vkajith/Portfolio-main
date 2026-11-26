// Window-event bridge so any component can summon Pompu without importing it.
export type PompuOpenDetail = { book?: boolean; prompt?: string }

export const openPompu = (detail: PompuOpenDetail = {}) =>
  window.dispatchEvent(new CustomEvent<PompuOpenDetail>('pompu:open', { detail }))
