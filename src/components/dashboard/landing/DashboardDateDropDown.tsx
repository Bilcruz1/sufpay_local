import React, { useState } from 'react';
import {
	Box,
	Select,
	MenuItem,
	Typography,
	SelectChangeEvent,
} from '@mui/material';
import { DateRange } from '@mui/icons-material'; // Calendar icon
import money_search from '../../../assets/icons/money_search.svg';
// Define months and years arrays
const months: string[] = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const years: number[] = [2022, 2023, 2024]; // Add more years as needed

const DashboardDateDropDown: React.FC = () => {
	const [selectedMonth, setSelectedMonth] = useState<string>('March');
	const [selectedYear, setSelectedYear] = useState<number>(2024);

	// Handle month change
	const handleMonthChange = (event: SelectChangeEvent<string>) => {
		setSelectedMonth(event.target.value);
	};

	// Handle year change
	const handleYearChange = (event: SelectChangeEvent<number>) => {
		setSelectedYear(Number(event.target.value));
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			gap="8px"
		>
			{/* Calendar Icon */}
			{/* <DateRange style={{ color: '#6E6E6E' }} /> */}
			<Box>
				<img
					src={money_search}
					alt="icon"
					style={{
						width: '1.5rem',
						height: '1.5rem',
					}}
				/>
			</Box>

			{/* Month and Year Dropdown */}
			<Typography
				variant="body1"
				color="textSecondary"
			>
				{/* Month Selector */}
				<Select
					value={selectedMonth}
					onChange={handleMonthChange}
					displayEmpty
					style={{ marginRight: '8px', color: '#6E6E6E' }}
					variant="standard"
				>
					{months.map(month => (
						<MenuItem
							key={month}
							value={month}
						>
							{month}
						</MenuItem>
					))}
				</Select>
				,{/* Year Selector */}
				<Select
					value={selectedYear} // No need to convert to string here, keep as number
					onChange={handleYearChange}
					displayEmpty
					style={{ marginLeft: '8px', color: '#6E6E6E' }}
					variant="standard"
				>
					{years.map(year => (
						<MenuItem
							key={year}
							value={year}
						>
							{year}
						</MenuItem>
					))}
				</Select>
			</Typography>
		</Box>
	);
};

export default DashboardDateDropDown;
