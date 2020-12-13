let categoriesArray = new Array();
let catalog = new Array();
let cart = new Array();
let ajaxObj;

/** A function that shows a Bootstrap Alerts status message with the 
 * specified cssClass and the message to display as parameters.
 * @param {string} cssClass The specified cssClass
 * @param {string} messageToDisplay The message to be displayed
 */
function showStatusMessage(cssClass, messageToDisplay) {
    let alertBox = document.getElementById("alertBox");
    
    try {
        let alertDiv = `<div class="${cssClass}">${messageToDisplay}</div>`;
        alertBox.innerHTML = alertDiv;
        setTimeout(hideStatusMessage, 5000);
    }
    catch(err) {
        alertBox.innerHTML = "Error: " + err + ".";
    }
}

/** Function that hides the Bootstrap Alerts status message 
 * from the HTML document */
function hideStatusMessage() {
    document.getElementById("alertBox").style.display = "none";
}

/** A funtion that show the list of all the available items with 
 * the possibility to add an item to the shopping cart */
function showListOfItems() {
    let divItemList = document.getElementById("itemList");
    try {
        let cards = '<div>';
        for (idx = 0; idx < catalog.length;) {
            let cardDeck = '<div class="card-deck>"';
            for (j = 0; j < 4; j++) {
                var itemId = catalog[idx].id;
                var itemTitle = catalog[idx].title;
                var desc = catalog[idx].description.substring(0, catalog[idx].description.indexOf('.') + 1);
                var image = catalog[idx].thumbnail;
                let itemCard = '<div class="card" style="width: 18rem;">';
                itemCard += `<img src="${image}" class="card-img-top" alt="Card image cap"/>`;
                itemCard += `<h5 class="card-title">${itemTitle}</h5>`;
                itemCard += `<p class="card-text">${desc}</p>`;
                itemCard += `<button type="button" class="btn btn-success" onclick="addToCart(${itemId});"><i class="fas fa-cart-plus"></i> Add To Cart</button><button type="button" class="btn btn-primary" onclick="showItemDetails(${itemId});"><i class="fas fa-info-circle"></i> View Details</button>`;
            
                itemCard += '</div>';
                cardDeck += itemCard;
                idx++;
            }
            cardDeck += '</div>';
            cards += cardDeck;
        }
        cards += '</div>';
        divItemList.innerHTML = cards;
    }
    catch(err) {
        divItemList.innerHTML = "Error: " + err + ".";
    }
}

/** A funtion that displays the content of the shopping cart */
function viewCart() {
    let divItemTable = document.getElementById("itemList");
    
    try {
        let itemTable = '<table class="table table-striped"><thead><tr><th>Item ID</th><th>Item Title</th><th>Price</th><th>Category</th><th>View Details</th><th>Remove</th></tr></thead><tbody>';
    
        cart.forEach(item => {
            itemTable += `<tr> <td>${item.id}</td><td>${item.title}</td><td>${item.unitPrice}</td><td>${item.categoryName}</td> <td><button type="button" class="btn btn-primary" onclick="showItemDetails(${item.id});"><i class="fas fa-info-circle"></i> View Details</button></td> <td><button type="button" class="btn btn-danger" onclick="removeFromCart(${item.id});">Remove</button></td></tr>`;
        });
        itemTable += '</tbody></table>';

        divItemTable.innerHTML = itemTable;
    }
    catch(err) {
        divItemTable.innerHTML = "Error: " + err + ".";
    }
}

/** A function that goes through the catalog array 
 * in order to find out if there is an item whose ID matches a given itemID
 * @param {int} itemId The given item ID.
 */
function findItemById(itemId) {
    for (idx = 0; idx < catalog.length; idx++) {
        if (catalog[idx].id == itemId) {
            return catalog[idx];
        } else if (idx == catalog.length - 1 && catalog[idx].itemId != itemId) {
            return false;
        }
    }
}

/** A function that displays the details of a given item
 * @param {int} itemId The given item ID.
 */
function showItemDetails(itemId) {
    let item = findItemById(itemId);
    
    if (item != false) {
        let divItemTable = document.getElementById("itemList");
        try {
            let itemTable = '<table class="table table-striped"><thead><tr><th>Image</th><th>Item ID</th><th>Item Title</th><th>Description</th><th>Brand</th><th>Unit Price</th><th>Quantity in stock</th><th>Manufacturer</th><th>Category</th></tr></thead><tbody>';
    
        itemTable += `<tr> <td><img src="${item.thumbnail}" width="100" height="100" class="img-thumbnail"/></td> <td>${item.id}</td><td>${item.title}</td><td>${item.description}</td><td>${item.brand}</td><td>${item.unitPrice}</td><td>${item.quantityInStock}</td><td>${item.make}</td><td>${item.categoryName}</td></tr>`;
        itemTable += '</tbody></table>';

        divItemTable.innerHTML = itemTable;
        }
        catch(err) {
            divItemTable.innerHTML = "Error: " + err + ".";
        }
    } 
}

