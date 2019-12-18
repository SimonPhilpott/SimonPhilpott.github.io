    
async function keywordText(targetText, scope, RegExpression) {
        try {
            const result = await fetch('/js/keywordMatchesPortfolio.json', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const data = await result.json();
            let title, terms, url, link, match, allTerms;
            for (let i = 0; i < data.length; i++) {
                let linkMatch = data[i];
                title = linkMatch.title;
                terms = linkMatch.terms;
                url = linkMatch.url;
                link = linkMatch.link;
                allTerms = title + ", " + terms;
                // Remove any false, nul or "" terms
                matchList = allTerms.split(", ").filter(Boolean);
                matchList.forEach(function(entry) {
                    // If the title or tag match (Exactly), but aren't already anchor links/buttons or headings. Can be expanded via Regexp
                    let expression = entry + RegExpression;
                        // 'm' multiline , 'g' global etc.
                    let rx = new RegExp(expression, scope);
                    let result = document.querySelector(targetText).innerHTML.match(rx);
                    if (result) {
                        var constructedLink = `<a href="${url}" class="${link} generated" target="_blank">${entry}</a>`;
                        document.querySelector(targetText).innerHTML = document.querySelector(targetText).innerHTML.replace(rx, constructedLink);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    //keywordText('#targetKeymatch', 'g', '(?![^<]*>|[^<>]*<\/)')
    /*function removeShortestMatch(arr, matchString) {
        const shortestInArr = arr.reduce(
            (acc, cur, index) => {
                if (RegExp(matchString).test(cur)) {
                    if (!cur.length || cur.length < acc.elem.length) {
                        acc.elem = cur;
                    }
                    acc.index = index;
                }
                return acc;
            }, {
                elem: "",
                index: -1
            }
        );

        arr.splice(shortestInArr.index, 1);
    }*/

    /* A better solution would be a proper HTML parse, like this 
    function findMatches(target, para, element = para) {
    let child = element.firstChild;
    while (child) {
        if (child.nodeType === 3 && child.nodeValue.includes(target)) {
            const a = child.parentNode.closest("a");
            if (!a || !para.contains(a)) {
                console.log(`Found in '${child.nodeValue}'`);
            }
        }
        child = child.nextSibling;
    }
}

findMatches("example", document.getElementById("theParagraph"));*/
