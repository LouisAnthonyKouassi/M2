import React, {Component} from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
//Google Map API KEY
const API_KEY = "AIzaSyDUa5RmGreVSTogjppcc8y9IR69jwtkeMo";

class App extends Component {

    state = {
        restaurants: []
    }

    //Au chargement de l'application on appelle la fonction qui permet de récupérer les restaurants
    componentDidMount() {
        this.getRestaurants();
    }

    //On récupère la requête mongodb pour l'affichage des restaurants
    getRestaurants = () => {
        fetch('http://localhost:5000/restau')
            .then(response => response.json())
            .then(response => this.setState({restaurants: response.data}))
            .catch(err => console.error(err))
    }

    /*Mapping du tableau restaurants afin de récupérer les coordonnées des markers et de les afficher sur la map
    On créer un marker pour chaque latitude/longitude récupérées grâce à la variable maps
    On attribue le marker à la map, et on affiche une description quand on passe le curseur sur un marker
    Lorsqu'on clique sur un marker, on affiche une alerte avec les informations de celui-ci*/
    renderMarkers(map, maps) {
        this.state.restaurants.map((value, i) => {
            let longitude = value['coord']['coordinates'][0];
            let latitude = value['coord']['coordinates'][1];
            let marker = new maps.Marker({
                position: {lat: latitude, lng: longitude},
                map,
                title: value['name']+'\n'+value['address']
            });
            marker.addListener("click", () => {
                //alert(marker.title)
                window.open(value['details'])
            });
        })
    }

    /*Affichage de la map avec les markers
    Nécessite une clé google permettant de charger la map, obtenue sur Google Maps Platform
    yesIWantToUseGoogleMapApiInternals permet d'utiliser l'API Google Maps et d'obtenir map et maps
    map permet de récupérer la carte de google
    maps permet d'utiliser tous les éléments de Maps Javascript API, dont l'ajout de markers
    https://developers.google.com/maps/documentation/javascript*/
    render() {
        return(
            <div style={{'width':"auto",'height':1000}}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: API_KEY}}
                    defaultZoom={13}
                    defaultCenter={{
                        lat: 48.856614,
                        lng: 2.3522219
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
                >
                </GoogleMapReact>
            </div>
        );
    }
}

export default App;