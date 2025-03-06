import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import icon from '../../../assets/icons/analytics.png';
import DashboardDateDropDown from './DashboardDateDropDown';

// Data type for Pie chart data
interface DataEntry {
	name: string;
	value: number;
}

const data: DataEntry[] = [
	{ name: 'Event and ticket', value: 20000 },
	{ name: 'Utility', value: 20000 },
	{ name: 'Airtime', value: 15000 },
	{ name: 'Transportation', value: 12000 },
	{ name: 'Cable and TV', value: 9000 },
];

const COLORS = ['#AAC645', '#758A2A', '#91DB59', '#90BE6D', '#BDD663'];

// Calculate total sum of values
const total = data.reduce((sum, entry) => sum + entry.value, 0);

// Type for label function props
interface LabelProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
}

// Custom label function to render percentages inside the slices
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: LabelProps) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
	const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central"
			fontSize="0.75rem"
			fontWeight="bold"
		>
			{`${(percent * 100).toFixed(1)}%`}
		</text>
	);
};

const DonutChart = () => {
	return (
		<Box
			sx={{
				border: '1px solid #66666628',
				borderRadius: '5px',
				height: '100%',
				width: '100%',
				padding: '1rem',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '0.5rem',
					paddingTop: '0.94rem',
				}}
			>
				{/* Typography */}
				<Typography
					variant="h6"
					sx={{ fontWeight: 'medium', color: '#353535' }}
				>
					Payment Analytics
				</Typography>
				{/* Image */}
				<img
					src={icon}
					alt="icon"
					style={{
						width: '2.88rem',
						height: '2.25rem',
					}}
				/>
			</Box>
			<Box sx={{ marginTop: '1rem' }}>
				<DashboardDateDropDown />
			</Box>

			{/* Donut Chart */}

			<ResponsiveContainer
				width="100%"
				height={300}
				style={{ marginTop: '5rem' }}
			>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={150}
						fill="#8884d8"
						paddingAngle={0}
						dataKey="value"
						labelLine={false}
						label={renderCustomizedLabel}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>

			{/* Labels below the chart */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					marginX: 'auto',
					marginTop: '1rem',
				}}
			>
				{data.map((entry, index) => (
					<Box
						key={index}
						sx={{
							textAlign: 'center',
							display: 'flex',
							gap: '1rem',
							paddingY: '1.5rem',
						}}
					>
						<Box
							sx={{
								width: '0.6rem',
								height: '0.6rem',
								backgroundColor: COLORS[index],
								display: 'inline-block',
								borderRadius: '50%',
								marginBottom: '0.5rem',
							}}
						></Box>
						<Box
							sx={{
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								gap: '1.5rem',
								width: '100%',
								marginTop: '-0.7rem',
							}}
						>
							<Typography
								variant="body2"
								sx={{
									fontWeight: 'medium',
									flexGrow: 1,
									textAlign: 'left',
									color: '#636559',
									fontSize: '1.25rem',
								}}
							>
								{entry.name}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									textAlign: 'right',
									color: '#353535',
									fontWeight: 'medium',
									fontSize: '1.25rem',
								}}
							>
								{entry.value}
							</Typography>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default DonutChart;
