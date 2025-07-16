import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const TrafficAnalytics = () => {
  const [pageVisits, setPageVisits] = useState<any[]>([]);
  const [visitorSessions, setVisitorSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      // Fetch page visits
      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (visitsError) throw visitsError;

      // Fetch visitor sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      setPageVisits(visits || []);
      setVisitorSessions(sessions || []);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch traffic analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading traffic analytics...</div>;
  }

  // Page visits over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const visitsTimelineData = last30Days.map(date => {
    const count = pageVisits.filter(visit => 
      visit.created_at.split('T')[0] === date
    ).length;
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: count,
    };
  });

  // Page path distribution
  const pagePathData = pageVisits.reduce((acc, visit) => {
    const path = visit.page_path || 'Unknown';
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPages = Object.entries(pagePathData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([path, count]) => ({
      page: path.replace('/', '') || 'Home',
      visits: count,
    }));

  // Traffic sources
  const sourceData = pageVisits.reduce((acc, visit) => {
    const source = visit.utm_source || visit.referrer || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceData).map(([source, count]) => ({
    source: source && source.length > 20 ? source.substring(0, 20) + '...' : source,
    count,
  }));

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayVisits = pageVisits.filter(visit => visit.created_at.split('T')[0] === today).length;
  const totalVisits = pageVisits.length;
  const uniqueVisitors = new Set(pageVisits.map(visit => visit.visitor_id)).size;
  const totalSessions = visitorSessions.length;

  const chartConfig = {
    visits: { label: "Visits", color: "#8884d8" },
    source: { label: "Source", color: "#82ca9d" },
    page: { label: "Page", color: "#ffc658" },
  };

  return (
    <div className="space-y-6">
      {/* Traffic Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={topPages} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="visits" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Timeline</CardTitle>
          <CardDescription>Daily page visits over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={visitsTimelineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};