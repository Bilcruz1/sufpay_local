import React from 'react';
import { DialogContent, Box } from '@mui/material';
import Loading from '../Loading';

export default function Processing() {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				overflow: 'hidden',
			}}
		>
			<DialogContent
				sx={{
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					padding: 0,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						overflow: 'hidden',
					}}
				>
					<Loading isLoading={true} />
				</Box>
			</DialogContent>
		</Box>
	);
}
