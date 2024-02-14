const home = document.querySelector('.home');
const portfolio = document.querySelector('.portfolio');
const contact = document.querySelector('.contact');

let pathCheck = window.location.pathname;

console.log(pathCheck);

switch (pathCheck) {
    case '/GIT/gwuxdesign/index.html':
    case '/GIT/gwuxdesign/':
    case '/gwuxdesign/index.html':
    case '/gwuxdesign/':
    case '/index.html':
    case '/':
        home.classList.add('active');
        break;
    case '/GIT/gwuxdesign/portfolio.html':
    case '/gwuxdesign/portfolio.html':
    case '/portfolio.html':
        portfolio.classList.add('active');
        break;
    case '/GIT/gwuxdesign/contact.html':
    case '/gwuxdesign/contact.html':
    case '/contact.html':
        contact.classList.add('active');
}