// ===== GERENCIADOR DE COMPONENTES DE UI =====

class UIManager {
    static init() {
        this.initComponents();
        this.setupGlobalEventListeners();
        this.initTheme();
        console.log('🎨 Gerenciador de UI inicializado');
    }

    static initComponents() {
        this.initModals();
        this.initToasts();
        this.initLoadingStates();
        this.initTooltips();
        this.initAccordions();
    }

    static setupGlobalEventListeners() {
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Fechar toasts ao clicar
        document.addEventListener('click', (e) => {
            if (e.target.matches('.toast, .toast-close')) {
                e.target.closest('.toast')?.remove();
            }
        });
    }

    // MODAIS
    static initModals() {
        // Fechar modais ao clicar no backdrop
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal')) {
                this.closeModal(e.target);
            }
        });
    }

    static showModal(type, options = {}) {
        const modalId = options.id || `modal-${Date.now()}`;
        const modal = this.createModal(modalId, type, options);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animar entrada
        setTimeout(() => modal.classList.add('active'), 10);
        
        return modalId;
    }

    static createModal(id, type, options) {
        const modal = document.createElement('div');
        modal.className = `modal modal-${type}`;
        modal.id = id;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${options.title || 'Modal'}</h3>
                    ${options.showClose !== false ? '<button class="modal-close">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${options.message || ''}
                    ${options.content || ''}
                </div>
                ${options.actions ? `
                <div class="modal-actions">
                    ${options.actions}
                </div>
                ` : ''}
            </div>
        `;

        // Event listeners
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modal));
        }

        return modal;
    }

    static closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }

    static closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => this.closeModal(modal));
    }

    // TOASTS
    static initToasts() {
        // Container global para toasts
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    static showToast(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        const container = document.getElementById('toast-container') || document.body;
        
        container.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }
        
        return toast;
    }

    static createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        return toast;
    }

    static hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // LOADING STATES
    static initLoadingStates() {
        // CSS para loading states será adicionado dinamicamente
    }

    static showLoading(message = 'Carregando...') {
        this.hideLoading(); // Remover loading anterior
        
        const loading = document.createElement('div');
        loading.className = 'global-loading';
        loading.id = 'global-loading';
        
        loading.innerHTML = `
            <div class="loading-backdrop"></div>
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(loading);
        document.body.style.overflow = 'hidden';
    }

    static hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.classList.add('hiding');
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // TOOLTIPS
    static initTooltips() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const tooltipText = target.getAttribute('data-tooltip');
            
            if (tooltipText && !target.hasAttribute('data-tooltip-initialized')) {
                this.setupTooltip(target, tooltipText);
            }
        });
    }

    static setupTooltip(element, text) {
        element.setAttribute('data-tooltip-initialized', 'true');
        
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e, text);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    static showTooltip(event, text) {
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        // Posicionamento
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        
        tooltip.classList.add('show');
    }

    static hideTooltip() {
        const existingTooltip = document.querySelector('.tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // ACCORDIONS
    static initAccordions() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.accordion-header')) {
                this.toggleAccordion(e.target.parentElement);
            }
        });
    }

    static toggleAccordion(accordion) {
        const isOpen = accordion.classList.contains('active');
        
        if (isOpen) {
            accordion.classList.remove('active');
        } else {
            // Fechar outros accordions no mesmo grupo
            const group = accordion.getAttribute('data-accordion-group');
            if (group) {
                document.querySelectorAll(`[data-accordion-group="${group}"]`).forEach(acc => {
                    acc.classList.remove('active');
                });
            }
            accordion.classList.add('active');
        }
    }

    // THEME MANAGEMENT
    static initTheme() {
        const savedTheme = StorageManager.obterConfiguracao('tema') || 'claro';
        this.setTheme(savedTheme);
    }

    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        StorageManager.salvarConfiguracao('tema', theme);
        
        // Disparar evento de mudança de tema
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'claro';
        const newTheme = currentTheme === 'claro' ? 'escuro' : 'claro';
        this.setTheme(newTheme);
    }

    // MÉTODOS UTILITÁRIOS
    static createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }

    static injectCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // DYNAMIC CSS FOR UI COMPONENTS
    static injectDynamicCSS() {
        const css = `
            /* Loading States */
            .global-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .loading-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .loading-content {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
                z-index: 1;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #2C5530;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            /* Tooltips */
            .tooltip {
                position: fixed;
                background: #333;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.875rem;
                z-index: 1000;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.2s ease;
                pointer-events: none;
            }
            
            .tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Validation Feedback */
            .field-error, .field-success {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.5rem;
                font-size: 0.875rem;
                padding: 0.5rem;
                border-radius: 4px;
            }
            
            .field-error {
                background: #fee;
                color: #c53030;
                border: 1px solid #feb2b2;
            }
            
            .field-success {
                background: #f0fff4;
                color: #2f855a;
                border: 1px solid #9ae6b4;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        this.injectCSS(css);
    }
}

// Injetar CSS dinâmico quando a classe for carregada
UIManager.injectDynamicCSS();
