(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');    
    const responseContainer = document.querySelector('#response-container');
    let searchedForText;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // make a new AJACK object
        const imageRequest = new XMLHttpRequest();
        imageRequest.onload = addPics; // set up a function to run
        imageRequest.onerror = function(err) {
            requestError(err, 'image err');
        }

        // sending out the request
        imageRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imageRequest.setRequestHeader('Authorization', 'Client-ID 462d22cae6dd1d4877bb082c9e9c6502893a9bb7305d4bf8f681d13b56d4abc3');
        imageRequest.send();
        

        // make a new AJACK object
        const articleRequests = new XMLHttpRequest();
        articleRequests.onload = addArticles; // set up a function to run
        articleRequests.onerror = function(err) {
            requestError(err, 'article err');
        }

        // set up and send out request
        articleRequests.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`);
        articleRequests.send();

    });


    // add a picture to #response-container
    /* The read-only XMLHttpRequest property responseText returns 
        the text received from a server following a request being sent. */
    function addPics(asdf) {
        let asdf1 = (this.responseText); // 'this XHM object', responseText is a 'property' of an object, that's why you see the 'dot' there
        let data = JSON.parse(asdf1); // converting text to object

        if ( data && data.results && data.results[0] ) {
            let firstImage = data.results[1]
            
            htmlContent = 
            `
            <figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}" >
                <figcaption> ${searchedForText} by ${firstImage.user.name} </figcaption>
            </figure>
            `
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        // insert into the HTML
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        

    }

    // add articles to #response-container
    function addArticles() {

        let htmlContent ='';
        const data = JSON.parse(this.responseText); // 'this XML object'

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            
            htmlContent = `<ul>` + data.response.docs.map(function(asdf) {
                return `
                <li class="article">
                <h2> <a href="${asdf.web_url}"> ${asdf.headline.main} </a> </h2>
                <p> ${asdf.snippet} </p>
                </li>
                `
            }).join('') + `</ul>`

        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }

        // insert into the DOM
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);

    }

})();
