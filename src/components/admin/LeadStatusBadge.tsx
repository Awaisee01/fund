
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'default' | 'lg';
}

export const LeadStatusBadge = ({ status, size = 'default' }: LeadStatusBadgeProps) => {
  const getStatusConfig = (status: LeadStatus) => {
    const configs = {
      new: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        label: 'New',
        priority: 1 
      },
      contacted: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        label: 'Contacted',
        priority: 2 
      },
      qualified: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        label: 'Qualified',
        priority: 3 
      },
      converted: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Converted',
        priority: 5 
      },
      closed: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        label: 'Closed',
        priority: 4 
      },
      lost: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        label: 'Lost',
        priority: 0 
      }
    };
    
    return configs[status];
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} font-medium`}
      size={size}
    >
      {config.label}
    </Badge>
  );
};
