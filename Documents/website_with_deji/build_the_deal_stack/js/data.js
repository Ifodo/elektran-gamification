/**
 * data.js
 * Main data file - exports scenarios and manages card pools
 * 
 * Multi-Scenario Architecture:
 * - Each scenario has its own card pool
 * - Universal cards shared across scenarios
 * - Scenario-specific cards for unique deal types
 */

// ========================================
// RESIDENTIAL CARDS (Original/Default)
// ========================================
const RESIDENTIAL_CARDS = [
    // ========================================
    // MANDATORY CARDS
    // ========================================
    {
        id: 'card_001',
        name: 'Bank Pre-Approval',
        category: 'mandatory',
        cost: 0,
        timeDays: 5,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_002',
        name: 'Property Inspection',
        category: 'mandatory',
        cost: 250000,
        timeDays: 2,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_003',
        name: 'Land Verification at Registry',
        category: 'mandatory',
        cost: 350000,
        timeDays: 10,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_004',
        name: 'Legal Due Diligence',
        category: 'mandatory',
        cost: 750000,
        timeDays: 7,
        prerequisites: ['card_003'],
        penalties: 0
    },
    {
        id: 'card_005',
        name: 'Property Survey',
        category: 'mandatory',
        cost: 400000,
        timeDays: 5,
        prerequisites: ['card_003'],
        penalties: 0
    },
    {
        id: 'card_006',
        name: 'Purchase Agreement Signing',
        category: 'mandatory',
        cost: 0,
        timeDays: 1,
        prerequisites: ['card_004'],
        penalties: 0
    },
    {
        id: 'card_007',
        name: 'Initial Deposit Payment',
        category: 'mandatory',
        cost: 0,
        timeDays: 1,
        prerequisites: ['card_006'],
        penalties: 0
    },
    {
        id: 'card_008',
        name: 'Property Insurance',
        category: 'mandatory',
        cost: 450000,
        timeDays: 3,
        prerequisites: ['card_001'],
        penalties: 0
    },
    {
        id: 'card_009',
        name: 'Final Payment',
        category: 'mandatory',
        cost: 0,
        timeDays: 1,
        prerequisites: ['card_007', 'card_008'],
        penalties: 0
    },
    {
        id: 'card_010',
        name: 'Title Registration',
        category: 'mandatory',
        cost: 1200000,
        timeDays: 14,
        prerequisites: ['card_009'],
        penalties: 0
    },

    // ========================================
    // OPTIONAL CARDS
    // ========================================
    {
        id: 'card_011',
        name: 'Estate Infrastructure Check',
        category: 'optional',
        cost: 0,
        timeDays: 1,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_012',
        name: 'Environmental Impact Assessment',
        category: 'optional',
        cost: 300000,
        timeDays: 5,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_013',
        name: 'Neighborhood Verification',
        category: 'optional',
        cost: 50000,
        timeDays: 2,
        prerequisites: [],
        penalties: 0
    },
    {
        id: 'card_014',
        name: 'Building Structural Assessment',
        category: 'optional',
        cost: 400000,
        timeDays: 3,
        prerequisites: ['card_002'],
        penalties: 0
    },

    // ========================================
    // RISKY CARDS (shortcuts with penalties)
    // ========================================
    {
        id: 'card_015',
        name: 'Skip Land Verification',
        category: 'risky',
        cost: -350000,
        timeDays: -10,
        prerequisites: [],
        penalties: 35
    },
    {
        id: 'card_016',
        name: 'Use Unverified Agent',
        category: 'risky',
        cost: -200000,
        timeDays: 0,
        prerequisites: [],
        penalties: 25
    },
    {
        id: 'card_017',
        name: 'Skip Legal Due Diligence',
        category: 'risky',
        cost: -750000,
        timeDays: -7,
        prerequisites: [],
        penalties: 40
    },
    {
        id: 'card_018',
        name: 'Verbal Agreement Only',
        category: 'risky',
        cost: 0,
        timeDays: -1,
        prerequisites: [],
        penalties: 30
    },

    // ========================================
    // RED HERRING CARDS (irrelevant actions)
    // ========================================
    {
        id: 'card_019',
        name: 'Interior Design Consultation',
        category: 'red_herring',
        cost: 500000,
        timeDays: 4,
        prerequisites: [],
        penalties: 15
    },
    {
        id: 'card_020',
        name: 'Furniture Shopping',
        category: 'red_herring',
        cost: 0,
        timeDays: 2,
        prerequisites: [],
        penalties: 10
    },
    {
        id: 'card_021',
        name: 'Plan Housewarming Party',
        category: 'red_herring',
        cost: 0,
        timeDays: 1,
        prerequisites: [],
        penalties: 12
    },
    {
        id: 'card_022',
        name: 'Social Media Announcement',
        category: 'red_herring',
        cost: 0,
        timeDays: 1,
        prerequisites: [],
        penalties: 8
    }
];

