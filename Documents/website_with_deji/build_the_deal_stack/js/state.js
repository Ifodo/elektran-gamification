/**
 * state.js
 * Manages application state and Local Storage operations
 */

const STATE_KEY = 'buildTheDealStack_state';

const StateManager = {
    /**
     * Initialize a new assessment session
     * Creates fresh state with default values
     */
    initialize() {
        const existingState = this.load();
        
        // If existing incomplete session exists, resume it
        if (existingState && !existingState.completedAt) {
            // Migrate old state if needed
            if (!existingState.activeScenarioId) {
                existingState.activeScenarioId = 'residential_basic';
                existingState.completedScenarios = {};
                this.save(existingState);
            }
            return existingState;
        }

        // Create new session with default scenario
        const defaultScenarioId = 'residential_basic';
        const initialState = {
            sessionId: this.generateSessionId(),
            
            // Multi-Scenario Support
            activeScenarioId: defaultScenarioId,
            scenarioStartedAt: new Date().toISOString(),
            completedScenarios: {},
            
            // Legacy compatibility
            dealScenario: DEAL_SCENARIO,
            
            // Deal Stack
            dealStack: [],
            selectedCards: [],
            riskScore: 0,
            timeUsed: 0,
            
            // Completion
            userEmail: null,
            completedAt: null,
            score: null,
            breakdown: null,
            validationReport: null,
            
            // Timestamps
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        this.save(initialState);
        return initialState;
    },

    /**
     * Load state from Local Storage
     */
    load() {
        try {
            const stateJson = localStorage.getItem(STATE_KEY);
            if (!stateJson) return null;
            return JSON.parse(stateJson);
        } catch (error) {
            console.error('Error loading state from Local Storage:', error);
            return null;
        }
    },

    /**
     * Save state to Local Storage
     */
    save(state) {
        try {
            const stateToSave = {
                ...state,
                lastUpdated: new Date().toISOString()
            };
            const stateJson = JSON.stringify(stateToSave);
            localStorage.setItem(STATE_KEY, stateJson);
            return true;
        } catch (error) {
            console.error('Error saving state to Local Storage:', error);
            return false;
        }
    },

    /**
     * Update specific fields in state
     */
    update(updates) {
        const currentState = this.load();
        if (!currentState) {
            console.warn('No state found to update. Initializing new session.');
            return this.initialize();
        }

        const updatedState = {
            ...currentState,
            ...updates
        };

        return this.save(updatedState);
    },

    /**
     * Clear all state and reset session
     */
    clear() {
        try {
            localStorage.removeItem(STATE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing state from Local Storage:', error);
            return false;
        }
    },

    /**
     * Reset session (clear and initialize fresh)
     */
    reset() {
        this.clear();
        return this.initialize();
    },

    /**
     * Save selected cards to the deal stack
     * @param {Array} cardIds - Array of card IDs to save
     */
    saveSelectedCards(cardIds) {
        if (!Array.isArray(cardIds)) {
            console.error('saveSelectedCards expects an array of card IDs');
            return false;
        }

        // Calculate metrics when cards change
        const metrics = this.calculateMetrics(cardIds);

        return this.update({
            dealStack: cardIds,
            selectedCards: cardIds,
            riskScore: metrics.riskScore,
            timeUsed: metrics.timeUsed
        });
    },

    /**
     * Update stack order
     * @param {Array} orderedCardIds - Array of card IDs in new order
     */
    updateStackOrder(orderedCardIds) {
        if (!Array.isArray(orderedCardIds)) {
            console.error('updateStackOrder expects an array of card IDs');
            return false;
        }

        // Recalculate metrics with new order
        const metrics = this.calculateMetrics(orderedCardIds);

        return this.update({
            dealStack: orderedCardIds,
            selectedCards: orderedCardIds,
            riskScore: metrics.riskScore,
            timeUsed: metrics.timeUsed
        });
    },

    /**
     * Add a card to the stack
     * @param {string} cardId - Card ID to add
     */
    addCard(cardId) {
        const state = this.load();
        if (!state) return false;

        const currentStack = state.dealStack || [];
        
        // Prevent duplicates
        if (currentStack.includes(cardId)) {
            console.warn('Card already in stack:', cardId);
            return false;
        }

        const newStack = [...currentStack, cardId];
        return this.saveSelectedCards(newStack);
    },

    /**
     * Remove a card from the stack
     * @param {string} cardId - Card ID to remove
     */
    removeCard(cardId) {
        const state = this.load();
        if (!state) return false;

        const currentStack = state.dealStack || [];
        const newStack = currentStack.filter(id => id !== cardId);
        
        return this.saveSelectedCards(newStack);
    },

    /**
     * Remove card by position in stack
     * @param {number} position - Index position to remove
     */
    removeCardAtPosition(position) {
        const state = this.load();
        if (!state) return false;

        const currentStack = state.dealStack || [];
        if (position < 0 || position >= currentStack.length) {
            console.error('Invalid position:', position);
            return false;
        }

        const newStack = currentStack.filter((_, index) => index !== position);
        return this.saveSelectedCards(newStack);
    },

    /**
     * Calculate risk score and time used for given cards
     * @param {Array} cardIds - Array of card IDs
     */
    calculateMetrics(cardIds) {
        const cards = cardIds.map(id => 
            TRANSACTION_CARDS.find(card => card.id === id)
        ).filter(card => card !== undefined);

        // Calculate time used
        const timeUsed = cards.reduce((total, card) => {
            return total + (card.timeDays || 0);
        }, 0);

        // Calculate risk score (penalties)
        const riskScore = cards.reduce((total, card) => {
            if (card.category === 'risky' || card.category === 'red_herring') {
                return total + (card.penalties || 0);
            }
            return total;
        }, 0);

        return {
            timeUsed,
            riskScore
        };
    },

    /**
     * Get current risk score
     */
    getRiskScore() {
        const state = this.load();
        return state ? state.riskScore : 0;
    },

    /**
     * Get current time used
     */
    getTimeUsed() {
        const state = this.load();
        return state ? state.timeUsed : 0;
    },

    /**
     * Get current deal stack
     */
    getDealStack() {
        const state = this.load();
        return state ? (state.dealStack || []) : [];
    },

    /**
     * Get selected cards details
     */
    getSelectedCards() {
        const state = this.load();
        if (!state) return [];

        const scenarioId = this.getActiveScenarioId();
        const cardPool = ScenarioManager.getCardPool(scenarioId);
        
        const cardIds = state.dealStack || [];
        return cardIds.map(id => 
            cardPool.find(card => card.id === id)
        ).filter(card => card !== undefined);
    },

    /**
     * Get available cards (not in stack)
     */
    getAvailableCards() {
        const state = this.load();
        const stackIds = state ? (state.dealStack || []) : [];
        
        const scenarioId = this.getActiveScenarioId();
        const cardPool = ScenarioManager.getCardPool(scenarioId);
        
        return cardPool.filter(card => 
            !stackIds.includes(card.id)
        );
    },

    /**
     * Save user email
     * @param {string} email - User email address
     */
    saveEmail(email) {
        if (!email || typeof email !== 'string') {
            console.error('Invalid email provided');
            return false;
        }

        return this.update({ userEmail: email });
    },

    /**
     * Check if email has been captured
     */
    hasEmail() {
        const state = this.load();
        return state && state.userEmail !== null && state.userEmail !== '';
    },

    /**
     * Get user email
     */
    getEmail() {
        const state = this.load();
        return state ? state.userEmail : null;
    },

    /**
     * Save final score and breakdown
     * @param {number} score - Transaction Readiness Score
     * @param {Object} breakdown - Detailed score breakdown
     */
    saveResults(score, breakdown) {
        return this.update({
            score: score,
            breakdown: breakdown,
            completedAt: new Date().toISOString()
        });
    },

    /**
     * Get assessment results
     */
    getResults() {
        const state = this.load();
        if (!state) return null;
        
        return {
            score: state.score,
            breakdown: state.breakdown,
            completedAt: state.completedAt,
            riskScore: state.riskScore,
            timeUsed: state.timeUsed
        };
    },

    /**
     * Check if session is completed
     */
    isCompleted() {
        const state = this.load();
        return state && state.completedAt !== null;
    },

    /**
     * Get session metadata
     */
    getSessionInfo() {
        const state = this.load();
        if (!state) return null;

        return {
            sessionId: state.sessionId,
            createdAt: state.createdAt,
            lastUpdated: state.lastUpdated,
            completedAt: state.completedAt,
            isCompleted: state.completedAt !== null
        };
    },

    /**
     * Get complete session data
     */
    getSessionData() {
        return this.load();
    },

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 11);
        return `session_${timestamp}_${random}`;
    },

    /**
     * Check if Local Storage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.error('Local Storage is not available:', error);
            return false;
        }
    },

    /**
     * Get storage usage info
     */
    getStorageInfo() {
        const state = this.load();
        if (!state) return { exists: false, size: 0 };

        const stateJson = JSON.stringify(state);
        const sizeInBytes = new Blob([stateJson]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);

        return {
            exists: true,
            size: sizeInBytes,
            sizeFormatted: `${sizeInKB} KB`,
            sessionId: state.sessionId,
            lastUpdated: state.lastUpdated
        };
    },
    
    // ========================================
    // MULTI-SCENARIO SUPPORT
    // ========================================
    
    /**
     * Set active scenario and reset stack
     */
    setActiveScenario(scenarioId) {
        if (!ScenarioManager.scenarioExists(scenarioId)) {
            console.error('Invalid scenario ID:', scenarioId);
            return false;
        }
        
        const state = this.load() || this.initialize();
        
        // Reset deal-specific data
        state.activeScenarioId = scenarioId;
        state.scenarioStartedAt = new Date().toISOString();
        state.dealStack = [];
        state.selectedCards = [];
        state.riskScore = 0;
        state.timeUsed = 0;
        state.completedAt = null;
        state.score = null;
        state.breakdown = null;
        state.validationReport = null;
        
        return this.save(state);
    },
    
    /**
     * Get active scenario ID
     */
    getActiveScenarioId() {
        const state = this.load();
        return state ? (state.activeScenarioId || 'residential_basic') : 'residential_basic';
    },
    
    /**
     * Get active scenario data
     */
    getActiveScenario() {
        const scenarioId = this.getActiveScenarioId();
        return ScenarioManager.getScenarioById(scenarioId);
    },
    
    /**
     * Check if scenario is completed
     */
    isScenarioCompleted(scenarioId) {
        const state = this.load();
        if (!state || !state.completedScenarios) return false;
        return !!state.completedScenarios[scenarioId];
    },
    
    /**
     * Get all completed scenarios
     */
    getCompletedScenarios() {
        const state = this.load();
        return state ? (state.completedScenarios || {}) : {};
    },
    
    /**
     * Get best score for a scenario
     */
    getBestScore(scenarioId) {
        const state = this.load();
        if (!state || !state.completedScenarios || !state.completedScenarios[scenarioId]) {
            return null;
        }
        return state.completedScenarios[scenarioId].score;
    },
    
    /**
     * Mark scenario as completed with score
     */
    completeScenario(scenarioId, score) {
        const state = this.load();
        if (!state) return false;
        
        if (!state.completedScenarios) {
            state.completedScenarios = {};
        }
        
        const existing = state.completedScenarios[scenarioId];
        
        state.completedScenarios[scenarioId] = {
            completedAt: new Date().toISOString(),
            score: score,
            attempts: existing ? existing.attempts + 1 : 1,
            bestScore: existing ? Math.max(existing.bestScore || 0, score) : score
        };
        
        return this.save(state);
    },
    
    /**
     * Change scenario with confirmation (clears current progress)
     */
    changeScenario(newScenarioId) {
        const state = this.load();
        if (!state) return false;
        
        // Save current scenario as completed if it was in progress
        if (state.activeScenarioId && state.dealStack.length > 0) {
            console.log('Clearing in-progress scenario:', state.activeScenarioId);
        }
        
        return this.setActiveScenario(newScenarioId);
    },
    
    /**
     * Reset current scenario progress only
     */
    resetScenarioProgress() {
        const state = this.load();
        if (!state) return false;
        
        state.dealStack = [];
        state.selectedCards = [];
        state.riskScore = 0;
        state.timeUsed = 0;
        state.completedAt = null;
        state.score = null;
        state.breakdown = null;
        state.validationReport = null;
        state.scenarioStartedAt = new Date().toISOString();
        
        return this.save(state);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
