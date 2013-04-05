$(document).ready(function(){
	var selectedCampusId = -1, selectedDateIndex = -1;
	var campusFilter = [], hallsFilter = [], dateFilter = [];
	var campusData = [];
	var weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
	var dayCycle = ['Matin', 'Midi', 'Soir'];
	var todayDateStr = '', selectedDate = '', selectedHall = '';
	
	var dateFormat = function(d) {
		var month= d.getMonth() + 1;
		var monthFormat = '' + month;
		if (month < 10) {
			monthFormat = '0' + monthFormat;
		}
		
		var day= d.getDate()
		var dayFormat = '' + day;
		if (day < 10) {
			dayFormat = '0' + dayFormat;
		}
		
		return d.getFullYear() + '-' + monthFormat  + '-' + dayFormat;
	}
	
	var displayDate = function(d) {
		var _date = d.split("-");
		return _date[2] + '/' + _date[1]  + '/' + _date[0];
	}
	
	var compareDates = function(firstStr, secondStr) {
		var _first = new Date(firstStr);
		_first.setHours(0,0,0,0);
		console.log("first: " + _first);
		var _second = new Date(secondStr);
		_second.setHours(0,0,0,0);
		console.log("second: " + _second);
	
		if (_first == _second) {
			return 0;
		} else if (_first > _second) {
			return 1;
		} else if (_first < _second) {
			return -1;
		}
		
	}
	
	var loadFeeds = function(){
		$.ajax({
				url: 'data/ru.json',
				async: false,
				dataType: 'json',
				success: function (json) {
  				campusData = json;
				}
		});
		
		$.ajax({
 				url: 'data/menu.json',
 				async: false,
 				dataType: 'json',
 				success: function (json) {
   					foodData = json;
 				},
 				error: function (xhr, ajaxOptions, thrownError) {
			        console.log(xhr.status);
			        console.log(ajaxOptions);
			    }
		});
	}
	
	
	var getData = function(){
		$.each(campusData.campuses, function(i, campus){
			$('#campusList').append($('<li>').append($('<a>').text(campus.name).attr('id', campus.id).attr('href', '#menus')));
			campusFilter.push(campus.id);
			if (selectedCampusId == -1) {
				selectedCampusId = campus.id;
				getDatesByCampus();
				getHallsByCampusAndDate();
				//getMenu();
			}
			$.each(campus.diningHalls, function(i, hall){
				displayHallDetails(hall);
			});
			
		});
		$('#campusList').trigger('create');
	}
	
	var getDatesByCampus = function(){
		hallsFilter.length = 0;
		$.each(campusData.campuses, function(i, campus){
			if (campus.id == selectedCampusId) {
				$.each(campus.diningHalls, function(i, hall){
					hallsFilter.push(hall.key);
				});
				return false;
			}
		});	
						
		dateFilter.length = 0;
		$.each(foodData.food, function(i, day){
			/* by default, the selected date is the current day */
			if (selectedDateIndex < 0 || todayDateStr == day.date) {
				selectedDateIndex = i;
				selectedDate = day.date;
			}
			var currentDate = day.date;
			
			$.each(day.menus, function(i, menu){
				if (hallsFilter.length > 0 && $.inArray(menu.diningHall, hallsFilter) > -1) {
					$('#dateSelect').append($('<option>').text(displayDate(currentDate)).attr('value', currentDate));
					dateFilter.push(day.date);
					return false;
				}
			});
		});
		$('#dateSelect option').eq(selectedDateIndex).attr('selected', 'selected');
	}
	
	var getHallsByCampusAndDate = function(){
		selectedDate = dateFilter[$('#dateSelect').prop("selectedIndex")];
		$('#hallList').empty();
		$('#hallSelect').empty();
		$.each(foodData.food, function(i, day){
			
			if (day.date == selectedDate) {
				$.each(day.menus, function(i, menu){
					$.each(campusData.campuses, function(i, campus){
						if (campus.id == selectedCampusId) {
							$.each(campus.diningHalls, function(i, hall){
								if (hall.key == menu.diningHall) {
									$('#hallList').append($('<div>').append($('<h3>').text(hall.name)).append(displayMenuItems(menu)).attr('value', hall.key).attr('data-role', 'collapsible'));
									return false;
								}
							});
							return false;
						}
					});
				});
				return false;	
			}
		});
		console.log($("#hallList"));
		$('#hallList div[data-role=collapsible]').collapsible();
		//$("#hallList").collapsible("create");
	}
	
	var displayHallDetails = function(hall) {
		var _hallPage = $('<div>').attr('id', 'dialog-hall-' + hall.key).attr('data-role', 'dialog');
		_hallPage.append($('<div>').attr('data-role', 'header').append($('<h1>').text(hall.name)));
		_hallPage.appendTo($('body'));
		var _hallPageContent = $('<div>').attr('data-role', 'content');
			
		if (hall.nextReopeningDate == "0" || compareDates(todayDateStr, hall.nextReopeningDate) >= 0) {
			var _openingContainer = $('<div>').attr('class', 'ui-grid-c');
			var _dayOpenings = hall.openingHours.split(",");
			var _classOpeningList = ['ui-block-b', 'ui-block-c', 'ui-block-d']
			for (var i = 0 ; i < _dayOpenings.length ; i++) {
				_openingContainer.append($('<div>').text(weekDays[i]).attr('class', 'ui-block-a'));
				for ( var j = 0; j < _dayOpenings[i].length; j++ ) {
					if (_dayOpenings[i][j] == '0') {
					_openingContainer.append($('<div>').text('F').attr('class', _classOpeningList[j]));
					} else {
						_openingContainer.append($('<div>').text('O').attr('class',  _classOpeningList[j]));
					}
				}			
			}
			_openingContainer.appendTo(_hallPageContent);
		} else {
			console.log(hall.key + " is closed");
			_hallPageContent.append($('<div class="nextClosing">').text("Fermé jusqu'au " + hall.nextReopeningDate));
		}
		

		var _descCollapsible = $('<div>').append($('<h3>').text('Description')).attr('data-role', 'collapsible').attr('data-collapsed-icon', 'arrow-r').attr('data-expanded-icon','arrow-d');
		var _descContainer = _descCollapsible.append($('<div>'));
		_descContainer.append($('<img>').attr('src', hall.img).attr('style', 'max-width:100%;'));
		if (hall.desc) {
			for (var i = 0; i < hall.desc.length; i++) {
				_descContainer.append($('<div>').append($('<h4>').text(hall.desc[i].name)).append($('<div>').text(hall.desc[i].value)).attr('class', 'description'));
				if (hall.desc[i].name.toLowerCase() == 'localisation') {
					_descContainer.append($('<a>').text('Maps').attr('href', 'https://maps.google.com/maps?q=loc:' + hall.location).attr('target', '_blank'));
				}
			}
		}
		_descCollapsible.appendTo(_hallPageContent);
		
		var _contactCollapsible = $('<div>').append($('<h3>').text('Contact info')).attr('data-role', 'collapsible').attr('data-content-theme', 'c');
		var _contactContainer = _contactCollapsible.append($('<div>'));
		
		_contactContainer.append($('<div>').text(hall.contactInfo.address).append($('<a style="float:right;">').attr('href', 'https://maps.google.com/maps?q=loc:' + hall.location).attr('target', '_blank')));
		_contactContainer.append($('<a>').text(hall.contactInfo.tel).attr('href', 'tel:' + hall.contactInfo.tel.replace(/\./g, "")));
		_contactContainer.append($('<a>').text(hall.contactInfo.email).attr('href', 'mailto:' + hall.contactInfo.email));		
		_contactCollapsible.appendTo(_hallPageContent);
		
		_hallPageContent.appendTo(_hallPage);
	}
	
	var getMenu = function() {
		selectedHall = $('#hallSelect').val();
		$('#menuContainer').empty();
		$.each(foodData.food, function(i, day){
			if (day.date == selectedDate) {
				$.each(day.menus, function(i, menu){
					if (menu.diningHall == selectedHall) {
						displayMenuItems(menu);
						return false;
					}
				});
				return false;	
			}
		});
		
	}
	
	var displayMenuItems = function(menu) {
		console.log(menu);
		var _menu = $('<div class="menu">');
		_menu.append($('<a style="float:right;">').text('Show info on RU').attr('data-rel', 'dialog').attr('href', '#dialog-hall-' + menu.diningHall));
		$.each(menu.meals, function(i, meal){
			var _meal = $('<div class="meal">').appendTo(_menu);
			$('<div class="mealName">').text(meal.name).appendTo(_meal);
			var _cats = $('<ul class="categories">').appendTo(_meal);
			$.each(menu.meals[i].categories, function(j, category){
				var _cat = $('<li>').text(category.name).appendTo(_cats);
				var _dishes = $('<ul class="dishes">').appendTo(_cat);
				$.each(category.dishes, function(k, dish){
					var _dish = $('<li>').text(dish.name).appendTo(_dishes);
					_dish.append($('<div class="ingredients">').text(dish.ingredients));
					var _items = $('<ul class="nutriItems">').appendTo(_dish);
					$.each(dish.nutritionItems, function(l, nutriItem){
						_items.append($('<li>').text(nutriItem.name + ': ' + nutriItem.value));
					});
				});
			});
		});
		return _menu;
	}
	
	var resetDatesAndDiningHalls = function(){
		$('#dateSelect').empty();
		$('#hallSelect').empty();
	}
	
	$("#campusList a").live('vclick', function() {
		resetDatesAndDiningHalls();
		
		selectedCampusId = $(this).attr("id");
		getDatesByCampus();
		getHallsByCampusAndDate();
		getMenu();
	});
	
	$("#campusList").change(function () {
		resetDatesAndDiningHalls();
		selectedCampusId = campusFilter[$(this).prop("selectedIndex")];
		getDatesByCampus();
		getHallsByCampusAndDate();
		getMenu();
	});
	
	$("#dateSelect").change(function () {
		getHallsByCampusAndDate();
	});
	
	todayDateStr = dateFormat(new Date());
	
	loadFeeds();
	getData();
});