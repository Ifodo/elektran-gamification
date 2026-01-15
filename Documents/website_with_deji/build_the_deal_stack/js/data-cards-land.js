/**
 * data-cards-land.js
 * Card pool specific to Land Acquisition (Investment) scenarios
 */

const LAND_CARDS = [
    // ========================================
    // MANDATORY CARDS - LAND SPECIFIC
    // ========================================
    {
        id: 'card_301',
        name: 'Surveyor Report & Beacons',
        category: 'mandatory',
        cost: 400000,
        timeDays: 7,
        prerequisites: [],
        penalties: 0,
        description: 'Licensed surveyor confirms boundaries and installs permanent beacons.'
    },
    {
        id: 'card_302',
        name: 'Community Clearance',
        category: 'mandatory',
        cost: 200000,
        timeDays: 10,
        prerequisites: [],
        penalties: 0,
        description: 'Obtain clearance from community leaders and local government.'
    },
    {
        id: 'card_303',
        name: 'Governor\'s Consent Application',
        category: 'mandatory',
        cost: 800000,
        timeDays: 14,
        prerequisites: ['card_004'], // Legal Due Diligence
        penalties: 0,
        description: 'Apply for Governor\'s Consent for land transfer as required by law.'
    },
    {
        id: 'card_304',
        name: 'Plot Demarcation',
        category: 'mandatory',
        cost: 300000,
        timeDays: 3,
        prerequisites: ['card_301'],
        penalties: 0,
        description: 'Physical demarcation with pillars or fencing to establish boundaries.'
    },
    {
        id: 'card_305',
        name: 'Family/Chieftaincy Verification',
        category: 'mandatory',
        cost: 250000,
        timeDays: 12,
        prerequisites: [],
        penalties: 0,
        description: 'Verify seller has family/community authorization to sell the land.'
    },
    {
        id: 'card_306',
        name: 'Land Documentation',
        category: 'mandatory',
        cost: 500000,
        timeDays: 5,
        prerequisites: ['card_303', 'card_305'],
        penalties: 0,
        description: 'Compile all land documents including deed, survey, and government approvals.'
    },
    
    // ========================================
    // OPTIONAL CARDS - LAND
    // ========================================
    {
        id: 'card_307',
        name: 'Soil Test Analysis',
        category: 'optional',
        cost: 350000,
        timeDays: 6,
        prerequisites: [],
        penalties: 0,
        description: 'Geotechnical analysis to assess soil quality for future construction.'
    },
    {
        id: 'card_308',
        name: 'Development Potential Study',
        category: 'optional',
        cost: 400000,
        timeDays: 8,
        prerequisites: [],
        penalties: 0,
        description: 'Assess zoning, access, utilities, and development restrictions.'
    },
    {
        id: 'card_309',
        name: 'Neighborhood Development Plan Review',
        category: 'optional',
        cost: 0,
        timeDays: 4,
        prerequisites: [],
        penalties: 0,
        description: 'Research planned infrastructure and area development projects.'
    },
    {
        id: 'card_310',
        name: 'Future Resale Market Analysis',
        category: 'optional',
        cost: 200000,
        timeDays: 5,
        prerequisites: [],
        penalties: 0,
        description: 'Analyze future market trends and appreciation potential.'
    },
    
    // ========================================
    // RISKY CARDS - LAND
    // ========================================
    {
        id: 'card_311',
        name: 'Skip Community Verification',
        category: 'risky',
        cost: -200000,
        timeDays: -10,
        prerequisites: [],
        penalties: 45,
        description: 'Bypass community clearance—risk of land grabbing disputes.'
    },
    {
        id: 'card_312',
        name: 'Trust Family Receipt',
        category: 'risky',
        cost: -250000,
        timeDays: -12,
        prerequisites: [],
        penalties: 50,
        description: 'Accept family receipt without proper verification—high fraud risk.'
    },
    {
        id: 'card_313',
        name: 'Skip Survey',
        category: 'risky',
        cost: -400000,
        timeDays: -7,
        prerequisites: [],
        penalties: 40,
        description: 'Proceed without professional survey—boundary dispute risk.'
    },
    {
        id: 'card_314',
        name: 'Verbal Boundary Agreement',
        category: 'risky',
        cost: 0,
        timeDays: -3,
        prerequisites: [],
        penalties: 35,
        description: 'Accept verbal boundary descriptions without physical demarcation.'
    },
    
    // ========================================
    // RED HERRING CARDS - LAND
    // ========================================
    {
        id: 'card_315',
        name: 'Immediate Development Design',
        category: 'red_herring',
        cost: 600000,
        timeDays: 10,
        prerequisites: [],
        penalties: 18,
        description: 'Commission architectural designs before owning the land.'
    },
    {
        id: 'card_316',
        name: 'Fencing Contract',
        category: 'red_herring',
        cost: 0,
        timeDays: 5,
        prerequisites: [],
        penalties: 15,
        description: 'Arrange fencing before title transfer and payment.'
    },
    {
        id: 'card_317',
        name: 'Plot Signage',
        category: 'red_herring',
        cost: 0,
        timeDays: 2,
        prerequisites: [],
        penalties: 10,
        description: 'Install "Property of..." signage prematurely.'
    },
    {
        id: 'card_318',
        name: 'Investment Partnership Solicitation',
        category: 'red_herring',
        cost: 0,
        timeDays: 3,
        prerequisites: [],
        penalties: 12,
        description: 'Seek development partners before securing land ownership.'
    }
];
