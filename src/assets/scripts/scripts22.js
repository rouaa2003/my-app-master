function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('guestPage').classList.add('hidden');
    document.querySelector('.container').classList.add('hidden');
}

function showSignUp() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.remove('hidden');
    document.getElementById('guestPage').classList.add('hidden');
    document.querySelector('.container').classList.add('hidden');
}

function visitAsGuest() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('guestPage').classList.remove('hidden');
    document.querySelector('.container').classList.add('hidden');
}
