const ncpSorter = ( unordered, sortArrays = false ) => {
	if ( ! unordered || typeof unordered !== 'object' ) {
		return unordered;
	}

	if ( Array.isArray( unordered ) ) {
		const newArr = unordered.map( ( item ) => ncpSorter( item, sortArrays ) );
		if ( sortArrays ) {
			newArr.sort();
		}
		return newArr;
	}

	const ordered = {};
	Object.keys( unordered )
		.sort()
		.forEach( ( key ) => {
			ordered[ key ] = ncpSorter( unordered[ key ], sortArrays );
		} );
	return ordered;
};

const ncpMergeObjects = ( first, second ) => {
	return { ...first, ...second };
};

export { ncpSorter, ncpMergeObjects };
