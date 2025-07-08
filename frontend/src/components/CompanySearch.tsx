import React, { useState, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, Business, LocationOn, People } from '@mui/icons-material';
import { useLazyQuery, gql } from '@apollo/client';
import { debounce } from 'lodash';

const SEARCH_COMPANIES = gql`
  query SearchCompanies($query: String!, $limit: Int) {
    searchCompanies(query: $query, limit: $limit) {
      id
      name
      domain
      industry
      size
      location
      description
      hubspotData {
        id
        properties
        lastModified
      }
    }
  }
`;

const GET_COMPANY_RESEARCH = gql`
  query GetCompanyResearch($companyId: String!) {
    getCompanyResearch(companyId: $companyId) {
      id
      companyOverview
      keyPersonnel
      recentNews
      serviceOpportunities
      competitiveAnalysis
      recommendedApproach
      generatedAt
    }
  }
`;

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  hubspotData?: any;
}

interface CompanyResearch {
  id: string;
  companyOverview: string;
  keyPersonnel: string[];
  recentNews: string[];
  serviceOpportunities: string[];
  competitiveAnalysis: string;
  recommendedApproach: string;
  generatedAt: string;
}

// Named function component (fixes Fast Refresh issue)
function CompanySearch() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchOptions, setSearchOptions] = useState<Company[]>([]);
  const [research, setResearch] = useState<CompanyResearch | null>(null);

  const [searchCompanies, { loading: searchLoading }] = useLazyQuery(SEARCH_COMPANIES);
  const [getResearch, { loading: researchLoading }] = useLazyQuery(GET_COMPANY_RESEARCH);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const { data } = await searchCompanies({
            variables: { query: searchTerm, limit: 10 }
          });
          if (data?.searchCompanies) {
            setSearchOptions(data.searchCompanies);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchOptions([]);
        }
      }
    }, 300),
    [searchCompanies]
  );

  const handleCompanySelect = useCallback(async (company: Company | null) => {
    setSelectedCompany(company);
    setResearch(null);
    
    if (company) {
      try {
        const { data } = await getResearch({
          variables: { companyId: company.id }
        });
        if (data?.getCompanyResearch) {
          setResearch(data.getCompanyResearch);
        }
      } catch (error) {
        console.error('Research error:', error);
      }
    }
  }, [getResearch]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        TSC Prospect Research Tool
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Autocomplete
          options={searchOptions}
          getOptionLabel={(option) => option.name}
          loading={searchLoading}
          onInputChange={(_, value) => debouncedSearch(value)}
          onChange={(_, value) => handleCompanySelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Companies"
              placeholder="Enter company name..."
              InputProps={{
                ...params.InputProps,
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchLoading ? <CircularProgress size={20} /> : null,
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Business sx={{ mr: 2, color: 'text.secondary' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.industry} • {option.location}
                  </Typography>
                </Box>
              </Box>
            </li>
          )}
        />
      </Paper>

      {selectedCompany && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" color="primary">
                    {selectedCompany.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCompany.domain}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<Business />}
                    label={selectedCompany.industry}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<People />}
                    label={selectedCompany.size}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<LocationOn />}
                    label={selectedCompany.location}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                <Typography variant="body1">
                  {selectedCompany.description}
                </Typography>

                {selectedCompany.hubspotData && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This company exists in HubSpot
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Research & Intelligence
                </Typography>
                
                {researchLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : research ? (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Company Overview
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {research.companyOverview}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Service Opportunities
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {research.serviceOpportunities.map((opportunity, index) => (
                        <Chip
                          key={index}
                          label={opportunity}
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Approach
                    </Typography>
                    <Typography variant="body2">
                      {research.recommendedApproach}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Select a company to see AI-powered research and insights
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

// Named export (fixes Fast Refresh issue)
export { CompanySearch };
