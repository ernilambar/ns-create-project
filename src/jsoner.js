import mergician from 'mergician';

export default class Jsoner {
	jsonContent;

	constructor( jsonContent ) {
		this.jsonContent = jsonContent;
	}

	add( obj ) {
		this.jsonContent = mergician( this.jsonContent, obj );
	}

	content() {
		return this.jsonContent;
	}

	sort( key = '' ) {
		if ( key === '' ) {
			this.jsonContent = this.sorter( this.jsonContent );
		} else if ( this.jsonContent.hasOwnProperty( key ) ) {
			this.jsonContent[ key ] = this.sorter( this.jsonContent[ key ] );
		}
	}

	sorter( unordered, sortArrays = false ) {
		if ( ! unordered || typeof unordered !== 'object' ) {
			return unordered;
		}

		if ( Array.isArray( unordered ) ) {
			const newArr = unordered.map( ( item ) => this.sorter( item, sortArrays ) );
			if ( sortArrays ) {
				newArr.sort();
			}
			return newArr;
		}

		const ordered = {};
		Object.keys( unordered )
			.sort()
			.forEach( ( key ) => {
				ordered[ key ] = this.sorter( unordered[ key ], sortArrays );
			} );
		return ordered;
	}
}
