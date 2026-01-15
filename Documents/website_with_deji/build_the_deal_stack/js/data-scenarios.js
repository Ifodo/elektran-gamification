/**
 * data-scenarios.js
 * Defines all available deal scenarios
 * Each scenario represents a different transaction type with unique characteristics
 */

const DEAL_SCENARIOS = [
    // ========================================
    // SCENARIO 1: RESIDENTIAL BASIC
    // ========================================
    {
        id: 'residential_basic',
        title: 'Residential Purchase (Owner-Occupier)',
        
        // Property Details
        propertyType: '4-Bedroom Detached House',
        location: 'Lekki Phase 2, Lagos',
        price: 85000000,
        priceFormatted: '₦85,000,000',
        
        // Timeline & Difficulty
        timelineDays: 45,
        difficulty: 'low',
        difficultyLabel: 'Beginner-Friendly',
        
        // Description
        description: 'Standard residential transaction for owner-occupier. You are purchasing a completed property in a gated estate with clear title documentation.',
        dealContext: 'This is the most common type of Nigerian real estate transaction. Focus on verifying ownership, conducting thorough inspections, and securing proper documentation.',
        
        // Visual
        icon: '🏠',
        badge: 'beginner-friendly',
        
        // Metadata
        estimatedDuration: '15-20 minutes',
        learningOutcomes: [
            'Understanding mandatory property verification steps',
            'Proper sequencing of legal and financial processes',
            'Risk mitigation in residential purchases',
            'Timeline management for standard deals'
        ],
        realWorldContext: 'Over 70% of Nigerian property transactions are residential purchases. Mastering this process is essential for any property buyer.',
        
        // Card IDs (defined in card pools)
        mandatoryCards: [
            'card_001', // Bank Pre-Approval
            'card_002', // Property Inspection
            'card_003', // Land Verification at Registry
            'card_004', // Legal Due Diligence
            'card_005', // Property Survey
            'card_006', // Purchase Agreement Signing
            'card_007', // Initial Deposit Payment
            'card_008', // Property Insurance
            'card_009', // Final Payment
            'card_010'  // Title Registration
        ],
        
        optionalCards: [
            'card_011', // Estate Infrastructure Check
            'card_012', // Environmental Impact Assessment
            'card_013', // Neighborhood Verification
            'card_014'  // Building Structural Assessment
        ],
        
        riskyCards: [
            'card_015', // Skip Land Verification
            'card_016', // Use Unverified Agent
            'card_017', // Skip Legal Due Diligence
            'card_018'  // Verbal Agreement Only
        ],
        
        redHerringCards: [
            'card_019', // Interior Design Consultation
            'card_020', // Furniture Shopping
            'card_021', // Plan Housewarming Party
            'card_022'  // Social Media Announcement
        ]
    },
    
    // ========================================
    // SCENARIO 2: OFF-PLAN INVESTMENT
    // ========================================
    {
        id: 'offplan_investment',
        title: 'Off-Plan Investment Deal',
        
        // Property Details
        propertyType: '3-Bedroom Apartment (Under Construction)',
        location: 'Epe, Lagos',
        price: 42000000,
        priceFormatted: '₦42,000,000',
        
        // Timeline & Difficulty
        timelineDays: 180,
        difficulty: 'medium',
        difficultyLabel: 'Medium',
        
        // Description
        description: 'Investment in an under-construction property with milestone-based payments. Higher returns but increased delivery risk.',
        dealContext: 'Off-plan investments offer price advantages but require careful developer vetting, escrow protection, and milestone monitoring.',
        
        // Visual
        icon: '🏗️',
        badge: 'investment-focused',
        
        // Metadata
        estimatedDuration: '20-25 minutes',
        learningOutcomes: [
            'Developer due diligence processes',
            'Milestone-based payment structuring',
            'Escrow and payment protection mechanisms',
            'Construction phase risk management'
        ],
        realWorldContext: 'Off-plan properties offer 20-40% discounts but account for 60% of investment disputes. Proper structuring is critical.',
        
        // Card IDs
        mandatoryCards: [
            'card_101', // Developer Due Diligence
            'card_102', // Building Plan Approval Verification
            'card_003', // Land Verification at Registry (universal)
            'card_004', // Legal Due Diligence (universal)
            'card_103', // Escrow Account Setup
            'card_104', // Milestone Payment Schedule
            'card_105', // Construction Monitoring Agreement
            'card_106', // Property Insurance (Off-Plan)
            'card_107', // Final Inspection & Handover
            'card_010'  // Title Registration (universal)
        ],
        
        optionalCards: [
            'card_108', // Architect Consultation
            'card_109', // Construction Phase Insurance
            'card_110', // Developer Financial Audit
            'card_111'  // Exit Strategy Planning
        ],
        
        riskyCards: [
            'card_112', // Skip Developer Verification
            'card_113', // Direct Payment to Developer (No Escrow)
            'card_114', // Skip Building Plan Verification
            'card_115'  // Trust Developer Timeline
        ],
        
        redHerringCards: [
            'card_116', // Interior Customization Planning
            'card_117', // Investment Portfolio Branding
            'card_118', // Early Property Listing
            'card_119'  // Social Media Investment Announcement
        ]
    },
    
    // ========================================
    // SCENARIO 3: COMMERCIAL PROPERTY
    // ========================================
    {
        id: 'commercial_property',
        title: 'Commercial Property Acquisition',
        
        // Property Details
        propertyType: 'Office Complex (3 Floors)',
        location: 'Victoria Island, Lagos',
        price: 320000000,
        priceFormatted: '₦320,000,000',
        
        // Timeline & Difficulty
        timelineDays: 90,
        difficulty: 'high',
        difficultyLabel: 'High',
        
        // Description
        description: 'Acquisition of income-generating commercial property with existing tenants. Complex due diligence and valuation required.',
        dealContext: 'Commercial deals involve tenant analysis, income projections, market comparables, and sophisticated financial modeling.',
        
        // Visual
        icon: '🏢',
        badge: 'advanced',
        
        // Metadata
        estimatedDuration: '25-30 minutes',
        learningOutcomes: [
            'Commercial property valuation methods',
            'Tenant lease analysis and income verification',
            'Market comparable assessment',
            'Commercial transaction structuring'
        ],
        realWorldContext: 'Commercial properties generate passive income but require comprehensive due diligence. Deal complexity is 3-4x residential transactions.',
        
        // Card IDs
        mandatoryCards: [
            'card_201', // Commercial Valuation
            'card_202', // Tenant Lease Review
            'card_203', // Rental Income Verification
            'card_003', // Land Verification at Registry (universal)
            'card_004', // Legal Due Diligence (universal)
            'card_204', // Building Code Compliance Check
            'card_205', // Market Comparable Analysis
            'card_006', // Purchase Agreement Signing (universal)
            'card_206', // Commercial Property Insurance
            'card_009', // Final Payment (universal)
            'card_207'  // Commercial Title & Registration
        ],
        
        optionalCards: [
            'card_208', // Property Management Company Assessment
            'card_209', // Renovation Cost Analysis
            'card_210', // Tenant Satisfaction Survey
            'card_211'  // Future Development Potential Study
        ],
        
        riskyCards: [
            'card_212', // Skip Tenant Verification
            'card_213', // Accept Inflated Income Projections
            'card_214', // Skip Market Analysis
            'card_215'  // Ignore Building Code Issues
        ],
        
        redHerringCards: [
            'card_216', // Immediate Renovation Planning
            'card_217', // New Signage Design
            'card_218', // Property Rebranding Strategy
            'card_219'  // Tenant Appreciation Event
        ]
    },
    
    // ========================================
    // SCENARIO 4: LAND ACQUISITION
    // ========================================
    {
        id: 'land_banking',
        title: 'Land Acquisition (Investment)',
        
        // Property Details
        propertyType: '1000 sqm Plot (Residential Zone)',
        location: 'Ibeju-Lekki, Lagos',
        price: 25000000,
        priceFormatted: '₦25,000,000',
        
        // Timeline & Difficulty
        timelineDays: 60,
        difficulty: 'medium',
        difficultyLabel: 'Medium',
        
        // Description
        description: 'Land purchase for future development or resale. Focus on title clarity, survey accuracy, and government approvals.',
        dealContext: 'Land banking is popular for capital appreciation but requires meticulous verification to avoid acquisition disputes.',
        
        // Visual
        icon: '🌾',
        badge: 'investment',
        
        // Metadata
        estimatedDuration: '18-22 minutes',
        learningOutcomes: [
            'Land title verification processes',
            'Survey and beacon demarcation',
            'Community and government clearances',
            'Land acquisition risk management'
        ],
        realWorldContext: 'Land fraud accounts for 40% of Nigerian property disputes. Thorough verification is non-negotiable for land transactions.',
        
        // Card IDs
        mandatoryCards: [
            'card_003', // Land Verification at Registry (universal)
            'card_301', // Surveyor Report & Beacons
            'card_302', // Community Clearance
            'card_303', // Governor\'s Consent Application
            'card_004', // Legal Due Diligence (universal)
            'card_304', // Plot Demarcation
            'card_305', // Family/Chieftaincy Verification
            'card_006', // Purchase Agreement Signing (universal)
            'card_306', // Land Documentation
            'card_009'  // Final Payment (universal)
        ],
        
        optionalCards: [
            'card_307', // Soil Test Analysis
            'card_308', // Development Potential Study
            'card_309', // Neighborhood Development Plan Review
            'card_310'  // Future Resale Market Analysis
        ],
        
        riskyCards: [
            'card_311', // Skip Community Verification
            'card_312', // Trust Family Receipt
            'card_313', // Skip Survey
            'card_314'  // Verbal Boundary Agreement
        ],
        
        redHerringCards: [
            'card_315', // Immediate Development Design
            'card_316', // Fencing Contract
            'card_317', // Plot Signage
            'card_318'  // Investment Partnership Solicitation
        ]
    }
];

// Helper function to get scenario by ID
function getScenarioById(scenarioId) {
    return DEAL_SCENARIOS.find(scenario => scenario.id === scenarioId);
}

// Helper function to get all scenario IDs
function getAllScenarioIds() {
    return DEAL_SCENARIOS.map(scenario => scenario.id);
}

// Helper function to get scenarios by difficulty
function getScenariosByDifficulty(difficulty) {
    return DEAL_SCENARIOS.filter(scenario => scenario.difficulty === difficulty);
}
