const home = document.querySelector('.home');
const profile = document.querySelector('.profile');
const contact = document.querySelector('.contact');

let pathCheck = window.location.pathname;

switch (pathCheck) {
    case '/GIT/gwuxdesign/':
        home.classList.add('active');
        break;
    case '/GIT/gwuxdesign/profile.html':
        profile.classList.add('active');
        break;
    case '/GIT/gwuxdesign/contact.html':
        contact.classList.add('active');
}