// This array will hold the profiles obtained from server
let profiles = [];

// This selector will be used to insert the proper html in the gallery div
const gallery = document.getElementById("gallery");

// This variable is the url used to get the 12 profiles, it's modified according to documentation
const serverUrl = 'https://randomuser.me/api/?results=12&nat=us&exc=gender,login,registered,phone,id';

// This selector will be used to insert and listen to the search bar
const searchBar = document.querySelector('.search-container');


// calling the principal function to run the program
getProfilesFromServer(serverUrl);


/**
 * getProfilesFromServer
 * This async function will retrieve profiles from server
 * @function
 * @param {string} url - server url
 * @return {Promise<void>}
 */

async function getProfilesFromServer(url) {
    try {
        await fetch(url)
            .then(response => response.json())
            .then(data => profiles = [...data.results])
    } catch (error) {
        console.error(error);
    }
    displayProfiles(profiles);
    insertSearchBar();
}

/**
 * displayProfiles
 * This function is in charge of loading the 12 cards with the proper user information
 * @function
 * @param {array} profilesToShow - an array of objects with each user info
 */

function displayProfiles(profilesToShow) {

    gallery.innerHTML = profilesToShow.map(user => {
        return `<div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${user.name.first + ' ' + user.name.last}</h3>
                        <p class="card-text">${user.email}</p>
                        <p class="card-text cap">${user.location.city + ' ' + user.location.state}</p>
                    </div>
                </div>`
    }).join('');
    createModals(profilesToShow);
}

/**
 * insertSearchBar
 * This function inserts the HTML code to show the search bar
 * @function
 */

function insertSearchBar () {
    searchBar.innerHTML = `<form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>`;
    activateSearchBar();
}

/**
 * activateSearchBar
 * This function is in charge of filtering the profiles according to input search
 * @function
 */

function activateSearchBar() {
    searchBar.addEventListener('input', event => {
        const inputSearch = event.target.value.toLowerCase();
        const filteredProfiles = profiles.filter(profile => {
            return profile.name.first.toLowerCase().includes(inputSearch) || profile.name.last.toLowerCase().includes(inputSearch);
        })
        displayProfiles(filteredProfiles)
        if (filteredProfiles.length === 0) {
            const notFoundMessage = document.createElement('div');
            notFoundMessage.innerHTML = `<div class="not-found"><h2>NOT FOUND</h2></div>`;
            gallery.appendChild(notFoundMessage);
        }
    })
}


/**
 * prepareDate
 * This auxiliary function will prepare the user birthday in proper format
 * @function
 * @param {object} selectedCard - object with user information
 * @return {string}
 */
function prepareDate (selectedCard) {
    return selectedCard.dob.date.slice(0,10).split('-').reverse().join('/');
}


/**
 * prepareCellPhone
 * This function will prepare cellphone number in proper format
 * @function
 * @param {object} selectedCard - object with user information
 * @return {string}
 */
function prepareCellPhone (selectedCard) {
    let cellArray = [...selectedCard.cell].filter(element => element !== '-' && element !== '(' && element !== ')' && element !== '').join('');
    return `(${cellArray.slice(0,3)}) ${cellArray.slice(3,6)}-${cellArray.slice(6)}`;
}


/**
 * crateModals
 * This function handles event listeners for cards shown
 * @function
 * @param {array} modalsToCreate - array of objects with users information
 */
function createModals(modalsToCreate) {
    let cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => card.addEventListener('click', () => {
        showModal(cards, index, modalsToCreate);
    }))
}

/**
 * showModal
 * This function has heavy duty, since is the responsible of proper modal display
 * @function
 * @param cards
 * @param cardIndex
 * @param modals
 */
function showModal(cards, cardIndex, modals) {
    const elementToShow = modals.filter(modalElement => `${modalElement.name.first} ${modalElement.name.last}` === cards[cardIndex].firstElementChild.nextElementSibling.firstElementChild.textContent)[0];
    const modal = document.createElement('div');
    modal.innerHTML = `<div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${elementToShow.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${elementToShow.name.first + ' ' + elementToShow.name.last}</h3>
                        <p class="modal-text">${elementToShow.email}</p>
                        <p class="modal-text cap">${elementToShow.location.city}</p>
                        <hr>
                        <p class="modal-text">${prepareCellPhone(elementToShow)}</p>
                        <p class="modal-text">${elementToShow.location.street.number + ', ' + elementToShow.location.street.name + ', ' + elementToShow.location.state + ', ' + elementToShow.location.postcode}</p>
                        <p class="modal-text">Birthday: ${prepareDate(elementToShow)}</p>
                    </div>
                </div>

                
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
    document.body.appendChild(modal);
    buttonsFunctionality(cards, cardIndex, modals);
}

/**
 * buttonsFunctionality
 * This function handles the close, prev and next buttons according to triggered event
 * @function
 * @param cards
 * @param cardIndex
 * @param modals
 */

function buttonsFunctionality(cards, cardIndex, modals) {
    const buttons = document.querySelectorAll("button");
    const modalContainer = document.querySelector(".modal-container");
    buttons.forEach(button => {
        button.addEventListener('click', event => {
        const buttonText = event.target.innerText;
            if (buttonText === 'X') modalContainer.remove();
            else if (buttonText === 'PREV') {
                if (cardIndex !== 0) {
                    cardIndex--;
                    modalContainer.remove();
                    showModal(cards, cardIndex, modals);
                }
            } else if (buttonText === 'NEXT') {
                if (cardIndex !== modals.length-1) {
                    cardIndex++;
                    modalContainer.remove();
                    showModal(cards, cardIndex, modals);
                }
            }
        })
    })
}





