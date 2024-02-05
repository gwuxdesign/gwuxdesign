const home = document.querySelector('.home');
const profile = document.querySelector('.profile');
const contact = document.querySelector('.contact');

let pathCheck = window.location.pathname;

console.log(pathCheck);

switch (pathCheck) {
    case '/GIT/gwuxdesign/':
    case '/gwuxdesign/':
    case '/gwuxdesign/index.html':
    case '/index.html':
    case '/':
        home.classList.add('active');
        break;
    case '/GIT/gwuxdesign/profile.html':
    case '/gwuxdesign/profile.html':
    case '/profile.html':
        profile.classList.add('active');
        break;
    case '/GIT/gwuxdesign/contact.html':
    case '/gwuxdesign/contact.html':
    case '/contact.html':
        contact.classList.add('active');
}