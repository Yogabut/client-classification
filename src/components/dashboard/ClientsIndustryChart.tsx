/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndustryData } from './useDashboard';

interface ClientsIndustryChartProps {
  industryData: IndustryData[];
  loading: boolean;
}

export const ClientsIndustryChart = ({ industryData, loading }: ClientsIndustryChartProps) => {
  const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#2DD4BF'];
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const data = industryData || [];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const industry = selectedIndustry 
    ? data.find(item => item.name === selectedIndustry) 
    : data[0];

  const handleSectorClick = (data: any) => {
    setSelectedIndustry(data.name);
  };

  const percentage = industry ? (industry.value / total) * 100 : 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Clients by Industry</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No client data available
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Donut Chart */}
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    onClick={handleSectorClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={selectedIndustry === entry.name ? '#000' : 'transparent'}
                        strokeWidth={selectedIndustry === entry.name ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Data Industry yang Dipilih */}
            <div className="flex-1 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: COLORS[data.findIndex(item => item.name === industry?.name) % COLORS.length] 
                    }}
                  ></div>
                  <h3 className="text-2xl font-bold">{industry?.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground text-lg">
                    {industry?.value} clients
                  </div>
                </div>

                {/* Progress Bar Minimalis */}
                <div className="w-full max-w-xs mx-auto">
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS[data.findIndex(item => item.name === industry?.name) % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Click any sector to view details
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};