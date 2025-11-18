// ===== GERENCIAMENTO AVANÇADO DE FORMULÁRIOS =====

class FormManager {
    static init() {
        this.setupFormHandlers();
        this.setupAutoSave();
        this.setupFormAnalytics();
        console.log('📋 Gerenciador de formulários inicializado');
    }

    static setupFormHandlers() {
        document.addEventListener('submit', this.handleFormSubmission.bind(this));
        document.addEventListener('reset', this.handleFormReset.bind(this));
    }

    static setupAutoSave() {
        // Auto-save para formulários longos
        document.addEventListener('input', this.debounce((e) => {
            if (e.target.form && e.target.form.hasAttribute('data-auto-save')) {
                this.autoSaveForm(e.target.form);
            }
        }, 1000));
    }

    static setupFormAnalytics() {
        // Analytics de preenchimento de formulário
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.trackFieldFocus(e.target);
            }
        });
    }

    static async handleFormSubmission(e) {
        e.preventDefault();
        const form = e.target;
        
        try {
            // Mostrar loading
            UIManager.showLoading('Enviando formulário...');
            
            // Preparar dados
            const formData = this.collectFormData(form);
            
            // Validação adicional
            if (!this.validateFormData(formData)) {
                throw new Error('Dados do formulário inválidos');
            }
            
            // Processar de acordo com o tipo de formulário
            await this.processFormSubmission(form, formData);
            
            // Sucesso
            this.handleFormSuccess(form, formData);
            
        } catch (error) {
            this.handleFormError(form, error);
        } finally {
            UIManager.hideLoading();
        }
    }

    static collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        // Coletar dados dos campos
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Se já existe, converter para array
                data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
            } else {
                data[key] = value;
            }
        }
        
        // Adicionar metadados
        data._metadata = {
            timestamp: new Date().toISOString(),
            formId: form.id || 'unknown',
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        return data;
    }

    static validateFormData(formData) {
        // Validações específicas por tipo de formulário
        if (formData.nomeCompleto && formData.nomeCompleto.length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (formData.email && !this.isValidEmail(formData.email)) {
            throw new Error('Email inválido');
        }
        
        return true;
    }

    static async processFormSubmission(form, formData) {
        const formType = this.getFormType(form);
        
        switch (formType) {
            case 'cadastro-voluntario':
                return await this.processVolunteerRegistration(formData);
                
            case 'cadastro-doador':
                return await this.processDonorRegistration(formData);
                
            case 'contato':
                return await this.processContactForm(formData);
                
            default:
                return await this.processGenericForm(formData);
        }
    }

    static getFormType(form) {
        return form.getAttribute('data-form-type') || 
               form.id || 
               'generic';
    }

    static async processVolunteerRegistration(formData) {
        // Simular processamento assíncrono
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const voluntario = {
            nome: formData.nomeCompleto,
            email: formData.email,
            telefone: formData.telefone,
            cpf: formData.cpf,
            dataNascimento: formData.dataNascimento,
            endereco: {
                cep: formData.cep,
                logradouro: formData.endereco,
                cidade: formData.cidade,
                estado: formData.estado
            },
            tipoAjuda: Array.isArray(formData.tipoAjuda) ? formData.tipoAjuda : [formData.tipoAjuda],
            mensagem: formData.mensagem,
            dataCadastro: new Date().toISOString()
        };
        
        const success = StorageManager.salvarVoluntario(voluntario);
        
        if (!success) {
            throw new Error('Erro ao salvar dados do voluntário');
        }
        
        return { id: voluntario.id, tipo: 'voluntario' };
    }

    static async processDonorRegistration(formData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular cadastro de doador
        return { id: Date.now(), tipo: 'doador' };
    }

    static async processContactForm(formData) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simular envio de contato
        return { id: Date.now(), tipo: 'contato' };
    }

    static async processGenericForm(formData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id: Date.now(), tipo: 'generic' };
    }

    static handleFormSuccess(form, formData) {
        // Mostrar confirmação
        UIManager.showModal('success', {
            title: 'Cadastro Realizado!',
            message: 'Obrigado por se cadastrar. Entraremos em contato em breve.',
            showClose: false
        });
        
        // Resetar formulário
        form.reset();
        
        // Limpar estados de validação
        FormValidator.clearValidationStates(form);
        
        // Disparar evento personalizado
        this.dispatchFormEvent('form-submitted', { form, data: formData });
        
        // Analytics
        this.trackFormSubmission(form, true);
    }

    static handleFormError(form, error) {
        console.error('Erro no formulário:', error);
        
        UIManager.showToast(error.message || 'Erro ao processar formulário', 'error');
        
        // Analytics
        this.trackFormSubmission(form, false, error.message);
    }

    static handleFormReset(e) {
        const form = e.target;
        
        // Limpar estados de validação
        FormValidator.clearValidationStates(form);
        
        // Limpar auto-save
        this.clearAutoSave(form);
        
        UIManager.showToast('Formulário limpo', 'info');
    }

    // AUTO-SAVE
    static autoSaveForm(form) {
        const formData = this.collectFormData(form);
        const autoSaveKey = `auto-save-${form.id || 'form'}`;
        
        try {
            localStorage.setItem(autoSaveKey, JSON.stringify(formData));
            UIManager.showToast('Rascunho salvo automaticamente', 'info', 2000);
        } catch (error) {
            console.error('Erro no auto-save:', error);
        }
    }

    static loadAutoSave(form) {
        const autoSaveKey = `auto-save-${form.id || 'form'}`;
        
        try {
            const savedData = localStorage.getItem(autoSaveKey);
            if (savedData) {
                const formData = JSON.parse(savedData);
                this.populateForm(form, formData);
                UIManager.showToast('Rascunho recuperado', 'info', 3000);
            }
        } catch (error) {
            console.error('Erro ao carregar auto-save:', error);
        }
    }

    static clearAutoSave(form) {
        const autoSaveKey = `auto-save-${form.id || 'form'}`;
        localStorage.removeItem(autoSaveKey);
    }

    static populateForm(form, data) {
        Object.keys(data).forEach(key => {
            if (key.startsWith('_')) return; // Ignorar metadados
            
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                const value = data[key];
                
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (Array.isArray(value)) {
                        field.checked = value.includes(field.value);
                    } else {
                        field.checked = value === field.value;
                    }
                } else {
                    field.value = value;
                }
            }
        });
    }

    // ANALYTICS
    static trackFieldFocus(field) {
        const form = field.form;
        if (form) {
            const fieldName = field.name;
            console.log(`Campo focado: ${fieldName} no formulário ${form.id}`);
        }
    }

    static trackFormSubmission(form, success, errorMessage = '') {
        const analyticsData = {
            formId: form.id || 'unknown',
            success: success,
            timestamp: new Date().toISOString(),
            error: errorMessage,
            fields: this.getFormFieldsInfo(form)
        };
        
        console.log('Form Analytics:', analyticsData);
    }

    static getFormFieldsInfo(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        return Array.from(fields).map(field => ({
            name: field.name,
            type: field.type,
            required: field.required,
            filled: !!field.value.trim()
        }));
    }

    // UTILITÁRIOS
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static dispatchFormEvent(type, detail) {
        const event = new CustomEvent(type, { detail });
        document.dispatchEvent(event);
    }

    // MÉTODOS PÚBLICOS
    static enableAutoSave(form) {
        form.setAttribute('data-auto-save', 'true');
        this.loadAutoSave(form);
    }

    static disableAutoSave(form) {
        form.removeAttribute('data-auto-save');
        this.clearAutoSave(form);
    }

    static getFormStats(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        const filledFields = Array.from(fields).filter(field => field.value.trim());
        
        return {
            totalFields: fields.length,
            filledFields: filledFields.length,
            completionRate: Math.round((filledFields.length / fields.length) * 100)
        };
    }
}
