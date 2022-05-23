import { number } from 'prop-types';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const logo = (
	<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
		<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
			<g id="Reactive-Maps-Redesign-Page" transform="translate(-50.000000, -37.000000)">
				<g id="Navbar">
					<g id="Reactive-Icon" transform="translate(50.000000, 37.000000)">
						<rect id="Rectangle-25" fill="#FF2A6F" x="0" y="0" width="32" height="32" rx="2" />
						<g id="log" transform="translate(6.080000, 6.080000)" fill="#FFFFFF">
							<path d="M5.74493501,-0.000123311803 L5.74493501,1.23299472 L6.45867861,1.23299472 L6.45867861,7.53854375 L0,20.16 L20.16,20.16 L13.8405219,7.54409278 L13.8405219,1.23299472 L14.595579,1.23299472 L14.595579,-0.000123311803 L5.74493501,-0.000123311803 Z M7.69932454,7.83412214 L7.69932454,1.23299472 L12.5998759,1.23299472 L12.5998759,2.71285966 L11.5759709,2.71285966 L11.5759709,3.45260716 L12.5998759,3.45260716 L12.5998759,4.93247211 L11.5759709,4.93247211 L11.5759709,5.67221961 L12.5998759,5.67221961 L12.5998759,7.15208456 L11.5759709,7.15208456 L11.5759709,7.89183206 L12.628783,7.89183206 L13.3700689,9.37169701 L11.5729933,9.37169701 L11.5729933,10.1114445 L13.7406499,10.1114445 L18.1562328,18.926882 L2.02287318,18.926882 L7.69932454,7.83412214 Z" id="Page-1" />
						</g>
						<polygon id="Path-5" fill="#FFFFFF" points="11.371875 18.7366071 20.9214286 17.0910714 24.9058036 25.3084821 7.53883929 25.3084821" />
					</g>
				</g>
			</g>
		</g>
	</svg>
);

export const Star = ({ size = 20 }) => (
	<svg
		version="1.1"
		id="Capa_1"
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width={size}
		height={size}
		viewBox="0 0 47.94 47.94"
	>
		<path
			fill="#ED8A19"
			d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	C22.602,0.567,25.338,0.567,26.285,2.486z"
		/>
	</svg>
);

Star.propTypes = {
	size: number,
};
