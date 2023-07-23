// variables
let formTextEl = document.querySelector("#form-text");
let formCuisineEl = document.querySelector("#form-cuisine");
let formPriceEl = document.querySelector("#form-price");
let formButtonEl = document.querySelector("#form-button");
let containerDiv = document.querySelector("#display-results");
let apiKeys = [
  "bc1f799ce0mshe02c6b2a2eb17b3p1a13a9jsn5c26cb1c4ec5", //edgar-[0]
  "de3f753eccmshe0f5fd91ea2d6fcp17c1b8jsn931676598f7c", //edgar2-[1]
  "5e5f6ede44msh62c3ce20cb8588cp1b3edejsn7dcbd4e52389", //edgar3-[2]
  "64e11e875fmsh272baa4a60cfe2dp10d5c3jsn0def253d0897", //edgar4-[3]
];

// funtions
function handleFormSubmit(event) {
  event.preventDefault();

  let city = formTextEl.value;
  let locationRequestUrl = `https://worldwide-restaurants.p.rapidapi.com/typeahead?q=${city}&language=en_US&currency=USD`;
  fetch(locationRequestUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": apiKeys[2],
      "X-RapidAPI-Host": "worldwide-restaurants.p.rapidapi.com",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (location) {
      let locationID = location.results.data[0].result_object.location_id;
      let requestUrl = `https://worldwide-restaurants.p.rapidapi.com/search?language=en_US&limit=30&location_id=${locationID}&currency=USD`;
      fetch(requestUrl, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": apiKeys[3],
          "X-RapidAPI-Host": "worldwide-restaurants.p.rapidapi.com",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let restaurants = data.results.data;

          filteredRestaurants = [...restaurants];
          console.log(restaurants);
          setLocalStorage(restaurants);
        });
    });
}

function displayResults(restaurants) {
  removeNodes(containerDiv);

  let resultsDiv = document.createElement("div");
  resultsDiv.setAttribute("class", "container d-flex flex-wrap");
  resultsDiv.setAttribute("style", "width: 80%; border: 1px solid black");

  restaurants.forEach((restaurant) => {
    let restaurantDiv = document.createElement("div");
    restaurantDiv.setAttribute("class", "container");
    restaurantDiv.setAttribute("style", "width: 300px; height: 250px; border: 1px solid black");
    restaurantDiv.addEventListener("click", function () {
      console.log("clicked");
    });
    resultsDiv.append(restaurantDiv);
  });
  containerDiv.append(resultsDiv);
}

// create cuisine filters
function createCuisineFilters(restaurants) {
  let cuisineArr = [];
  restaurants.forEach((restaurant) => {
    restaurant.cuisine.forEach((single) => {
      if (!cuisineArr.includes(single.name)) {
        cuisineArr.push(single.name);
      }
    });
  });
  cuisineArr.sort();

  removeNodes(formCuisineEl);
  let nonClickableEl = document.createElement("option");
  nonClickableEl.textContent = "Cuisine";
  nonClickableEl.setAttribute("selected", "true");
  nonClickableEl.setAttribute("disabled", "disabled");
  formCuisineEl.append(nonClickableEl);
  cuisineArr.forEach((cuisine) => {
    let cuisineEl = document.createElement("option");
    cuisineEl.textContent = cuisine;
    formCuisineEl.append(cuisineEl);
  });
}

function removeNodes(parent) {
  if (parent.hasChildNodes) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

function createPriceFilters(restaurant) {}

// --- FILTERS ---
// CUISINE
function handleFilterCuisine(restaurants) {
  console.log(formCuisineEl.value);
}

// PRICE
function handleFilterPrice(restaurants) {
  console.log("change");
}

// TESTING - WILL DELETE
function setLocalStorage(filteredRestaurants) {
  localStorage.setItem("restaurants", JSON.stringify(filteredRestaurants));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("restaurants"));
}

function handleFormSubmit2(event) {
  event.preventDefault();

  // TEST FETCH
  let restaurantFromLS = getLocalStorage();
  console.log(restaurantFromLS);

  displayResults(restaurantFromLS);
  createCuisineFilters(restaurantFromLS);
  formCuisineEl.setAttribute("class", "d-inline");
  formPriceEl.setAttribute("class", "d-inline");
}

// eventListener
// formButtonEl.addEventListener("click", handleFormSubmit);
formButtonEl.addEventListener("click", handleFormSubmit2);
formCuisineEl.addEventListener("change", handleFilterCuisine);
formPriceEl.addEventListener("change", handleFilterPrice);