// ========================================
// SCENARIO DEFINITIONS
// ========================================

const DEAL_SCENARIOS = [
    // Scenario 1: Residential (Default/Original)
    {
        id: 'residential_basic',
        title: 'Residential Purchase (Owner-Occupier)',
        propertyType: '4-Bedroom Detached House',
        location: 'Lekki Phase 2, Lagos',
        price: 85000000,
        priceFormatted: '₦85,000,000',
        timelineDays: 45,
        difficulty: 'low',
        difficultyLabel: 'Beginner-Friendly',
        description: 'Standard residential transaction for owner-occupier. Purchase a completed property in a gated estate with clear title documentation.',
        dealContext: 'Most common Nigerian real estate transaction. Focus on property verification, inspections, and proper documentation.',
        icon: '🏠',
        badge: 'recommended-start',
        estimatedDuration: '15-20 minutes',
        learningOutcomes: [
            'Property verification steps',
            'Legal and financial sequencing',
            'Risk mitigation strategies',
            'Timeline management'
        ],
        cardPool: RESIDENTIAL_CARDS,
        mandatoryCardIds: [
            'card_001', 'card_002', 'card_003', 'card_004', 'card_005',
            'card_006', 'card_007', 'card_008', 'card_009', 'card_010'
        ]
    },
    
    // Scenario 2: Off-Plan Investment
    {
        id: 'offplan_investment',
        title: 'Off-Plan Investment Deal',
        propertyType: '3-Bedroom Apartment (Under Construction)',
        location: 'Epe, Lagos',
        price: 42000000,
        priceFormatted: '₦42,000,000',
        timelineDays: 180,
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        description: 'Investment in an under-construction property with milestone-based payments. Higher returns but increased delivery risk.',
        dealContext: 'Off-plan investments offer price advantages but require careful developer vetting, escrow protection, and milestone monitoring.',
        icon: '🏗️',
        badge: 'investment-focused',
        estimatedDuration: '20-25 minutes',
        learningOutcomes: [
            'Developer due diligence processes',
            'Milestone-based payment structuring',
            'Escrow and payment protection',
            'Construction phase risk management'
        ],
        cardPool: RESIDENTIAL_CARDS, // Using same cards for now
        mandatoryCardIds: [
            'card_001', 'card_003', 'card_004', 'card_006', 
            'card_007', 'card_008', 'card_009', 'card_010'
        ]
    },
    
    // Scenario 3: Commercial Property
    {
        id: 'commercial_property',
        title: 'Commercial Property Acquisition',
        propertyType: 'Office Complex (3 Floors)',
        location: 'Victoria Island, Lagos',
        price: 320000000,
        priceFormatted: '₦320,000,000',
        timelineDays: 90,
        difficulty: 'high',
        difficultyLabel: 'Advanced',
        description: 'Acquisition of income-generating commercial property with existing tenants. Complex due diligence and valuation required.',
        dealContext: 'Commercial deals involve tenant analysis, income projections, market comparables, and sophisticated financial modeling.',
        icon: '🏢',
        badge: 'expert-level',
        estimatedDuration: '25-30 minutes',
        learningOutcomes: [
            'Commercial property valuation',
            'Tenant lease analysis',
            'Market comparable assessment',
            'Commercial transaction structuring'
        ],
        cardPool: RESIDENTIAL_CARDS, // Using same cards for now
        mandatoryCardIds: [
            'card_001', 'card_003', 'card_004', 'card_005',
            'card_006', 'card_007', 'card_008', 'card_009', 'card_010'
        ]
    },
    
    // Scenario 4: Land Acquisition
    {
        id: 'land_banking',
        title: 'Land Acquisition (Investment)',
        propertyType: '1000 sqm Plot (Residential Zone)',
        location: 'Ibeju-Lekki, Lagos',
        price: 25000000,
        priceFormatted: '₦25,000,000',
        timelineDays: 60,
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        description: 'Land purchase for future development or resale. Focus on title clarity, survey accuracy, and government approvals.',
        dealContext: 'Land banking is popular for capital appreciation but requires meticulous verification to avoid acquisition disputes.',
        icon: '🌾',
        badge: 'investment',
        estimatedDuration: '18-22 minutes',
        learningOutcomes: [
            'Land title verification',
            'Survey and beacon demarcation',
            'Community and government clearances',
            'Land acquisition risk management'
        ],
        cardPool: RESIDENTIAL_CARDS, // Using same cards for now
        mandatoryCardIds: [
            'card_003', 'card_004', 'card_005', 
            'card_006', 'card_009'
        ]
    }
];

