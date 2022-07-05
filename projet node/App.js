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

    //Mapping du tableau restaurants afin d'afficher tous les markers avec leurs informations
    renderMarkers(map, maps) {
        this.state.restaurants.map((value, i) => {
            let longitude = value['coord']['coordinates'][0];
            let latitude = value['coord']['coordinates'][1];
            let marker = new maps.Marker({
                position: {lat: latitude, lng: longitude},
                map,
                title: value['name']+'\n'+value['address']
            });
        })
    }

    //Affichage de la map avec calcul de la position des markers au chargement
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