/*
Integration for Google Maps in the django admin.

How it works:

You have an address field on the page.
Enter an address and an on change event will update the map
with the address. A marker will be placed at the address.
If the user needs to move the marker, they can and the geolocation
field will be updated.

Only one marker will remain present on the map at a time.

This script expects:

<input type="text" name="address" id="id_address" />
<input type="text" name="geolocation" id="id_geolocation" />

<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

*/

// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);

function init() {
  var marker;
  var geolocationInput = document.querySelector("#id_geolocation");
  // Создание карты.
  // var lat = Number.parseFloat($('#map').attr('data-lat').split(';'));
  // var lng = Number.parseFloat($('#map').attr('data-lng').split(';'));

  var geolocationInfo = geolocationInput.value
    ? geolocationInput.value.split(",")
    : [51.15259, 71.427984];

  var myMap = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчнию: «широта, долгота».
    center: geolocationInfo,
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 17,
    // Элементы управления
    // https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/controls/standard-docpage/
    controls: [
      "zoomControl", // Ползунок масштаба
      "trafficControl", // Пробки
      "typeSelector", // Переключатель слоев карты
      "fullscreenControl", // Полноэкранный режим
    ],
  });

  prepareMap(geolocationInput);
  myMap.events.add("click", function (e) {
    if (marker == null) {
      console.log("NO Marker: ");
      marker = new ymaps.Placemark(
        e.get("coords"),
        {
          // Хинт показывается при наведении мышкой на иконку метки.
          hintContent: "Содержимое всплывающей подсказки",
          // Балун откроется при клике по метке.
        },
        {
          preset: "islands#darkGreenIcon",
        }
      );
      myMap.geoObjects.add(marker);
      geolocationInput.value = `${e.get("coords").join(",")}`;
    } else {
      // console.log("Marker: "+ marker)
      marker.geometry.setCoordinates(e.get("coords"));
      myMap.geoObjects.add(marker);
    }

    marker.events.add("drag", function (e) {
      // console.log(marker.geometry.getCoordinates());
      geolocationInput.value = `${marker.geometry.getCoordinates().join(",")}`;
    });
  });

  function prepareMap(geoInput) {
    if (geoInput.value) {
      marker = new ymaps.Placemark(
        geoInput.value.split(","),
        {
          hintContent: "Содержимое всплывающей подсказки",
        },
        {
          preset: "islands#darkGreenIcon",
          draggable: true,
        }
      );
      return true;
    }
    return false;
  }
}

// DG.then(function () {
// 	var marker;
// 	var geolocationInput = $('#id_geolocation');
// 	map = DG.map('map', {
// 		'center': [51.15259, 71.427984],
// 		'zoom': 14
// 	});
// 	prepareMap();
// 	map.on('click', function (e) {
// 		if (!marker) {
// 			marker = DG.marker([e.latlng.lat, e.latlng.lng], {
// 				'draggable': true
// 			}).addTo(map);

// 			geolocationInput.val(e.latlng.lat + ',' + e.latlng.lng);

// 		}
// 		else {
// 			marker.setLatLng([e.latlng.lat, e.latlng.lng]);
// 			geolocationInput.val(e.latlng.lat + ',' + e.latlng.lng);
// 		}
// 		marker.on('dragend', function (data) {
// 			geolocationInput.val(data.target._latlng.lat + ',' + data.target._latlng.lng);
// 		});
// 	});

// 	function prepareMap() {
// 		if (geolocationInput.val()) {
// 			marker = DG.marker(geolocationInput.val().split(','), { 'draggable': true }).addTo(map);
// 			return true;
// 		}
// 		return false;
// 	}
// });

//
// Добавить маркер по клику
//
// myMap.events.add('click', function (e) {
// 				var myPlacemark = new ymaps.Placemark(e.get('coords'), {
// 						// Хинт показывается при наведении мышкой на иконку метки.
// 						hintContent: 'Содержимое всплывающей подсказки',
// 						// Балун откроется при клике по метке.
// 				}, {
// 						preset: 'islands#darkGreenIcon',
// 				});
//
// 				// После того как метка была создана, добавляем её на карту.
// 				myMap.geoObjects.add(myPlacemark);
// 		});
