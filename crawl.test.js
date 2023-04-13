const { normalizeUrl } = require('./crawl.js')
const {test, expect} = require('@jest/globals') 


test('normalizeUrl strip protocal', () =>{
    const input = "https://boot.dev/"
    const actual = normalizeUrl(input)
    const expected = "boot.dev"
    expect(actual).toEqual(expected) 
})

test('normalizeUrl strip trailing slash ', () =>{
    const input = "https://boot.dev/path/"
    const actual = normalizeUrl(input)
    const expected = "boot.dev/path"
    expect(actual).toEqual(expected) 
})

test('normalizeUrl capitals ', () =>{
    const input = "https://BOOt.dev/path/"
    const actual = normalizeUrl(input)
    const expected = "boot.dev/path"
    expect(actual).toEqual(expected) 
})

test('normalizeUrl strip http', () =>{
    const input = "http://BOOt.dev/path/"
    const actual = normalizeUrl(input)
    const expected = "boot.dev/path"
    expect(actual).toEqual(expected) 
})
