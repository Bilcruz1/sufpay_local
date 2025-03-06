import React from 'react';
import { Box } from '@mui/material';
import Select, { SingleValue, StylesConfig } from 'react-select';
import CountryFlag from 'react-country-flag';

interface CountryOption {
	value: string;
	label: string;
	flag: string;
}

const countries: CountryOption[] = [
	{ value: 'NG', label: 'Nigeria', flag: 'NG' },
	{ value: 'US', label: 'United States', flag: 'US' },
	{ value: 'GB', label: 'United Kingdom', flag: 'GB' },
	{ value: 'IN', label: 'India', flag: 'IN' },
	{ value: 'FR', label: 'France', flag: 'FR' },
];

const customStyles: StylesConfig<CountryOption, false> = {
	control: base => ({
		...base,
		borderColor: '#D0D5DD',
		boxShadow: 'none',
		width: '100%',
		'&:hover': {
			borderColor: '#D0D5DD',
		},
		'&:focus': {
			borderColor: '#D0D5DD',
		},
		padding: '0.5rem 0.75rem',
		borderRadius: '0.5rem',
		minHeight: '2.75rem',
		display: 'flex',
		justifyContent: 'space-between',
	}),
	option: (base, { isFocused, isSelected }) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		padding: '0.5rem 0.75rem',
		backgroundColor: isSelected ? '#AAC645' : isFocused ? '#aeb39a' : 'white',
		color: isSelected ? 'white' : '#344054',
		':active': {
			backgroundColor: '#2ECC71',
		},
	}),
	singleValue: base => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		color: '#101828',
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
	dropdownIndicator: base => ({
		...base,
		color: '#98A2B3',
		'&:hover': {
			color: '#98A2B3',
		},
		alignSelf: 'flex-end',
	}),
};

// Function to format the options with country flag and name
const formatOptionLabel = ({ label, flag }: CountryOption) => (
	<div style={{ display: 'flex', alignItems: 'center' }}>
		<CountryFlag
			countryCode={flag}
			style={{ marginRight: 10, width: 20, height: 15 }}
			svg
		/>
		{label}
	</div>
);

export default function CountryFlagSelector() {
	// Handle selected option (if needed)
	const handleSelectChange = (selected: SingleValue<CountryOption>) => {
		console.log('Selected Country:', selected?.label);
	};

	return (
		<Box
			sx={{
				width: '100%',
				fontSize: '1rem',
				color: '#101828',
				fontWeight: '500',
			}}
		>
			<Select
				styles={customStyles}
				options={countries}
				formatOptionLabel={formatOptionLabel}
				defaultValue={countries[0]} // Default to Nigeria
				onChange={handleSelectChange}
			/>
		</Box>
	);
}
