/**
 * game.js
 * Transaction assessment interface and drag-and-drop functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

let currentState = null;

/**
 * Initialize the assessment interface
 * 
 * Edge Case: Handles page reload/refresh mid-session by:
 * - Detecting existing session state
 * - Restoring deal stack from Local Storage
 * - Preserving user progress
 */
function initializeGame() {
    // Check if Local Storage is available
    if (!checkStorageAvailability()) {
        return; // Cannot proceed without storage
    }

    // Initialize or load session state
    currentState = StateManager.initialize();

    // Edge Case 3a: Redirect if assessment already completed
    if (currentState.completedAt && currentState.score !== null) {
        console.log('Assessment already completed. Redirecting to results...');
        ModalManager.alert(
            'Assessment Already Completed',
            'You have already submitted this assessment.\n\nRedirecting to your results page...',
            'info'
        );
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 2000);
        return;
    }

    // Edge Case 3b: Handle reload or refresh mid-session
    const existingStack = StateManager.getDealStack();
    const sessionInfo = StateManager.getSessionInfo();
    
    if (existingStack && existingStack.length > 0) {
        console.log('Session restored from Local Storage:', {
            cards: existingStack.length,
            sessionId: currentState.sessionId,
            lastUpdated: sessionInfo.lastUpdated
        });
        
        // Show subtle notification that progress was restored
        showSessionRestoredNotification(existingStack.length);
    } else {
        console.log('New session initialized');
    }

    // Render deal details
    renderDealDetails();

    // Render available cards
    renderAvailableCards();

    // Render deal stack
    renderDealStack();

    // Update indicators
    updateIndicators();

    // Attach event listeners
    attachEventListeners();
}

/**
 * Render deal details with scenario context
 */
