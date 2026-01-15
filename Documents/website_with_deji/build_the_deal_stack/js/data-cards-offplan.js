/**
 * data-cards-offplan.js
 * Card pool specific to Off-Plan Investment scenarios
 */

const OFFPLAN_CARDS = [
    // ========================================
    // MANDATORY CARDS - OFF-PLAN SPECIFIC
    // ========================================
    {
        id: 'card_101',
        name: 'Developer Due Diligence',
        category: 'mandatory',
        cost: 500000,
        timeDays: 14,
        prerequisites: [],
        penalties: 0,
        description: 'Verify developer track record, completed projects, financial stability, and reputation.'
    },
    {
        id: 'card_102',
        name: 'Building Plan Approval Verification',
        category: 'mandatory',
        cost: 200000,
        timeDays: 7,
        prerequisites: [],
        penalties: 0,
        description: 'Confirm all required government approvals and building permits are in place.'
    },
    {
        id: 'card_103',
        name: 'Escrow Account Setup',
        category: 'mandatory',
        cost: 300000,
        timeDays: 5,
        prerequisites: ['card_004'], // Legal Due Diligence
        penalties: 0,
        description: 'Establish escrow with reputable institution to protect milestone payments.'
    },
    {
        id: 'card_104',
        name: 'Milestone Payment Schedule',
        category: 'mandatory',
        cost: 0,
        timeDays: 3,
        prerequisites: ['card_103'],
        penalties: 0,
        description: 'Define payment milestones tied to construction stages with clear deliverables.'
    },
    {
        id: 'card_105',
        name: 'Construction Monitoring Agreement',
        category: 'mandatory',
        cost: 400000,
        timeDays: 10,
        prerequisites: ['card_102'],
        penalties: 0,
        description: 'Engage independent monitoring to verify construction progress and quality.'
    },
    {
        id: 'card_106',
        name: 'Property Insurance (Off-Plan)',
        category: 'mandatory',
        cost: 350000,
        timeDays: 4,
        prerequisites: ['card_104'],
        penalties: 0,
        description: 'Secure insurance covering construction risks and developer default.'
    },
    {
        id: 'card_107',
        name: 'Final Inspection & Handover',
        category: 'mandatory',
        cost: 200000,
        timeDays: 7,
        prerequisites: ['card_105'],
        penalties: 0,
        description: 'Conduct thorough inspection before final payment and property handover.'
    },
    
    // ========================================
    // OPTIONAL CARDS - OFF-PLAN
    // ========================================
    {
        id: 'card_108',
        name: 'Architect Consultation',
        category: 'optional',
        cost: 300000,
        timeDays: 5,
        prerequisites: ['card_102'],
        penalties: 0,
        description: 'Independent architect reviews building plans for quality and compliance.'
    },
    {
        id: 'card_109',
        name: 'Construction Phase Insurance',
        category: 'optional',
        cost: 250000,
        timeDays: 3,
        prerequisites: ['card_106'],
        penalties: 0,
        description: 'Additional coverage for construction delays and material defects.'
    },
    {
        id: 'card_110',
        name: 'Developer Financial Audit',
        category: 'optional',
        cost: 600000,
        timeDays: 10,
        prerequisites: ['card_101'],
        penalties: 0,
        description: 'Full financial audit of developer to assess completion capability.'
    },
    {
        id: 'card_111',
        name: 'Exit Strategy Planning',
        category: 'optional',
        cost: 0,
        timeDays: 2,
        prerequisites: [],
        penalties: 0,
        description: 'Plan for potential resale or rental before completion.'
    },
    
    // ========================================
    // RISKY CARDS - OFF-PLAN
    // ========================================
    {
        id: 'card_112',
        name: 'Skip Developer Verification',
        category: 'risky',
        cost: -500000,
        timeDays: -14,
        prerequisites: [],
        penalties: 45,
        description: 'Proceed without verifying developer credentials and track record.'
    },
    {
        id: 'card_113',
        name: 'Direct Payment to Developer (No Escrow)',
        category: 'risky',
        cost: -300000,
        timeDays: -5,
        prerequisites: [],
        penalties: 50,
        description: 'Pay developer directly without escrow protection—high risk.'
    },
    {
        id: 'card_114',
        name: 'Skip Building Plan Verification',
        category: 'risky',
        cost: -200000,
        timeDays: -7,
        prerequisites: [],
        penalties: 35,
        description: 'Assume all approvals are in place without verification.'
    },
    {
        id: 'card_115',
        name: 'Trust Developer Timeline',
        category: 'risky',
        cost: 0,
        timeDays: -3,
        prerequisites: [],
        penalties: 20,
        description: 'Accept timeline without penalty clauses or monitoring.'
    },
    
    // ========================================
    // RED HERRING CARDS - OFF-PLAN
    // ========================================
    {
        id: 'card_116',
        name: 'Interior Customization Planning',
        category: 'red_herring',
        cost: 400000,
        timeDays: 6,
        prerequisites: [],
        penalties: 18,
        description: 'Plan interior changes before construction is complete.'
    },
    {
        id: 'card_117',
        name: 'Investment Portfolio Branding',
        category: 'red_herring',
        cost: 0,
        timeDays: 3,
        prerequisites: [],
        penalties: 12,
        description: 'Create branding for your property investment portfolio prematurely.'
    },
    {
        id: 'card_118',
        name: 'Early Property Listing',
        category: 'red_herring',
        cost: 0,
        timeDays: 2,
        prerequisites: [],
        penalties: 15,
        description: 'List property for resale before construction completion.'
    },
    {
        id: 'card_119',
        name: 'Social Media Investment Announcement',
        category: 'red_herring',
        cost: 0,
        timeDays: 1,
        prerequisites: [],
        penalties: 8,
        description: 'Announce investment publicly before deal is secured.'
    }
];
