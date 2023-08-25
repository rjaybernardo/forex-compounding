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

  // ----------------------START FOREX COMPOUNDING --------------------------------

  document
    .getElementById('fc-form-submit')
    .addEventListener('click', function (event) {
      event.preventDefault()

      // Extracting values from the form
      const startBalance = parseFloat(
        document.getElementById('fc-start-balance-input').value
      )
      console.log('Start Balance:', startBalance)

      const percentage =
        parseFloat(document.getElementById('fc-percentage-input').value) / 100
      const years = parseFloat(document.getElementById('fc-years-input').value)
      const months = parseFloat(
        document.getElementById('fc-months-input').value
      )
      const compoundingFrequency = parseFloat(
        document.getElementById('compound-interest-sidebar__compound-interval')
          .value
      )
      const additionalContribution = parseFloat(
        document.getElementById('fc-add-contri-input').value
      )

      let totalMonths = years * 12 + months

      // Compound the initial balance
      let compoundedStartBalance =
        startBalance *
        Math.pow(
          1 + percentage / compoundingFrequency,
          compoundingFrequency * (totalMonths / 12)
        )

      // Calculate future value of additional contributions
      let contributionFutureValue = 0
      if (additionalContribution && !isNaN(additionalContribution)) {
        for (let i = 0; i < totalMonths; i++) {
          contributionFutureValue +=
            additionalContribution *
            Math.pow(
              1 + percentage / compoundingFrequency,
              compoundingFrequency * ((totalMonths - i) / 12)
            )
        }
      }

      // Sum of compounded start balance and contributions
      let futureValue = compoundedStartBalance + contributionFutureValue

      // Calculate other results
      const totalEarnings =
        futureValue - startBalance - additionalContribution * totalMonths
      const percentageMonthly =
        (Math.pow(futureValue / startBalance, 1 / totalMonths) - 1) * 100
      const totalWeightedRateOfReturn = (futureValue / startBalance - 1) * 100

      // Display results
      document.getElementById(
        'futureValueResult'
      ).innerText = `Future Investment: $${futureValue.toFixed(2)}`
      document.getElementById(
        'totalEarningsResult'
      ).innerText = `Total Earnings: $${totalEarnings.toFixed(2)}`
      document.getElementById(
        'initialBalanceResult'
      ).innerText = `Initial Balance: $${startBalance.toFixed(2)}`
      document.getElementById(
        'additionalDepositsResult'
      ).innerText = `Additional Deposits: $${(
        additionalContribution * totalMonths
      ).toFixed(2)}`
      document.getElementById(
        'percentageMonthlyResult'
      ).innerText = `Percentage Monthly: ${percentageMonthly.toFixed(2)}%`
      document.getElementById(
        'totalWeightedRateOfReturnResult'
      ).innerText = `Total Weighted Rate of Return: ${totalWeightedRateOfReturn.toFixed(
        2
      )}%`
    })

  // ----------------------END FOREX COMPOUNDING --------------------------------

  // ----------------------START DAILY COMPOUNDING --------------------------------

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
  // ----------------------END DAILY COMPOUNDING --------------------------------

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
  //SIMPLE INTEREST
  document
    .getElementById('si-form-submit')
    .addEventListener('click', function (event) {
      event.preventDefault() // Prevent the form from submitting

      // Get the values from the form
      const P = parseFloat(document.getElementById('si-starting-balance').value)
      let r =
        parseFloat(
          document.getElementById('simple-interest-sidebar__interest-rate')
            .value
        ) / 100
      const rateType = document.getElementById(
        'simple-interest-sidebar__rate-select'
      ).value

      if (rateType == '12') {
        // Convert monthly rate to yearly
        r = r * 12
      }

      let t // Time in years

      // Calculate time based on user's choice of time period or end date
      if (
        document.getElementById('si-time-period').classList.contains('active')
      ) {
        const years =
          parseInt(document.getElementById('field-years-input').value) || 0
        const months =
          (parseInt(document.getElementById('field-months-input').value) || 0) /
          12
        const weeks =
          (parseInt(document.getElementById('field-weeks-input').value) || 0) /
          52
        const days =
          (parseInt(document.getElementById('field-days-input').value) || 0) /
          365
        t = years + months + weeks + days
      } else {
        const startDate = new Date(document.getElementById('si-start').value)
        const endDate = new Date(document.getElementById('si-end').value)
        t = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365) // Convert milliseconds to years
      }

      // Calculate simple interest and final balance
      const I = P * r * t
      const F = P + I

      // Embed results into the Webflow embed element
      const resultsEmbed = document.getElementById('simpleInterestResultsEmbed')
      resultsEmbed.innerHTML = `
        <h2>Simple Interest Results</h2>
        <p>Final Balance: $${F.toFixed(2)}</p>
        <p>Interest Accrued: $${I.toFixed(2)}</p>
        <p>Initial Balance: $${P.toFixed(2)}</p>
        <p>Monthly Interest: $${(I / (t * 12)).toFixed(2)}</p>
        <p>End Date: ${endDate.toISOString().slice(0, 10)}</p>
    `
    })
})
