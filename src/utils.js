const nsSorter = ( data ) => {
	const ordered = Object.keys( data ).sort().reduce(
		( obj, key ) => {
			obj[ key ] = data[ key ];
			return obj;
		},
		{}
	);

	return ordered;
};

export { nsSorter };
