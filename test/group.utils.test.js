/* eslint-env jest */
import _ from 'lodash/fp'
import { getRange, expandRanges, operateIfAny } from '../src/group.utils'

it('should get range values from item', () => {
  const partial = getRange([['left', 'right'], ['bottom', 'top']])
  expect(partial).toBeInstanceOf(Function)

  const result = partial({ left: 7, right: 10, bottom: 8, top: 9 })
  expect(result).toEqual([[7, 10], [8, 9]])
})

it('should expand ranges by smallest range size', () => {
  const partial = expandRanges(Math.min)
  expect(partial).toBeInstanceOf(Function)

  const result1 = partial([[5, 6], [4, 8]])
  expect(result1).toEqual([[4, 7], [3, 9]])

  const result2 = partial([[5, 6], [4, 8]])
  expect(result2).toEqual([[4, 7], [3, 9]])
})

it('should return the union of items1 and items2', () => {
  const partial1 = operateIfAny(_.intersection)
  expect(partial1).toBeInstanceOf(Function)

  const partial2 = partial1(_.union)
  expect(partial2).toBeInstanceOf(Function)

  const result = partial2([1, 2], [2, 3])
  expect(result).toContain(1)
  expect(result).toContain(2)
  expect(result).toContain(3)
  expect(result.length).toBe(3)
})

it('should return items1', () => {
  const partial1 = operateIfAny(_.intersection)
  expect(partial1).toBeInstanceOf(Function)

  const partial2 = partial1(_.union)
  expect(partial2).toBeInstanceOf(Function)

  const result = partial2([1, 2], [3, 4])
  expect(result).toContain(1)
  expect(result).toContain(2)
  expect(result).not.toContain(3)
  expect(result).not.toContain(4)
  expect(result.length).toBe(2)
})
