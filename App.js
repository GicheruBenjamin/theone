const app = document.getElementById("app");

// App state
let currentUser = JSON.parse(sessionStorage.getItem("user")) || null;

// -----------------------------
// API Functions
// -----------------------------
async function fetchUsers() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return await res.json();
}

async function fetchPosts(userId) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    return await res.json();
}

// -----------------------------
// Helper: create element
// -----------------------------
function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.id) el.id = options.id;
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.type) el.type = options.type;
    if (options.placeholder) el.placeholder = options.placeholder;
    if (options.value) el.value = options.value;
    if (options.src) el.src = options.src;
    if (options.href) el.href = options.href;
    return el;
}

// -----------------------------
// Navbar
// -----------------------------
function renderNavbar() {
    const nav = createEl('nav');

    const homeLink = createEl('a', { text: 'Home', href: '#' });
    const aboutLink = createEl('a', { text: 'About', href: '#' });

    nav.appendChild(homeLink);
    nav.appendChild(document.createTextNode(' | '));
    nav.appendChild(aboutLink);
    nav.appendChild(document.createTextNode(' | '));

    if (currentUser) {
        const logoutLink = createEl('a', { text: 'Logout', href: '#' });
        logoutLink.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            currentUser = null;
            renderHome();
        });
        nav.appendChild(logoutLink);
    } else {
        const loginLink = createEl('a', { text: 'Login', href: '#' });
        loginLink.addEventListener('click', () => renderLogin());
        nav.appendChild(loginLink);
    }

    return nav;
}

// -----------------------------
// Pages
// -----------------------------
function renderHome() {
    app.innerHTML = '';
    app.appendChild(renderNavbar());

    const main = createEl('main');
    const h1 = createEl('h1', { text: 'Welcome to The One' });
    const p = createEl('p', { text: 'Landing page content goes here.' });

    main.appendChild(h1);
    main.appendChild(p);

    app.appendChild(main);
}

function renderAbout() {
    app.innerHTML = '';
    app.appendChild(renderNavbar());

    const main = createEl('main');
    const h1 = createEl('h1', { text: 'About' });
    const p = createEl('p', { text: 'This app is a single-page client-side app with dynamic login and user dashboard.' });

    main.appendChild(h1);
    main.appendChild(p);

    app.appendChild(main);
}

function renderLogin() {
    app.innerHTML = '';
    app.appendChild(renderNavbar());

    const main = createEl('main');
    const h1 = createEl('h1', { text: 'Login' });

    const form = createEl('form', { id: 'loginForm' });
    const usernameInput = createEl('input', { id: 'username', placeholder: 'Username', type: 'text' });
    const emailInput = createEl('input', { id: 'email', placeholder: 'Email', type: 'email' });
    const submitBtn = createEl('button', { text: 'Login', type: 'submit' });
    const errorP = createEl('p', { id: 'error' });

    form.appendChild(usernameInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(emailInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitBtn);
    form.appendChild(errorP);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        const users = await fetchUsers();
        const user = users.find(u => u.username === username && u.email === email);

        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            currentUser = user;
            renderDashboard();
        } else {
            errorP.textContent = 'Invalid username or email!';
        }
    });

    main.appendChild(h1);
    main.appendChild(form);
    app.appendChild(main);
}

async function renderDashboard() {
    if (!currentUser) {
        renderLogin();
        return;
    }

    app.innerHTML = '';
    app.appendChild(renderNavbar());

    const main = createEl('main');
    const h1 = createEl('h1', { text: 'Dashboard' });

    // User info
    const infoDiv = createEl('div', { id: 'userInfo' });
    const nameP = createEl('p', { text: `Name: ${currentUser.name}` });
    const usernameP = createEl('p', { text: `Username: ${currentUser.username}` });
    const emailP = createEl('p', { text: `Email: ${currentUser.email}` });

    infoDiv.appendChild(nameP);
    infoDiv.appendChild(usernameP);
    infoDiv.appendChild(emailP);

    // User posts
    const postsDiv = createEl('div', { id: 'userPosts' });
    const h2 = createEl('h2', { text: 'Your Posts' });
    postsDiv.appendChild(h2);

    const posts = await fetchPosts(currentUser.id);
    posts.forEach(post => {
        const postDiv = createEl('div');
        const title = createEl('h3', { text: post.title });
        const body = createEl('p', { text: post.body });
        postDiv.appendChild(title);
        postDiv.appendChild(body);
        postDiv.style.border = "1px solid #ccc";
        postDiv.style.padding = "10px";
        postDiv.style.margin = "10px 0";
        postsDiv.appendChild(postDiv);
    });

    main.appendChild(h1);
    main.appendChild(infoDiv);
    main.appendChild(postsDiv);

    app.appendChild(main);
}

// -----------------------------
// Initialize App
// -----------------------------
renderHome();
