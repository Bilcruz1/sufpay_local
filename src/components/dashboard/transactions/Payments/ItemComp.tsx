import React from 'react';
import { Box, Typography } from '@mui/material';

function ItemComp({ items }: any) {
	console.log(items, 'items');
	return (
		<Box
			sx={{
				borderRadius: '8px',
				display: 'grid',
				gap: '2.2rem',
				marginTop: '1.25rem',
			}}
		>
			{items.map((item: any, index: number) => {
				return (
					<Box
						key={index}
						sx={{
							display: 'flex',
							gap: { xs: '0.5rem', md: '1rem', lg: '2rem' },
						}}
					>
						<Typography sx={{ minWidth: '150px' }}>{item.name}:</Typography>
						<Typography sx={{ textAlign: 'left' }}>{item.value}</Typography>
					</Box>
				);
			})}
		</Box>
	);
}

export default ItemComp;
