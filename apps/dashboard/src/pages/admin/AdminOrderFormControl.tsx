import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ToggleLeft, 
  ToggleRight,
  Globe,
  Package,
  DollarSign,
  FileText,
  Users,
  Building2,
  AlertCircle,
  CheckCircle,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Jurisdiction {
  code: string;
  name: string;
  flag: string;
  active: boolean;
  defaultConsultantId: string;
  steps: {
    namesAndType: boolean;
    packages: boolean;
    addons: boolean;
    additionalDetails: boolean;
  };
  entityTypes: string[];
  validations: {
    companyNameRegex: string;
    minProposedNames: number;
    requirePassportNumber: boolean;
    minApplicantAge: number;
  };
  fields: {
    nationality: 'required' | 'optional' | 'hidden';
    dateOfBirth: 'required' | 'optional' | 'hidden';
    passportNumber: 'required' | 'optional' | 'hidden';
    address: 'required' | 'optional' | 'hidden';
    phone: 'required' | 'optional' | 'hidden';
    email: 'required' | 'optional' | 'hidden';
  };
  currency: string;
  packages: Array<{
    id: string;
    name: string;
    price: number;
    processingTime: string;
    includes: string[];
    active: boolean;
    recommended?: boolean;
  }>;
  addons: Array<{
    id: string;
    label: string;
    price: number;
    active: boolean;
  }>;
}

interface OrderFormSettings {
  enabled: boolean;
  maintenanceMode: boolean;
  defaultCurrency: string;
  allowGuestApplications: boolean;
  requireEmailVerification: boolean;
  autoAssignConsultants: boolean;
}

