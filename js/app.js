// ===== APLICAÇÃO PRINCIPAL - PLATAFORMA ONG =====

class ONGApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Inicializar todos os módulos
        this.initializeSPA();
        this.initializeTemplates();
        this.initializeValidation();
        this.initializeStorage();
        this.initializeForms();
        this.initializeUI();
        
        console.log('✅ Plataforma ONG inicializada com sucesso');
    }

    initializeSPA() {
        if (typeof SPA !== 'undefined') {
            SPA.init();
        }
    }

    initializeTemplates() {
        if (typeof TemplateManager !== 'undefined') {
            TemplateManager.init();
        }
    }

    initializeValidation() {
        if (typeof FormValidator !== 'undefined') {
            FormValidator.init();
        }
    }

    initializeStorage() {
        if (typeof StorageManager !== 'undefined') {
            StorageManager.init();
        }
    }

    initializeForms() {
        if (typeof FormManager !== 'undefined') {
            FormManager.init();
        }
    }

    initializeUI() {
        if (typeof UIManager !== 'undefined') {
            UIManager.init();
        }
    }

    // Método global para exibir notificações
    showNotification(message, type = 'info') {
        if (typeof UIManager !== 'undefined') {
            UIManager.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.ONGApp = new ONGApp();
});
