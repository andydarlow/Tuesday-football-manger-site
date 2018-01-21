import {replaceAll, firstOrDefault} from '@/utils/ListUtils.js'

describe('tests for replaceAll', () => {

  it('mid point replaceAll', () => {
    let testCase = ['a', 'b', 'c', 'd']
    let result = replaceAll(testCase, 'f', c => c === 'c')
    expect(result).toEqual(['a', 'b', 'f', 'd'])
  })

  it('empty List', () => {
    let testCase = []
    let result = replaceAll(testCase, 'j', c => c === 'c')
    expect(result).toEqual([])
  })

  it('single element list', () => {
    let testCase = ['a']
    let result = replaceAll(testCase, 'b', c => c === 'a')
    expect(result).toEqual(['b'])
  })

  it('predicate no match', () => {
    let testCase = [9, 8, 7, 6]
    let result = replaceAll(testCase, 9, c => c < 2)
    expect(result).toEqual([9, 8, 7, 6])
  })

  it('single element list no match', () => {
    let testCase = ['a']
    let result = replaceAll(testCase, 'b', c => c === 'b')
    expect(result).toEqual(['a'])
  })

  it('multi match in list', () => {
    let testCase = ['a', 'b', 'c', 'b']
    let result = replaceAll(testCase, 'f', c => c === 'b')
    expect(result).toEqual(['a', 'f', 'c', 'f'])
  })

  it('all matches', () => {
    let testCase = [1, 99, 111, 1]
    let result = replaceAll(testCase, 2, c => true)
    expect(result).toEqual([2, 2, 2, 2])
  })
})

describe('test for firstOrDefault', () => {
  it('returns default on EmptyList', () => {
    let testCase = []
    let result = firstOrDefault(testCase, 2)
    expect(result).toEqual(2)
  })

  it('returns default on List', () => {
    let testCase = [1, 2]
    let result = firstOrDefault(testCase, 2)
    expect(result).toEqual(1)
  })

})
