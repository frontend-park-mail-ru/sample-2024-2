// Тип рендера для демонстрации
export const MENU_RENDER_TYPES = {
    DOM: 'DOM',
    STRING: 'STRING',
    TEMPLATE: 'TEMPLATE'
}

export class Menu {
    #parent
    #config
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;

        this.state = {
            activeMenuLink: null,
            menuElements: {},
        }
    }

    get config() {
        return this.#config;
    }

    render(renderType) {
        switch(renderType) {
            case MENU_RENDER_TYPES.DOM:
                this.renderDOM();
                break;
            case MENU_RENDER_TYPES.STRING:
                this.renderString();
                break;
            case MENU_RENDER_TYPES.TEMPLATE:
            default:
                this.renderTemplate();
                break;
        }
    }

    get items() {
        return Object.entries(this.config.menu);
    }

    // Это классический вид рендера. Безопасно, но неудобно
    renderDOM() {
        this.items.forEach(([key, {href, text}], index) => {
            const menuLink = document.createElement('a');
            menuLink.href = href;
            menuLink.textContent = text;
            menuLink.dataset.section = key;
            menuLink.classList.add('menu-item');

            this.#parent.appendChild(menuLink)

            this.state.menuElements[key] = menuLink;
        });
    }

    // Рендер через шаблонную строку. Это опасно — можно получить XSS. В index.js есть пример такой атаки в config.menu.
    renderString() {
        this.items.forEach(([key, {href, text}], index) => {
            let className = 'menu-item';
            if (index === 0) {
                className += ' active';
            }

            this.#parent.innerHTML += `<a class="${className}" href="${href}" data-section="${key}">${text}</a>`;
        });

        this.#parent.querySelectorAll('a').forEach((element) => {
            this.state.menuElements[element.dataset.section] = element;
        });
    }

    // Рендер с использованием шаблонов. Этот подход — правильный!
    // Не обязательно Handlebars. Есть множество решений.
    renderTemplate() {
        const template = Handlebars.templates['Menu.hbs'];
        const items = this.items.map(([key, {href, text}], index) => {
            let className = 'menu-item';
            if (index === 0) {
                className += ' active';
            }
            return {key, href, text, className};
        });
        this.#parent.innerHTML = template({items});
        this.#parent.querySelectorAll('a').forEach((element) => {
            this.state.menuElements[element.dataset.section] = element;
        })
    }
}
