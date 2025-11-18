// ===== SINGLE PAGE APPLICATION (SPA) =====

class SPA {
    static init() {
        this.setupNavigation();
        this.loadInitialPage();
        this.setupLinkInterception();
        
        console.log('🔄 SPA inicializado');
    }

    static setupNavigation() {
        // Navegação via hash para SPA básico
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }

    static loadInitialPage() {
        const hash = window.location.hash.substring(1) || 'home';
        this.navigateTo(hash);
    }

    static handleHashChange() {
        const hash = window.location.hash.substring(1) || 'home';
        this.navigateTo(hash);
    }

    static setupLinkInterception() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-spa]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('href').replace('#', '');
                this.navigateTo(page);
            }
        });
    }

    static async navigateTo(page) {
        try {
            // Mostrar loading
            UIManager.showLoading();
            
            // Carregar conteúdo da página
            const content = await this.loadPageContent(page);
            
            // Atualizar o DOM
            this.updateMainContent(content);
            
            // Atualizar estado
            this.currentPage = page;
            window.location.hash = page;
            
            // Disparar evento personalizado
            this.dispatchPageChangeEvent(page);
            
            console.log(`📄 Navegado para: ${page}`);
            
        } catch (error) {
            console.error('Erro na navegação SPA:', error);
            UIManager.showToast('Erro ao carregar a página', 'error');
        } finally {
            UIManager.hideLoading();
        }
    }

    static async loadPageContent(page) {
        // Simular carregamento de templates
        const templates = {
            'home': this.getHomeTemplate(),
            'projetos': this.getProjectsTemplate(),
            'cadastro': this.getRegistrationTemplate(),
            'sobre': this.getAboutTemplate()
        };

        return templates[page] || this.getNotFoundTemplate();
    }

    static updateMainContent(content) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = content;
            
            // Re-inicializar componentes após atualização do DOM
            this.reinitializeComponents();
        }
    }

    static reinitializeComponents() {
        // Re-inicializar validação de formulários
        if (typeof FormValidator !== 'undefined') {
            FormValidator.init();
        }
        
        // Re-inicializar componentes de UI
        if (typeof UIManager !== 'undefined') {
            UIManager.initComponents();
        }
    }

    static dispatchPageChangeEvent(page) {
        const event = new CustomEvent('pageChanged', {
            detail: { page }
        });
        document.dispatchEvent(event);
    }

    // Templates básicos para SPA
    static getHomeTemplate() {
        return `
            <section class="hero">
                <div class="container">
                    <div class="hero-grid">
                        <div class="hero-content">
                            <h1>ONG TransformaVidas</h1>
                            <p>Há mais de 15 anos transformando realidades e construindo um futuro melhor</p>
                            <div class="flex gap-3 justify-center">
                                <a href="#projetos" class="btn btn-primary" data-spa>Conhecer Projetos</a>
                                <a href="#cadastro" class="btn btn-outline" data-spa>Ser Voluntário</a>
                            </div>
                        </div>
                        <div class="hero-image">
                            <img src="img/ong-home.jpg" alt="Voluntários da ONG em ação comunitária" class="hero-img">
                        </div>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <h2 class="text-center">Sobre Nossa Organização</h2>
                    <p class="text-center">A ONG TransformaVidas atua desde 2009 desenvolvendo projetos sociais que impactam positivamente milhares de pessoas.</p>
                    
                    <div class="grid grid-3" id="sobre-cards"></div>
                </div>
            </section>
        `;
    }

    static getProjectsTemplate() {
        return `
            <section class="hero">
                <div class="container">
                    <h1>Nossos Projetos Sociais</h1>
                    <p>Conheça as iniciativas que transformam vidas diariamente</p>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <div class="cards-grid" id="projetos-container"></div>
                </div>
            </section>
        `;
    }

    static getRegistrationTemplate() {
        return `
            <section class="section">
                <div class="container">
                    <div class="form-container">
                        <div class="form-header">
                            <h1>Junte-se à Nossa Causa</h1>
                            <p>Preencha o formulário abaixo para se cadastrar como voluntário ou doador</p>
                        </div>
                        <form id="formCadastro" class="form" novalidate>
                            <!-- Formulário será injetado via templates -->
                        </form>
                    </div>
                </div>
            </section>
        `;
    }

    static getAboutTemplate() {
        return `
            <section class="hero">
                <div class="container">
                    <h1>Sobre Nós</h1>
                    <p>Conheça mais sobre nossa história e missão</p>
                </div>
            </section>
        `;
    }

    static getNotFoundTemplate() {
        return `
            <section class="section">
                <div class="container">
                    <div class="text-center">
                        <h1>Página Não Encontrada</h1>
                        <p>A página que você está procurando não existe.</p>
                        <a href="#home" class="btn btn-primary" data-spa>Voltar para Home</a>
                    </div>
                </div>
            </section>
        `;
    }
}
