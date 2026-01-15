/**
 * modal.js
 * Universal modal system for professional UI dialogs
 * Replaces browser alert() and confirm() with custom modals
 */

const ModalManager = {
    /**
     * Show alert modal (info/error)
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {string} type - Modal type: 'info', 'success', 'warning', 'error'
     */
    alert(title, message, type = 'info') {
        const modal = document.getElementById('universalModal');
        const modalTitle = document.getElementById('universalModalTitle');
        const modalMessage = document.getElementById('universalModalMessage');
        const modalIcon = document.getElementById('universalModalIcon');
        const modalActions = document.getElementById('universalModalActions');
        const modalContent = modal?.querySelector('.modal-content');

        if (!modal || !modalTitle || !modalMessage || !modalActions) {
            // Fallback to browser alert if modal not found
            alert(message);
            return;
        }

        // Set icon based on type
        const icons = {
            info: '💡',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        if (modalIcon) {
            modalIcon.textContent = icons[type] || icons.info;
        }

        // Set content
        modalTitle.textContent = title;
        modalMessage.textContent = message;

        // Apply type class for styling
        if (modalContent) {
            modalContent.className = 'modal-content modal-' + type;
        }

        // Create single Close button
        modalActions.innerHTML = `
            <button class="btn btn-primary modal-btn-close">Close</button>
        `;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Attach close handler
        const closeBtn = modalActions.querySelector('.modal-btn-close');
        closeBtn.onclick = () => this.close();

        // Close on overlay click
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.close();
            }
        };

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    },

    /**
     * Show confirm modal (with Yes/No buttons)
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @param {function} onConfirm - Callback when user clicks Yes/Confirm
     * @param {function} onCancel - Callback when user clicks No/Cancel (optional)
     * @param {object} options - Options like confirmText, cancelText
     */
    confirm(title, message, onConfirm, onCancel, options = {}) {
        const modal = document.getElementById('universalModal');
        const modalTitle = document.getElementById('universalModalTitle');
        const modalMessage = document.getElementById('universalModalMessage');
        const modalIcon = document.getElementById('universalModalIcon');
        const modalActions = document.getElementById('universalModalActions');
        const modalContent = modal?.querySelector('.modal-content');

        if (!modal || !modalTitle || !modalMessage || !modalActions) {
            // Fallback to browser confirm
            if (confirm(message)) {
                onConfirm?.();
            } else {
                onCancel?.();
            }
            return;
        }

        const confirmText = options.confirmText || 'Continue';
        const cancelText = options.cancelText || 'Cancel';
        const type = options.type || 'warning';

        // Set icon
        const icons = {
            info: '❓',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        if (modalIcon) {
            modalIcon.textContent = icons[type] || icons.warning;
        }

        // Set content
        modalTitle.textContent = title;
        modalMessage.textContent = message;

        // Apply type class
        if (modalContent) {
            modalContent.className = 'modal-content modal-' + type;
        }

        // Create Yes/No buttons
        modalActions.innerHTML = `
            <button class="btn btn-secondary modal-btn-cancel">${cancelText}</button>
            <button class="btn btn-primary modal-btn-confirm">${confirmText}</button>
        `;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Attach handlers
        const confirmBtn = modalActions.querySelector('.modal-btn-confirm');
        const cancelBtn = modalActions.querySelector('.modal-btn-cancel');

        confirmBtn.onclick = () => {
            this.close();
            onConfirm?.();
        };

        cancelBtn.onclick = () => {
            this.close();
            onCancel?.();
        };

        // Close on overlay click = cancel
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.close();
                onCancel?.();
            }
        };

        // Escape key = cancel
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                onCancel?.();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Focus confirm button for keyboard accessibility
        setTimeout(() => confirmBtn.focus(), 100);
    },

    /**
     * Close modal
     */
    close() {
        const modal = document.getElementById('universalModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// Make available globally
window.ModalManager = ModalManager;