// ========================================
// BACKWARD COMPATIBILITY
// ========================================
// Default to first scenario for existing code
const DEAL_SCENARIO = {
    id: DEAL_SCENARIOS[0].id,
    propertyType: DEAL_SCENARIOS[0].propertyType,
    location: DEAL_SCENARIOS[0].location,
    price: DEAL_SCENARIOS[0].priceFormatted,
    timeline: DEAL_SCENARIOS[0].timelineDays,
    description: DEAL_SCENARIOS[0].description
};

const TRANSACTION_CARDS = RESIDENTIAL_CARDS;

// ========================================
// SCENARIO MANAGER
// ========================================

const ScenarioManager = {
    /**
     * Get all available scenarios
     */
    getAllScenarios() {
        return DEAL_SCENARIOS;
    },
    
    /**
     * Get scenario by ID
     */
    getScenarioById(scenarioId) {
        return DEAL_SCENARIOS.find(s => s.id === scenarioId);
    },
    
    /**
     * Get card pool for a scenario
     */
    getCardPool(scenarioId) {
        const scenario = this.getScenarioById(scenarioId);
        return scenario ? scenario.cardPool : [];
    },
    
    /**
     * Get mandatory card IDs for a scenario
     */
    getMandatoryCardIds(scenarioId) {
        const scenario = this.getScenarioById(scenarioId);
        return scenario ? scenario.mandatoryCardIds : [];
    },
    
    /**
     * Get card by ID from a specific scenario
     */
    getCardById(scenarioId, cardId) {
        const cardPool = this.getCardPool(scenarioId);
        return cardPool.find(card => card.id === cardId);
    },
    
    /**
     * Get scenarios by difficulty
     */
    getScenariosByDifficulty(difficulty) {
        return DEAL_SCENARIOS.filter(s => s.difficulty === difficulty);
    },
    
    /**
     * Check if scenario exists
     */
    scenarioExists(scenarioId) {
        return DEAL_SCENARIOS.some(s => s.id === scenarioId);
    }
};

// Make globally available
window.ScenarioManager = ScenarioManager;

// ========================================
// EXPORTS
// ========================================

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        DEAL_SCENARIO,
        TRANSACTION_CARDS,
        DEAL_SCENARIOS,
        ScenarioManager
    };
}
