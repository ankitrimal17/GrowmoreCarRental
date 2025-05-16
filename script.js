// Load saved form data from localStorage
function loadFormData() {
    const savedData = localStorage.getItem('carRentalFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      
      // Fill text inputs
      document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]').forEach(input => {
        if (formData[input.id]) {
          input.value = formData[input.id];
        }
      });
      
      // Restore fuel type selection
      if (formData.fuelType) {
        selectFuelType(formData.fuelType);
      }
      
      // Restore car type selection
      if (formData.carType) {
        setTimeout(() => {
          selectCarType(formData.carType);
        }, 100);
      }
      
      // Restore drive type selection
      if (formData.driveType) {
        selectDriveType(formData.driveType);
      }
    }
  }
  
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Save form data to localStorage
  function saveFormData() {
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      pickupLocation: document.getElementById('pickupLocation').value,
      dropoffLocation: document.getElementById('dropoffLocation').value,
      travelLocation: document.getElementById('travelLocation').value,
      pickupDate: document.getElementById('pickupDate').value,
      returnDate: document.getElementById('returnDate').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      fuelType: document.querySelector('.fuel-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
      carType: document.querySelector('.car-type.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
      driveType: document.querySelector('.drive-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
    };
    
    localStorage.setItem('carRentalFormData', JSON.stringify(formData));
  }
  
  // Auto-save form data when inputs change
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', saveFormData);
  });
  
  // Validate date inputs
  function validateDates() {
    const pickupDate = new Date(document.getElementById('pickupDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (pickupDate < today) {
      showError('pickupDateError', 'Pickup date cannot be in the past');
      document.getElementById('pickupDate').classList.add('error');
      return false;
    }
  
    if (returnDate < pickupDate) {
      showError('returnDateError', 'Return date must be after pickup date');
      document.getElementById('returnDate').classList.add('error');
      return false;
    }
  
    clearError('pickupDateError');
    clearError('returnDateError');
    document.getElementById('pickupDate').classList.remove('error');
    document.getElementById('returnDate').classList.remove('error');
    return true;
  }
  
  // Show error message
  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
  }
  
  // Clear error message
  function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    element.style.display = 'none';
  }
  
  // Show status message
  function showStatusMessage(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';
    
    // Scroll to the message
    statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  function selectFuelType(type) {
    // Remove selected class from all buttons
    document.querySelectorAll('.fuel-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
  
    // Add selected class to clicked button
    const selectedBtn = document.querySelector(`.fuel-btn[onclick="selectFuelType('${type}')"]`);
    selectedBtn.classList.add('selected');
    
    // Set the hidden input value
    document.getElementById('fuelTypeInput').value = type;
    
    // Show car types
    document.getElementById('carTypesContainer').classList.add('active');
    
    // Reset car type selection
    document.querySelectorAll('.car-type').forEach(car => {
      car.classList.remove('selected');
    });
    
    // Clear car type hidden input
    document.getElementById('carTypeInput').value = '';
    
    // Clear error
    clearError('fuelTypeError');
    
    // Save form data
    saveFormData();
  }
  
  function selectCarType(type) {
    // Remove selected class from all car types
    document.querySelectorAll('.car-type').forEach(car => {
      car.classList.remove('selected');
    });
  
    // Add selected class to clicked car type
    document.querySelector(`.car-type[onclick="selectCarType('${type}')"]`).classList.add('selected');
    
    // Set the hidden input value
    document.getElementById('carTypeInput').value = type;
    
    // Clear error
    clearError('carTypeError');
    
    // Save form data
    saveFormData();
  }
  
  function selectDriveType(type) {
    // Remove selected class from all buttons
    document.querySelectorAll('.drive-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
  
    // Add selected class to clicked button
    const selectedBtn = document.querySelector(`.drive-btn[onclick="selectDriveType('${type}')"]`);
    selectedBtn.classList.add('selected');
    
    // Set the hidden input value
    document.getElementById('driveTypeInput').value = type;
    
    // Clear error
    clearError('driveTypeError');
    
    // Save form data
    saveFormData();
  }
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  // Show booking details after successful submission
  function showBookingDetails(formData) {
    // Hide the form
    document.getElementById('bookingForm').style.display = 'none';
    
    // Show success message
    showStatusMessage('Booking successful! We will contact you shortly to confirm your reservation.', 'success');
    
    // Prepare the booking details
    const detailsList = document.getElementById('bookingDetailsList');
    detailsList.innerHTML = '';
    
    // Add booking details to the list
    const details = [
      { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
      { label: 'Contact', value: formData.phone },
      { label: 'Email', value: formData.email },
      { label: 'Pickup Location', value: formData.pickupLocation },
      { label: 'Dropoff Location', value: formData.dropoffLocation },
      { label: 'Travel Location', value: formData.travelLocation },
      { label: 'Pickup Date', value: formatDate(formData.pickupDate) },
      { label: 'Return Date', value: formatDate(formData.returnDate) },
      { label: 'Fuel Type', value: formData.fuelType === 'petrol' ? 'Petrol/Diesel' : 'Electric' },
      { label: 'Car Type', value: formData.carType === 'suv' ? 'SUV' : 
                                formData.carType === 'hatchback' ? 'Hatchback' : 'Sedan' },
      { label: 'Drive Type', value: formData.driveType === 'self' ? 'Self Drive' : 'With Driver' }
    ];
    
    details.forEach(detail => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${detail.label}:</strong> <span>${detail.value}</span>`;
      detailsList.appendChild(li);
    });
    
    // Show the success details section
    document.getElementById('successDetails').style.display = 'block';
  }
  
  // Validate form fields
  function validateForm() {
    let isValid = true;
  
    // Validate required text fields
    const requiredFields = [
      'firstName', 'lastName', 'pickupLocation', 
      'dropoffLocation', 'travelLocation', 'phone', 'email'
    ];
  
    requiredFields.forEach(field => {
      const value = document.getElementById(field).value.trim();
      if (!value) {
        showError(`${field}Error`, 'This field is required');
        document.getElementById(field).classList.add('error');
        isValid = false;
      } else {
        clearError(`${field}Error`);
        document.getElementById(field).classList.remove('error');
      }
    });
  
    // Validate email format
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      showError('emailError', 'Please enter a valid email address');
      document.getElementById('email').classList.add('error');
      isValid = false;
    }
  
    // Validate phone number
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^\d{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      showError('phoneError', 'Please enter a valid 10-digit phone number');
      document.getElementById('phone').classList.add('error');
      isValid = false;
    }
  
    // Validate dates
    if (!validateDates()) {
      isValid = false;
    }
  
    // Validate fuel type selection
    if (!document.querySelector('.fuel-btn.selected')) {
      showError('fuelTypeError', 'Please select a fuel type');
      isValid = false;
    } else {
      clearError('fuelTypeError');
    }
  
    // Validate car type selection
    if (!document.querySelector('.car-type.selected')) {
      showError('carTypeError', 'Please select a car type');
      isValid = false;
    } else {
      clearError('carTypeError');
    }
  
    // Validate drive type selection
    if (!document.querySelector('.drive-btn.selected')) {
      showError('driveTypeError', 'Please select a drive type');
      isValid = false;
    } else {
      clearError('driveTypeError');
    }
  
    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      showStatusMessage('Please complete the reCAPTCHA verification', 'error');
      isValid = false;
    }
  
    return isValid;
  }
  
  // Form submission
  document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('loadingSpinner');
    
    // Disable button immediately
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    spinner.style.display = 'inline-block';
  
    // Offline check
    if (!navigator.onLine) {
      showStatusMessage('You appear to be offline. Please check your connection.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Now';
      spinner.style.display = 'none';
      return;
    }
  
    // Validate form
    if (!validateForm()) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Now';
      spinner.style.display = 'none';
      return;
    }
  
    // Verify reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      showStatusMessage('Please complete the reCAPTCHA verification', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Now';
      spinner.style.display = 'none';
      return;
    }
  
    try {
      const formData = new FormData(this);
      formData.append('g-recaptcha-response', recaptchaResponse);
  
      // Create an object with all form values for the success display
      const formValues = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        dropoffLocation: document.getElementById('dropoffLocation').value,
        travelLocation: document.getElementById('travelLocation').value,
        pickupDate: document.getElementById('pickupDate').value,
        returnDate: document.getElementById('returnDate').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        fuelType: document.querySelector('.fuel-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
        carType: document.querySelector('.car-type.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
        driveType: document.querySelector('.drive-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
      };
  
      // Submit with 10s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Submission failed');
      }
  
      // Show success with booking details
      showBookingDetails(formValues);
      
      // Clear form and local storage
      this.reset();
      localStorage.removeItem('carRentalFormData');
      grecaptcha.reset();
      
      // Reset UI selections
      document.querySelectorAll('.fuel-btn, .car-type, .drive-btn').forEach(el => {
        el.classList.remove('selected');
      });
      document.getElementById('carTypesContainer').classList.remove('active');
  
    } catch (error) {
      const errorMsg = error.name === 'AbortError' 
        ? 'Request timed out. Please try again.' 
        : `Error: ${error.message}`;
      showStatusMessage(errorMsg, 'error');
      console.error('Submission error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Now';
      spinner.style.display = 'none';
    }
  });
  
  // Load any saved form data when page loads
  document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
  });