function renderDealDetails() {
    const dealDetailsContainer = document.getElementById('dealDetails');
    const scenario = StateManager.getActiveScenario();
    
    if (!scenario) {
        console.error('No active scenario found. Redirecting to home...');
        ModalManager.alert(
            'No Scenario Selected',
            'Please select a transaction scenario to begin.',
            'error'
        );
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Difficulty badge styling
    const difficultyClass = `difficulty-${scenario.difficulty}`;
    const difficultyEmoji = scenario.difficulty === 'low' ? '⚡' : 
                           scenario.difficulty === 'medium' ? '⚡⚡' : '⚡⚡⚡';

    dealDetailsContainer.innerHTML = `
        <div class="scenario-header-banner">
            <div class="scenario-banner-content">
                <span class="scenario-banner-icon">${scenario.icon}</span>
                <div class="scenario-banner-text">
                    <h2 class="scenario-banner-title">${scenario.title}</h2>
                    <div class="scenario-banner-badges">
                        <span class="difficulty-badge ${difficultyClass}">
                            ${difficultyEmoji} ${scenario.difficultyLabel}
                        </span>
                    </div>
                </div>
            </div>
            <button class="btn-change-scenario" id="changeScenarioBtn" title="Switch to a different scenario">
                Change Scenario
            </button>
        </div>
        <div class="deal-meta-grid">
            <div class="deal-meta-item">
                <span class="deal-meta-icon">🏠</span>
                <div class="deal-meta-content">
                    <span class="deal-meta-label">Property</span>
                    <span class="deal-meta-value">${scenario.propertyType}</span>
                </div>
            </div>
            <div class="deal-meta-item">
                <span class="deal-meta-icon">📍</span>
                <div class="deal-meta-content">
                    <span class="deal-meta-label">Location</span>
                    <span class="deal-meta-value">${scenario.location}</span>
                </div>
            </div>
            <div class="deal-meta-item">
                <span class="deal-meta-icon">💰</span>
                <div class="deal-meta-content">
                    <span class="deal-meta-label">Price</span>
                    <span class="deal-meta-value">${scenario.priceFormatted}</span>
                </div>
            </div>
            <div class="deal-meta-item">
                <span class="deal-meta-icon">⏱️</span>
                <div class="deal-meta-content">
                    <span class="deal-meta-label">Timeline</span>
                    <span class="deal-meta-value">${scenario.timelineDays} Days</span>
                </div>
            </div>
        </div>
        ${scenario.description ? `<p class="deal-description">${scenario.description}</p>` : ''}
    `;
    
    // Attach event listener for change scenario button
    setTimeout(() => {
        const changeBtn = document.getElementById('changeScenarioBtn');
        if (changeBtn) {
            changeBtn.addEventListener('click', handleChangeScenario);
        }
    }, 0);
}

/**
 * Render available cards
 */
function renderAvailableCards() {
    const cardsContainer = document.getElementById('availableCards');
    const availableCards = StateManager.getAvailableCards();

    if (availableCards.length === 0) {
        cardsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">All cards have been added to your stack</p>';
        return;
    }

    cardsContainer.innerHTML = availableCards.map(card => `
        <div class="card" draggable="true" data-card-id="${card.id}" data-category="${card.category}">
            <div class="card-category ${card.category}">${formatCategory(card.category)}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-meta">
                ${card.timeDays ? `<span class="card-meta-item"><span style="opacity: 0.6;">⏱</span> ${card.timeDays}d</span>` : ''}
                ${card.cost !== 0 ? `<span class="card-meta-item"><span style="opacity: 0.6;">₦</span> ${formatCurrency(card.cost)}</span>` : ''}
            </div>
        </div>
    `).join('');

    // Attach drag event listeners to cards
    const cardElements = cardsContainer.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
}

/**
 * Render deal stack
 */
function renderDealStack() {
    const stackContainer = document.getElementById('dealStack');
    const stackCards = StateManager.getSelectedCards();

    if (stackCards.length === 0) {
        stackContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">Drag transaction steps here to build your deal stack</p>';
    } else {
        stackContainer.innerHTML = stackCards.map((card, index) => {
            return `
                <div class="stack-slot filled" 
                     data-position="${index}" 
                     data-card-id="${card.id}"
                     data-category="${card.category}"
                     draggable="true">
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; cursor: move;">
                        <span style="font-weight: var(--font-weight-bold); color: var(--color-primary); font-size: 1rem; min-width: 1.5rem;">${index + 1}</span>
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                <span class="card-category ${card.category}" style="font-size: 0.625rem; padding: 0.125rem 0.4rem;">${formatCategory(card.category)}</span>
                                <span style="font-weight: var(--font-weight-semibold); color: var(--color-text-primary); font-size: 0.875rem;">${card.name}</span>
                            </div>
                            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
                                <span style="opacity: 0.6;">⏱</span> ${card.timeDays}d
                                ${card.cost !== 0 ? `<span style="margin-left: 0.75rem;"><span style="opacity: 0.6;">₦</span> ${formatCurrency(card.cost)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="removeFromStack(${index})" style="flex-shrink: 0;">✕</button>
                </div>
            `;
        }).join('');
        
        // Attach drag event listeners to stack slots for reordering
        const stackSlots = stackContainer.querySelectorAll('.stack-slot');
        stackSlots.forEach(slot => {
            slot.addEventListener('dragstart', handleStackDragStart);
            slot.addEventListener('dragend', handleStackDragEnd);
            slot.addEventListener('dragover', handleSlotDragOver);
            slot.addEventListener('dragleave', handleSlotDragLeave);
            slot.addEventListener('drop', handleSlotDrop);
        });
    }

    // Make stack container a drop zone for new cards
    stackContainer.removeEventListener('dragover', handleDragOver);
    stackContainer.removeEventListener('dragleave', handleDragLeave);
    stackContainer.removeEventListener('drop', handleDrop);
    
    stackContainer.addEventListener('dragover', handleDragOver);
    stackContainer.addEventListener('dragleave', handleDragLeave);
    stackContainer.addEventListener('drop', handleDrop);
}

/**
 * Update indicators
 */
function updateIndicators() {
    const stackCards = StateManager.getSelectedCards();
    const timeUsed = StateManager.getTimeUsed();
    const riskScore = StateManager.getRiskScore();

    // Update stack count with minimum requirement indicator
    const MINIMUM_STEPS = 9;
    const stackCount = document.getElementById('stackCount');
    const validateBtn = document.getElementById('validateBtn');
    
    if (stackCount) {
        if (stackCards.length < MINIMUM_STEPS) {
            stackCount.textContent = `${stackCards.length}/${MINIMUM_STEPS} minimum`;
            stackCount.style.color = 'var(--color-accent)'; // Orange/warning color
            
            // Disable Review Deal button until minimum is met
            if (validateBtn) {
                validateBtn.disabled = true;
                validateBtn.style.opacity = '0.5';
                validateBtn.style.cursor = 'not-allowed';
                validateBtn.title = `Add ${MINIMUM_STEPS - stackCards.length} more step${MINIMUM_STEPS - stackCards.length !== 1 ? 's' : ''} to unlock assessment`;
            }
        } else {
            stackCount.textContent = `${stackCards.length} ${stackCards.length === 1 ? 'step' : 'steps'}`;
            stackCount.style.color = 'var(--color-primary)'; // Green/success color
            
            // Enable Review Deal button when minimum is met
            if (validateBtn) {
                validateBtn.disabled = false;
                validateBtn.style.opacity = '1';
                validateBtn.style.cursor = 'pointer';
                validateBtn.title = 'Submit your deal stack for assessment';
            }
        }
    }

    // Update time indicator (scenario-aware)
    const activeScenario = StateManager.getActiveScenario();
    const timeline = activeScenario ? activeScenario.timelineDays : 45;
    const timeIndicator = document.getElementById('timeIndicator');
    timeIndicator.textContent = `${timeUsed} / ${timeline} days`;
    
    // Change parent indicator card border color based on time
    const timeCard = timeIndicator.closest('.indicator-card');
    if (timeCard) {
        if (timeUsed > timeline) {
            timeCard.style.borderLeftColor = 'var(--color-secondary)';
            timeIndicator.style.color = 'var(--color-secondary)';
        } else if (timeUsed > timeline * 0.9) {
            timeCard.style.borderLeftColor = 'var(--color-accent)';
            timeIndicator.style.color = 'var(--color-accent)';
        } else {
            timeCard.style.borderLeftColor = 'var(--color-primary)';
            timeIndicator.style.color = 'var(--color-primary)';
        }
    }

    // Update risk indicator
    const riskIndicator = document.getElementById('riskIndicator');
    const riskCard = riskIndicator.closest('.indicator-card');
    
    if (riskScore === 0) {
        riskIndicator.textContent = 'Low';
        riskIndicator.style.color = 'var(--color-primary)';
        if (riskCard) riskCard.style.borderLeftColor = 'var(--color-primary)';
    } else if (riskScore <= 25) {
        riskIndicator.textContent = 'Moderate';
        riskIndicator.style.color = 'var(--color-accent)';
        if (riskCard) riskCard.style.borderLeftColor = 'var(--color-accent)';
    } else {
        riskIndicator.textContent = 'High';
        riskIndicator.style.color = 'var(--color-secondary)';
        if (riskCard) riskCard.style.borderLeftColor = 'var(--color-secondary)';
    }

    // Calculate and update health (scenario-aware)
    const scenarioId = StateManager.getActiveScenarioId();
    const cardPool = ScenarioManager.getCardPool(scenarioId);
    const mandatoryCards = cardPool.filter(c => c.category === 'mandatory');
    const mandatoryInStack = stackCards.filter(c => c.category === 'mandatory');
    const completionRate = (mandatoryInStack.length / mandatoryCards.length) * 100;
    const healthIndicator = document.getElementById('healthIndicator');
    const healthCard = healthIndicator.closest('.indicator-card');
    
    healthIndicator.textContent = `${Math.round(completionRate)}%`;
    
    if (completionRate >= 80) {
        healthIndicator.style.color = 'var(--color-primary)';
        if (healthCard) healthCard.style.borderLeftColor = 'var(--color-primary)';
    } else if (completionRate >= 50) {
        healthIndicator.style.color = 'var(--color-accent)';
        if (healthCard) healthCard.style.borderLeftColor = 'var(--color-accent)';
    } else {
        healthIndicator.style.color = 'var(--color-secondary)';
        if (healthCard) healthCard.style.borderLeftColor = 'var(--color-secondary)';
    }
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Validate button
    document.getElementById('validateBtn').addEventListener('click', validateStack);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetGame);
}

/**
 * ========================================
 * Drag and Drop Handlers
 * ========================================
 * 
 * Implements HTML5 drag-and-drop with two modes:
 * 
 * 1. LIBRARY TO STACK:
 *    - Drag cards from library into stack container
 *    - Prevents duplicate placement
 *    - Updates Local Storage immediately
 *    - Real-time indicator updates (risk, time, health)
 * 
 * 2. STACK REORDERING:
 *    - Drag cards within stack to reorder
 *    - Drop on specific slot to insert at that position
 *    - Maintains all cards, only changes order
 *    - Updates stack order in Local Storage
 * 
 * All operations update indicators in real-time.
 */

let draggedCardId = null;
let draggedFromStack = false;
let draggedStackPosition = null;

/**
 * Handle drag start from card library
 */
function handleDragStart(e) {
    draggedCardId = e.target.dataset.cardId;
    draggedFromStack = false;
    draggedStackPosition = null;
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

/**
 * Handle drag end
 */
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    
    // Clean up all drag-over states
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

/**
 * Handle drag start from stack
 */
function handleStackDragStart(e) {
    const slotElement = e.target.closest('.stack-slot');
    if (!slotElement) return;
    
    draggedStackPosition = parseInt(slotElement.dataset.position);
    const stackCards = StateManager.getSelectedCards();
    draggedCardId = stackCards[draggedStackPosition]?.id;
    draggedFromStack = true;
    
    slotElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

/**
 * Handle drag end from stack
 */
function handleStackDragEnd(e) {
    const slotElement = e.target.closest('.stack-slot');
    if (slotElement) {
        slotElement.classList.remove('dragging');
    }
    
    // Clean up
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

/**
 * Handle drag over stack container
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const stackContainer = e.currentTarget;
    stackContainer.classList.add('drag-over');
}

/**
 * Handle drag leave stack container
 */
function handleDragLeave(e) {
    if (e.currentTarget === e.target) {
        e.currentTarget.classList.remove('drag-over');
    }
}

/**
 * Handle drop into stack container
 */
function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedCardId) return;

    // Check for duplicate - prevent adding same card twice
    const currentStack = StateManager.getDealStack();
    
    if (!draggedFromStack && currentStack.includes(draggedCardId)) {
        showModal(
            'Duplicate Card',
            'This card is already in your deal stack. Each card can only be used once.'
        );
        draggedCardId = null;
        draggedFromStack = false;
        return;
    }

    // Add card to end of stack if from library
    if (!draggedFromStack) {
        const success = StateManager.addCard(draggedCardId);
        
        if (success) {
            // Refresh UI in real-time
            refreshUI();
        }
    }
    
    // Reset drag state
    draggedCardId = null;
    draggedFromStack = false;
    draggedStackPosition = null;
}

/**
 * Handle drag over individual stack slot for reordering
 */
function handleSlotDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    const slot = e.currentTarget;
    
    // Only show drag-over for slots when reordering
    if (draggedFromStack) {
        slot.classList.add('drag-over');
    }
}

/**
 * Handle drag leave stack slot
 */
function handleSlotDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

/**
 * Handle drop on individual stack slot for reordering
 */
function handleSlotDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedFromStack || draggedStackPosition === null) {
        return;
    }
    
    const targetPosition = parseInt(e.currentTarget.dataset.position);
    
    if (draggedStackPosition === targetPosition) {
        return; // No change needed
    }
    
    // Reorder the stack
    const currentStack = StateManager.getDealStack();
    const newStack = [...currentStack];
    
    // Remove from old position
    const [movedCard] = newStack.splice(draggedStackPosition, 1);
    
    // Insert at new position
    newStack.splice(targetPosition, 0, movedCard);
    
    // Update stack order in Local Storage - this also recalculates metrics
    const success = StateManager.updateStackOrder(newStack);
    
    if (success) {
        // Refresh UI in real-time (no need to update available cards, just stack and indicators)
        currentState = StateManager.load();
        renderDealStack();
        updateIndicators();
    }
    
    // Reset drag state
    draggedCardId = null;
    draggedFromStack = false;
    draggedStackPosition = null;
}

/**
 * Remove card from stack
 */
function removeFromStack(position) {
    // Remove card using StateManager
    const success = StateManager.removeCardAtPosition(position);
    
    if (!success) {
        console.error('Failed to remove card at position:', position);
        return;
    }
    
    // Reload current state
    currentState = StateManager.load();

    // Re-render and update in real-time
    renderAvailableCards();
    renderDealStack();
    updateIndicators();
}

/**
 * Refresh all UI components after state change
 */
function refreshUI() {
    currentState = StateManager.load();
    renderAvailableCards();
    renderDealStack();
    updateIndicators();
}

/**
 * Validate stack and process results
 * 
 * Edge cases handled:
 * 1. Empty stack submission
 * 2. Missing mandatory cards
 * 3. Validation errors
 * 4. Save failures
 */
function validateStack() {
    const dealStack = StateManager.getDealStack();
    
    // Edge Case 1: Empty stack submission
    if (dealStack.length === 0) {
        ModalManager.alert(
            'No Transaction Steps Selected',
            'To receive an assessment, please add transaction steps to your deal stack.\n\nDrag cards from the left panel into your deal stack to begin building your transaction sequence.',
            'error'
        );
        return;
    }

    // Edge Case 1b: Minimum steps requirement (NEW)
    const MINIMUM_STEPS = 9;
    if (dealStack.length < MINIMUM_STEPS) {
        const remaining = MINIMUM_STEPS - dealStack.length;
        ModalManager.alert(
            'Minimum Steps Required',
            `You need at least ${MINIMUM_STEPS} transaction steps to complete an assessment.\n\nYou currently have ${dealStack.length} step${dealStack.length !== 1 ? 's' : ''}.\n\nPlease add ${remaining} more step${remaining !== 1 ? 's' : ''} to continue.`,
            'warning'
        );
        return;
    }

    // Edge Case 2: Attempt to proceed without mandatory cards (scenario-aware)
    const stackCards = StateManager.getSelectedCards();
    const scenarioId = StateManager.getActiveScenarioId();
    const cardPool = ScenarioManager.getCardPool(scenarioId);
    const mandatoryCards = cardPool.filter(c => c.category === 'mandatory');
    const mandatoryInStack = stackCards.filter(c => c.category === 'mandatory');
    
    if (mandatoryInStack.length < mandatoryCards.length) {
        const missing = mandatoryCards.length - mandatoryInStack.length;
        const missingCards = mandatoryCards
            .filter(mc => !stackCards.find(sc => sc.id === mc.id))
            .slice(0, 3)
            .map(c => c.name)
            .join(', ');
        
        ModalManager.confirm(
            'Assessment Incomplete',
            `You are missing ${missing} mandatory transaction step${missing > 1 ? 's' : ''}.\n\nMissing steps include: ${missingCards}${mandatoryCards.length - mandatoryInStack.length > 3 ? ', and others' : ''}.\n\nSubmitting now will significantly reduce your assessment results.\n\nWould you like to continue anyway, or return to add more steps?`,
            () => {
                // User confirmed - continue with validation
                console.log('User confirmed submission despite missing mandatory steps');
                proceedWithValidation();
            },
            () => {
                // User cancelled - stay on page
                console.log('User cancelled submission to add more mandatory steps');
            },
            { confirmText: 'Submit Anyway', cancelText: 'Add More Steps', type: 'warning' }
        );
        return;
    }

    // If we reach here, proceed with validation
    proceedWithValidation();
}

/**
 * Proceed with validation (extracted for use with confirm callback)
 */
function proceedWithValidation() {
    const dealStack = StateManager.getDealStack();
    
    // Disable validation button to prevent double-submission
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.disabled = true;
        validateBtn.textContent = 'Processing Assessment...';
    }

    // Use setTimeout to allow UI to update before running validation
    setTimeout(() => {
        try {
            // Run rules engine validation
            console.log('Running validation on deal stack:', dealStack);
            const validationResults = RulesEngine.validateDealStack(dealStack);
            console.log('Validation results:', validationResults);

            // Save complete results to Local Storage
            const saveSuccess = StateManager.saveResults(
                validationResults.totalScore,
                validationResults.breakdown
            );

            if (!saveSuccess) {
                showModal(
                    'Error',
                    'Failed to save assessment results. Please try again.',
                    'error'
                );
                // Re-enable button
                if (validateBtn) {
                    validateBtn.disabled = false;
                    validateBtn.textContent = 'Review Deal';
                }
                return;
            }

            // Also save the full validation report for detailed display
            StateManager.update({
                validationReport: validationResults
            });

            console.log('Results saved to Local Storage. Redirecting to result.html...');

            // Redirect to results page
            window.location.href = 'result.html';
            
        } catch (error) {
            console.error('Error during validation:', error);
            showModal(
                'Validation Error',
                'An error occurred while processing your assessment. Please try again.',
                'error'
            );
            // Re-enable button
            if (validateBtn) {
                validateBtn.disabled = false;
                validateBtn.textContent = 'Review Deal';
            }
        }
    }, 100);
}

/**
 * Quick validation check (without redirect)
 * Shows modal with basic feedback
 */
function quickValidate() {
    const dealStack = StateManager.getDealStack();
    
    if (dealStack.length === 0) {
        showModal('Empty Stack', 'Add cards to your stack to see validation feedback.');
        return;
    }

    const results = RulesEngine.validateDealStack(dealStack);
    const scoreBand = results.scoreBand;
    
    let message = `Current Assessment:\n\n`;
    message += `Transaction Readiness Score: ${results.totalScore}/100\n`;
    message += `Classification: ${scoreBand.label}\n\n`;
    message += `Breakdown:\n`;
    message += `• Completeness: ${results.breakdown.completeness.score}/${results.breakdown.completeness.maxScore}\n`;
    message += `• Sequencing: ${results.breakdown.sequencing.score}/${results.breakdown.sequencing.maxScore}\n`;
    message += `• Risk Handling: ${results.breakdown.riskHandling.score}/${results.breakdown.riskHandling.maxScore}\n`;
    message += `• Time Discipline: ${results.breakdown.timeDiscipline.score}/${results.breakdown.timeDiscipline.maxScore}\n\n`;
    
    if (results.validation.missingMandatory.length > 0) {
        message += `⚠️ Missing ${results.validation.missingMandatory.length} mandatory step(s)\n`;
    }
    if (results.validation.sequenceViolations.length > 0) {
        message += `⚠️ ${results.validation.sequenceViolations.length} sequencing violation(s)\n`;
    }
    
    message += `\nClick "Review Deal" to see your full assessment report.`;
    
    showModal('Quick Assessment', message);
}

/**
 * Reset game - Start New Deal
 * Clears Local Storage and returns to landing page
 */
function resetGame() {
    ModalManager.confirm(
        'Start New Deal?',
        'This will clear your current deal stack and all progress.\n\nDo you want to continue?',
        () => {
            // User confirmed
            console.log('Starting new deal - clearing Local Storage...');
            StateManager.clear();
            console.log('Local Storage cleared. Redirecting to landing page...');
            window.location.href = 'index.html';
        },
        () => {
            // User cancelled
            console.log('User cancelled reset');
        },
        { confirmText: 'Start New Deal', cancelText: 'Cancel', type: 'warning' }
    );
}

/**
 * Handle scenario change request
 * Warns user if they have progress and redirects to scenario selection
 */
function handleChangeScenario() {
    const dealStack = StateManager.getDealStack();
    const scenario = StateManager.getActiveScenario();
    
    if (dealStack && dealStack.length > 0) {
        ModalManager.confirm(
            'Change Scenario?',
            `You have ${dealStack.length} transaction step${dealStack.length !== 1 ? 's' : ''} in progress for "${scenario?.title || 'this scenario'}".\n\nSwitching scenarios will clear your current progress.\n\nDo you want to continue?`,
            () => {
                // User confirmed - redirect to scenario selection
                console.log('Redirecting to scenario selection...');
                window.location.href = 'index.html';
            },
            () => {
                // User cancelled
                console.log('User cancelled scenario change');
            },
            { confirmText: 'Change Scenario', cancelText: 'Continue Current', type: 'warning' }
        );
    } else {
        // No progress, just redirect
        console.log('No progress. Redirecting to scenario selection...');
        window.location.href = 'index.html';
    }
}

/**
 * Show modal (uses ModalManager)
 */
function showModal(title, message, type = 'info') {
    ModalManager.alert(title, message, type);
}

/**
 * Close modal (uses ModalManager)
 */
function closeModal() {
    ModalManager.close();
}

/**
 * Show session restored notification
 * Subtle, non-intrusive feedback for page reload/refresh
 */
function showSessionRestoredNotification(cardCount) {
    // Create a subtle notification banner
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 999;
        font-size: var(--font-size-sm);
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <strong>Session Restored</strong><br>
        Your ${cardCount} transaction step${cardCount !== 1 ? 's' : ''} ${cardCount !== 1 ? 'have' : 'has'} been recovered.
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Check Local Storage availability and show error if unavailable
 */
function checkStorageAvailability() {
    if (!StateManager.isStorageAvailable()) {
        showModal(
            'Storage Not Available',
            'Your browser\'s Local Storage is not available or disabled.\n\n' +
            'This assessment requires Local Storage to save your progress.\n\n' +
            'Please enable Local Storage in your browser settings and refresh the page.'
        );
        return false;
    }
    return true;
}

/**
 * Utility functions
 */
function formatCategory(category) {
    const labels = {
        'mandatory': 'Required',
        'optional': 'Optional',
        'risky': 'Risky',
        'red_herring': 'Questionable'
    };
    return labels[category] || category;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency for compact display
 */
function formatCurrency(amount) {
    if (amount === 0) return '0';
    
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? '+' : '-';
    
    // Convert to millions or thousands for compact display
    if (absAmount >= 1000000) {
        return `${sign}${(absAmount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
        return `${sign}${(absAmount / 1000).toFixed(0)}K`;
    }
    
    return `${sign}${absAmount}`;
}
