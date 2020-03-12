document.addEventListener('DOMContentLoaded', () => {


  const mapCounter        = document.getElementById('map-counter'),
        counters          = document.querySelectorAll('.counter')
        eventsCounter     = document.getElementById('events-counter')
        mapPageMain       = document.querySelector('.map-page'),
        feed              = document.querySelector('.feed'),
        feedArticle       = document.querySelectorAll('.feed__article'),
        feedListBtn       = document.getElementById('feed-list-btn'),
        feedList          = document.getElementById('feed-list'),
        mapFeedCity       = document.getElementById('map-feed-city'),
        mapFeedCountry    = document.getElementById('map-feed-country');

  const bookmark = [];

  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }, 
  });


   const checkCounterValue = () => {
    counters.forEach(function(item) {
      if (item.textContent.length > 1) {
        item.style.borderRadius = '7.5px'
      } else {
        item.style.borderRadius = '50%'
      }
    });
  }     



  const showFeedlist = () => {
    if (mapCounter.textContent == '0') {
      mapFeedCity.textContent = 'Events not found';
      mapFeedCountry.textContent = 'Сhoose a location of the events on the map';
      feedArticle.forEach(function(item) {
        item.style.display = 'none'
        feedList.style.top = '30rem'
      });
      feedList.style.height = 'auto'
    } else {
      feedArticle.forEach(function(item) {
        item.style.display = 'block'
        feedList.style.top = '15rem'
      });
    }
    feedList.classList.toggle('active');
    mapPageMain.classList.toggle('active');
  }

  const hideFeedlist = (event) => {
    const target = event.target;
    let itsFeed = target == feedList || feedList.contains(target);
    let itsFeedBtn = target == feedListBtn;
    let feedIsActive = feedList.classList.contains('active');
    if (!itsFeed && !itsFeedBtn && feedIsActive) {
      mapFeedCity.textContent = '';
      mapFeedCountry.textContent = '';
      showFeedlist()
    }
  }


  const storageQuery = (get) => {
    if (get) {
      if (localStorage.getItem('bookmark')) {
        const bookmarkStorage = JSON.parse(localStorage.getItem('bookmark'))
        bookmarkStorage.forEach(id => bookmark.push(id))
      } 
    } else {
      localStorage.setItem('bookmark', JSON.stringify(bookmark))
    }
    checkEvents();
  }

  const toggleBookmark = (id,elem) => {
    if (bookmark.includes(id)) {
      bookmark.splice(bookmark.indexOf(id), 1)
      elem.classList.remove('active')
    } else {
      bookmark.push(id)
      elem.classList.add('active')
    }
    checkEvents();
    storageQuery();
}


const checkEvents = () => {
  eventsCounter.textContent = bookmark.length; 
  feedArticle.forEach(function(item) {
  if (bookmark.includes(item.dataset.eventId)) {
    item.classList.add('active') 
  }
  });
}




const handlerEvents = event => {
  const target = event.target;
  if (target.classList.contains('feed__article')) {
    toggleBookmark(target.dataset.eventId, target)
  }
}




  if (feedListBtn) {
    feedListBtn.addEventListener('click', showFeedlist);
    document.addEventListener('click', hideFeedlist);
  }

  feed.addEventListener('click', handlerEvents);
  storageQuery(true)
   

  



// Google map

if (mapPageMain) {

function initMap() {
  const coordinates = {lat: 43.726379, lng: 1.151681},
      map = new google.maps.Map(document.getElementById('map'), {
          center: coordinates,
          disableDefaultUI: true,
          zoom: 5,
          scrollwheel: false,
          
      });

      const myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function () {
          this.getPanes().markerLayer.id='all-markers';
      };
      myoverlay.setMap(map);


      const locations = [
        ['Paris', 48.352062, 2.351325, '14', 'France'],
        ['Barcelona', 40.857227, 2.169812, '115', 'Spain'],
        ['Madrid', 39.953276, -3.710737, '8', 'Spain'],
        ['Valencia', 38.928138, -0.305393, '12', 'Spain'],
        ['Nice', 43.711987, 7.213355, '32', 'Monaco']
      ]; 


      let allMarkers = []

      var marker;

      for (i = 0; i < locations.length; i++) {  
         marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon: 'img/marker.svg',
          optimized: false,
          title: locations[i][3],
          eventCity: locations[i][0], 
          eventCountry: locations[i][4],  
        });

        allMarkers.push(marker)

        google.maps.event.addListener(marker, 'click', function() { 
          const markerCity = this.eventCity;
          const markerCountry = this.eventCountry;
          mapFeedCity.textContent = markerCity;
          mapFeedCountry.textContent = markerCountry;
          mapCounter.textContent = this.title;
          checkCounterValue()
          allMarkers.forEach(function(item) {
            item.setIcon('img/marker.svg');
          });
          this.setIcon('img/marker-active.svg');
          document.getElementById('all-markers').classList.add('active')
        });


        google.maps.event.addListener(map, 'click', function() { 
          mapCounter.textContent = '0'; 
          checkCounterValue()
          allMarkers.forEach(function(item) {
            item.setIcon('img/marker.svg');
        });

        });
      }    
      





      const styles = [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "stylers": [
            {
              "color": "#737373"
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.icon",
          "stylers": [
            {
              "color": "#333333"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#999999"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "color": "#333333"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "stylers": [
            {
              "color": "#2a2a2a"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "stylers": [
            {
              "color": "#2a2a2a"
            }
          ]
        },
        {
          "featureType": "water",
          "stylers": [
            {
              "color": "#1d1d1d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]

    

    // enable custom styles
    map.setOptions({styles: styles});




}



initMap()


}




}); // end scripts