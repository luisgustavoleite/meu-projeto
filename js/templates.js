// ===== SISTEMA DE TEMPLATES DINÂMICOS =====

class TemplateManager {
    static init() {
        this.templates = new Map();
        this.loadTemplates();
        this.renderDynamicContent();
        
        console.log('📝 Sistema de templates inicializado');
    }

    static loadTemplates() {
        // Templates para cards de projetos
        this.templates.set('project-card', `
            <article class="card" data-project-id="{{id}}">
                <div class="card-header">
                    <h2>{{title}}</h2>
                    <span class="badge {{badgeClass}}">{{category}}</span>
                </div>
                <div class="card-body">
                    <img src="{{image}}" alt="{{altText}}" class="card-img">
                    <p>{{description}}</p>
                    <ul>
                        {{#each achievements}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" data-action="support" data-project="{{id}}">
                        Apoiar este Projeto
                    </button>
                    <span class="support-count">{{supporters}} apoiadores</span>
                </div>
            </article>
        `);

        // Template para cards sobre
        this.templates.set('about-card', `
            <article class="card">
                <div class="card-header">
                    <h3>{{title}}</h3>
                </div>
                <div class="card-body">
                    <p>{{content}}</p>
                </div>
            </article>
        `);

        // Template para itens de voluntários
        this.templates.set('volunteer-item', `
            <div class="volunteer-card">
                <h4>{{name}}</h4>
                <p>{{role}}</p>
                <span class="badge {{statusClass}}">{{status}}</span>
            </div>
        `);

        // Template para feedback de validação
        this.templates.set('validation-feedback', `
            <div class="validation-feedback {{type}}">
                <span class="feedback-icon">{{icon}}</span>
                <span class="feedback-message">{{message}}</span>
            </div>
        `);
    }

    static render(templateName, data) {
        const template = this.templates.get(templateName);
        if (!template) {
            console.error(`Template não encontrado: ${templateName}`);
            return '';
        }

        return this.compileTemplate(template, data);
    }

    static compileTemplate(template, data) {
        return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            const keys = key.trim().split('.');
            let value = data;
            
            for (const k of keys) {
                value = value ? value[k] : '';
            }
            
            return value !== undefined ? value : match;
        }).replace(/\{\{#each ([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayKey, content) => {
            const array = this.getNestedValue(data, arrayKey.trim());
            if (!Array.isArray(array)) return '';
            
            return array.map(item => {
                return content.replace(/\{\{this\}\}/g, item);
            }).join('');
        });
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current ? current[key] : undefined;
        }, obj);
    }

    static async renderDynamicContent() {
        await this.renderProjects();
        await this.renderAboutCards();
        this.setupTemplateEvents();
    }

    static async renderProjects() {
        const projects = await this.loadProjectsData();
        const container = document.getElementById('projetos-container');
        
        if (container) {
            container.innerHTML = projects.map(project => 
                this.render('project-card', project)
            ).join('');
        }
    }

    static async renderAboutCards() {
        const aboutData = [
            {
                title: 'Nossa Missão',
                content: 'Promover o desenvolvimento social através de ações educativas, culturais e de assistência, garantindo direitos básicos e construindo oportunidades.'
            },
            {
                title: 'Nossa Visão', 
                content: 'Ser referência nacional em transformação social, ampliando nosso alcance para todas as regiões do país até 2030.'
            },
            {
                title: 'Nossos Valores',
                content: 'Transparência, Comprometimento, Solidariedade, Ética e Sustentabilidade.'
            }
        ];

        const container = document.getElementById('sobre-cards');
        if (container) {
            container.innerHTML = aboutData.map(item =>
                this.render('about-card', item)
            ).join('');
        }
    }

    static setupTemplateEvents() {
        // Eventos para botões de apoio a projetos
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="support"]')) {
                const projectId = e.target.getAttribute('data-project');
                this.handleProjectSupport(projectId);
            }
        });
    }

    static handleProjectSupport(projectId) {
        UIManager.showToast(`Obrigado pelo interesse em apoiar o projeto ${projectId}!`, 'success');
        
        // Simular incremento de apoiadores
        const card = document.querySelector(`[data-project-id="${projectId}"]`);
        const countElement = card.querySelector('.support-count');
        if (countElement) {
            const currentCount = parseInt(countElement.textContent) || 0;
            countElement.textContent = `${currentCount + 1} apoiadores`;
        }
    }

    static async loadProjectsData() {
        // Simular dados de API
        return [
            {
                id: 'educacao-todos',
                title: 'Educação para Todos',
                category: 'Educação',
                badgeClass: 'badge-primary',
                image: 'img/projetos-sociais.jpg',
                altText: 'Crianças estudando',
                description: 'Oferecemos reforço escolar, cursos profissionalizantes e alfabetização para crianças, jovens e adultos.',
                achievements: [
                    '+ de 2.000 alunos atendidos anualmente',
                    '15 polos educacionais', 
                    '85% de aprovação escolar'
                ],
                supporters: 150
            },
            {
                id: 'alimentacao-solidaria',
                title: 'Alimentação Solidária',
                category: 'Assistência', 
                badgeClass: 'badge-secondary',
                image: 'img/voluntarios.jpg',
                altText: 'Distribuição de alimentos',
                description: 'Distribuímos cestas básicas e oferecemos refeições nutritivas para famílias em situação de vulnerabilidade.',
                achievements: [
                    '+ de 5.000 cestas básicas mensais',
                    'Refeitório comunitário',
                    'Hortas urbanas sustentáveis'
                ],
                supporters: 89
            },
            {
                id: 'saude-acao',
                title: 'Saúde em Ação', 
                category: 'Saúde',
                badgeClass: 'badge-accent',
                image: 'img/ong-home.jpg',
                altText: 'Atendimento de saúde',
                description: 'Realizamos atendimentos básicos de saúde, prevenção e conscientização em comunidades carentes.',
                achievements: [
                    'Atendimento médico voluntário',
                    'Campanhas de vacinação',
                    'Oficinas de saúde preventiva'
                ],
                supporters: 67
            }
        ];
    }
}
