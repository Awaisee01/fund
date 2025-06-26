
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, MousePointer, TrendingUp, Globe, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  totalEnquiries: number;
  conversionRate: number;
  topTrafficSources: Array<{ source: string; count: number }>;
  recentEnquiries: Array<{
    id: string;
    form_type: string;
    created_at: string;
    utm_source?: string;
    utm_medium?: string;
  }>;
  dailyStats: Array<{
    date: string;
    visitors: number;
    enquiries: number;
  }>;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      // Get total visitors (unique visitor_ids)
      const { data: visitorsData } = await supabase
        .from('page_visits')
        .select('visitor_id')
        .gte('created_at', daysAgo.toISOString());

      const uniqueVisitors = new Set(visitorsData?.map(v => v.visitor_id) || []);
      const totalVisitors = uniqueVisitors.size;

      // Get total page views
      const { count: totalPageViews } = await supabase
        .from('page_visits')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', daysAgo.toISOString());

      // Get total enquiries
      const { count: totalEnquiries } = await supabase
        .from('enquiry_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', daysAgo.toISOString());

      // Calculate conversion rate
      const conversionRate = totalVisitors > 0 ? ((totalEnquiries || 0) / totalVisitors) * 100 : 0;

      // Get top traffic sources
      const { data: trafficSourcesData } = await supabase
        .from('page_visits')
        .select('utm_source, referrer')
        .gte('created_at', daysAgo.toISOString());

      const sourceCounts: Record<string, number> = {};
      trafficSourcesData?.forEach(visit => {
        const source = visit.utm_source || 
          (visit.referrer ? new URL(visit.referrer).hostname : 'Direct');
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      const topTrafficSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get recent enquiries
      const { data: recentEnquiries } = await supabase
        .from('enquiry_submissions')
        .select('id, form_type, created_at, utm_source, utm_medium')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      // Get daily stats for the chart
      const dailyStats = [];
      for (let i = parseInt(dateRange) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const { data: dayVisitors } = await supabase
          .from('page_visits')
          .select('visitor_id')
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString());

        const { count: dayEnquiries } = await supabase
          .from('enquiry_submissions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString());

        const uniqueDayVisitors = new Set(dayVisitors?.map(v => v.visitor_id) || []);

        dailyStats.push({
          date: dayStart.toISOString().split('T')[0],
          visitors: uniqueDayVisitors.size,
          enquiries: dayEnquiries || 0,
        });
      }

      setAnalytics({
        totalVisitors,
        totalPageViews: totalPageViews || 0,
        totalEnquiries: totalEnquiries || 0,
        conversionRate,
        topTrafficSources,
        recentEnquiries: recentEnquiries || [],
        dailyStats,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">Unique visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEnquiries}</div>
            <p className="text-xs text-muted-foreground">Form submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Visitors to enquiries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topTrafficSources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{source.source}</span>
                  <Badge variant="secondary">{source.count} visits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.dailyStats.slice(-5).map((day, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{day.date}</span>
                  <div className="text-sm text-muted-foreground">
                    {day.visitors} visitors, {day.enquiries} enquiries
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Enquiries</CardTitle>
          <CardDescription>Latest form submissions with traffic source</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Traffic Source</TableHead>
                <TableHead>Medium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-medium capitalize">
                    {enquiry.form_type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {enquiry.utm_source || 'Direct'}
                  </TableCell>
                  <TableCell>
                    {enquiry.utm_medium || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
