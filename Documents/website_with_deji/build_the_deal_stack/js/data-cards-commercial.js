/**
 * data-cards-commercial.js
 * Card pool specific to Commercial Property Acquisition scenarios
 */

const COMMERCIAL_CARDS = [
    // ========================================
    // MANDATORY CARDS - COMMERCIAL SPECIFIC
    // ========================================
    {
        id: 'card_201',
        name: 'Commercial Valuation',
        category: 'mandatory',
        cost: 1500000,
        timeDays: 10,
        prerequisites: [],
        penalties: 0,
        description: 'Professional valuation using income approach, market comparables, and asset value.'
    },
    {
        id: 'card_202',
        name: 'Tenant Lease Review',
        category: 'mandatory',
        cost: 800000,
        timeDays: 7,
        prerequisites: [],
        penalties: 0,
        description: 'Review all existing tenant leases, terms, renewal options, and obligations.'
    },
    {
        id: 'card_203',
        name: 'Rental Income Verification',
        category: 'mandatory',
        cost: 600000,
        timeDays: 5,
        prerequisites: ['card_202'],
        penalties: 0,
        description: 'Verify actual rental income against claimed amounts with bank statements.'
    },
    {
        id: 'card_204',
        name: 'Building Code Compliance Check',
        category: 'mandatory',
        cost: 700000,
        timeDays: 8,
        prerequisites: [],
        penalties: 0,
        description: 'Ensure property meets all commercial building codes and safety standards.'
    },
    {
        id: 'card_205',
        name: 'Market Comparable Analysis',
        category: 'mandatory',
        cost: 500000,
        timeDays: 6,
        prerequisites: ['card_201'],
        penalties: 0,
        description: 'Compare property value and rental yields against similar commercial properties.'
    },
    {
        id: 'card_206',
        name: 'Commercial Property Insurance',
        category: 'mandatory',
        cost: 1200000,
        timeDays: 4,
        prerequisites: ['card_204'],
        penalties: 0,
        description: 'Comprehensive insurance covering liability, tenants, and business interruption.'
    },
    {
        id: 'card_207',
        name: 'Commercial Title & Registration',
        category: 'mandatory',
        cost: 2000000,
        timeDays: 21,
        prerequisites: ['card_009'], // Final Payment
        penalties: 0,
        description: 'Register commercial property title with appropriate commercial designation.'
    },
    
    // ========================================
    // OPTIONAL CARDS - COMMERCIAL
    // ========================================
    {
        id: 'card_208',
        name: 'Property Management Company Assessment',
        category: 'optional',
        cost: 400000,
        timeDays: 5,
        prerequisites: [],
        penalties: 0,
        description: 'Evaluate and engage professional property management for ongoing operations.'
    },
    {
        id: 'card_209',
        name: 'Renovation Cost Analysis',
        category: 'optional',
        cost: 300000,
        timeDays: 4,
        prerequisites: ['card_204'],
        penalties: 0,
        description: 'Assess renovation needs and costs to improve rental value.'
    },
    {
        id: 'card_210',
        name: 'Tenant Satisfaction Survey',
        category: 'optional',
        cost: 0,
        timeDays: 3,
        prerequisites: ['card_202'],
        penalties: 0,
        description: 'Survey existing tenants to assess retention likelihood and concerns.'
    },
    {
        id: 'card_211',
        name: 'Future Development Potential Study',
        category: 'optional',
        cost: 500000,
        timeDays: 7,
        prerequisites: [],
        penalties: 0,
        description: 'Analyze expansion, conversion, or redevelopment opportunities.'
    },
    
    // ========================================
    // RISKY CARDS - COMMERCIAL
    // ========================================
    {
        id: 'card_212',
        name: 'Skip Tenant Verification',
        category: 'risky',
        cost: -800000,
        timeDays: -7,
        prerequisites: [],
        penalties: 40,
        description: 'Accept landlord\'s tenant information without independent verification.'
    },
    {
        id: 'card_213',
        name: 'Accept Inflated Income Projections',
        category: 'risky',
        cost: -600000,
        timeDays: -5,
        prerequisites: [],
        penalties: 45,
        description: 'Use seller\'s optimistic projections without income verification.'
    },
    {
        id: 'card_214',
        name: 'Skip Market Analysis',
        category: 'risky',
        cost: -500000,
        timeDays: -6,
        prerequisites: [],
        penalties: 35,
        description: 'Proceed without comparing to market rates and comparable properties.'
    },
    {
        id: 'card_215',
        name: 'Ignore Building Code Issues',
        category: 'risky',
        cost: -700000,
        timeDays: -8,
        prerequisites: [],
        penalties: 50,
        description: 'Overlook compliance issues, risking future closure or penalties.'
    },
    
    // ========================================
    // RED HERRING CARDS - COMMERCIAL
    // ========================================
    {
        id: 'card_216',
        name: 'Immediate Renovation Planning',
        category: 'red_herring',
        cost: 800000,
        timeDays: 10,
        prerequisites: [],
        penalties: 20,
        description: 'Plan extensive renovations before understanding current tenant obligations.'
    },
    {
        id: 'card_217',
        name: 'New Signage Design',
        category: 'red_herring',
        cost: 300000,
        timeDays: 4,
        prerequisites: [],
        penalties: 12,
        description: 'Design new building signage before acquisition is complete.'
    },
    {
        id: 'card_218',
        name: 'Property Rebranding Strategy',
        category: 'red_herring',
        cost: 0,
        timeDays: 5,
        prerequisites: [],
        penalties: 15,
        description: 'Develop rebranding plan without understanding market positioning.'
    },
    {
        id: 'card_219',
        name: 'Tenant Appreciation Event',
        category: 'red_herring',
        cost: 0,
        timeDays: 2,
        prerequisites: [],
        penalties: 10,
        description: 'Plan welcome event for tenants before you own the property.'
    }
];
