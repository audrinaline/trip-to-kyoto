import React, { Component } from 'react'
import './App.css'
//work asynchronous with foursquare fetch
import axios from 'axios'
import SideBar from './SideBar'
import shrine from "./itsukushima-shrine.png"

//error handling
//handle authentication errors
window.gm_authFailure = () => {
  alert("Google Map Can't Be Loaded : InvalidKeyMapError");
};



class App extends Component {
  state = {
    venues: [],
    infoWindow: [],
    markers: [],
    q: ''
  };

  componentDidMount() {
    this.getVenues()
  };

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDVxNqhSqece78-IjJWtBgd6H1Gbwr3-7Q&callback=initMap")

    window.initMap = this.initMap
  };

  getQuery = q => {
    this.setState({ q });
      if(q.trim() === ""){
    this.state.markers.forEach(marker => marker.setVisible(true))
    return true;}
    else {
      let venues = this.state.venues.filter(venue => {
          return venue.venue.name.toLowerCase().indexOf(q.toLowerCase()) > -1
      })
      venues.forEach(item => this.state.markers.filter(marker => marker.id !== item.venue.name).map(falseMarker => falseMarker.setVisible(false)))
      venues.forEach(item => this.state.markers.filter(marker => marker.id === item.venue.name).map(trueMarker => trueMarker.setVisible(true)))
  }
    
  }; 

//saved to state
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "YCCXYBLK3BKCWNVC4VI3GFURB0MQ1VHCHU4UVOIPI0E1HJ5E",
      client_secret: "VQNASRWT4NGCVUPYI3D1OZFTZ4GDUG0O4OINRXO2RHS03ZG1",
      near: "Kyoto, Japan",
      v: "20181809"
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      //if succeed
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items.filter(
            theVenues => theVenues.venue.categories[0].name === "Shrine")
        }, 
        this.renderMap())
        //move this.renderMap() here so it will render after it render venues so markers will show
      })
      //handle errors
      .catch(er => {
        alert("Something went wrong" + er)
      })
    };

//show markers
  showMarker = ( marker, contentString ) => {
    this.state.infoWindow.setContent(contentString);
    this.state.infoWindow.open(this.state.map, marker );

    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1500);
  }


//create map canvas
  initMap = () => {

    // Create A Map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.96714, lng: 135.77267}, //kyoto area 
      zoom: 10.5
    });

    //create infoWindow
    //outside of markers so only one infoWindow shows at a time
    //https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple
    const infoWindow = new window.google.maps.InfoWindow();
      this.setState({ map, infoWindow })

    let markers = this.state.venues.map(theVenues => {
      const contentString = `<br>Name: ${theVenues.venue.name}</br>
          <br>Location: ${theVenues.venue.location.formattedAddress}</br>`;

      //https://developers.google.com/maps/documentation/javascript/markers
      //create marker
      const marker = new window.google.maps.Marker({
        //loop over arrays of venues to make dynamics positions
        position: {
          lat: theVenues.venue.location.lat, 
          lng: theVenues.venue.location.lng,
        },
        map: map,
        title: theVenues.venue.name,
        address: theVenues.venue.location.formattedAddress,
        id: theVenues.venue.name,
        animation: window.google.maps.Animation.DROP,
        icon: shrine
        })

        //add marker eventListener
        marker.addListener('click', () => {
          this.showMarker( marker, contentString )

          //change content in each click
          infoWindow.setContent(contentString)

          //open infoWindow
          infoWindow.open(map, marker)
          map.setZoom(14)
          map.setCenter(marker.getPosition())
        })
        return marker;
      })
    this.setState({ markers })
  };

  render() {
    return (
      <main>
        <div id="map" role="application" aria-label="map" />

        <SideBar
          venues={this.state.venues}
          q={this.state.q}
          markers={this.state.markers}
          getQuery={this.getQuery}
          showMarker={this.showMarker}
        />

      </main>
    )
  }
};

function loadScript(url) {
  //first script tag
  const index  = window.document.getElementsByTagName("script")[0];
  //create script tag
  const script = window.document.createElement("script");
  //locate source
  script.src = url
  script.async = true
  script.defer = true
//handle google map data
  script.onerror = () => {
    window.alert("Google Maps failed to load data!")
    console.log(script)
  };
  index.parentNode.insertBefore(script, index)
};

export default App;