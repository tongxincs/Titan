(function() {
  /**
   * Variables Initialization
   */
  var user_id = '1111';
  var lng = -122.08;
  var lat = 37.38;
/**
 * Initialization
 * @returns
 */
  function init() {
	  // Register event listeners
	  // click one button, execute the load action
	  $('nearby-btn').addEventListener('click', loadNearbyItems);
	  $('fav-btn').addEventListener('click', loadFavoriteItems);
	  $('recommend-btn').addEventListener('click', loadRecommendedItems);
	  // initialize geolocation
	  //initGeoLocation();
	  loadNearbyItems();
	  
	}
  
  //-----------------------------
  // Helper Function
  //-----------------------------
  /**
   * Helper Function
   * step 1 get DOM by tag
   * step 2 create DOM with options
   */
  function $(tag, options) {
    if (!options) {
      return document.getElementById(tag);
    }

    var element = document.createElement(tag);

    for ( var option in options) {
      if (options.hasOwnProperty(option)) {
        element[option] = options[option];
      }
    }

    return element;
  }
  
  //-----------------------------
  // Loading Function
  //-----------------------------
  /**
   * Loading Message
   * @param msg
   * @returns
   */
  function showLoadingMessage(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> '+ msg + '</p>';
  }

  function showWarningMessage(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> ' + msg + '</p>';
  }

  function showErrorMessage(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> ' + msg + '</p>';
  }
  
  //-----------------------------
  // Button Function
  //-----------------------------
  /**
   * Active Button function 
   * @param btnId
   * @returns
   */
  function activeBtn(btnId) {
    var btns = document.getElementsByClassName('main-nav-btn');

    for (var i = 0; i < btns.length; i++) {
      btns[i].className =btns[i].className.replace(/\bactive\b/, ''); // regular expression to replace active button
    }

    // active the one that has id = btnId
    var btn = $(btnId);
    btn.className += ' active';
  }
  
  //--------------------------------
  //Creation and adding list Part
  //--------------------------------
  //call for helper function
  function listItems(items) {
	  // Clear the current results
	  var itemList = $('item-list');
	  // intializied the list as empty before any call
	  itemList.innerHTML = '';
		for (var i = 0; i < items.length; i++) {
			addItem(itemList, items[i]);
	}
  }

  //addItem function
  function addItem(itemList, item) {
	  var item_id = item.item_id;
	  
	  // create the <li> tag into list and specify the id and class attributes
	  // <li id-{id}, class> </li>
	  var li = $('li', {
		id : 'item-' + item_id,
		className : 'item'
	  });

	  // set the data attribute
	  li.dataset.item_id = item_id;
	  li.dataset.favorite = item.favorite;
	  
	  // add item image tag into <li><image></image></li> with default or options
	  if (item.image_url) {
		li.appendChild($('img', {
			src : item.image_url
			}));
	  } else {
		  li.appendChild($('img', {
			  src : 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
		  }))
	  }
		
		// create section<div> </div>
		var section = $('div', {});

		// create title <a href="#"> </a>
		var title = $('a', {
			href : item.url,
			target : '_blank',
			className : 'item-name'
		});
		// add item name <a href="#"> item name </a> into title
		title.innerHTML = item.name;
		// add title into section <div><a>item name</a></div>
		section.appendChild(title);

		// create category
		var category = $('p', {
			className : 'item-category'
		});
		// join all the categories of one item into an array
		category.innerHTML = 'Category: ' + item.categories.join(', ');
		// add category into section <div><p>category</p></div>
		section.appendChild(category);
		
		// create section name stars 
		var stars = $('div', {
			className : 'stars'
		});
		// run n times, n is the item rating, and add n stars into stars<div> <i class="star"></i></div>
		for (var i = 0; i < item.rating; i++) {
			var star = $('i', {
				className : 'fa fa-star'
			});
			stars.appendChild(star);
		}
		// deal with half star
		if (('' + item.rating).match(/\.5$/)) {
			stars.appendChild($('i', {
				className : 'fa fa-star-half-o'
			}));
		}
		// add stars into section<div><div class="stars"></div></div>
		section.appendChild(stars);
		// add section into li
		li.appendChild(section);

		// create address<p class="item-address"></p>
		var address = $('p', {
			className : 'item-address'
		});
		// break the address into three line
		// 400 W Disney Way, #337" <br>Thousand Oak<br>California<br>
		address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g,
				'');
		// add address into list
		li.appendChild(address);

		// create favorite link
		var favLink = $('p', {
			className : 'fav-link'
		});
		// call the following function when click
		favLink.onclick = function() {
			changeFavoriteItem(item_id);
		};
		// if item is faverate, it is fa fa-heart, otherwise it is fa fa-heart-o
		favLink.appendChild($('i', {
			id : 'fav-icon-' + item_id,
			className : item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
		}));
		// add faverate link into list
		li.appendChild(favLink);
		// add this ite, into itemlist
		itemList.appendChild(li);
	}

//-----------------------------
//Geolocation Part
//-----------------------------
/**
* Initialize Geolocation function
* @returns
*/
function initGeoLocation() {
	// get geolocation navigator.geolocation, return true if success
	if (navigator.geolocation) {
		// if success update position infomation
		navigator.geolocation.getCurrentPosition(onPositionUpdated,
				onLoadPositionFailed, {
					maximumAge : 60000
				});
		showLoadingMessage('Retrieving your location...'); // add loading message
	} else {
		onLoadPositionFailed();
	}
}
/**
* Update Position Function
* update position information
* @param position
* @returns
*/
function onPositionUpdated(position) {
	lat = position.coords.latitude;
	lng = position.coords.longitude;

	loadNearbyItems();
}
/**
* Warning Function
* showing warning message, and get location from IP
* @returns
*/
function onLoadPositionFailed() {
	console.warn('navigator.geolocation is not available');
	getLocationFromIP();
}
/**
* Get Location From IP Function
* @returns
*/
function getLocationFromIP() {
	// Get location from http://ipinfo.io/json
	var url = 'http://ipinfo.io/json'
	var req = null;
	ajax('GET', url, req, function(res) {
		var result = JSON.parse(res);
		if ('loc' in result) {
			var loc = result.loc.split(',');
			lat = loc[0];
			lng = loc[1];
		} else {
			console.warn('Getting location by IP failed.');
		}
		loadNearbyItems();
	});
}


//-----------------------------
//Ajex Function
//-----------------------------
/**
* @param method : GET POST DELETE
* @param url: url address
* @param data: null or input
* @param callback : execute if success
* @param errorHandler: execute if failed
* @returns
*/
function ajax(method, url, data, callback, errorHandler) {
	var xhr = new XMLHttpRequest();

	xhr.open(method, url, true);

	xhr.onload = function() {
		switch (xhr.status) {
		case 200:
			callback(xhr.responseText); // execute success
			break;
		case 401:
			errorHandler();  // error
			break;
		}
	};

	xhr.onerror = function() {
		console.error("The request couldn't be completed.");
		errorHandler();
	};
	// send request with data
	if (data === null) {
		xhr.send();
	} else {
		xhr.setRequestHeader("Content-Type",
				"application/json;charset=utf-8");
		xhr.send(data);
	}
}

/**
* API #1 Load the nearby items API end point: [GET]
* /Titan/search?user_id=1111&lat=37.38&lon=-122.08
*/
function loadNearbyItems() {
	console.log('loadNearbyItems');
	activeBtn('nearby-btn');

	// The request parameters
	var url = './search';
	var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
	// empty request
	var req = JSON.stringify({});

	// display loading message
	showLoadingMessage('Loading nearby items...');

	// make AJAX call
	ajax('GET', url + '?' + params, req,
	// successful callback
	function(res) {
		var items = JSON.parse(res);
		if (!items || items.length === 0) {
			showWarningMessage('No nearby item.');
		} else {
			listItems(items);
		}
	},
	// failed callback
	function() {
		showErrorMessage('Cannot load nearby items.');
	});
}

/**
 * API #2 Load favorite (or visited) items API end point: [GET]
 * /Titan/history?user_id=1111
 */
function loadFavoriteItems() {
	activeBtn('fav-btn');

	// The request parameters
	var url = './history';
	var params = 'user_id=' + user_id;
	var req = JSON.stringify({});

	// display loading message
	showLoadingMessage('Loading favorite items...');

	// make AJAX call
	ajax('GET', url + '?' + params, req, function(res) {
		var items = JSON.parse(res);
		if (!items || items.length === 0) {
			showWarningMessage('No favorite item.');
		} else {
			listItems(items);
		}
	}, function() {
		showErrorMessage('Cannot load favorite items.');
	});
}


/**
 * API #3 Load recommended items API end point: [GET]
 * /Titan/recommendation?user_id=1111
 */
function loadRecommendedItems() {
	activeBtn('recommend-btn');

	// The request parameters
	var url = './recommendation';
	var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;

	var req = JSON.stringify({});

	// display loading message
	showLoadingMessage('Loading recommended items...');

	// make AJAX call
	ajax(
			'GET',
			url + '?' + params,
			req,
			// successful callback
			function(res) {
				var items = JSON.parse(res);
				if (!items || items.length === 0) {
					showWarningMessage('No recommended item. Make sure you have favorites.');
				} else {
					listItems(items);
				}
			},
			// failed callback
			function() {
				showErrorMessage('Cannot load recommended items.');
			});
}


/**
 * API #4 Toggle favorite (or visited) items
 * 
 * @param item_id -
 *            The item business id
 * 
 * API end point: [POST]/[DELETE] /Dashi/history request json data: {
 * user_id: 1111, visited: [a_list_of_business_ids] }
 */
function changeFavoriteItem(item_id) {
	// Check whether this item has been visited or not
	var li = $('item-' + item_id);
	var favIcon = $('fav-icon-' + item_id);
	var favorite = li.dataset.favorite !== 'true';

	// The request parameters
	var url = './history';
	var req = JSON.stringify({
		user_id : user_id,
		favorite : [ item_id ]
	});
	// if item is already favorite, call delete, otherwise call post
	var method = favorite ? 'POST' : 'DELETE';

	ajax(method, url, req,
	// successful callback
	function(res) {
		var result = JSON.parse(res);
		if (result.result === 'SUCCESS') {
			li.dataset.favorite = favorite;
			favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
		}
	});
}

init();

})();



