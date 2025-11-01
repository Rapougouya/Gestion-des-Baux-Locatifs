// Auth functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthFill && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthFill.setAttribute('data-strength', strength);
            strengthFill.style.width = `${(strength + 1) * 25}%`;
            
            const strengthLabels = ['Faible', 'Moyen', 'Fort', 'Très fort'];
            strengthText.textContent = strengthLabels[strength];
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // Cap at 3 for our 4-level system (0-3)
        return Math.min(strength - 2, 3);
    }

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Multi-step form for signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        let currentStep = 1;
        const totalSteps = 3;
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        nextBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormSteps();
            }
        });
        
        prevBtn.addEventListener('click', function() {
            currentStep--;
            updateFormSteps();
        });
        
        function validateStep(step) {
            // Simple validation - in real app, add proper validation
            return true;
        }
        
        function updateFormSteps() {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            
            // Show current step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
            
            // Update progress
            const progressFill = document.querySelector('.progress-fill');
            progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
            
            // Update steps UI
            document.querySelectorAll('.step').forEach((step, index) => {
                if (index + 1 <= currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            
            // Update buttons
            prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
            nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
            submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
            
            // Update review information on final step
            if (currentStep === 3) {
                updateReviewInfo();
            }
        }
        
        function updateReviewInfo() {
            document.getElementById('reviewName').textContent = 
                `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
            document.getElementById('reviewEmail').textContent = 
                document.getElementById('email').value;
            
            const accountType = document.querySelector('input[name="accountType"]:checked');
            document.getElementById('reviewAccountType').textContent = 
                accountType ? accountType.value.charAt(0).toUpperCase() + accountType.value.slice(1) : '-';
        }
        
        // Initialize form
        updateFormSteps();
    }

    // Quick access buttons for login
    const accessBtns = document.querySelectorAll('.access-btn');
    accessBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            accessBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Forgot password modal
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModalBtn = document.querySelector('.btn-close');
    const cancelModalBtn = document.querySelector('.btn-cancel');

    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });
        
        [closeModalBtn, cancelModalBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function() {
                    forgotPasswordModal.style.display = 'none';
                });
            }
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
            }
        });
    }

    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add login logic here
            console.log('Login attempt');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add signup logic here
            console.log('Signup attempt');
        });
    }

    console.log('PNSBIL Auth System Loaded');
});