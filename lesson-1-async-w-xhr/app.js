(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // making a new AJAX object, and setting variables
        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function(err) {
            requestError(err, 'image');
        }

        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID 462d22cae6dd1d4877bb082c9e9c6502893a9bb7305d4bf8f681d13b56d4abc3');
        imgRequest.send();

        // making a new AJAX object, and setting variables
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };

        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`);
        articleRequest.send();

    });

    function addImage() {
        let htmlContent = '';

        // the this.responseText is the imgRequest AJAX object
        let data = JSON.parse(this.responseText);
        
        if ( data && data.results && data.results[0] ) {
            let firstImage = data.results[0];

            htmlContent = `
            <figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}" >
                <figcaption> ${searchedForText} by ${firstImage.user.name} </figcaption>
            </figure>
            `
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        // insert into HTML page
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);

    } // addImage()

    function addArticles() {
        let htmlContent ='';

        // this XML object
        const data = JSON.parse(this.responseText);

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

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);

    }

})();
