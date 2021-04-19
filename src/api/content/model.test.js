import { Content } from '.'

let content

beforeEach(async () => {
  content = await Content.create({ name: 'test', type: 'vod', src: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = content.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(content.id)
    expect(view.name).toBe(content.name)
    expect(view.type).toBe(content.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = content.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(content.id)
    expect(view.name).toBe(content.name)
    expect(view.type).toBe(content.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
