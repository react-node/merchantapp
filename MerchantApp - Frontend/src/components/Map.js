import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { GOOGLE_MAP_API_KEY } from '../../src/utils/config';
import '../views/store/AddStoreView/customStyle.css'
import MapServices from '../services/MapServices'
Geocode.setApiKey( GOOGLE_MAP_API_KEY );
Geocode.enableDebug();

class Map extends Component{

	constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: "",
				lng: ""
			},
			markerPosition: {
				lat: "",
				lng: ""
			}
		}
		
	}
	showCurrentLocation = ()=>{
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(
			position => {
			  console.log(position.coords);
			  this.setState({
				  ...this.state,
				mapPosition: {
				
				  lat: position.coords.latitude,
				  lng: position.coords.longitude
				},
				markerPosition:{
					lat: position.coords.latitude,
				  	lng: position.coords.longitude
				}
				
			  })
			  Geocode.fromLatLng( position.coords.latitude , position.coords.longitude ).then(
				response => {
					const address = response.results[0].formatted_address,
						  addressArray =  response.results[0].address_components,
						  city = MapServices.getCity( addressArray ),
						  area = MapServices.getArea( addressArray ),
						  state = MapServices.getState( addressArray );
	
					console.log( 'city', city, area, state );
	
					this.setState( {
						address: ( address ) ? address : '',
						area: ( area ) ? area : '',
						city: ( city ) ? city : '',
						state: ( state ) ? state : '',
					} )
				},
				error => {
					console.error( error );
				}
			);
			}
		  )
		} else {
		  console.log("error")
		}
		
	  };
	 
	/**
	 * Get the current address from the default map position and set those values in the state
	 */
	componentDidMount() {
		this.showCurrentLocation()
	};
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
	}
	
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = ( event ) => {
console.log("info window closed")
	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();
			this.props.updateGeoLocation(newLat,newLng)
		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = MapServices.getCity( addressArray ),
				      area = MapServices.getArea( addressArray ),
				      state = MapServices.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				} )
			},
			error => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		const address = place.formatted_address,
		      addressArray =  place.address_components,
		      city = MapServices.getCity( addressArray ),
		      area = MapServices.getArea( addressArray ),
		      state = MapServices.getState( addressArray ),
		      latValue = place.geometry.location.lat(),
		      lngValue = place.geometry.location.lng();
		// Set these values in the state.
		this.setState({
			address: ( address ) ? address : '',
			area: ( area ) ? area : '',
			city: ( city ) ? city : '',
			state: ( state ) ? state : '',
			markerPosition: {
				lat: latValue,
				lng: lngValue
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue
			},
		})
	};
	

	render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap
					           defaultZoom={ this.props.zoom }
					           defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
						
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								
							}}
							onPlaceSelected={ this.onPlaceSelected }
							types={[]}
						/>
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker 
						        name={'Dolores park'}
						        draggable={true}
						        onDragEnd={ this.onMarkerDragEnd }
						        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						
					</GoogleMap>
				)
			)
		);
		let map;
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<AsyncMap
					googleMapURL={`http://maps.google.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`}
					
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}
}
export default Map
