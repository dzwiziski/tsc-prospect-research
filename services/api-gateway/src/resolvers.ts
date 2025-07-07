// Mock data for demo purposes
const mockCompanies = [
  {
    id: '1',
    name: 'Marriott International',
    domain: 'marriott.com',
    industry: 'Hospitality',
    size: 'Large (10,000+ employees)',
    location: 'Bethesda, MD',
    description: 'Global hospitality company operating hotels and lodging facilities worldwide'
  },
  {
    id: '2',
    name: 'Johns Hopkins Hospital',
    domain: 'hopkinsmedicine.org',
    industry: 'Healthcare',
    size: 'Large (10,000+ employees)',
    location: 'Baltimore, MD',
    description: 'Academic medical center and teaching hospital'
  },
  {
    id: '3',
    name: 'University of Maryland',
    domain: 'umd.edu',
    industry: 'Education',
    size: 'Large (10,000+ employees)',
    location: 'College Park, MD',
    description: 'Public research university'
  }
];

const mockResearch = {
  id: '1',
  companyId: '1',
  companyOverview: 'Marriott International is a leading global hospitality company with a portfolio of hotel brands spanning luxury to economy segments.',
  keyPersonnel: ['Facilities Manager', 'Operations Director', 'Regional Manager'],
  recentNews: ['Expansion plans announced', 'Sustainability initiatives launched'],
  serviceOpportunities: ['Housekeeping Services', 'Laundry Management', 'Event Staffing'],
  competitiveAnalysis: 'Large hospitality companies typically have established vendor relationships but are open to service improvements.',
  recommendedApproach: 'Focus on specialized hospitality experience and service quality improvements.',
  generatedAt: new Date().toISOString()
};

export const resolvers = {
  Query: {
    searchCompanies: async (_: any, { query, limit }: { query: string; limit: number }) => {
      // Simple mock search
      return mockCompanies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.industry.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    },

    getCompany: async (_: any, { id }: { id: string }) => {
      return mockCompanies.find(company => company.id === id);
    },

    getCompanyResearch: async (_: any, { companyId }: { companyId: string }) => {
      // Return mock research data
      return { ...mockResearch, companyId };
    }
  },

  Mutation: {
    generateCompanyResearch: async (_: any, { companyId }: { companyId: string }) => {
      // Return mock research data
      return { ...mockResearch, companyId };
    }
  }
};
