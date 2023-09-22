// importing the ts and hash from the key Javascript file
import { ts, hash } from './key.js';

// storing the data in localstorage of browser and parsing
const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

// all the html containers are listed below
var searchBox = $('#searchbox');
var searchList = $('#search-list');
var modelBox = $('.modal');
var modelTitle = $('.modal-title');
var modelBody = $('.modal-description');
var modelClose = $('.modal-close');
var defaultModelBody = modelBody[0].innerHTML;
var searchButton = $('#search-button');


// function that will execute on every input letter on the searchbox
searchBox.on('input', searchTask);

// function that will execute when there is click trigerred on search button
searchButton.click(function(){
    var content = searchBox.val();

    // if there is no text in the input box then below message will pop up
    if (content === '') {
        setTimeout(function () {
            searchList.empty();
            alert("Please enter the character name to fetch !");
        }, 1000);
        return;
    }
    setTimeout(fetchCharacter(content), 1000);
});


function searchTask(event) {
    const inputValue = event.target.value;

    // if the input box is empty then it will empty the results list as well
    if (inputValue === '') {
        setTimeout(function () {
            searchList.empty();
        }, 1000);
        return;
    }
    setTimeout(fetchCharacter(inputValue), 1000);
}

//main funtion that will fetch the character details from the api
function fetchCharacter(inputValue) {
    // console.log(inputValue);
    fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputValue}&limit=9&ts=${ts}&apikey=c2fe8ba050bcef541c9007527c79d8eb&hash=${hash}`)
        .then(response => response.json()) // Extract JSON data from the response
        .then(data => {
            // Handle the JSON data
            // console.log(data.data.results);
            const results = data.data.results;
            searchList.empty();
            results.forEach(result => {
                var listItem = $(`<li></li>`);
                var img = $(`<img src=${result.thumbnail.path + '.' + result.thumbnail.extension} />`);
                var bold = $(`<b class="char-name">${result.name}</b>`);
                var span = $(`<span>${result.id}</span>`);
                if (favourites.includes(parseInt(result.id))) {
                    var bool = true;
                } else {
                    var bool = false;
                }
                var button = $(`<button type="button" class="btn btn-danger favourite-button" data-bs-toggle="button" aria-pressed="${bool}">
                    <i class="fa-regular fa-heart"></i>
                </button>`);
                listItem.append(img); // Using .append() to add img to listItem
                listItem.append(bold);
                listItem.append(span);
                if (bool) {
                    button.css({
                        'background-color': 'red' // background color
                    });
                } else {
                    button.css({
                        'background-color': 'transparent' // background color
                    });
                }
                listItem.append(button);
                searchList.append(listItem); // Appending listItem to searchList
                // console.log(result.description);
            });

            //variables used for the functioning of the favorites button
            var favouriteButton = $('.favourite-button');
            favouriteButton.click(checkFavourite);
            var charName = $('.char-name');
            charName.click(charDeatils);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch request
            console.error('Fetch error:', error);
        });
}

// function to check does the current character is in favorite list or not
function checkFavourite() {
    var listItem = $(this).closest("li");
    // Find the <b> element within the closest <li> element
    var bElement = listItem.find("span");
    // Get the inner text of the <b> element
    var innerText = bElement.text();
    if (favourites.includes(parseInt(innerText))) {
        // console.log("hi");
        var indexToRemove = favourites.indexOf(parseInt(innerText));
        // console.log(indexToRemove);
        if (indexToRemove !== -1) {
            favourites.splice(indexToRemove, 1);
        }
        $(this).attr('aria-pressed', 'false');
        $(this).css({
            'background-color': 'transparent'
        });
    } else {
        favourites.push(parseInt(innerText));
        $(this).attr('aria-pressed', 'true');
        $(this).css({
            'background-color': 'red'
        });
    }
    // Store data in localStorage
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

//funtion for the fetching of the character details in the modal
function charDeatils() {
    var listItem = $(this).closest("li");
    var fetchedName = listItem.find("b");
    var fetchedID = listItem.find("span");
    var currentName = fetchedName[0].textContent;
    var currentID = fetchedID[0].textContent
    // console.log(currentID);
    modelTitle[0].textContent = currentName;
    fetch(`https://gateway.marvel.com:443/v1/public/characters/${currentID}?ts=${ts}&apikey=c2fe8ba050bcef541c9007527c79d8eb&hash=${hash}`)
        .then(response => response.json()) // Extract JSON data from the response
        .then(data => {
            var result = data.data.results[0].description;
            if(result != ''){
                modelBody[0].innerHTML = result;
            }else{
                modelBody[0].innerHTML = defaultModelBody;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch request
            console.error('Fetch error:', error);
    });
    $("#myModal").modal("show");
}

// funtion of clicking close or X in modal
modelClose.click(function () {
    // console.log("Hi");
    $("#myModal").modal("hide");
});