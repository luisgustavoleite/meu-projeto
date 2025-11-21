// ===== SISTEMA DE ACESSIBILIDADE (WCAG 2.1 AA) =====

class A11yManager {
    static init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupHighContrastMode();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
        this.setupSkipLinks();
        
        console.log('♿ Sistema de acessibilidade inicializado');
    }

    // NAVEGAÇÃO POR TECLADO
    static setupKeyboardNavigation() {
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
        
        // Tornar todos os elementos interativos focáveis
        this.makeInteractiveElementsFocusable();
    }

    static handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'Tab':
                this.handleTabNavigation(e);
                break;
            case 'Enter':
            case ' ':
                this.handleActionKeys(e);
                break;
            case 'Escape':
                this.handleEscapeKey(e);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.handleArrowKeys(e);
                break;
        }
    }

    static handleTabNavigation(e) {
        // Garantir que a navegação por tab seja visível
        const focusedElement = document.activeElement;
        
        // Adicionar outline customizado para focus
        focusedElement.style.outline = '3px solid #2C5530';
        focusedElement.style.outlineOffset = '2px';
        
        // Remover outline quando perder foco
        focusedElement.addEventListener('blur', () => {
            focusedElement.style.outline = '';
        }, { once: true });
    }

    static makeInteractiveElementsFocusable() {
        const interactiveSelectors = [
            '.card',
            '.btn',
            '.nav-link',
            '.menu-toggle',
            'input',
            'select',
            'textarea',
            '[role="button"]',
            '[tabindex]'
        ];
        
        interactiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
            });
        });
    }

    // SUPORTE A LEITORES DE TELA
    static setupScreenReaderSupport() {
        // Adicionar roles ARIA semânticas
        this.addAriaRoles();
        
        // Configurar labels descritivas
        this.addAriaLabels();
        
        // Gerenciar estados ARIA
        this.setupAriaStates();
    }

    static addAriaRoles() {
        // Header
        const header = document.querySelector('header');
        if (header) header.setAttribute('role', 'banner');
        
        // Navigation
        const nav = document.querySelector('nav');
        if (nav) nav.setAttribute('role', 'navigation');
        
        // Main content
        const main = document.querySelector('main');
        if (main) main.setAttribute('role', 'main');
        
        // Footer
        const footer = document.querySelector('footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
        
        // Cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `card-title-${index}`);
            
            const title = card.querySelector('h2, h3');
            if (title) {
                title.id = `card-title-${index}`;
            }
        });
    }

    static addAriaLabels() {
        // Menu hamburger
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            const isExpanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.setAttribute('aria-label', 'Menu principal');
            menuToggle.setAttribute('aria-controls', 'nav-menu');
        }
        
        // Modal close buttons
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(close => {
            close.setAttribute('aria-label', 'Fechar modal');
        });
        
        // Form fields
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            if (!input.id) {
                input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && !input.getAttribute('aria-label')) {
                const placeholder = input.getAttribute('placeholder');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }
        });
    }

    static setupAriaStates() {
        // Observar mudanças de estado
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.updateAriaStates(mutation.target);
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    static updateAriaStates(element) {
        // Menu toggle
        if (element.classList.contains('menu-toggle')) {
            const isExpanded = element.classList.contains('active');
            element.setAttribute('aria-expanded', isExpanded);
        }
        
        // Modal
        if (element.classList.contains('modal')) {
            const isVisible = element.classList.contains('active');
            element.setAttribute('aria-hidden', !isVisible);
            
            if (isVisible) {
                element.setAttribute('aria-modal', 'true');
                // Focar no primeiro elemento interativo do modal
                const firstFocusable = element.querySelector('button, input, [tabindex]');
                if (firstFocusable) firstFocusable.focus();
            }
        }
    }

    // MODO ALTO CONTRASTE
    static setupHighContrastMode() {
        // Detectar preferência do sistema
        const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');
        this.toggleHighContrast(contrastMediaQuery.matches);
        
        // Ouvir mudanças na preferência
        contrastMediaQuery.addListener((e) => {
            this.toggleHighContrast(e.matches);
        });
        
        // Botão de toggle manual
        this.createContrastToggle();
    }

    static toggleHighContrast(enable) {
        if (enable) {
            document.body.classList.add('high-contrast');
            document.body.setAttribute('data-contrast', 'high');
        } else {
            document.body.classList.remove('high-contrast');
            document.body.removeAttribute('data-contrast');
        }
    }

    static createContrastToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'contrast-toggle';
        toggle.innerHTML = '🎨';
        toggle.setAttribute('aria-label', 'Alternar contraste alto');
        toggle.setAttribute('title', 'Alto Contraste');
        
        toggle.addEventListener('click', () => {
            const isHighContrast = document.body.classList.contains('high-contrast');
            this.toggleHighContrast(!isHighContrast);
            
            // Salvar preferência
            StorageManager.salvarConfiguracao('alto-contraste', !isHighContrast);
        });
        
        // Adicionar ao DOM
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(toggle);
        }
    }

    // GERENCIAMENTO DE FOCO
    static setupFocusManagement() {
        // Trap focus em modais
        this.setupFocusTrap();
        
        // Restaurar foco após fechar modal
        this.setupFocusRestoration();
    }

    static setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.querySelector('.modal.active')) {
                this.trapFocus(e);
            }
        });
    }

    static trapFocus(e) {
        const modal = document.querySelector('.modal.active');
        if (!modal) return;
        
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    static setupFocusRestoration() {
        let lastFocusedElement;
        
        document.addEventListener('focusin', (e) => {
            if (!e.target.closest('.modal')) {
                lastFocusedElement = e.target;
            }
        });
        
        // Restaurar foco quando modal fechar
        document.addEventListener('modalClosed', () => {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        });
    }

    // REGIÕES ARIA LIVE
    static setupAriaLiveRegions() {
        // Criar região para notificações dinâmicas
        const liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        
        document.body.appendChild(liveRegion);
    }

    static announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('a11y-live-region');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            
            // Limpar após anunciar
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // SKIP LINKS
    static setupSkipLinks() {
        const skipLinks = document.createElement('nav');
        skipLinks.className = 'skip-links';
        skipLinks.setAttribute('aria-label', 'Links de acesso rápido');
        
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
            <a href="#main-navigation" class="skip-link">Pular para navegação</a>
            <a href="#footer" class="skip-link">Pular para rodapé</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Configurar IDs dos alvos
        const main = document.querySelector('main');
        if (main) main.id = 'main-content';
        
        const nav = document.querySelector('nav');
        if (nav) nav.id = 'main-navigation';
        
        const footer = document.querySelector('footer');
        if (footer) footer.id = 'footer';
    }

    // UTILITÁRIOS
    static handleActionKeys(e) {
        const target = e.target;
        
        if (target.classList.contains('card') || 
            target.classList.contains('nav-link') ||
            target.getAttribute('role') === 'button') {
            e.preventDefault();
            target.click();
        }
    }

    static handleEscapeKey(e) {
        // Fechar modais com ESC
        const openModal = document.querySelector('.modal.active');
        if (openModal) {
            UIManager.closeModal(openModal);
            e.preventDefault();
        }
        
        // Fechar menu mobile com ESC
        const openMenu = document.querySelector('.nav-menu.active');
        if (openMenu) {
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.click();
                e.preventDefault();
            }
        }
    }

    static handleArrowKeys(e) {
        // Navegação em grupos de elementos (como cards)
        const currentElement = document.activeElement;
        const parent = currentElement.closest('.cards-grid, .nav-menu');
        
        if (parent) {
            const focusableElements = Array.from(
                parent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            );
            
            const currentIndex = focusableElements.indexOf(currentElement);
            
            if (currentIndex !== -1) {
                let nextIndex;
                
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % focusableElements.length;
                } else {
                    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                }
                
                focusableElements[nextIndex].focus();
                e.preventDefault();
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    A11yManager.init();
});
