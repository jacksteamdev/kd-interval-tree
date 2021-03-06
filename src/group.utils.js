import at from 'lodash/fp/at'
import chunk from 'lodash/fp/chunk'
import compose from 'lodash/fp/compose'
import curry from 'lodash/fp/curry'
import difference from 'lodash/fp/difference'
import flatten from 'lodash/fp/flatten'
import map from 'lodash/fp/map'
import uniqWith from 'lodash/fp/uniqWith'

/**
 * Get range array representing object dimensions
 * @param {string[][]} rangeKeys - Array with arrays of key name pairs
 * @param {object} item - Object with properties named in keys array
 * @returns {number[][]} - Array of Number[min, max] representing ranges
 */
export const getRanges = curry((rangeKeys, item) => {
  const flatKeys = flatten(rangeKeys)
  const getMinMax = a => [Math.min(...a), Math.max(...a)]

  const getRange = compose(
    map(getMinMax),
    chunk(2),
    at(flatKeys),
  )

  return getRange(item)
})

/**
 * Expand ranges in array by a single amount
 * @param {function} fn - Comparator function to choose amount for expansion
 * @param {number[][]} ranges - Array of Number[min, max] representing ranges
 * @returns {number[][]} - Ranges expanded by value from fn
 */
export const expandRanges = curry((fn, ranges) => {
  const diff = ([a, b]) => Math.abs(a - b)
  const amount = fn(...ranges.map(diff))
  const expand = ([min, max]) => [min - amount, max + amount]

  return ranges.map(expand)
})

/**
 * If fn1(a, b) returns an array with length > 0,
 * return result of fn2(a, b), else return a
 *
 * callIfLength will be used in a reducer
 * The reducer will be the first array
 * Each array in the parent array will be
 * compared with the reducer but
 * the reducer will be unified with the array
 * if fn1 :: result.length > 0
 *
 * @param {function} fn1 - Set operation function
 * @param {function} fn2 - Set operation function
 * @param {Array} a
 * @param {Array} b
 * @returns {Array} - Result of operator2(a, b) or a
 */
export const callIfLength = curry((fn1, fn2, a, b) => {
  if (fn1(a, b).length > 0) {
    return fn2(a, b)
  } else {
    return a
  }
})

/**
 * Returns true if arrays have same elements
 * @param {array} x
 * @param {array} y
 */
export const hasSameItems = (x, y) => {
  const arrayDiff = difference(x, y)
  const isDifferent = arrayDiff.length > 0
  return !isDifferent
}

/**
 * array of arrays, multiple equivalent sets ->
 * remove equivalent array, regardless of order ->
 * array of arrays, one of each set
 * @param {Array[]} sets - An array of arrays
 */
export const uniqueSets = sets => {
  return uniqWith(hasSameItems, sets)
}
