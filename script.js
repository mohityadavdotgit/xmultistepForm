    let currentStep = 1;
    let isYearly = false;

    const state = {
      plan: { name: 'Arcade', price: 9 },
      addons: []
    };

    // DOM Elements
    const nextBtn = document.getElementById('next-button');
    const backBtn = document.getElementById('back-button');
    const billingToggle = document.getElementById('billing-toggle');
    const planCards = document.querySelectorAll('.plan_card');
    const addonCards = document.querySelectorAll('.addon_card');

    // Email validation helper
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Input Validation for Step 1
    function validateStep1() {
      let isValid = true;
      const nameInput = document.querySelector('input[name="userName"]');
      const emailInput = document.querySelector('input[name="email"]');
      const phoneInput = document.querySelector('input[name="phone"]');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const phoneError = document.getElementById('phone-error');

      // Name validation
      if (!nameInput.value.trim()) {
        nameError.innerText = 'This field is required';
        nameError.style.display = 'block';
        nameInput.classList.add('error');
        isValid = false;
      } else {
        nameError.style.display = 'none';
        nameInput.classList.remove('error');
      }

      // Email validation
      if (!emailInput.value.trim()) {
        emailError.innerText = 'This field is required';
        emailError.style.display = 'block';
        emailInput.classList.add('error');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        emailError.innerText = 'Invalid email format';
        emailError.style.display = 'block';
        emailInput.classList.add('error');
        isValid = false;
      } else {
        emailError.style.display = 'none';
        emailInput.classList.remove('error');
      }

      // Phone validation
      if (!phoneInput.value.trim()) {
        phoneError.innerText = 'This field is required';
        phoneError.style.display = 'block';
        phoneInput.classList.add('error');
        isValid = false;
      } else {
        phoneError.style.display = 'none';
        phoneInput.classList.remove('error');
      }

      return isValid;
    }

    // Step 2 Validation
    function validateStep2() {
      const selectedPlan = document.querySelector('.plan_card.selected');
      const planError = document.getElementById('plan-error');
      if (!selectedPlan) {
        planError.style.display = 'block';
        return false;
      }
      planError.style.display = 'none';
      return true;
    }

    // Update Plan Prices on Toggle
    billingToggle.addEventListener('change', (e) => {
      isYearly = e.target.checked;
      document.getElementById('monthly-label').classList.toggle('active', !isYearly);
      document.getElementById('yearly-label').classList.toggle('active', isYearly);

      planCards.forEach(card => {
        const price = isYearly ? card.dataset.yearly : card.dataset.monthly;
        const unit = isYearly ? 'yr' : 'mo';
        card.querySelector('.plan-price').innerText = `$${price}/${unit}`;
        card.querySelector('.yearly-bonus').style.display = isYearly ? 'block' : 'none';
      });

      addonCards.forEach(card => {
        const price = isYearly ? card.dataset.yearly : card.dataset.monthly;
        const unit = isYearly ? 'yr' : 'mo';
        card.querySelector('.addon-price').innerText = `+$${price}/${unit}`;
      });

      updateState();
    });

    // Plan Selection
    planCards.forEach(card => {
      card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateState();
      });
    });

    // Addon Selection
    addonCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        card.classList.toggle('selected', checkbox.checked);
        updateState();
      });
    });

    function updateState() {
      const selectedPlanCard = document.querySelector('.plan_card.selected');
      if (selectedPlanCard) {
        state.plan = {
          name: selectedPlanCard.dataset.plan,
          price: parseInt(isYearly ? selectedPlanCard.dataset.yearly : selectedPlanCard.dataset.monthly)
        };
      }

      state.addons = [];
      document.querySelectorAll('.addon_card.selected').forEach(card => {
        state.addons.push({
          name: card.dataset.addon,
          price: parseInt(isYearly ? card.dataset.yearly : card.dataset.monthly)
        });
      });
    }

    // Render Step 4 Summary
    function renderSummary() {
      const unit = isYearly ? 'yr' : 'mo';
      const durationText = isYearly ? 'Yearly' : 'Monthly';

      document.getElementById('summary-plan-name').innerText = `${state.plan.name} (${durationText})`;
      document.getElementById('summary-plan-price').innerText = `$${state.plan.price}/${unit}`;

      const addonsListContainer = document.getElementById('summary-addons-list');
      addonsListContainer.innerHTML = '';

      let addonsTotal = 0;
      state.addons.forEach(addon => {
        addonsTotal += addon.price;
        const row = document.createElement('div');
        row.className = 'summary-addon-row';
        row.innerHTML = `
          <span class="summary-addon-name">${addon.name}</span>
          <span class="summary-addon-price">+$${addon.price}/${unit}</span>
        `;
        addonsListContainer.appendChild(row);
      });

      const grandTotal = state.plan.price + addonsTotal;
      document.getElementById('total-label').innerText = `Total (per ${isYearly ? 'year' : 'month'})`;
      document.getElementById('total-price').innerText = `+$${grandTotal}/${unit}`;
    }

    // Navigation Logic
    function goToStep(step) {
      document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
      document.getElementById(`step-${step}`).classList.add('active');

      document.querySelectorAll('.step-item').forEach(item => {
        const itemStep = parseInt(item.dataset.step);
        item.classList.toggle('active', itemStep === step || (step === 5 && itemStep === 4));
      });

      currentStep = step;

      // Handle Buttons State
      if (currentStep === 1) {
        backBtn.style.display = 'none';
      } else if (currentStep <= 4) {
        backBtn.style.display = 'block';
      } else {
        document.getElementById('button-container').style.display = 'none';
      }

      if (currentStep === 4) {
        nextBtn.innerText = 'Confirm';
        nextBtn.classList.add('confirm-btn');
        renderSummary();
      } else {
        nextBtn.innerText = 'Next step';
        nextBtn.classList.remove('confirm-btn');
      }
    }

    nextBtn.addEventListener('click', () => {
      if (currentStep === 1 && !validateStep1()) return;
      if (currentStep === 2 && !validateStep2()) return;

      if (currentStep < 5) {
        goToStep(currentStep + 1);
      }
    });

    backBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });

    document.getElementById('change-plan-btn').addEventListener('click', () => {
      goToStep(2);
    });