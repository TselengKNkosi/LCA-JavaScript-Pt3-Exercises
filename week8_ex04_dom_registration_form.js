/** --- Grabbing Elements --- */
const registrationForm = document.querySelector('#registrationForm');
const formMessage = document.querySelector('#formMessage');
const submitBtn = document.querySelector('#submitBtn');

const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirmPassword');

const usernameError = document.querySelector('#usernameError');
const emailError = document.querySelector('#emailError');
const passwordError = document.querySelector('#passwordError');
const confirmPasswordError = document.querySelector('#confirmPasswordError');

/** --- Valiation Rules Object --- */
const validationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9._%+-]/,
  },
  password: {
    minLength: 6,
    maxLength: 50,
  },
  email: {
    minLength: 5,
    maxLength: 100,
  }
};

/** --- Event Listeners --- */

//Prevent the form from reloading the page (default behaviour)
registrationForm.addEventListener('submit',(event) => {
  event.preventDefault();

  //Run Validation
  validateForm();
});

/** --- Helper Functions --- */

//showFieldError() function 
function showFieldError(input, errorDiv, message) {
  //Input error styling
  input.classList.remove('inputSuccess');
  input.classList.add('inputError');

  //Display error message
  errorDiv.textContent = message;
  errorDiv.classList.add('show');

  console.warn(message);
};

//clearFieldError() function
function clearFieldError(input, errorDiv) {
  //Input error styling
  input.classList.remove('inputError');
  input.classList.add('inputSuccess');

  //Hide error message
  errorDiv.textContent = '';
  errorDiv.classList.remove('show');
};

//clearAllErrors() function 
function clearAllErrors() {
  //Reset error div
  const errorDivs = [usernameError, emailError, passwordError, confirmPasswordError];
  errorDivs.forEach(errorDiv => {
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
  });

  //Reset input success/error styling
  const inputs = [usernameInput, emailInput, passwordInput, confirmPasswordInput];
  inputs.forEach(input => {
    input.classList.remove('inputError', 'inputSuccess');
  });

  //Clear formMessage
  formMessage.textContent = '';
  formMessage.classList.remove('success', 'error');
  formMessage.style.display = 'none';
};

//showSuccessMessage() function — displays success message in formMessage 
function showSuccessMessage(message) {
  formMessage.textContent = message;
  formMessage.classList.remove('error');
  formMessage.classList.add('success');
  formMessage.style.display = 'block';
};

//showErrorMessage() function — displays error message in formMessage
function showErrorMessage(message) {
  formMessage.textContent = message;
  formMessage.classList.remove('success')
  formMessage.classList.add('error');
  formMessage.style.display = 'block';
};

/** -- Validation Functions --- */

//validateUsername() function 
function validateUsername() {
  const username = usernameInput.value.trim();
  const errorDiv = usernameError;

  //Check if field is empty
  if (!username) {
    showFieldError(usernameInput, errorDiv, 'Field is empty, enter a valid username');
    return false;
  }

  //Check min length
  if (username.length < validationRules.username.minLength) {
    showFieldError(usernameInput, errorDiv, `Username must be at least ${validationRules.username.minLength} characters`);
    return false;
  }

  //Check max length
  if (username.length > validationRules.username.maxLength) {
    showFieldError(usernameInput, errorDiv, `Username must not exceed ${validationRules.username.maxLength} characters`);
    return false;
  }

  //Check username for invalid characters 
  if (!validationRules.username.pattern.test(username)) {
    showFieldError(usernameInput, errorDiv, 'Username can only include letters, numbers, hyphens, and underscores');
    return false;
  }

  //Validation Passed
  clearFieldError(usernameInput, errorDiv);
  return true;
};

//validateEmail() function
function validateEmail() {
  const email = emailInput.value.trim();
  const errorDiv = emailError;

  //Check if field is empty
  if (!email) {
    showFieldError(emailInput, errorDiv, 'Field cannot be empty, enter email');
    return false;
  }

  //Check for "@" symbol inside email
  if (!email.includes('@')) {
    showFieldError(emailInput, errorDiv, 'Email must contain an "@" symbol');
    return false;
  }

  //Check for content before and after "@" symbol
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    showFieldError(emailInput, errorDiv, 'Invalid Format');
    return false;
  }

  //Check the domain for a '.' 
  if (!domain.includes('.')) {
    showFieldError(emailInput, errorDiv, 'Email domain must be valid (e.g., gmail.com)');
    return false;
  }

  //Validation Passed
  clearFieldError(emailInput, errorDiv);
  return true;
};

//validatePassword() function
function validatePassword() {
  const password = passwordInput.value;
  const errorDiv = passwordError;

  //Check if field is empty
  if (!password) {
    showFieldError(passwordInput, errorDiv, 'Field is empty, enter a password');
    return false;
  }

  //Check if content is min length
  if (password.length < validationRules.password.minLength) {
    showFieldError(passwordInput, errorDiv, `Password must be at least ${validationRules.password.minLength} characters long.`);
    return false;
  }

  //Check if content is above max length
  if (password.length > validationRules.password.maxLength) {
    showFieldError(passwordInput, errorDiv, `Password must not exceed ${validationRules.password.maxLength} characters`);
    return false;
  }

  //Validtion Passed
  clearFieldError(passwordInput, errorDiv);
  return true;
};

//validateConfirmPassword() function
function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const errorDiv = confirmPasswordError;

  //Check if field is empty
  if (!confirmPassword) {
    showFieldError(confirmPasswordInput, errorDiv, 'Field is empty, confirm password');
    return false;
  }

  //Check if passwords match exactly
  if (password !== confirmPassword) {
    showFieldError(confirmPasswordInput, errorDiv, 'Passwords do not match');
    return false;
  }

  //Validation Passed 
  clearFieldError(confirmPasswordInput, errorDiv);
  return true;
};

/** --- main validation Function ---
 * 
 * validateForm() function
 * 
 * Purpose = runs/executes the validation of each field and logs form data if valid
 */
function validateForm() {
  //Clear all previous error states 
  clearAllErrors();

  //Validate each field
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (isUsernameValid == true && isEmailValid == true && isPasswordValid == true && isConfirmPasswordValid == true) {
    //Collect form Data
    const formData = {
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value
    };

    //Success Message
    showSuccessMessage('Registration Successful!');

    //Log collected form data
    console.log('--- Form Data ---');
    console.table(formData);

    //Reset the form
    registrationForm.reset();
  } else {
    console.log('Cannot Register. Please fix errors above.');
    
  };
}

