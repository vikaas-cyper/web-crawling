const { normalizeUrl, getURLsFromHTML } = require('./crawl.js')
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


test('getURLsFromHTML absoluteUrls', () =>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                Boot.dev.Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected) 
})


test('getURLsFromHTML relativeUrls', () =>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                Boot.dev.Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected) 
})


test('getURLsFromHTML both relative and absolute', () =>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path1/">
                Boot.dev.Blog Path one
            </a>
            <a href="https://blog.boot.dev/path2/">
                Boot.dev.Blog Path two
            </a>

        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected) 
})



test('getURLsFromHTML invalid url', () =>{
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
                Invalid URL
            </a>
            <a href="invalid">
                Invalid URL
            </a>
            <a href="invalid">
                Invalid URL
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected) 
})
