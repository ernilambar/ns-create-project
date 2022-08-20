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

const nsMergeObjects = ( first, second ) => {
	return { ...first, ...second };
};

export { nsSorter, nsMergeObjects };
