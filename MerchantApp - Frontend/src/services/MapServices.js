    /**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && addressArray[ i ].types.includes('administrative_area_level_2') ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};
    /**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getPostalCode = ( addressArray ) => {
		let postalCode = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'postal_code' === addressArray[ i ].types[0] ) {
				postalCode = addressArray[ i ].long_name;
				return postalCode;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getArea = ( addressArray ) => {
		//const filteredStrings = ["sublocality_level_1","locality"]
		const filteredStrings = ["sublocality_level_1"]
		let area = '';
		for( let i = 0; i < filteredStrings.length; i++ ) {
			
				for ( let j = 0; j < addressArray.length; j++ ) {

					if ( addressArray[ j ].types[0] && addressArray[ j ].types.includes(filteredStrings[i])  ) {
						area += ", "+addressArray[ j ].long_name;
						
					}
				}
			
		}
		return area.replace(/^,/, '');
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getState = ( addressArray ) => {
		let state = '';
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && addressArray[ i ].types.includes('administrative_area_level_1') ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
    };
	
	/**
	 * Get the country
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getCountry = ( addressArray ) => {
		let country = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && addressArray[ i ].types.includes('country') ) {
					country = addressArray[ i ].long_name;
					return country;
				}
			}
		}
    };
	/**
	 * Get the AddressLine
	 *
	 * @param addressArray
	 * @return {string}
	 */
	const getAddressLine = ( addressArray ) => {
		let addressLine = '';
		const filteredStrings = ["street_number","route","sublocality_level_3","sublocality_level_2","premise"]

		for( let x = 0; x < filteredStrings.length; x++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && addressArray[ i ].types.includes(filteredStrings[x])) {
					addressLine += ", "+addressArray[ i ].long_name;
					
				}
			}
		}
		
		return addressLine.replace(/^,/, '');
    };
 
    
    export default {
        getArea,
        getCity,
        getState,
		getPostalCode,
		getCountry,
		getAddressLine
    }