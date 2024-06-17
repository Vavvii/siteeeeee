document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerButton = registerForm.querySelector('button[type="submit"]');
    const loginButton = loginForm.querySelector('button[type="submit"]');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    registerForm.addEventListener('input', () => {
        const isFormValid = [...registerForm.elements].filter(input => input.type !== 'submit').every(input => input.value);
        registerButton.disabled = !isFormValid;
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: registerForm['register-username'].value,
            password: registerForm['register-password'].value,
            email: registerForm['register-email'].value,
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Registration successful. You can now log in.');
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
            } else {
                alert(`Registration failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: loginForm['login-username'].value,
            password: loginForm['login-password'].value,
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                
                const isAdminResponse = await fetch('/checkAdmin');
                const isAdminResult = await isAdminResponse.json();
                if (isAdminResult.isAdmin) {
                    window.location.href = '/admin'; 
                } else {
                    window.location.href = '/'; 
                }
            } else {
                alert(`Login failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
});
