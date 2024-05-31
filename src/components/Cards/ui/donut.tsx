import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

interface Props {
  data: Record<string, number>;
}

const DonutChart: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div>loading data...</div>;
  }

  const getColor = (index: number) => {
    const colors = ['#FF6384', '#FFCE56', '#8ADE7A'];
    return colors[index % colors.length];
  };

  const chartData = Object.values(data).map((value, index) => ({
    value,
    color: getColor(index),
  }));

  return (
    <PieChart
      data={chartData}
      labelPosition={80}
      lineWidth={40}
      radius={40}
      paddingAngle={5}
      animate={true}
      animationEasing={'ease-in'}
      rounded={true}
      startAngle={100}
      label={({ dataEntry }) => Math.round(dataEntry.percentage ?? 0) + '%'}
      labelStyle={{
        fontSize: '0.3rem',
        fontWeight: '500',
        filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))',
      }}
    />
  );
};

export default DonutChart;
