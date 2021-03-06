/* eslint-env jest */
import _ from 'lodash/fp'

import { kdIntervalTree, getGroupsFromKD } from '../src/main'

describe('kdIntervalTree', () => {
  it('should initialize correctly', () => {
    const keys = [['left', 'right'], ['bottom', 'top']]

    const items = [
      {
        id: 0,
        bottom: 2,
        top: 4,
        left: 2,
        right: 4,
        height: 2,
        width: 2,
      },
      {
        id: 1,
        bottom: 5,
        top: 6,
        left: 5,
        right: 6,
        height: 1,
        width: 1,
      },
      {
        id: 2,
        bottom: 1,
        top: 2,
        left: 1,
        right: 2,
        height: 1,
        width: 1,
      },
      {
        id: 3,
        bottom: 0,
        top: 10,
        left: 0,
        right: 1,
        height: 10,
        width: 1,
      },
      {
        id: 8,
        bottom: 0,
        top: 1,
        left: 1,
        right: 10,
        height: 1,
        width: 9,
      },
    ]

    const partial = kdIntervalTree(keys)
    expect(partial).toBeInstanceOf(Function)

    const searchTrees = partial(items)

    expect(searchTrees).toBeDefined()
    expect(searchTrees).toBeInstanceOf(Function)
    expect(searchTrees).toHaveProperty('trees')
    expect(searchTrees).toHaveProperty('items', items)
    expect(searchTrees).toHaveProperty('keys', keys)
  })

  it('should search ranges in trees', () => {
    const keys = [['left', 'right'], ['bottom', 'top']]

    const items = [
      {
        id: 0,
        bottom: 2,
        top: 4,
        left: 2,
        right: 4,
        height: 2,
        width: 2,
      },
      {
        id: 1,
        bottom: 0,
        top: 10,
        left: 0,
        right: 1,
        height: 10,
        width: 1,
      },
      {
        id: 2,
        bottom: 1,
        top: 2,
        left: 1,
        right: 2,
        height: 1,
        width: 1,
      },
      {
        id: 3,
        bottom: 5,
        top: 6,
        left: 5,
        right: 6,
        height: 1,
        width: 1,
      },
    ]

    const searchTrees = kdIntervalTree(keys, items)
    const result = searchTrees(_.intersection, [[0, 2], [0, 2]])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(3)

    expect(result).toContain(items[0])
    expect(result).toContain(items[1])
    expect(result).toContain(items[2])
    expect(result).not.toContain(items[3])
  })

  it('should group clusters of items', () => {
    const keys = [['left', 'right'], ['bottom', 'top']]

    const group1 = [
      { id: 0, bottom: 2, top: 4, left: 2, right: 4 },
      { id: 1, bottom: 5, top: 6, left: 5, right: 6 },
      { id: 2, bottom: 1, top: 2, left: 1, right: 2 },
      { id: 3, bottom: 0, top: 10, left: 0, right: 1 },
      { id: 8, bottom: 0, top: 1, left: 1, right: 10 },
    ]

    const group2 = [
      { id: 4, bottom: 8, top: 9, left: 8, right: 9 },
      { id: 5, bottom: 8, top: 9, left: 9, right: 10 },
      { id: 6, bottom: 9, top: 10, left: 8, right: 9 },
      { id: 7, bottom: 9, top: 10, left: 9, right: 10 },
    ]

    const searchTree = kdIntervalTree(keys, [
      ...group1,
      ...group2,
    ])

    const result = getGroupsFromKD(searchTree)

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[0]).toBeInstanceOf(Array)
    expect(result[1]).toBeInstanceOf(Array)

    const [result1] = result.filter(({ length }) => length === 5)
    expect(result1).toContain(group1[0])
    expect(result1).toContain(group1[1])
    expect(result1).toContain(group1[2])
    expect(result1).toContain(group1[3])
    expect(result1).toContain(group1[4])

    const [result2] = result.filter(({ length }) => length === 4)
    expect(result2).toContain(group2[0])
    expect(result2).toContain(group2[1])
    expect(result2).toContain(group2[2])
    expect(result2).toContain(group2[3])
  })
})
