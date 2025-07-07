import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Company {
    id: ID!
    name: String!
    domain: String
    industry: String
    size: String
    location: String
    description: String
    hubspotData: HubSpotCompany
  }

  type HubSpotCompany {
    id: String!
    properties: JSON
    lastModified: String
  }

  type CompanyResearch {
    id: ID!
    companyId: String!
    companyOverview: String!
    keyPersonnel: [String!]!
    recentNews: [String!]!
    serviceOpportunities: [String!]!
    competitiveAnalysis: String!
    recommendedApproach: String!
    generatedAt: String!
  }

  scalar JSON

  type Query {
    searchCompanies(query: String!, limit: Int = 10): [Company!]!
    getCompany(id: ID!): Company
    getCompanyResearch(companyId: String!): CompanyResearch
  }

  type Mutation {
    generateCompanyResearch(companyId: String!): CompanyResearch!
  }
`;
