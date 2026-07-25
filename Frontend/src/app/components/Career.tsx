import { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Eye, Send, Search, X } from 'lucide-react';
import '../../styles/career.css';
import { getJobs } from '../../data/jobs';

export function Career() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [divisionSearch, setDivisionSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [levelSearch, setLevelSearch] = useState('');

  const openings = useMemo(() => getJobs(t), [t, i18n.language]);

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredOpenings = useMemo(() => {
    return openings.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDivision = (selectedDivision === '' && divisionSearch === '') || 
                             job.division === selectedDivision || 
                             job.division.toLowerCase().includes(divisionSearch.toLowerCase());
      const matchesLocation = (selectedLocation === '' && locationSearch === '') || 
                             job.location === selectedLocation || 
                             job.location.toLowerCase().includes(locationSearch.toLowerCase());
      const matchesLevel = (selectedLevel === '' && levelSearch === '') || 
                         job.level === selectedLevel || 
                         job.level.toLowerCase().includes(levelSearch.toLowerCase());
      
      return matchesSearch && matchesDivision && matchesLocation && matchesLevel;
    });
  }, [searchQuery, selectedDivision, selectedLocation, selectedLevel, divisionSearch, locationSearch, levelSearch]);

  const totalJobs = filteredOpenings.length;

  const handleViewDetail = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    navigate(`/${currentLang}/karir/${jobId}`);
  };

  const handleApply = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    navigate(`/${currentLang}/karir/${jobId}/lamar`);
  };

  const divisions = [...new Set(openings.map(job => job.division))];
  const locations = [...new Set(openings.map(job => job.location))];
  const levels = [...new Set(openings.map(job => job.level))];



  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDivision('');
    setSelectedLocation('');
    setSelectedLevel('');
    setDivisionSearch('');
    setLocationSearch('');
    setLevelSearch('');
  };

  const dateLocale = i18n.language === 'en' ? 'en-US' : i18n.language === 'zh' ? 'zh-CN' : 'id-ID';
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(dateLocale, options);
  };

  return (
    <div className="career-page">
      {/* Career Hero Section */}
      <div className="career-hero">
        <div className="section-container">
          <div className="section-header">
            <h2>{t('career.page.title')}</h2>
            <p>{t('career.page.subtitle')}</p>
            <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="listings-section">
        <div className="section-container">

          {/* Search and Filters */}
          <div className="search-filters-container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder={t('career.page.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filters">
              <div className="filter-group">
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setDivisionSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">{t('career.page.allDivisions')}</option>
                  {divisions.map(division => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={t('career.page.searchDivision')}
                    value={divisionSearch}
                    onChange={(e) => {
                      setDivisionSearch(e.target.value);
                      setSelectedDivision('');
                    }}
                    className="filter-search-input"
                  />
                  {divisionSearch && (
                    <button onClick={() => setDivisionSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setLocationSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">{t('career.page.allCities')}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={t('career.page.searchCity')}
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setSelectedLocation('');
                    }}
                    className="filter-search-input"
                  />
                  {locationSearch && (
                    <button onClick={() => setLocationSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setLevelSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">{t('career.page.allLevels')}</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={t('career.page.searchLevel')}
                    value={levelSearch}
                    onChange={(e) => {
                      setLevelSearch(e.target.value);
                      setSelectedLevel('');
                    }}
                    className="filter-search-input"
                  />
                  {levelSearch && (
                    <button onClick={() => setLevelSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-button">
                <X size={16} />
                {t('career.page.resetFilter')}
              </button>
            </div>
          </div>

          <div className="jobs-grid">
            {filteredOpenings.length === 0 ? (
              <div className="no-jobs-found">
                <p>{t('career.page.noJobsFound')}</p>
              </div>
            ) : (
              filteredOpenings.map((job) => {
                const deadlinePassed = isDeadlinePassed(job.deadline);
                return (
                  <div key={job.id} className={`job-card ${deadlinePassed ? 'closed' : ''}`}>
                    <div className="job-header">
                      <div className="job-title">
                        <h3>{job.title}</h3>
                        <div className="job-meta">
                          <span className="job-badge division">{job.division}</span>
                          <span className="job-badge type">{job.type}</span>
                          <span className="job-badge level">{job.level}</span>
                        </div>
                      </div>
                      <span className="job-location">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                    </div>
                    <div className="job-description">
                      <p>{job.description}</p>
                    </div>
                    <div className="job-deadline">
                      <span>{t('career.page.deadlineLabel', { date: formatDate(job.deadline) })}</span>
                      {deadlinePassed && <span className="closed-badge">{t('career.page.closed')}</span>}
                    </div>
                    <div className="job-footer">
                      <div className="job-buttons">
                        <Link
                          to={`/${currentLang}/karir/${job.id}`}
                          className="detail-button"
                          onClick={(e) => handleViewDetail(e, job.id)}
                        >
                          <Eye size={16} />
                          {t('career.page.viewDetail')}
                        </Link>
                        {deadlinePassed ? (
                          <button
                            className="apply-button disabled"
                            disabled
                          >
                            <Send size={16} />
                            {t('career.page.closed')}
                          </button>
                        ) : (
                          <Link
                            to={`/${currentLang}/karir/${job.id}/lamar`}
                            className="apply-button"
                            onClick={(e) => handleApply(e, job.id)}
                          >
                            <Send size={16} />
                            {t('career.page.apply')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}