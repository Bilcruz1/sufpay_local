import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface DataPlanCardProps {
	data: string;
	validity: string;
	price: string;
	onClick: () => void;
	isSelected: boolean;
}

const DataPlanCard: React.FC<DataPlanCardProps> = ({
	data,
	validity,
	price,
	onClick,
	isSelected,
}) => {
	return (
		<Card
			onClick={onClick}
			sx={{
				cursor: 'pointer',
				backgroundColor: '#F7F9FB',
				boxShadow: 'none',
				width: '100%',
				minHeight: '100px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				padding: '20px',
				outline: isSelected ? '1px solid #AAC645' : 'none',
			}}
		>
			<CardContent>
				<Typography
					variant="h6"
					sx={{ fontSize: '1rem', textAlign: 'center' }}
				>
					{data}
				</Typography>
				<Typography
					sx={{
						fontSize: '0.88rem',
						fontWeight: 'medium',
						paddingTop: '0.31rem',
						textAlign: 'center',
					}}
				>
					{validity}
				</Typography>
				<Typography
					sx={{
						fontSize: '1rem',
						fontWeight: '600',
						paddingTop: '1rem',
						textAlign: 'center',
					}}
				>
					{price}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default DataPlanCard;