/** A function that adds an item to the cart.
 * @param {int} itemId The item ID.
 */
function addToCart(itemId) {
    let item = findItemById(itemId);
    
    if (typeof item != String) {
        cart[length] = item;
        document.getElementById("cartList").innerHTML = cart.length;
        showStatusMessage("alert alert-success", "Item successfully added");
    } else {
        showStatusMessage("alert alert-warning", "Item not found");
    }
}

/** A function that removes an item to the cart.
 * @param {int} itemId The item ID.
 */
function removeFromCart(itemId) {
    for (idx = 0; idx < cart.length; idx++) {
        if (cart[idx].id == itemId) {
            cart.splice(idx);
            document.getElementById("cartList").innerHTML = cart.length;
            showStatusMessage("alert alert-danger", "Item successfully removed");
        }
    }
    viewCart();
}

/**
* A funtion That looks for an item in an array
* Returns true is the item is not found in the array
*/
function notFound(array, item) {
    for (var idx = 0; idx < array.length; idx++) {
        if (array[idx].id == item.id) {
            return false;
        }
    }
    return true;
}

/**
 * A function that search for an item according to a given keyword
 * @param {string} searchKeyword The given keyword.
 */
function searchByKeyword(searchKeyword) {
    var keyword = searchKeyword.toLowerCase();
    var searchArray = new Array();

    for (idx = 0; idx < catalog.length; idx++) {
        if (catalog[idx].categoryName.toLowerCase().includes(keyword)
            || catalog[idx].title.toLowerCase().includes(keyword)
            || catalog[idx].description.toLowerCase().includes(keyword)
            || catalog[idx].brand.toLowerCase().includes(keyword)
            || catalog[idx].make.toLowerCase().includes(keyword)) { 
            if (notFound(searchArray, catalog[idx])) {
                searchArray[idx] = catalog[idx];
            }
        }
    }

    if (searchArray.length == 0) {
        showStatusMessage("alert alert-secondary", "Not found");
    } else {
        let searchTable = document.getElementById("itemList");
        try {
            let itemTable = '<table class="table table-striped"><thead><tr><th>Item ID</th><th>Item Title</th><th>Description</th><th>Category</th><th>View Details</th><th>Add To Cart</th></tr></thead><tbody>';
    
        searchArray.forEach(searchItem => {
            itemTable += `<tr> <td>${searchItem.id}</td><td>${searchItem.title}</td><td>${searchItem.unitPrice}</td><td>${searchItem.categoryName}</td> <td><button type="button" class="btn btn-primary" onclick="showItemDetails(${searchItem.id});"><i class="fas fa-info-circle"></i> View Details</button></td> <td><button type="button" class="btn btn-success" onclick="addToCart(${searchItem.id});"><i class="fas fa-cart-plus"></i> Add To Cart</button></td></tr>`;
        });
        itemTable += '</tbody></table>';

        searchTable.innerHTML = itemTable;
        }
        catch(err) {
            searchTable.innerHTML = "Error: " + err + ".";
        }
    }
}


/**
 * It creates and configures an AJAX request 
 * and sends it to the provided search.php
 */
function makeAjaxCall() {
    ajaxObj = new XMLHttpRequest();
    ajaxObj.onreadystatechange = processResponse;
    var search = document.getElementById("searchInput").value;
    
    if (search == "") {
        ajaxObj.open("GET", "search.php", true);
    } else {
        ajaxObj.open("GET", "search.php?query=" + search, true);
    }
    ajaxObj.send();
}

/**
 * It retrieves the obtained JSON document 
 * embedded in the HTTP response and passes it as a parameter
 * to parseJsonData(). It calls showListOfItems() after successfully 
 * populating the catalog array in parseJsonData()
 */
function processResponse() {
    if (ajaxObj.readyState == XMLHttpRequest.DONE) {
        parseJsonData(ajaxObj.responseText);
        showListOfItems();
    }
}

/**
 * It parses the received JSON data and populate the catalog
 * and categories arrays
 * @param {*} strData The JSON data it to parse.
 */
function parseJsonData(strData) {
    var jsonObj = JSON.parse(strData);
 
    categoriesArray = jsonObj.categories;
    
    let catalogIdx = 0;

    for (let idx = 0; idx < jsonObj.categories.length; idx++) {
        if (jsonObj.categories[idx].items != null) {
            for (let idx2 = 0; idx2 < jsonObj.categories[idx].items.length; idx2++) {
            catalog[catalogIdx] = jsonObj.categories[idx].items[idx2];
            catalogIdx++;
            }
        }
    }
}