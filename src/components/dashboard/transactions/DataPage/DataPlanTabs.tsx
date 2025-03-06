import React, { useState } from 'react';
import { Tabs, Tab, Box, Grid } from '@mui/material';
import DataPlanCard from './DataPlanCard';

const tabLabels = [
	'Regular',
	'Daily',
	'Weekly',
	// 'Monthly',
	// '2 Months',
	// '3 Months',
	// '6 Months',
];

const dataPlansByTab = {
	Regular: [
		{ data: '200GB', validity: '10 Days', price: '₦12,000' },
		{ data: '300GB', validity: '15 Days', price: '₦15,000' },
		{ data: '500GB', validity: '30 Days', price: '₦20,000' },
		{ data: '500GB', validity: '30 Days', price: '₦20,000' },
		{ data: '500GB', validity: '30 Days', price: '₦20,000' },
	],
	Daily: [
		{ data: '50MB', validity: '1 Day', price: '₦100' },
		{ data: '100MB', validity: '1 Day', price: '₦200' },
	],
	Weekly: [
		{ data: '500MB', validity: '7 Days', price: '₦500' },
		{ data: '1GB', validity: '7 Days', price: '₦1,000' },
	],
	Monthly: [
		{ data: '1.5GB', validity: '30 Days', price: '₦3,000' },
		{ data: '5GB', validity: '30 Days', price: '₦7,000' },
	],
	'2 Months': [
		{ data: '10GB', validity: '60 Days', price: '₦12,000' },
		{ data: '20GB', validity: '60 Days', price: '₦18,000' },
	],
	'3 Months': [
		{ data: '30GB', validity: '90 Days', price: '₦25,000' },
		{ data: '50GB', validity: '90 Days', price: '₦40,000' },
	],
	'6 Months': [
		{ data: '100GB', validity: '180 Days', price: '₦60,000' },
		{ data: '200GB', validity: '180 Days', price: '₦100,000' },
	],
};

interface DataPlansTabsProps {
	onSelectData: (data: string, price: string) => void;
}

const DataPlansTabs: React.FC<DataPlansTabsProps> = ({ onSelectData }) => {
	const [activeTab, setActiveTab] = useState(0);
	const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
		null
	);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setSelectedCardIndex(null); // Reset selected card when switching tabs
	};

	const handleCardClick = (index: number, data: string, price: string) => {
		setSelectedCardIndex(index); // Update the selected card index
		onSelectData(data, price); // Trigger callback with selected data and price
	};

	const selectedTab = tabLabels[activeTab] as keyof typeof dataPlansByTab;
	const dataPlans = dataPlansByTab[selectedTab];

	return (
		<Box sx={{ width: '100%', marginTop: '2rem' }}>
			{/* Tabs */}
			<Tabs
				value={activeTab}
				onChange={handleTabChange}
				sx={{
					mb: 3,
				}}
				textColor="primary"
				TabIndicatorProps={{ style: { backgroundColor: '#8bc34a' } }}
			>
				{tabLabels.map((label, index) => (
					<Tab
						key={index}
						label={label}
						sx={{
							textTransform: 'none',
							color: activeTab === index ? '#8bc34a' : 'inherit',
							fontWeight: activeTab === index ? 'bold' : 'normal',
						}}
					/>
				))}
			</Tabs>

			{/* Data Plan Cards */}
			<Grid
				container
				spacing={3}
			>
				{dataPlans.map((plan, index) => (
					<Grid
						item
						xs={4}
						sm={4}
						md={2}
						lg={2}
						xl={1}
						key={index}
					>
						<DataPlanCard
							data={plan.data}
							validity={plan.validity}
							price={plan.price}
							isSelected={selectedCardIndex === index}
							onClick={() => handleCardClick(index, plan.data, plan.price)}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default DataPlansTabs;
