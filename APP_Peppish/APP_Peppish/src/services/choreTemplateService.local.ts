const STORAGE_KEY = 'peppish_chore_templates'

const read = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

const write = (items: any[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

export const choreTemplateServiceLocal = {
  createTemplate: async (payload: any) => {
    const items = read()
    const id = `tmpl-${Date.now()}`
    const tpl = { id, ...payload }
    write([tpl, ...items])
    return tpl
  },
  getTemplates: async () => read(),
  getTemplateById: async (id: string) => read().find((t: any) => t.id === id) ?? null,
  updateTemplate: async (id: string, payload: Partial<any>) => {
    const items = read()
    const updated = items.map((t: any) => (t.id === id ? { ...t, ...payload } : t))
    write(updated)
    return updated.find((t: any) => t.id === id)
  },
}
