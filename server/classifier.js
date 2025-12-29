/**
 * Heuristic Classifier for Intake Requests
 * 
 * Classifies intake descriptions into categories using keyword-based rules.
 * Rules are deterministic and easy to audit.
 * 
 * Categories:
 * - billing: invoice, payment, billing issues
 * - technical_support: login, errors, bugs, access issues
 * - new_matter_project: quotes, new projects, engagements, proposals
 * - other: everything else
 */

/**
 * Classifies an intake description into a category
 * @param {string} description - The intake description text
 * @returns {string} - One of: 'billing', 'technical_support', 'new_matter_project', 'other'
 */
export function classifyIntake(description) {
  if (!description || typeof description !== 'string') {
    return 'other';
  }

  const lowerDesc = description.toLowerCase();

  // Billing keywords
  const billingKeywords = [
    'invoice', 'invoices', 'invoicing',
    'payment', 'payments', 'paying', 'paid',
    'bill', 'bills', 'billing',
    'charge', 'charges', 'charged', 'charging',
    'fee', 'fees',
    'refund', 'refunds',
    'cost', 'costs', 'pricing', 'price'
  ];

  // Technical support keywords
  const technicalKeywords = [
    'login', 'log in', 'logged in', 'logging',
    'error', 'errors', 'errored',
    'broken', 'break', 'breaks',
    'bug', 'bugs',
    'can\'t access', 'cannot access', 'access denied', 'access issue',
    'not working', 'doesn\'t work', 'not functioning',
    'crash', 'crashes', 'crashed', 'crashing',
    'slow', 'slowly', 'performance',
    'password', 'reset password', 'forgot password',
    'connection', 'connectivity', 'network',
    'down', 'down time', 'outage'
  ];

  // New matter/project keywords
  const newMatterKeywords = [
    'quote', 'quotes', 'quotation', 'quote request',
    'new project', 'new matter', 'new engagement',
    'proposal', 'proposals',
    'engagement', 'engagements',
    'start', 'starting', 'begin', 'beginning',
    'onboard', 'onboarding', 'on-board',
    'hire', 'hiring', 'retain', 'retainer'
  ];

  // Check for billing keywords
  if (billingKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'billing';
  }

  // Check for technical support keywords
  if (technicalKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'technical_support';
  }

  // Check for new matter/project keywords
  if (newMatterKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return 'new_matter_project';
  }

  // Default to other
  return 'other';
}

