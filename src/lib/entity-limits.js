// Single source of truth for entity list limits and sort orders.
// Import these instead of passing bare limits to base44.entities.<Name>.list().
export const ENTITY_LIMITS = {
  Department: { sort: 'sort_order', limit: 500 },
  Role: { sort: 'title', limit: 500 },
  System: { sort: 'name', limit: 500 },
  Procedure: { sort: '-updated_date', limit: 500 },
  DocumentArtifact: { sort: '-updated_date', limit: 500 },
  Stage: { sort: 'number', limit: 500 },
  DealScenario: { sort: 'code', limit: 500 },
  GlossaryTerm: { sort: 'term', limit: 500 },
  Gate: { sort: 'name', limit: 500 },
  Control: { sort: 'name', limit: 500 },
  Location: { sort: 'name', limit: 500 },
  TitleState: { sort: 'state_name', limit: 500 },
  PaymentInstrument: { sort: 'name', limit: 500 },
  FundingAccount: { sort: 'name', limit: 500 },
  DocFeedback: { sort: '-created_date', limit: 500 },
};