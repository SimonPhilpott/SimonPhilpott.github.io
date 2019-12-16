async function keywordText(targetText, scope, RegExpression) {
    try {
        // ttps://cors-anywhere.herokuapp.com/https://simonphilpott.github.io/js/keywordMatchesPortfolio.json
        const result = await fetch('/js/keywordMatchesPortfolio.json', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        const data = await result.json();
        console.log(data)
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
                console.log(expression)
                    // 'm' multiline , 'g' global etc.
                let rx = new RegExp(expression, scope);
                let result = document.querySelector(targetText).innerHTML.match(rx);
                if (result) {
                        //resultArray.push(result.toString());
                    var constructedLink = `<a href="${url}" class="${link} generated" target="_blank">${entry}</a>`;
                    document.querySelector(targetText).innerHTML = document.querySelector(targetText).innerHTML.replace(rx, constructedLink);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}
keywordText('#targetKeymatch', 'gm', '(?![^<]*\<\/a\>)(?![^<]*\<\/h)')
