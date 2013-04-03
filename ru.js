$(document).ready(function(){
	var selectedCampusId = -1, selectedDateIndex = -1;
	var campusFilter = [], hallsFilter = [], dateFilter = [];
	var campusData = [];
	var todayDate = '', selectedDate = '', selectedHall = '';
	
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
			if (selectedDateIndex < 0 || todayDate == day.date) {
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
	
	console.log('aaaaaaaaaaa');
	todayDate = dateFormat(new Date());
	
	loadFeeds();
	getData();
});