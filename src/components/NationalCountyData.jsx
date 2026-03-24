// components/NationalCountyData.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NationalCountyData = () => {
  // State for data and loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // State for filters
  const [filters, setFilters] = useState({
    area: [],
    sector: [],
    subsector: [],
    indicator: [],
    item: [],
    domain: [],
    subgroup_dimension: [],
    subgroup: [],
    time_period: '',
  });
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    areas: [],
    sectors: [],
    subsectors: [],
    indicators: [],
    items: [],
    domains: [],
    subgroupDimensions: [],
    subgroups: [],
    timePeriods: [],
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  
  // State for modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  
  // State for export
  const [exporting, setExporting] = useState(false);
  
  // State for quick preview
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [quickPreviewData, setQuickPreviewData] = useState([]);
  const [quickPreviewLoading, setQuickPreviewLoading] = useState(false);
  
  // API Base URL
  const API_BASE_URL = 'https://statistics.kilimo.go.ke/api';

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch data when filters or pagination change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage, pageSize]);

  // Fetch all filter options from API
  const fetchFilterOptions = async () => {
    setFilterOptionsLoading(true);
    setError(null);
    try {
      console.log('Fetching filter options...');
      
      const [
        areasRes,
        sectorsRes,
        subsectorsRes,
        indicatorsRes,
        itemsRes,
        domainsRes,
        subgroupDimensionsRes,
        subgroupsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/areas/`),
        axios.get(`${API_BASE_URL}/sectors/`),
        axios.get(`${API_BASE_URL}/subsectors/`),
        axios.get(`${API_BASE_URL}/indicators/`),
        axios.get(`${API_BASE_URL}/items/`),
        axios.get(`${API_BASE_URL}/domains/`),
        axios.get(`${API_BASE_URL}/subgroup-dimensions/`),
        axios.get(`${API_BASE_URL}/subgroups/`),
      ]);

      // Get areas data (handle different response structures)
      const areas = areasRes.data.results || areasRes.data || [];
      const sectors = sectorsRes.data.results || sectorsRes.data || [];
      const subsectors = subsectorsRes.data.results || subsectorsRes.data || [];
      const indicators = indicatorsRes.data.results || indicatorsRes.data || [];
      const items = itemsRes.data.results || itemsRes.data || [];
      const domains = domainsRes.data.results || domainsRes.data || [];
      const subgroupDimensions = subgroupDimensionsRes.data.results || subgroupDimensionsRes.data || [];
      const subgroups = subgroupsRes.data.results || subgroupsRes.data || [];

      // Extract unique time periods from existing data
      const timePeriodsRes = await axios.get(`${API_BASE_URL}/data/?page_size=1000`);
      const timePeriodsData = timePeriodsRes.data.results || timePeriodsRes.data || [];
      const timePeriods = [...new Set(timePeriodsData.map(item => item.time_period))].sort().reverse();

      setFilterOptions({
        areas,
        sectors,
        subsectors,
        indicators,
        items,
        domains,
        subgroupDimensions,
        subgroups,
        timePeriods,
      });
      
      console.log('Filter options loaded:', {
        areas: areas.length,
        sectors: sectors.length,
        indicators: indicators.length,
        items: items.length,
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError('Failed to load filter options. Please refresh the page.');
    } finally {
      setFilterOptionsLoading(false);
    }
  };

  // Fetch data with filters - FIXED VERSION
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = {
        page: currentPage,
        page_size: pageSize,
      };

      // Add filters to params - using the correct field names from API
      // The API expects these parameter names based on the data structure
      if (filters.area && filters.area.length > 0) {
        params.area = filters.area.join(',');
      }
      if (filters.sector && filters.sector.length > 0) {
        params.sector = filters.sector.join(',');
      }
      if (filters.subsector && filters.subsector.length > 0) {
        params.subsector = filters.subsector.join(',');
      }
      if (filters.indicator && filters.indicator.length > 0) {
        params.indicator = filters.indicator.join(',');
      }
      if (filters.item && filters.item.length > 0) {
        params.item = filters.item.join(',');
      }
      if (filters.domain && filters.domain.length > 0) {
        params.domain = filters.domain.join(',');
      }
      if (filters.subgroup_dimension && filters.subgroup_dimension.length > 0) {
        params.subgroup_dimension = filters.subgroup_dimension.join(',');
      }
      if (filters.subgroup && filters.subgroup.length > 0) {
        params.subgroup = filters.subgroup.join(',');
      }
      if (filters.time_period) {
        params.time_period = filters.time_period;
      }

      console.log('Fetching data with params:', params);
      console.log('Current filters:', filters);
      
      const response = await axios.get(`${API_BASE_URL}/data/`, { params });
      const results = response.data.results || response.data;
      const count = response.data.count || 0;
      
      setData(results);
      setTotalCount(count);
      
      console.log(`Loaded ${results.length} records out of ${count} total`);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Preview - Fetch first 5 records with current filters
  const handleQuickPreview = async () => {
    setQuickPreviewLoading(true);
    setShowQuickPreview(true);
    try {
      // Build query parameters for preview (limit to 5 records)
      const params = {
        page_size: 5,
        page: 1,
      };

      // Add current filters
      if (filters.area && filters.area.length > 0) params.area = filters.area.join(',');
      if (filters.sector && filters.sector.length > 0) params.sector = filters.sector.join(',');
      if (filters.subsector && filters.subsector.length > 0) params.subsector = filters.subsector.join(',');
      if (filters.indicator && filters.indicator.length > 0) params.indicator = filters.indicator.join(',');
      if (filters.item && filters.item.length > 0) params.item = filters.item.join(',');
      if (filters.domain && filters.domain.length > 0) params.domain = filters.domain.join(',');
      if (filters.subgroup_dimension && filters.subgroup_dimension.length > 0) params.subgroup_dimension = filters.subgroup_dimension.join(',');
      if (filters.subgroup && filters.subgroup.length > 0) params.subgroup = filters.subgroup.join(',');
      if (filters.time_period) params.time_period = filters.time_period;

      console.log('Quick preview with params:', params);
      
      const response = await axios.get(`${API_BASE_URL}/data/`, { params });
      const results = response.data.results || response.data;
      setQuickPreviewData(results);
    } catch (error) {
      console.error('Error fetching preview data:', error);
      setError('Failed to load preview data.');
    } finally {
      setQuickPreviewLoading(false);
    }
  };

  // Close quick preview
  const closeQuickPreview = () => {
    setShowQuickPreview(false);
    setQuickPreviewData([]);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    console.log(`Filter changed: ${filterName} = ${value}`);
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle multiselect change
  const handleMultiSelectChange = (filterName, selectedValue) => {
    console.log(`Multi-select change: ${filterName} = ${selectedValue}`);
    setFilters(prev => {
      const currentValues = [...(prev[filterName] || [])];
      let newValues;
      if (currentValues.includes(selectedValue)) {
        newValues = currentValues.filter(v => v !== selectedValue);
        console.log(`Removed ${selectedValue} from ${filterName}, new values:`, newValues);
      } else {
        newValues = [...currentValues, selectedValue];
        console.log(`Added ${selectedValue} to ${filterName}, new values:`, newValues);
      }
      return {
        ...prev,
        [filterName]: newValues,
      };
    });
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    console.log('Clearing all filters');
    setFilters({
      area: [],
      sector: [],
      subsector: [],
      indicator: [],
      item: [],
      domain: [],
      subgroup_dimension: [],
      subgroup: [],
      time_period: '',
    });
    setCurrentPage(1);
  };

  // Preview data (show modal)
  const previewDataItem = (item) => {
    console.log('Previewing item:', item.id);
    setPreviewData(item);
    setShowPreviewModal(true);
  };

  // Export data to CSV
  const exportData = async () => {
    setExporting(true);
    try {
      // Build query parameters without pagination
      const params = {
        page_size: totalCount || 10000, // Fallback to 10000 if totalCount is 0
      };

      // Add filters to params
      if (filters.area && filters.area.length > 0) params.area = filters.area.join(',');
      if (filters.sector && filters.sector.length > 0) params.sector = filters.sector.join(',');
      if (filters.subsector && filters.subsector.length > 0) params.subsector = filters.subsector.join(',');
      if (filters.indicator && filters.indicator.length > 0) params.indicator = filters.indicator.join(',');
      if (filters.item && filters.item.length > 0) params.item = filters.item.join(',');
      if (filters.domain && filters.domain.length > 0) params.domain = filters.domain.join(',');
      if (filters.subgroup_dimension && filters.subgroup_dimension.length > 0) params.subgroup_dimension = filters.subgroup_dimension.join(',');
      if (filters.subgroup && filters.subgroup.length > 0) params.subgroup = filters.subgroup.join(',');
      if (filters.time_period) params.time_period = filters.time_period;

      console.log('Exporting data with params:', params);
      
      const response = await axios.get(`${API_BASE_URL}/data/`, { params });
      const allData = response.data.results || response.data;

      if (allData.length === 0) {
        alert('No data to export with current filters.');
        setExporting(false);
        return;
      }

      // Convert to CSV
      const headers = [
        'Area', 'Sector', 'Subsector', 'Indicator', 'Item',
        'Domain', 'Time Period', 'Value', 'Unit', 'Flag', 'Source', 'Provider'
      ];
      
      const csvRows = [headers.join(',')];
      
      allData.forEach(item => {
        const row = [
          `"${(item.area_name || '').replace(/"/g, '""')}"`,
          `"${(item.sector_name || '').replace(/"/g, '""')}"`,
          `"${(item.subsector_name || '').replace(/"/g, '""')}"`,
          `"${(item.indicator_name || '').replace(/"/g, '""')}"`,
          `"${(item.item_name || '').replace(/"/g, '""')}"`,
          `"${(item.domain_name || '').replace(/"/g, '""')}"`,
          `"${(item.time_period || '').replace(/"/g, '""')}"`,
          item.data_value || '',
          `"${(item.unit_symbol || '').replace(/"/g, '""')}"`,
          `"${(item.flag || '').replace(/"/g, '""')}"`,
          `"${(item.source_name || '').replace(/"/g, '""')}"`,
          `"${(item.provider_name || '').replace(/"/g, '""')}"`,
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kilimostat_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log(`Exported ${allData.length} records`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Render filter section with Preview Button
  const renderFilterSection = () => (
    <div className="data-filters">
      <div className="filter-header">
        <h3>
          <i className="fas fa-filter"></i> Filters
        </h3>
        <div className="filter-actions">
          <button 
            className="btn-preview-data" 
            onClick={handleQuickPreview}
            disabled={filterOptionsLoading}
          >
            <i className="fas fa-eye"></i> Preview Data
          </button>
          <button className="btn-clear-filters" onClick={clearFilters}>
            <i className="fas fa-times"></i> Clear All
          </button>
        </div>
      </div>
      
      {filterOptionsLoading ? (
        <div className="loading-filters">
          <i className="fas fa-spinner fa-spin"></i> Loading filter options...
        </div>
      ) : (
        <div className="filters-grid">
          {/* Area Filter */}
          <div className="filter-group">
            <label>Area (County) {filterOptions.areas.length > 0 && `(${filterOptions.areas.length})`}</label>
            <div className="multiselect-container scrollable">
              {filterOptions.areas.map(area => (
                <label key={area.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.area.includes(area.id)}
                    onChange={() => handleMultiSelectChange('area', area.id)}
                  />
                  <span>{area.name}</span>
                </label>
              ))}
              {filterOptions.areas.length === 0 && (
                <div className="no-options">No areas available</div>
              )}
            </div>
          </div>

          {/* Sector Filter */}
          <div className="filter-group">
            <label>Sector {filterOptions.sectors.length > 0 && `(${filterOptions.sectors.length})`}</label>
            <div className="multiselect-container">
              {filterOptions.sectors.map(sector => (
                <label key={sector.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.sector.includes(sector.id)}
                    onChange={() => handleMultiSelectChange('sector', sector.id)}
                  />
                  <span>{sector.name}</span>
                </label>
              ))}
              {filterOptions.sectors.length === 0 && (
                <div className="no-options">No sectors available</div>
              )}
            </div>
          </div>

          {/* Subsector Filter */}
          <div className="filter-group">
            <label>Subsector {filterOptions.subsectors.length > 0 && `(${filterOptions.subsectors.length})`}</label>
            <div className="multiselect-container scrollable">
              {filterOptions.subsectors.map(subsector => (
                <label key={subsector.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.subsector.includes(subsector.id)}
                    onChange={() => handleMultiSelectChange('subsector', subsector.id)}
                  />
                  <span>{subsector.name}</span>
                </label>
              ))}
              {filterOptions.subsectors.length === 0 && (
                <div className="no-options">No subsectors available</div>
              )}
            </div>
          </div>

          {/* Indicator Filter */}
          <div className="filter-group">
            <label>Indicator {filterOptions.indicators.length > 0 && `(${filterOptions.indicators.length})`}</label>
            <div className="multiselect-container">
              {filterOptions.indicators.map(indicator => (
                <label key={indicator.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.indicator.includes(indicator.id)}
                    onChange={() => handleMultiSelectChange('indicator', indicator.id)}
                  />
                  <span>{indicator.name}</span>
                </label>
              ))}
              {filterOptions.indicators.length === 0 && (
                <div className="no-options">No indicators available</div>
              )}
            </div>
          </div>

          {/* Item Filter */}
          <div className="filter-group">
            <label>Item {filterOptions.items.length > 0 && `(${filterOptions.items.length})`}</label>
            <div className="multiselect-container scrollable">
              {filterOptions.items.map(item => (
                <label key={item.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.item.includes(item.id)}
                    onChange={() => handleMultiSelectChange('item', item.id)}
                  />
                  <span>{item.name}</span>
                </label>
              ))}
              {filterOptions.items.length === 0 && (
                <div className="no-options">No items available</div>
              )}
            </div>
          </div>

          {/* Domain Filter */}
          <div className="filter-group">
            <label>Domain {filterOptions.domains.length > 0 && `(${filterOptions.domains.length})`}</label>
            <div className="multiselect-container">
              {filterOptions.domains.map(domain => (
                <label key={domain.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.domain.includes(domain.id)}
                    onChange={() => handleMultiSelectChange('domain', domain.id)}
                  />
                  <span>{domain.name}</span>
                </label>
              ))}
              {filterOptions.domains.length === 0 && (
                <div className="no-options">No domains available</div>
              )}
            </div>
          </div>

          {/* Subgroup Dimension Filter */}
          <div className="filter-group">
            <label>Subgroup Dimension {filterOptions.subgroupDimensions.length > 0 && `(${filterOptions.subgroupDimensions.length})`}</label>
            <div className="multiselect-container">
              {filterOptions.subgroupDimensions.map(dim => (
                <label key={dim.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.subgroup_dimension.includes(dim.id)}
                    onChange={() => handleMultiSelectChange('subgroup_dimension', dim.id)}
                  />
                  <span>{dim.name}</span>
                </label>
              ))}
              {filterOptions.subgroupDimensions.length === 0 && (
                <div className="no-options">No subgroup dimensions available</div>
              )}
            </div>
          </div>

          {/* Subgroup Filter */}
          <div className="filter-group">
            <label>Subgroup {filterOptions.subgroups.length > 0 && `(${filterOptions.subgroups.length})`}</label>
            <div className="multiselect-container scrollable">
              {filterOptions.subgroups.map(subgroup => (
                <label key={subgroup.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.subgroup.includes(subgroup.id)}
                    onChange={() => handleMultiSelectChange('subgroup', subgroup.id)}
                  />
                  <span>{subgroup.name}</span>
                </label>
              ))}
              {filterOptions.subgroups.length === 0 && (
                <div className="no-options">No subgroups available</div>
              )}
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="filter-group">
            <label>Time Period {filterOptions.timePeriods.length > 0 && `(${filterOptions.timePeriods.length})`}</label>
            <select
              value={filters.time_period}
              onChange={(e) => handleFilterChange('time_period', e.target.value)}
            >
              <option value="">All Years</option>
              {filterOptions.timePeriods.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );

  // Render data table
  const renderDataTable = () => (
    <div className="data-table-container">
      <div className="table-header">
        <h3>
          <i className="fas fa-table"></i> Agricultural Data
          <span className="data-count">({totalCount} records)</span>
        </h3>
        <div className="table-actions">
          <button className="btn-export" onClick={exportData} disabled={exporting || data.length === 0}>
            <i className={`fas ${exporting ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
            {exporting ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading data...
        </div>
      ) : data.length === 0 && !error ? (
        <div className="no-data">
          <i className="fas fa-inbox"></i>
          <p>No data found. Try adjusting your filters or clear them to see all data.</p>
          <button className="btn-sm" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Sector</th>
                  <th>Indicator</th>
                  <th>Item</th>
                  <th>Time Period</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.area_name}</td>
                    <td>{item.sector_name}</td>
                    <td>{item.indicator_name}</td>
                    <td>{item.item_name}</td>
                    <td>{item.time_period}</td>
                    <td className="data-value">
                      {item.data_value?.toLocaleString()}
                      {item.flag && <span className="flag-badge">{item.flag}</span>}
                    </td>
                    <td>{item.unit_symbol}</td>
                    <td>
                      <button 
                        className="btn-preview" 
                        onClick={() => previewDataItem(item)}
                        title="Preview Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {Math.ceil(totalCount / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="page-size-select"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render preview modal
  const renderPreviewModal = () => (
    showPreviewModal && previewData && (
      <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
        <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <i className="fas fa-chart-line"></i> Data Preview
            </h3>
            <button className="modal-close" onClick={() => setShowPreviewModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="preview-grid">
              <div className="preview-item">
                <label>Area</label>
                <p>{previewData.area_name}</p>
              </div>
              <div className="preview-item">
                <label>Sector</label>
                <p>{previewData.sector_name}</p>
              </div>
              <div className="preview-item">
                <label>Subsector</label>
                <p>{previewData.subsector_name}</p>
              </div>
              <div className="preview-item">
                <label>Indicator</label>
                <p>{previewData.indicator_name}</p>
              </div>
              <div className="preview-item">
                <label>Item</label>
                <p>{previewData.item_name}</p>
              </div>
              <div className="preview-item">
                <label>Domain</label>
                <p>{previewData.domain_name}</p>
              </div>
              <div className="preview-item">
                <label>Subgroup Dimension</label>
                <p>{previewData.subgroup_dimension_name}</p>
              </div>
              <div className="preview-item">
                <label>Subgroup</label>
                <p>{previewData.subgroup_name}</p>
              </div>
              <div className="preview-item">
                <label>Time Period</label>
                <p>{previewData.time_period}</p>
              </div>
              <div className="preview-item">
                <label>Value</label>
                <p className="preview-value">{previewData.data_value?.toLocaleString()} {previewData.unit_symbol}</p>
              </div>
              <div className="preview-item">
                <label>Flag</label>
                <p>{previewData.flag || 'N/A'}</p>
              </div>
              <div className="preview-item">
                <label>Source</label>
                <p>{previewData.source_name}</p>
              </div>
              <div className="preview-item">
                <label>Provider</label>
                <p>{previewData.provider_name}</p>
              </div>
              <div className="preview-item full-width">
                <label>Notes</label>
                <p>{previewData.notes || 'No notes available'}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-close" onClick={() => setShowPreviewModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Render quick preview modal
  const renderQuickPreview = () => (
    showQuickPreview && (
      <div className="quick-preview-overlay" onClick={closeQuickPreview}>
        <div className="quick-preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="quick-preview-header">
            <h3>
              <i className="fas fa-eye"></i> Data Preview
            </h3>
            <button className="quick-preview-close" onClick={closeQuickPreview}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="quick-preview-body">
            {quickPreviewLoading ? (
              <div className="quick-preview-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading preview data...</p>
              </div>
            ) : quickPreviewData.length === 0 ? (
              <div className="quick-preview-empty">
                <i className="fas fa-inbox"></i>
                <p>No data available with current filters.</p>
                <button className="btn-sm" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <p className="quick-preview-info">
                  Showing {quickPreviewData.length} sample record(s) from your current filter selection.
                </p>
                <div className="quick-preview-table-container">
                  <table className="quick-preview-table">
                    <thead>
                      <tr>
                        <th>Area</th>
                        <th>Indicator</th>
                        <th>Item</th>
                        <th>Year</th>
                        <th>Value</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quickPreviewData.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>{item.area_name}</td>
                          <td>{item.indicator_name}</td>
                          <td>{item.item_name}</td>
                          <td>{item.time_period}</td>
                          <td className="preview-value-cell">
                            {item.data_value?.toLocaleString()}
                            {item.flag && <span className="flag-badge-small">{item.flag}</span>}
                          </td>
                          <td>{item.unit_symbol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="quick-preview-actions">
                  <button className="btn-primary" onClick={() => {
                    closeQuickPreview();
                    setTimeout(() => {
                      const tableElement = document.querySelector('.data-table-container');
                      if (tableElement) {
                        tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}>
                    <i className="fas fa-table"></i> View Full Table
                  </button>
                  <button className="btn-outline" onClick={exportData}>
                    <i className="fas fa-download"></i> Export All Data
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="national-county-data">
      <div className="page-header">
        <h1>
          <i className="fas fa-map-marked-alt"></i> National & County Data
        </h1>
        <p className="page-description">
          Explore comprehensive agricultural data across Kenya's 47 counties and national level.
          Filter by area, sector, indicator, and more to find the data you need.
        </p>
      </div>

      {renderFilterSection()}
      {renderDataTable()}
      {renderPreviewModal()}
      {renderQuickPreview()}
    </div>
  );
};

export default NationalCountyData;