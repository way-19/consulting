import React, { useState, useEffect } from 'react';
import { useAuth } from '@consulting19/shared';
import { 
  BarChart3, 
  Download, 
  Save, 
  X, 
  Plus, 
  Settings,
  Calendar,
  TrendingUp,
  PieChart,
  FileText,
  Filter,
  Target,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Eye
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface ReportConfig {
  name: string;
  description: string;
  type: string;
  dateRange: string;
  metrics: string[];
  filters: Record<string, any>;
  chartType: string;
  exportFormat: string;
  groupBy: string;
}

interface SavedReport {
  id: string;
  report_name: string;
  report_description: string;
  report_config: ReportConfig;
  run_count: number;
  last_run_at: string;
  created_at: string;
}

interface AdvancedReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedReportBuilder: React.FC<AdvancedReportBuilderProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    type: 'financial',
    dateRange: 'last_30_days',
    metrics: ['revenue', 'commission'],
    filters: {},
    chartType: 'line',
    exportFormat: 'csv',
    groupBy: 'month'
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const reportTypes = [
    { value: 'financial', label: 'Financial Performance', icon: DollarSign },
    { value: 'client', label: 'Client Analytics', icon: Users },
    { value: 'service', label: 'Service Performance', icon: Target },
    { value: 'activity', label: 'Activity Summary', icon: Clock },
    { value: 'comprehensive', label: 'Comprehensive Report', icon: BarChart3 }
  ];

  const availableMetrics = {
    financial: [
      { value: 'revenue', label: 'Total Revenue' },
      { value: 'commission', label: 'Commission Earned' },
      { value: 'avg_order_value', label: 'Average Order Value' },
      { value: 'conversion_rate', label: 'Conversion Rate' },
      { value: 'growth_rate', label: 'Growth Rate' }
    ],
    client: [
      { value: 'client_count', label: 'Total Clients' },
      { value: 'active_clients', label: 'Active Clients' },
      { value: 'client_satisfaction', label: 'Satisfaction Score' },
      { value: 'retention_rate', label: 'Retention Rate' },
      { value: 'response_time', label: 'Avg Response Time' }
    ],
    service: [
      { value: 'service_count', label: 'Total Services' },
      { value: 'service_orders', label: 'Service Orders' },
      { value: 'popular_services', label: 'Most Popular Services' },
      { value: 'service_revenue', label: 'Revenue by Service' }
    ],
    activity: [
      { value: 'messages_sent', label: 'Messages Sent' },
      { value: 'tasks_created', label: 'Tasks Created' },
      { value: 'meetings_held', label: 'Meetings Held' },
      { value: 'documents_processed', label: 'Documents Processed' }
    ]
  };

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'table', label: 'Data Table', icon: FileText }
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV File' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' }
  ];

  useEffect(() => {
    if (isOpen && user) {
      fetchSavedReports();
    }
  }, [isOpen, user]);

  const fetchSavedReports = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .eq('consultant_id', user?.id)
        .order('last_run_at', { ascending: false });

      if (error) throw error;
      setSavedReports(data || []);
    } catch (err) {
      console.error('Error fetching saved reports:', err);
    }
  };

  const generateReport = async () => {
    if (!reportConfig.name.trim() || reportConfig.metrics.length === 0) {
      alert('Please provide a report name and select at least one metric');
      return;
    }

    try {
      setGenerating(true);

      const { data, error } = await supabase.functions.invoke('generate-performance-report', {
        body: {
          consultant_id: user?.id,
          report_type: reportConfig.type,
          date_range: reportConfig.dateRange,
          metrics: reportConfig.metrics,
          export_format: reportConfig.exportFormat,
          filters: reportConfig.filters,
          chart_config: {
            type: reportConfig.chartType,
            group_by: reportConfig.groupBy
          }
        }
      });

      if (error) throw error;

      // Handle export
      if (data.export_data) {
        downloadReport(data.export_data);
      }

      alert('Report generated successfully!');
      fetchSavedReports();
    } catch (err) {
      console.error('Report generation error:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const saveReportTemplate = async () => {
    if (!reportConfig.name.trim()) {
      alert('Please provide a report name');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('custom_reports')
        .insert({
          consultant_id: user?.id,
          report_name: reportConfig.name,
          report_description: reportConfig.description,
          report_config: reportConfig,
          data_sources: [reportConfig.type],
          filters: reportConfig.filters
        });

      if (error) throw error;

      alert('Report template saved successfully!');
      fetchSavedReports();
    } catch (err) {
      console.error('Error saving report template:', err);
      alert('Failed to save report template');
    } finally {
      setSaving(false);
    }
  };

  const loadReportTemplate = (report: SavedReport) => {
    setReportConfig(report.report_config);
    setActiveTab('builder');
  };

  const downloadReport = (exportData: any) => {
    const blob = new Blob([exportData.content], { 
      type: exportData.format === 'csv' ? 'text/csv' : 'application/octet-stream' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleMetric = (metric: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Advanced Report Builder</h2>
              <p className="text-gray-600">Create custom reports and analytics</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {[
              { id: 'builder', name: 'Report Builder', icon: Settings },
              { id: 'templates', name: 'Saved Templates', icon: FileText },
              { id: 'schedule', name: 'Scheduled Reports', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Report Builder Tab */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Monthly Performance Report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {reportTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setReportConfig(prev => ({ ...prev, type: type.value, metrics: [] }))}
                        className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                          reportConfig.type === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief description of this report"
                />
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Metrics to Include *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableMetrics[reportConfig.type as keyof typeof availableMetrics]?.map((metric) => (
                    <label key={metric.value} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={reportConfig.metrics.includes(metric.value)}
                        onChange={() => toggleMetric(metric.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">{metric.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={reportConfig.dateRange}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_90_days">Last 90 Days</option>
                    <option value="this_quarter">This Quarter</option>
                    <option value="this_year">This Year</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group By
                  </label>
                  <select
                    value={reportConfig.groupBy}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, groupBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="quarter">Quarterly</option>
                    <option value="client">By Client</option>
                    <option value="service">By Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={reportConfig.exportFormat}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, exportFormat: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {exportFormats.map((format) => (
                      <option key={format.value} value={format.value}>{format.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chart Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visualization Type
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {chartTypes.map((chart) => (
                    <button
                      key={chart.value}
                      onClick={() => setReportConfig(prev => ({ ...prev, chartType: chart.value }))}
                      className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                        reportConfig.chartType === chart.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <chart.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{chart.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Report Preview</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{reportTypes.find(t => t.value === reportConfig.type)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date Range:</span>
                        <span className="font-medium">{reportConfig.dateRange.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Group By:</span>
                        <span className="font-medium">{reportConfig.groupBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visualization:</span>
                        <span className="font-medium">{chartTypes.find(c => c.value === reportConfig.chartType)?.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Metrics ({reportConfig.metrics.length}):</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {reportConfig.metrics.map((metric) => (
                            <span key={metric} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {availableMetrics[reportConfig.type as keyof typeof availableMetrics]?.find(m => m.value === metric)?.label || metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={saveReportTemplate}
                  disabled={saving || !reportConfig.name.trim()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Template
                </button>

                <button
                  onClick={generateReport}
                  disabled={generating || !reportConfig.name.trim() || reportConfig.metrics.length === 0}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate & Download Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Saved Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Saved Report Templates</h3>
                <span className="text-sm text-gray-500">{savedReports.length} templates</span>
              </div>

              {savedReports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{report.report_name}</h4>
                          <p className="text-sm text-gray-600">{report.report_description}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                            <span>Type: {report.report_config.type}</span>
                            <span>•</span>
                            <span>Used: {report.run_count} times</span>
                            <span>•</span>
                            <span>Last run: {new Date(report.last_run_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => loadReportTemplate(report)}
                            className="p-2 text-blue-600 hover:text-blue-700"
                            title="Load template"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              loadReportTemplate(report);
                              generateReport();
                            }}
                            className="p-2 text-green-600 hover:text-green-700"
                            title="Run report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {report.report_config.metrics.slice(0, 3).map((metric) => (
                          <span key={metric} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {metric.replace('_', ' ')}
                          </span>
                        ))}
                        {report.report_config.metrics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{report.report_config.metrics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Templates</h3>
                  <p className="text-gray-600 mb-4">Create your first report template</p>
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === 'schedule' && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scheduled Reports</h3>
              <p className="text-gray-600">Automated report scheduling coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportBuilder;