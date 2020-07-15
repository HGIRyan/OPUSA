import { useState } from 'react';
// iv is InitialValue

export const useBusInfo = (iv) => {
	const [val, setVal] = useState(iv);

	return [
		val,
		(e) => {
			console.log(e.target);
			setVal({
				...val,
				[e.target.name]: e.target.value,
			});
		},
	];
};
