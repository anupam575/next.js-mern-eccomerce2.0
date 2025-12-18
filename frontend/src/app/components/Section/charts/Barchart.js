import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';

// Default triangle shape
const getPath = (x, y, width, height) =>
  `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
   ${x + width / 2}, ${y}
   C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
   Z`;

const TriangleBar = ({ fill, x, y, width, height }) => (
  <path d={getPath(Number(x), Number(y), Number(width), Number(height))} stroke="none" fill={fill} />
);

export default function CustomShapeBarChart({
  data,
  barColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'],
  shape = TriangleBar, // default shape
  dataKey = 'value',
}) {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      data={data}
      margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Bar dataKey={dataKey} fill="#8884d8" shape={shape} label={{ position: 'top' }}>
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
        ))}
      </Bar>
    </BarChart>
  );
}
