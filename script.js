// Load saved form data from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadFormData();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// Load saved form data from localStorage
function loadFormData() {
  const savedData = localStorage.getItem('carRentalFormData');
  if (savedData) {
    const formData = JSON.parse(savedData);
    
    // Fill all input fields
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="time"]').forEach(input => {
      if (formData[input.id]) {
        input.value = formData[input.id];
      }
    });
    
    // Restore selections
    if (formData.fuelType) selectFuelType(formData.fuelType);
    if (formData.carType) setTimeout(() => selectCarType(formData.carType), 100);
    if (formData.driveType) selectDriveType(formData.driveType);
  }
}

// Save form data to localStorage
function saveFormData() {
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    pickupLocation: document.getElementById('pickupLocation').value,
    dropoffLocation: document.getElementById('dropoffLocation').value,
    travelLocation: document.getElementById('travelLocation').value,
    pickupDate: document.getElementById('pickupDate').value,
    pickupTime: document.getElementById('pickupTime').value,
    returnDate: document.getElementById('returnDate').value,
    returnTime: document.getElementById('returnTime').value,
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

// Validate date and time inputs
function validateDates() {
  const pickupDate = new Date(document.getElementById('pickupDate').value);
  const pickupTime = document.getElementById('pickupTime').value;
  const returnDate = new Date(document.getElementById('returnDate').value);
  const returnTime = document.getElementById('returnTime').value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate required times
  if (!pickupTime) {
    showError('pickupDateError', 'Please select pickup time');
    return false;
  }
  if (!returnTime) {
    showError('returnDateError', 'Please select return time');
    return false;
  }

  // Validate dates
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

  // Validate times if same day
  if (returnDate.getTime() === pickupDate.getTime() && returnTime <= pickupTime) {
    showError('returnDateError', 'Return time must be after pickup time');
    return false;
  }

  clearError('pickupDateError');
  clearError('returnDateError');
  document.getElementById('pickupDate').classList.remove('error');
  document.getElementById('returnDate').classList.remove('error');
  return true;
}

// Error handling functions
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.display = 'block';
}

function clearError(elementId) {
  const element = document.getElementById(elementId);
  element.textContent = '';
  element.style.display = 'none';
}

function showStatusMessage(message, type) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
  statusElement.style.display = 'block';
  statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Selection functions for fuel type, car type, and drive type
function selectFuelType(type) {
  document.querySelectorAll('.fuel-btn').forEach(btn => btn.classList.remove('selected'));
  const selectedBtn = document.querySelector(`.fuel-btn[onclick="selectFuelType('${type}')"]`);
  selectedBtn.classList.add('selected');
  document.getElementById('fuelTypeInput').value = type;
  document.getElementById('carTypesContainer').classList.add('active');
  document.querySelectorAll('.car-type').forEach(car => car.classList.remove('selected'));
  document.getElementById('carTypeInput').value = '';
  clearError('fuelTypeError');
  saveFormData();
}

function selectCarType(type) {
  document.querySelectorAll('.car-type').forEach(car => car.classList.remove('selected'));
  document.querySelector(`.car-type[onclick="selectCarType('${type}')"]`).classList.add('selected');
  document.getElementById('carTypeInput').value = type;
  clearError('carTypeError');
  saveFormData();
}

function selectDriveType(type) {
  document.querySelectorAll('.drive-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`.drive-btn[onclick="selectDriveType('${type}')"]`).classList.add('selected');
  document.getElementById('driveTypeInput').value = type;
  clearError('driveTypeError');
  saveFormData();
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show booking confirmation details
function showBookingDetails(formData) {
  document.getElementById('bookingForm').style.display = 'none';
  showStatusMessage('Booking successful! We will contact you shortly to confirm your reservation.', 'success');
  
  const detailsList = document.getElementById('bookingDetailsList');
  detailsList.innerHTML = '';
  
  const details = [
    { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
    { label: 'Contact', value: formData.phone },
    { label: 'Email', value: formData.email },
    { label: 'Pickup Location', value: formData.pickupLocation },
    { label: 'Dropoff Location', value: formData.dropoffLocation },
    { label: 'Travel Location', value: formData.travelLocation },
    { label: 'Pickup Date', value: `${formatDate(formData.pickupDate)} at ${formData.pickupTime}` },
    { label: 'Return Date', value: `${formatDate(formData.returnDate)} at ${formData.returnTime}` },
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
  
  document.getElementById('successDetails').style.display = 'block';
}

// Validate all form fields
function validateForm() {
  let isValid = true;

  // Validate required fields
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
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailError', 'Please enter a valid email address');
    document.getElementById('email').classList.add('error');
    isValid = false;
  }

  // Validate phone number
  const phone = document.getElementById('phone').value;
  if (phone && !/^\d{10}$/.test(phone)) {
    showError('phoneError', 'Please enter a valid 10-digit phone number');
    document.getElementById('phone').classList.add('error');
    isValid = false;
  }

  // Validate dates and times
  if (!validateDates()) isValid = false;

  // Validate selections
  if (!document.querySelector('.fuel-btn.selected')) {
    showError('fuelTypeError', 'Please select a fuel type');
    isValid = false;
  } else clearError('fuelTypeError');

  if (!document.querySelector('.car-type.selected')) {
    showError('carTypeError', 'Please select a car type');
    isValid = false;
  } else clearError('carTypeError');

  if (!document.querySelector('.drive-btn.selected')) {
    showError('driveTypeError', 'Please select a drive type');
    isValid = false;
  } else clearError('driveTypeError');

  // Validate reCAPTCHA
  if (!grecaptcha.getResponse()) {
    showStatusMessage('Please complete the reCAPTCHA verification', 'error');
    isValid = false;
  }

  return isValid;
}

// Form submission handler
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('loadingSpinner');
  
  // Disable button and show loading state
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
    // Prepare form data for submission
    const formData = new FormData(this);
    formData.append('g-recaptcha-response', recaptchaResponse);

    // Create object for success display
    const formValues = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      pickupLocation: document.getElementById('pickupLocation').value,
      dropoffLocation: document.getElementById('dropoffLocation').value,
      travelLocation: document.getElementById('travelLocation').value,
      pickupDate: document.getElementById('pickupDate').value,
      pickupTime: document.getElementById('pickupTime').value,
      returnDate: document.getElementById('returnDate').value,
      returnTime: document.getElementById('returnTime').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      fuelType: document.querySelector('.fuel-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
      carType: document.querySelector('.car-type.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1],
      driveType: document.querySelector('.drive-btn.selected')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
    };

    // Submit with timeout
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

    if (!response.ok) throw new Error(responseData.error || 'Submission failed');

    // Show success
    showBookingDetails(formValues);
    
    // Reset form
    this.reset();
    localStorage.removeItem('carRentalFormData');
    grecaptcha.reset();
    document.querySelectorAll('.fuel-btn, .car-type, .drive-btn').forEach(el => el.classList.remove('selected'));
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