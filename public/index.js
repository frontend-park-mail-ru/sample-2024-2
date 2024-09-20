import {Menu, MENU_RENDER_TYPES} from "./components/Menu/Menu.js";
import {safe} from "./utils/safe.js";

console.log('lolkek');
const rootElement = document.getElementById('root');
const menuElement = document.createElement('aside');
const pageElement = document.createElement('main');

rootElement.appendChild(menuElement);
rootElement.appendChild(pageElement);


const config = {
  menu: {
    feed: {
      href: '/feed',
      text: 'Лента',
      render: renderFeed,
    },
    login: {
      href: '/login',
      text: 'Авторизоваться',
      render: renderLogin,
    },
    signup: {
      href: '/signup',
      text: 'Регистрация',
      render: renderSignup
    },
    profile: {
      href: '/profile',
      text: safe('Профиль'),
      // Вектор атаки XSS. Работает, если делать рендер через строку. Для ознакомления!
      // text: safe('<iframe onload="alert(1234)"></iframe>'),
      render: renderProfile,
    }
  }
};

const menu = new Menu(menuElement, config);

function renderMenu() {
    menu.render(MENU_RENDER_TYPES.TEMPLATE);
    menuElement.addEventListener('click', (e) => {
        const {target} = e;

        if (target.tagName.toLowerCase() === 'a'|| target instanceof HTMLAnchorElement) {
            e.preventDefault();

            goToPage(target);
        }
    });
}

function createInput(type, text, name) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = text;

  return input;
}

function renderLogin() {
  const form = document.createElement('form');

  const emailInput = createInput('email', 'Емайл', 'email');
  const passwordInput = createInput('password', 'Пароль', 'password');

  const submitBtn = document.createElement('input');
  submitBtn.type = 'submit';
  submitBtn.value = 'Войти!';

  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    Ajax.post({
        url: '/login',
        body: {password, email},
        callback: (status) => {
            if(status === 200) {
                goToPage(menu.state.menuElements.profile);
                return;
            }

            alert('НЕВЕРНЫЙ ЕМЕЙЛ ИЛИ ПАРОЛЬ');
        }
    });
  })

  return form;
}

function renderSignup() {
  const form = document.createElement('form');

  const emailInput = createInput('email', 'Емайл', 'email');
  const passwordInput = createInput('password', 'Пароль', 'password');
  const ageInput = createInput('number', 'Возраст', 'age');

  const submitBtn = document.createElement('input');
  submitBtn.type = 'submit';
  submitBtn.value = 'Зарегистрироваться!';

  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(ageInput);
  form.appendChild(submitBtn);

  return form;
}

function renderFeed() {
  const feedElement = document.createElement('div');

  Ajax.get({
      url: '/feed',
      callback: (status, responseString) => {
          let isAuthorized = status === 200;

          if (!isAuthorized) {
              alert('Нет авторизации!');
              goToPage(menu.state.menuElements.login);
              return;
          }

          const images = JSON.parse(responseString);

          if (images && Array.isArray(images)) {
              const div = document.createElement('div');
              feedElement.appendChild(div);

              images.forEach(({src, likes}) => {
                  div.innerHTML += `<img src="${src}" width="500" /><div>${likes} лайков</div>`;
              });
          }
      }
  });

  return feedElement;
}

function goToPage(menuLinkElement) {
  pageElement.innerHTML = '';

  menu.state.activeMenuLink?.classList.remove('active');
  menuLinkElement.classList.add('active');
  menu.state.activeMenuLink = menuLinkElement;

  const element = config.menu[menuLinkElement.dataset.section].render();

  pageElement.appendChild(element);
}

function renderProfile() {
  const profileElement = document.createElement('div');

  Ajax.get({
      url: '/me',
      callback: (status, responseString) => {
          const isAuthorized = status === 200;

          if (!isAuthorized) {
              alert('АХТУНГ! нет авторизации');
              goToPage(menu.state.menuElements.login);
              return;
          }

          const {email, age, images} = JSON.parse(responseString);

          const span = document.createElement('span');
          span.textContent = `${email} ${age} лет`;
          profileElement.appendChild(span);

          if (images && Array.isArray(images)) {
              const div = document.createElement('div');
              profileElement.appendChild(div);

              images.forEach(({src, likes}) => {
                  div.innerHTML += `<img src="${src}" width="500"/><div>${likes} лайков</div>`
              });
          }
      }
  });

  return profileElement;
}


renderMenu();
goToPage(menu.state.menuElements.feed);
