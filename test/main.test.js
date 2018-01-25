/* eslint-env jest */
import _ from 'lodash/fp'

import initTree from '../src/main'

it('should initialize correctly', () => {
  const keys = [['left', 'right'], ['bottom', 'top']]

  const items = [
    { id: 0, bottom: 2, top: 4, left: 2, right: 4, height: 2, width: 2 },
    { id: 1, bottom: 5, top: 6, left: 5, right: 6, height: 1, width: 1 },
    { id: 2, bottom: 1, top: 2, left: 1, right: 2, height: 1, width: 1 },
    { id: 3, bottom: 0, top: 10, left: 0, right: 1, height: 10, width: 1 },
    { id: 8, bottom: 0, top: 1, left: 1, right: 10, height: 1, width: 9 }
  ]

  const partial = initTree(keys)
  expect(partial).toBeInstanceOf(Function)

  const { searchTrees, getGroups } = partial(items)

  expect(searchTrees).toBeDefined()
  expect(searchTrees).toBeInstanceOf(Function)
  expect(searchTrees).toHaveProperty('trees')
  expect(searchTrees).toHaveProperty('items', items)
  expect(searchTrees).toHaveProperty('keys', keys)

  expect(getGroups).toBeDefined()
  expect(getGroups).toBeInstanceOf(Function)
})

it('should search ranges in trees', () => {
  const keys = [['left', 'right'], ['bottom', 'top']]

  const items = [
    { id: 0, bottom: 2, top: 4, left: 2, right: 4, height: 2, width: 2 },
    { id: 1, bottom: 0, top: 10, left: 0, right: 1, height: 10, width: 1 },
    { id: 2, bottom: 1, top: 2, left: 1, right: 2, height: 1, width: 1 },
    { id: 3, bottom: 5, top: 6, left: 5, right: 6, height: 1, width: 1 }
  ]

  const { searchTrees } = initTree(keys, items)
  const result = searchTrees(_.intersection, [0, 2, 0, 2])

  expect(result).toBeInstanceOf(Array)
  expect(result.length).toBe(3)

  expect(result).toContain(items[0])
  expect(result).toContain(items[1])
  expect(result).toContain(items[2])
  expect(result).not.toContain(items[3])
})

it('should group clusters of items', () => {
  const keys = [['left', 'right'], ['bottom', 'top']]

  const items1 = [
    { id: 0, bottom: 2, top: 4, left: 2, right: 4, height: 2, width: 2 },
    { id: 1, bottom: 5, top: 6, left: 5, right: 6, height: 1, width: 1 },
    { id: 2, bottom: 1, top: 2, left: 1, right: 2, height: 1, width: 1 },
    { id: 3, bottom: 0, top: 10, left: 0, right: 1, height: 10, width: 1 },
    { id: 8, bottom: 0, top: 1, left: 1, right: 10, height: 1, width: 9 }
  ]

  const items2 = [
    { id: 4, bottom: 8, top: 9, left: 8, right: 9, height: 1, width: 1 },
    { id: 5, bottom: 8, top: 9, left: 9, right: 10, height: 1, width: 1 },
    { id: 6, bottom: 9, top: 10, left: 8, right: 9, height: 1, width: 1 },
    { id: 7, bottom: 9, top: 10, left: 9, right: 10, height: 1, width: 1 }
  ]

  const { getGroups } = initTree(keys, [...items1, ...items2])
  const result = getGroups()

  expect(result).toBeInstanceOf(Array)
  expect(result).toEqual([items1, items2])
})
