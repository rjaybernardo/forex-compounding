document.addEventListener('DOMContentLoaded', function () {
  // Get the tab links and sidebars
  const compoundInterestTab = document.getElementById('compound-interest-tab')
  const simpleInterestTab = document.getElementById('simple-interest-tab')
  const dailyCompoundingTab = document.getElementById('daily-compounding-tab')
  const forexCompoundingTab = document.getElementById('forex-compounding-tab')

  const compoundInterestSidebar = document.getElementById(
    'compound-interest-sidebar'
  )
  const simpleInterestSidebar = document.getElementById(
    'simple-interest-sidebar'
  )

  // Hide all sidebars
  function hideAllSidebars() {
    compoundInterestSidebar.style.display = 'none'
    simpleInterestSidebar.style.display = 'none'
  }

  // Show the sidebar based on the active tab
  function showSidebarBasedOnActiveTab() {
    if (compoundInterestTab.classList.contains('w--current')) {
      hideAllSidebars()
      compoundInterestSidebar.style.display = 'block'
    } else if (simpleInterestTab.classList.contains('w--current')) {
      hideAllSidebars()
      simpleInterestSidebar.style.display = 'block'
    } else if (
      dailyCompoundingTab.classList.contains('w--current') ||
      forexCompoundingTab.classList.contains('w--current')
    ) {
      hideAllSidebars() // Hide both sidebars for these tabs
    }
  }

  function handleClick() {
    setTimeout(showSidebarBasedOnActiveTab, 50) // Delay the check to ensure the tab has switched
  }

  // Add event listeners to the tabs
  compoundInterestTab.addEventListener('click', handleClick)
  simpleInterestTab.addEventListener('click', handleClick)
  dailyCompoundingTab.addEventListener('click', handleClick)
  forexCompoundingTab.addEventListener('click', handleClick)

  var buttons = document.querySelectorAll('.forex-form-button')
  buttons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault() // Prevent the default link behavior
      // Remove the "selected" state from all buttons
      buttons.forEach(function (innerButton) {
        innerButton.classList.remove('forex-form-button--selected')
      })
      // Add the "selected" state to the clicked button
      button.classList.add('forex-form-button--selected')
    })
  })
  // tab pane toggle button
  let buttonContainers = document.querySelectorAll('.form-button-container')

  buttonContainers.forEach(function (container) {
    let buttons = container.querySelectorAll('.form-button')

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault() // Prevent any default action

        // Remove the active class from all buttons within this container
        buttons.forEach(function (btn) {
          btn.classList.remove('active')
        })

        // Add the active class to the clicked button
        button.classList.add('active')
      })
    })
  })
  document
    .getElementById('fc-form-submit')
    .addEventListener('click', function (event) {
      event.preventDefault() // Prevent the form from submitting

      // Get the values from the form
      const P = parseFloat(
        document.getElementById('fc-start-balance-input').value
      )
      const r =
        parseFloat(document.getElementById('fc-percentage-input').value) / 100
      const n = parseInt(
        document.getElementById('compound-interest-sidebar__compound-interval')
          .value
      )
      const t =
        parseInt(document.getElementById('fc-years-input').value) +
        parseInt(document.getElementById('fc-months-input').value) / 12
      const additionalContribution =
        parseFloat(document.getElementById('fc-add-contri-input').value) || 0
      const contributionFrequencyMapping = {
        First: 52, // weekly
        Second: 12, // monthly
        Third: 4, // quarterly
        'Another option': 1, // yearly
      }
      const contributionFrequency =
        contributionFrequencyMapping[
          document.getElementById('fc-add-contri-select').value
        ]

      // Calculate the future value with additional contributions
      let futureValue = P * Math.pow(1 + r / n, n * t)
      for (let i = 0; i < t * contributionFrequency; i++) {
        futureValue +=
          additionalContribution *
          Math.pow(1 + r / n, n * (t - i / contributionFrequency))
      }

      // Calculate other desired values
      const totalEarnings =
        futureValue - P - additionalContribution * t * contributionFrequency
      const percentageMonthly = (r / 12) * 100
      const totalWeightedRateOfReturn = (futureValue / P - 1) * 100

      // Display results (you'll need to add some elements in your HTML to display these results)
      document.getElementById('futureValueResult').innerText =
        'Future Investment: $' + futureValue.toFixed(2)
      document.getElementById('totalEarningsResult').innerText =
        'Total Earnings: $' + totalEarnings.toFixed(2)
      document.getElementById('initialBalanceResult').innerText =
        'Initial Balance: $' + P.toFixed(2)
      document.getElementById('additionalDepositsResult').innerText =
        'Additional Deposits: $' +
        (additionalContribution * t * contributionFrequency).toFixed(2)
      document.getElementById('percentageMonthlyResult').innerText =
        'Percentage Monthly: ' + percentageMonthly.toFixed(2) + '%'
      document.getElementById('totalWeightedRateOfReturnResult').innerText =
        'Total Weighted Rate of Return: ' +
        totalWeightedRateOfReturn.toFixed(2) +
        '%'
    })

  //Daily Compounding Tab Section
  // Tracking user's choice for including all days or just business days
  let includeAllDays = true

  // Event listeners for the "Include all days of the week" buttons
  document
    .getElementById('weeks-true')
    .addEventListener('click', function (event) {
      event.preventDefault()
      this.classList.add('active')
      document.getElementById('weeks-false').classList.remove('active')
      includeAllDays = true
    })

  document
    .getElementById('weeks-false')
    .addEventListener('click', function (event) {
      event.preventDefault()
      this.classList.add('active')
      document.getElementById('weeks-true').classList.remove('active')
      includeAllDays = false
    })

  // Event listener for the form submission
  document
    .getElementById('dc-form-submit')
    .addEventListener('click', function (event) {
      event.preventDefault() // Prevent the form from submitting

      // Get the values from the form
      const initialP = parseFloat(
        document.getElementById('dc-principal-amount-input').value
      )
      let P = initialP
      const r =
        parseFloat(document.getElementById('dc-interest-rate-input').value) /
        100 /
        365
      const years = parseInt(document.getElementById('dc-years-input').value)
      const months = parseInt(document.getElementById('dc-months-input').value)
      const days = parseInt(document.getElementById('cd-days-input').value)
      const totalDays = years * 365 + months * 30 + days
      const reinvestRate =
        parseFloat(
          document.getElementById('dc-daily-reinvest-rate-select').value
        ) / 100

      const startDate = new Date(document.getElementById('start').value)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + totalDays)

      // Loop over each day for compounding
      for (let i = 0; i < totalDays; i++) {
        if (!includeAllDays) {
          const dayOfWeek = (startDate.getDay() + i) % 7
          if (dayOfWeek === 6 || dayOfWeek === 0) {
            // Skip Saturday and Sunday
            continue
          }
        }
        const interestForDay = P * r
        P += interestForDay * reinvestRate
      }

      const A = P
      const totalInterestEarnings = A - initialP
      const percentageProfit = (A / initialP - 1) * 100
      const dailyInterestRate = r * 100
      const endDateFormatted = endDate.toISOString().slice(0, 10)

      // Display results
      document.getElementById('investmentValueResult').innerText =
        'Investment Value: $' + A.toFixed(2)
      document.getElementById('totalInterestEarningsResult').innerText =
        'Total Interest / Earnings: $' + totalInterestEarnings.toFixed(2)
      document.getElementById('percentageProfitResult').innerText =
        'Percentage Profit: ' + percentageProfit.toFixed(2) + '%'
      document.getElementById('totalDaysResult').innerText =
        'Total Days / Business Days: ' + totalDays
      document.getElementById('dailyInterestRateResult').innerText =
        'Daily Interest Rate: ' + dailyInterestRate.toFixed(2) + '%'
      document.getElementById('endDateResult').innerText =
        'End Date: ' + endDateFormatted
      document.getElementById('initialBalanceResult').innerText =
        'Initial Balance: $' + initialP.toFixed(2)
    })

  //TOGGLE SIMPLE INTEREST

  // Grab elements
  const timePeriodButton = document.getElementById('si-time-period')
  const endDateButton = document.getElementById('si-end-date')
  const timePeriodBlock = document.getElementById('time-period-block')
  const endDateBlock = document.getElementById('end-date-block')

  // Event listener for the "Time period" button
  timePeriodButton.addEventListener('click', function (event) {
    event.preventDefault() // Prevent default behavior
    this.classList.add('active')
    endDateButton.classList.remove('active')
    timePeriodBlock.style.display = 'flex'
    endDateBlock.style.display = 'none'
  })
  // Event listener for the "End date" button
  endDateButton.addEventListener('click', function (event) {
    event.preventDefault() // Prevent default behavior
    this.classList.add('active')
    timePeriodButton.classList.remove('active')
    endDateBlock.style.display = 'block'
    timePeriodBlock.style.display = 'none'
  })
})
