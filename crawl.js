const {JSDOM} = require('jsdom')

async function crawlPage(baseURL ,currentURL, pages){
    
    const baseURLOBJ = new  URL (baseURL)
    const currentURLOBJ = new  URL (currentURL)

    if (baseURLOBJ.hostname !== currentURLOBJ.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeUrl(currentURL)
    
    if (pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`activity crawling at ${currentURL}`)

    try{
        const resp = await fetch(currentURL)

        if (resp.status >399){
            console.log(`error in fetch with statun code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")){
            console.log(`\nnon html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }
        
        const htmlBody = await resp.text()
        
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        
        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL , pages)
        }
    }

    catch(err){
        console.log(`error in fetch: ${err.message} on page: ${currentURL} ` )
    }
    return pages
}
function getURLsFromHTML(htmlBody, baseURL){

    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    
    for (const linkElement of linkElements){
        if (linkElement.href.slice(0,1) === '/'){
            // Relative url
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            }
            catch(err){
                console.log(`error with relatice url: ${err.message} at  ${linkElement.href}` )
            }
            
        }
        else{
            // Absolute Urls
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            }
            catch(err){
                console.log(`error with relatice url: ${err.message} at ${linkElement.href}` )
            }
        }
    }
    return urls
}


function normalizeUrl(urlString){
    const urlObj = new URL(urlString)
    
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) == "/")
    {
        return hostPath.slice(0,-1)
    }
    return hostPath
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
}