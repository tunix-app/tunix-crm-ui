import React from 'react';
interface ProgressChartProps {
  metric?: string;
}
const ProgressChart = ({
  metric
}: ProgressChartProps) => {
  // This is a placeholder for a real chart
  // In a real implementation, you would use a library like recharts
  return <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-full relative">
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map(line => <div key={line} className="absolute left-0 right-0 border-t border-gray-200" style={{
        top: `${line * 25}%`
      }} />)}
        {/* Sample data visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-3/4 flex items-end">
          {Array.from({
          length: 12
        }, (_, i) => {
          // Generate some random data that trends upward
          const baseHeight = 30 + Math.floor(i * 3);
          const randomVariation = Math.floor(Math.random() * 15);
          const height = baseHeight + randomVariation;
          return <div key={i} className="flex-1 mx-px">
                  <div className="bg-blue-500 rounded-t-sm" style={{
              height: `${height}%`
            }} />
                </div>;
        })}
        </div>
        {/* Overlay a line chart */}
        <svg className="absolute inset-0 w-full h-full" style={{
        top: '10%',
        height: '65%'
      }}>
          <polyline points="
              0,100
              8.33,85
              16.66,88
              25,80
              33.33,75
              41.66,78
              50,65
              58.33,60
              66.66,55
              75,50
              83.33,45
              91.66,40
              100,35
            " fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
          {/* Data points */}
          {[0, 8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66, 100].map((point, i) => <circle key={i} cx={`${point}%`} cy={[100, 85, 88, 80, 75, 78, 65, 60, 55, 50, 45, 40, 35][i]} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1" />)}
        </svg>
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between w-full mt-2">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => <div key={month} className="text-xs text-gray-500">
            {month}
          </div>)}
      </div>
    </div>;
};
export default ProgressChart;