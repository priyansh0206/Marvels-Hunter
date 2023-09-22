// importing the ts and hash from the key Javascript file
import { ts, hash } from './key.js';

// storing the data in localstorage of browser and parsing
var favourites = JSON.parse(localStorage.getItem('favourites')) || [];

// all the html containers are listed below
var searchList = $('#search-list');
var modelBox = $('.modal');
var modelTitle = $('.modal-title');
var modelBody = $('.modal-description');
var modelClose = $('.modal-close');
var defaultModelBody = modelBody[0].innerHTML;
var loaderBox = $('.loading-container');

// funtion that will load the favourites list
async function loadFavourites() {
    // if there is no favorite added then below will be the message
    if (favourites.length === 0) {
        setTimeout(function () { alert("No Favourites added ! Please add some to check here."); }, 2500);
    }
    else {
        loaderBox.css({
            'display': 'block'
        });
    }
    // console.log(count);
    for (var key in favourites) {
        await fetch(`https://gateway.marvel.com:443/v1/public/characters/${favourites[key]}?ts=${ts}&apikey=c2fe8ba050bcef541c9007527c79d8eb&hash=${hash}`)
            .then(response => response.json()) // Extract JSON data from the response
            .then(data => {
                var bool = true;
                var result = data.data.results[0];
                var listItem = $(`<li></li>`);
                var img = $(`<img src=${result.thumbnail.path + '.' + result.thumbnail.extension} />`);
                var bold = $(`<b class="char-name">${result.name}</b>`);
                var span = $(`<span>${result.id}</span>`);
                var button = $(`<button type="button" class="btn btn-danger favourite-button" data-bs-toggle="button" aria-pressed="true">
                <i class="fa-regular fa-heart"></i>
                </button>`);
                listItem.append(img); // Use .append() to add img to listItem
                listItem.append(bold);
                listItem.append(span);
                if (bool) {
                    button.css({
                        'background-color': 'red' // Example background color
                    });
                } else {
                    button.css({
                        'background-color': 'transparent' // Example background color
                    });
                }
                listItem.append(button);
                searchList.append(listItem);
                // const results = data;
                // console.log(data.data.results[0].name);
            }).catch(error => {
                // Handle any errors that occurred during the fetch request
                console.error('Fetch error:', error);
            });
    }
    //variables used for the functioning of the favorites button
    var favouriteButton = $('.favourite-button');
    favouriteButton.click(checkFavourite);
    var charName = $('.char-name');
    charName.click(charDeatils);
    loaderBox.css({
        'display' : 'none'
    });
}
// the default call for loading the favourites
loadFavourites();

// function to check does the current character is in favorite list or not
function checkFavourite() {
    var listItem = $(this).closest("li");
    // Find the <b> element within the closest <li> element
    var bElement = listItem.find("span");
    // Get the inner text of the <b> element
    var innerText = bElement.text();
    var indexToRemove = favourites.indexOf(parseInt(innerText));
    // console.log(indexToRemove);
    if (indexToRemove !== -1) {
        favourites.splice(indexToRemove, 1);
    }
    $(this).attr('aria-pressed', 'false');
    $(this).css({
        'background-color': 'transparent'
    });
    // console.log(favourites);
    // Store data in localStorage
    localStorage.setItem('favourites', JSON.stringify(favourites));
    searchList.empty();
    loadFavourites();
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
            if (result != '') {
                modelBody[0].innerHTML = result;
            } else {
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