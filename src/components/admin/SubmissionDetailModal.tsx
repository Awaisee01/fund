
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

interface SubmissionDetailModalProps {
  submission: FormSubmission;
  editingNotes: string;
  editingStatus: LeadStatus;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: LeadStatus) => void;
  onSave: () => void;
}

export const SubmissionDetailModal = ({
  submission,
  editingNotes,
  editingStatus,
  onClose,
  onNotesChange,
  onStatusChange,
  onSave
}: SubmissionDetailModalProps) => {
  const [propertyType, setPropertyType] = useState(submission.property_type || '');
  const [propertyOwnership, setPropertyOwnership] = useState(submission.property_ownership || '');
  const [currentHeatingSystem, setCurrentHeatingSystem] = useState(submission.current_heating_system || '');
  const [epcScore, setEpcScore] = useState(submission.epc_score || '');

  const formatServiceType = (serviceType: string) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType as keyof typeof formatted] || serviceType;
  };

  const getAddressFromFormData = () => {
    if (submission.form_data && typeof submission.form_data === 'object' && 'address' in submission.form_data) {
      return submission.form_data.address as string;
    }
    return null;
  };

  const handleSave = async () => {
    // TODO: Update submission with property details
    // This will need to be implemented in the parent component
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Lead Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-lg">Contact Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm">{submission.name}</p>
                  </div>
                  {submission.email && (
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{submission.email}</p>
                    </div>
                  )}
                  {submission.phone && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{submission.phone}</p>
                    </div>
                  )}
                  {getAddressFromFormData() && (
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm">{getAddressFromFormData()}</p>
                    </div>
                  )}
                  {submission.postcode && (
                    <div>
                      <Label className="text-sm font-medium">Post Code</Label>
                      <p className="text-sm">{submission.postcode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Service Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Service Type</Label>
                    <p className="text-sm">{formatServiceType(submission.service_type)}</p>
                  </div>
                </div>
              </div>

              {(submission.utm_source || submission.utm_medium || submission.utm_campaign) && (
                <div>
                  <h3 className="font-medium mb-3 text-lg">Marketing Attribution</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {submission.utm_source && (
                      <div>
                        <Label className="text-sm font-medium">Source</Label>
                        <p className="text-sm">{submission.utm_source}</p>
                      </div>
                    )}
                    {submission.utm_medium && (
                      <div>
                        <Label className="text-sm font-medium">Medium</Label>
                        <p className="text-sm">{submission.utm_medium}</p>
                      </div>
                    )}
                    {submission.utm_campaign && (
                      <div>
                        <Label className="text-sm font-medium">Campaign</Label>
                        <p className="text-sm">{submission.utm_campaign}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Entry Fields */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-lg">Property Details (Manual Entry)</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="flat">Flat</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
                        <SelectItem value="terraced">Terraced</SelectItem>
                        <SelectItem value="semi-detached">Semi-detached</SelectItem>
                        <SelectItem value="detached">Detached</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyOwnership">Property Ownership</Label>
                    <Select value={propertyOwnership} onValueChange={setPropertyOwnership}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner-occupied">Owner Occupied</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="housing-association">Housing Association</SelectItem>
                        <SelectItem value="council">Council</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentHeatingSystem">Current Heating System</Label>
                    <Select value={currentHeatingSystem} onValueChange={setCurrentHeatingSystem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heating system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gas-boiler">Gas Boiler</SelectItem>
                        <SelectItem value="oil-boiler">Oil Boiler</SelectItem>
                        <SelectItem value="electric-heating">Electric Heating</SelectItem>
                        <SelectItem value="heat-pump">Heat Pump</SelectItem>
                        <SelectItem value="solid-fuel">Solid Fuel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="epcScore">EPC Score</Label>
                    <Select value={epcScore} onValueChange={setEpcScore}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select EPC rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A (92-100)</SelectItem>
                        <SelectItem value="B">B (81-91)</SelectItem>
                        <SelectItem value="C">C (69-80)</SelectItem>
                        <SelectItem value="D">D (55-68)</SelectItem>
                        <SelectItem value="E">E (39-54)</SelectItem>
                        <SelectItem value="F">F (21-38)</SelectItem>
                        <SelectItem value="G">G (1-20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Lead Management</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={editingStatus} onValueChange={onStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea
                      value={editingNotes}
                      onChange={(e) => onNotesChange(e.target.value)}
                      placeholder="Add notes about this lead..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