const AdminOrderFormControl = () => {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [settings, setSettings] = useState<OrderFormSettings>({
    enabled: true,
    maintenanceMode: false,
    defaultCurrency: 'USD',
    allowGuestApplications: false,
    requireEmailVerification: true,
    autoAssignConsultants: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('jurisdictions');
  const [expandedJurisdictions, setExpandedJurisdictions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load from jurisdictions.json (simulated)
      const mockJurisdictions: Jurisdiction[] = [
        {
          code: 'GE',
          name: 'Georgia',
          flag: '🇬🇪',
          active: true,
          defaultConsultantId: 'a4d1a7b0-1234-5678-90ab-cdef12345678',
          steps: {
            namesAndType: true,
            packages: true,
            addons: true,
            additionalDetails: true
          },
          entityTypes: ['LLC', 'JSC'],
          validations: {
            companyNameRegex: '^[A-Za-z0-9 &\'-]{3,100}$',
            minProposedNames: 1,
            requirePassportNumber: false,
            minApplicantAge: 18
          },
          fields: {
            nationality: 'required',
            dateOfBirth: 'required',
            passportNumber: 'optional',
            address: 'required',
            phone: 'required',
            email: 'required'
          },
          currency: 'USD',
          packages: [
            {
              id: 'basic',
              name: 'Basic',
              price: 1100,
              processingTime: '3–5 days',
              includes: [
                'Set-up Fee',
                'Business Consultation',
                'Document Preparation',
                'Dedicated Account Manager'
              ],
              active: true
            },
            {
              id: 'plus',
              name: 'Plus',
              price: 1620,
              processingTime: '3–7 days',
              includes: [
                'Company Seal',
                'Notarisation & Apostille',
                'International Courier',
                'Dedicated Account Manager'
              ],
              active: true,
              recommended: true
            }
          ],
          addons: [
            {
              id: 'rubber-stamp',
              label: 'Company Rubber Stamp',
              price: 70,
              active: true
            },
            {
              id: 'company-seal',
              label: 'Company Seal',
              price: 150,
              active: true
            }
          ]
        },
        {
          code: 'AE',
          name: 'UAE',
          flag: '🇦🇪',
          active: true,
          defaultConsultantId: 'b5e2b8c1-abcd-efgh-ijkl-mnop12345678',
          steps: {
            namesAndType: true,
            packages: true,
            addons: false,
            additionalDetails: true
          },
          entityTypes: ['LLC', 'Free Zone LLC'],
          validations: {
            companyNameRegex: '^[A-Za-z0-9 &\'-]{3,100}$',
            minProposedNames: 2,
            requirePassportNumber: true,
            minApplicantAge: 18
          },
          fields: {
            nationality: 'required',
            dateOfBirth: 'required',
            passportNumber: 'required',
            address: 'required',
            phone: 'required',
            email: 'required'
          },
          currency: 'USD',
          packages: [
            {
              id: 'fz-basic',
              name: 'Free Zone Basic',
              price: 2400,
              processingTime: '7–14 days',
              includes: [
                'Trade Name Reservation',
                'License Issuance'
              ],
              active: true
            }
          ],
          addons: []
        }
      ];

      setJurisdictions(mockJurisdictions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving configuration:', { jurisdictions, settings });
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleJurisdictionActive = (code: string) => {
    setJurisdictions(prev => 
      prev.map(j => 
        j.code === code ? { ...j, active: !j.active } : j
      )
    );
  };

  const toggleJurisdictionStep = (code: string, step: keyof Jurisdiction['steps']) => {
    setJurisdictions(prev => 
      prev.map(j => 
        j.code === code 
          ? { ...j, steps: { ...j.steps, [step]: !j.steps[step] } }
          : j
      )
    );
  };

  const togglePackageActive = (jurisdictionCode: string, packageId: string) => {
    setJurisdictions(prev => 
      prev.map(j => 
        j.code === jurisdictionCode 
          ? {
              ...j,
              packages: j.packages.map(p => 
                p.id === packageId ? { ...p, active: !p.active } : p
              )
            }
          : j
      )
    );
  };

  const togglePackageRecommended = (jurisdictionCode: string, packageId: string) => {
    setJurisdictions(prev => 
      prev.map(j => 
        j.code === jurisdictionCode 
          ? {
              ...j,
              packages: j.packages.map(p => 
                p.id === packageId ? { ...p, recommended: !p.recommended } : { ...p, recommended: false }
              )
            }
          : j
      )
    );
  };

  const toggleAddonActive = (jurisdictionCode: string, addonId: string) => {
    setJurisdictions(prev => 
      prev.map(j => 
        j.code === jurisdictionCode 
          ? {
              ...j,
              addons: j.addons.map(a => 
                a.id === addonId ? { ...a, active: !a.active } : a
              )
            }
          : j
      )
    );
  };

  const toggleJurisdictionExpanded = (code: string) => {
    setExpandedJurisdictions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const updateJurisdictionField = (code: string, field: string, value: any) => {
    setJurisdictions(prev =>
      prev.map(j =>
        j.code === code
          ? { ...j, [field]: value }
          : j
      )
    );
  };

  const updateJurisdictionValidation = (code: string, validation: string, value: any) => {
    setJurisdictions(prev =>
      prev.map(j =>
        j.code === code
          ? { 
              ...j, 
              validations: { ...j.validations, [validation]: value }
            }
          : j
      )
    );
  };

  const updateFieldStatus = (code: string, field: string, status: 'required' | 'optional' | 'hidden') => {
    setJurisdictions(prev =>
      prev.map(j =>
        j.code === code
          ? { 
              ...j, 
              fields: { ...j.fields, [field]: status }
            }
          : j
      )
    );
  };

  const addNewPackage = (jurisdictionCode: string) => {
    const newPackage = {
      id: `new-package-${Date.now()}`,
      name: 'New Package',
      price: 0,
      processingTime: '1-2 days',
      includes: [],
      active: true,
    };

    setJurisdictions(prev =>
      prev.map(j =>
        j.code === jurisdictionCode
          ? { ...j, packages: [...j.packages, newPackage] }
          : j
      )
    );
  };

  const addNewAddon = (jurisdictionCode: string) => {
    const newAddon = {
      id: `new-addon-${Date.now()}`,
      label: 'New Add-on',
      price: 0,
      active: true
    };

    setJurisdictions(prev =>
      prev.map(j =>
        j.code === jurisdictionCode
          ? { ...j, addons: [...j.addons, newAddon] }
          : j
      )
    );
  };

  const deletePackage = (jurisdictionCode: string, packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    setJurisdictions(prev =>
      prev.map(j =>
        j.code === jurisdictionCode
          ? { ...j, packages: j.packages.filter(p => p.id !== packageId) }
          : j
      )
    );
  };

  const deleteAddon = (jurisdictionCode: string, addonId: string) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    setJurisdictions(prev =>
      prev.map(j =>
        j.code === jurisdictionCode
          ? { ...j, addons: j.addons.filter(a => a.id !== addonId) }
          : j
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Form Control</h1>
          <p className="text-gray-600">Manage company formation wizard configuration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadInitialData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={saveConfiguration}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Global Order Form Settings</h2>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Order Form Enabled</div>
                <div className="text-sm text-gray-600">Enable/disable entire wizard</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Maintenance Mode</div>
                <div className="text-sm text-gray-600">Show maintenance message</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Auto-Assign Consultants</div>
                <div className="text-sm text-gray-600">Automatic consultant assignment</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, autoAssignConsultants: !prev.autoAssignConsultants }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoAssignConsultants ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoAssignConsultants ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { 
              id: 'jurisdictions', 
              label: 'Jurisdictions', 
              icon: Globe, 
              count: jurisdictions.length 
            },
            { 
              id: 'overview', 
              label: 'Overview', 
              icon: FileText, 
              count: 0 
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Jurisdictions Tab */}
      {activeTab === 'jurisdictions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Jurisdiction Management</h2>
            <button
              onClick={() => {
                const newJurisdiction: Jurisdiction = {
                  code: '',
                  name: '',
                  flag: '',
                  active: false,
                  defaultConsultantId: '',
                  steps: {
                    namesAndType: true,
                    packages: true,
                    addons: true,
                    additionalDetails: true
                  },
                  entityTypes: ['LLC'],
                  validations: {
                    companyNameRegex: '^[A-Za-z0-9 &\'-]{3,100}$',
                    minProposedNames: 1,
                    requirePassportNumber: false,
                    minApplicantAge: 18
                  },
                  fields: {
                    nationality: 'required',
                    dateOfBirth: 'required',
                    passportNumber: 'optional',
                    address: 'required',
                    phone: 'required',
                    email: 'required'
                  },
                  currency: 'USD',
                  packages: [],
                  addons: []
                };
                setJurisdictions(prev => [...prev, newJurisdiction]);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Jurisdiction
            </button>
          </div>

          <div className="space-y-4">
            {jurisdictions.map((jurisdiction) => {
              const isExpanded = expandedJurisdictions.has(jurisdiction.code);
              
              return (
                <div key={jurisdiction.code} className="bg-white rounded-lg shadow border border-gray-200">
                  {/* Jurisdiction Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={jurisdiction.flag}
                          onChange={(e) => updateJurisdictionField(jurisdiction.code, 'flag', e.target.value)}
                          className="w-16 text-center text-2xl border border-gray-300 rounded px-2 py-1"
                          placeholder="🏳️"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={jurisdiction.name}
                              onChange={(e) => updateJurisdictionField(jurisdiction.code, 'name', e.target.value)}
                              className="text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
                              placeholder="Country Name"
                            />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              jurisdiction.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {jurisdiction.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">Code:</span>
                            <input
                              type="text"
                              value={jurisdiction.code}
                              onChange={(e) => updateJurisdictionField(jurisdiction.code, 'code', e.target.value)}
                              className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 w-16"
                              placeholder="US"
                            />
                            <span className="text-sm text-gray-600">Currency:</span>
                            <select
                              value={jurisdiction.currency}
                              onChange={(e) => updateJurisdictionField(jurisdiction.code, 'currency', e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="TRY">TRY</option>
                              <option value="GEL">GEL</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleJurisdictionActive(jurisdiction.code)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            jurisdiction.active ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              jurisdiction.active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => toggleJurisdictionExpanded(jurisdiction.code)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Jurisdiction Details */}
                  {isExpanded && (
                    <div className="px-6 py-4 space-y-6">
                      {/* Steps Configuration */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Wizard Steps</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(jurisdiction.steps).map(([step, enabled]) => (
                            <div key={step} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {step.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <button
                                onClick={() => toggleJurisdictionStep(jurisdiction.code, step as keyof Jurisdiction['steps'])}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  enabled ? 'bg-green-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Entity Types */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Entity Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {jurisdiction.entityTypes.map((type, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Validations */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Validation Rules</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Proposed Names
                            </label>
                            <input
                              type="number"
                              value={jurisdiction.validations.minProposedNames}
                              onChange={(e) => updateJurisdictionValidation(jurisdiction.code, 'minProposedNames', parseInt(e.target.value))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              min="1"
                              max="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Applicant Age
                            </label>
                            <input
                              type="number"
                              value={jurisdiction.validations.minApplicantAge}
                              onChange={(e) => updateJurisdictionValidation(jurisdiction.code, 'minApplicantAge', parseInt(e.target.value))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              min="16"
                              max="21"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">Require Passport Number</div>
                                <div className="text-sm text-gray-600">Mandatory passport field</div>
                              </div>
                              <button
                                onClick={() => updateJurisdictionValidation(jurisdiction.code, 'requirePassportNumber', !jurisdiction.validations.requirePassportNumber)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  jurisdiction.validations.requirePassportNumber ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    jurisdiction.validations.requirePassportNumber ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Field Configuration */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Field Requirements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(jurisdiction.fields).map(([field, status]) => (
                            <div key={field} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <select
                                value={status}
                                onChange={(e) => updateFieldStatus(jurisdiction.code, field, e.target.value as any)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="required">Required</option>
                                <option value="optional">Optional</option>
                                <option value="hidden">Hidden</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Packages */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Service Packages</h4>
                          <button
                            onClick={() => addNewPackage(jurisdiction.code)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm bg-green-600 text-xs font-medium text-white hover:bg-green-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Package
                          </button>
                        </div>
                        <div className="space-y-3">
                          {jurisdiction.packages.map((pkg) => (
                            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="text"
                                    value={pkg.name}
                                    onChange={(e) => {
                                      setJurisdictions(prev =>
                                        prev.map(j =>
                                          j.code === jurisdiction.code
                                            ? {
                                                ...j,
                                                packages: j.packages.map(p =>
                                                  p.id === pkg.id ? { ...p, name: e.target.value } : p
                                                )
                                              }
                                            : j
                                        )
                                      );
                                    }}
                                    className="font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                                    placeholder="Package Name"
                                  />
                                  <input
                                    type="number"
                                    value={pkg.price}
                                    onChange={(e) => {
                                      setJurisdictions(prev =>
                                        prev.map(j =>
                                          j.code === jurisdiction.code
                                            ? {
                                                ...j,
                                                packages: j.packages.map(p =>
                                                  p.id === pkg.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p
                                                )
                                              }
                                            : j
                                        )
                                      );
                                    }}
                                    className="w-24 text-sm border border-gray-300 rounded px-2 py-1"
                                    placeholder="Price"
                                  />
                                  <span className="text-sm text-gray-600">{jurisdiction.currency}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => togglePackageRecommended(jurisdiction.code, pkg.id)}
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      pkg.recommended
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                                    }`}
                                  >
                                    {pkg.recommended ? 'Recommended' : 'Set Recommended'}
                                  </button>
                                  <button
                                    onClick={() => togglePackageActive(jurisdiction.code, pkg.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                      pkg.active ? 'bg-green-600' : 'bg-gray-200'
                                    }`}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        pkg.active ? 'translate-x-6' : 'translate-x-1'
                                      }`}
                                    />
                                  </button>
                                  <button
                                    onClick={() => deletePackage(jurisdiction.code, pkg.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Processing Time
                                  </label>
                                  <input
                                    type="text"
                                    value={pkg.processingTime}
                                    onChange={(e) => {
                                      setJurisdictions(prev =>
                                        prev.map(j =>
                                          j.code === jurisdiction.code
                                            ? {
                                                ...j,
                                                packages: j.packages.map(p =>
                                                  p.id === pkg.id ? { ...p, processingTime: e.target.value } : p
                                                )
                                              }
                                            : j
                                        )
                                      );
                                    }}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                    placeholder="3-5 days"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Features (one per line)
                                  </label>
                                  <textarea
                                    value={pkg.includes.join('\n')}
                                    onChange={(e) => {
                                      setJurisdictions(prev =>
                                        prev.map(j =>
                                          j.code === jurisdiction.code
                                            ? {
                                                ...j,
                                                packages: j.packages.map(p =>
                                                  p.id === pkg.id ? { ...p, includes: e.target.value.split('\n').filter(line => line.trim()) } : p
                                                )
                                              }
                                            : j
                                        )
                                      );
                                    }}
                                    rows={3}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                    placeholder="Company Registration&#10;Tax Setup&#10;Banking Assistance"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Additional Services</h4>
                          <button
                            onClick={() => addNewAddon(jurisdiction.code)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm bg-purple-600 text-xs font-medium text-white hover:bg-purple-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Service
                          </button>
                        </div>
                        <div className="space-y-2">
                          {jurisdiction.addons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  value={addon.label}
                                  onChange={(e) => {
                                    setJurisdictions(prev =>
                                      prev.map(j =>
                                        j.code === jurisdiction.code
                                          ? {
                                              ...j,
                                              addons: j.addons.map(a =>
                                                a.id === addon.id ? { ...a, label: e.target.value } : a
                                              )
                                            }
                                          : j
                                      )
                                    );
                                  }}
                                  className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                                  placeholder="Add-on Name"
                                />
                                <input
                                  type="number"
                                  value={addon.price}
                                  onChange={(e) => {
                                    setJurisdictions(prev =>
                                      prev.map(j =>
                                        j.code === jurisdiction.code
                                          ? {
                                              ...j,
                                              addons: j.addons.map(a =>
                                                a.id === addon.id ? { ...a, price: parseFloat(e.target.value) || 0 } : a
                                              )
                                            }
                                          : j
                                      )
                                    );
                                  }}
                                  className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                                  placeholder="Price"
                                />
                                <span className="text-sm text-gray-600">{jurisdiction.currency}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleAddonActive(jurisdiction.code, addon.id)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    addon.active ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      addon.active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <button
                                  onClick={() => deleteAddon(jurisdiction.code, addon.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Form Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Jurisdictions</p>
                  <p className="text-2xl font-semibold text-gray-900">{jurisdictions.length}</p>
                  <p className="text-xs text-gray-500">
                    {jurisdictions.filter(j => j.active).length} active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Packages</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {jurisdictions.reduce((sum, j) => sum + j.packages.length, 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {jurisdictions.reduce((sum, j) => sum + j.packages.filter(p => p.active).length, 0)} active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Add-ons</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {jurisdictions.reduce((sum, j) => sum + j.addons.length, 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {jurisdictions.reduce((sum, j) => sum + j.addons.filter(a => a.active).length, 0)} active
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Settings className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {settings.enabled ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Disabled</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {settings.maintenanceMode ? 'Maintenance' : 'Operational'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Jurisdiction Quick Stats</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {jurisdictions.map((jurisdiction) => (
                  <div key={jurisdiction.code} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{jurisdiction.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">{jurisdiction.name}</div>
                        <div className="text-sm text-gray-600">
                          {jurisdiction.packages.filter(p => p.active).length} packages, 
                          {jurisdiction.addons.filter(a => a.active).length} add-ons
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {Object.entries(jurisdiction.steps).map(([step, enabled]) => (
                          <span
                            key={step}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {step.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        jurisdiction.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {jurisdiction.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Reminder */}
      <div className="sticky bottom-4 right-4 ml-auto w-fit">
        <button
          onClick={saveConfiguration}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-lg bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminOrderFormControl;