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
      new ymaps.control.SearchControl({
        options: {
          // вид - поисковая строка
          size: "large",
          // Включим возможность искать не только топонимы, но и организации.
          provider: "yandex#search",
        },
      }),
    ],
  });

  prepareMap();

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
          draggable: true,
        }
      );
      myMap.geoObjects.add(marker);
      geolocationInput.value = `${e.get("coords").join(",")}`;
    } else {
      marker.geometry.setCoordinates(e.get("coords"));
      myMap.geoObjects.add(marker);
      geolocationInput.value = `${e.get("coords").join(",")}`;
    }

    marker.events.add("drag", function (e) {
      geolocationInput.value = `${marker.geometry.getCoordinates().join(",")}`;
    });
  });

  function prepareMap() {
    if (geolocationInput.value) {
      marker = new ymaps.Placemark(
        geolocationInput.value.split(","),
        {
          hintContent: "Содержимое всплывающей подсказки",
        },
        {
          preset: "islands#darkGreenIcon",
          draggable: true,
        }
      );
      myMap.geoObjects.add(marker);
      return true;
    }
    return false;
  }
}
