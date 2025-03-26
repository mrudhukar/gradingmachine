document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let isSystemRunning = false;
let currentToken = '';
let machinesRunning = false;
let outletsDone = 0;
let totalOutlets = 8;

function initApp() {
    // Generate initial QR code for machine ID
    generateMachineQRCode();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize all displays to zero
    resetAllDisplays();
}

function generateMachineQRCode() {
    // QR Code for Machine ID
    const qrcode2 = qrcode(0, 'M');
    qrcode2.addData('MID-27839');
    qrcode2.make();
    document.getElementById('qrcode2').innerHTML = qrcode2.createImgTag(5);
}

function generateTokenQRCode(token) {
    // QR Code for Token
    const qrcode1 = qrcode(0, 'M');
    qrcode1.addData(token);
    qrcode1.make();
    document.getElementById('qrcode1').innerHTML = qrcode1.createImgTag(5);
}

function setupEventListeners() {
    // Start button
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', handleStartButtonClick);
    
    // Token modal
    const modal = document.getElementById('token-modal');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.getElementById('submit-token');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    submitBtn.addEventListener('click', handleTokenSubmit);
    
    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Allow Enter key to submit token
    document.getElementById('token-input').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleTokenSubmit();
        }
    });
    
    // Setup Done buttons
    setupDoneButtons();
}

function setupDoneButtons() {
    const doneButtons = document.querySelectorAll('.done-button');
    
    doneButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Mark this outlet as done
            markOutletAsDone(this, index);
        });
    });
}

function markOutletAsDone(button, index) {
    // Disable the button and change its appearance
    button.disabled = true;
    button.classList.add('completed');
    button.textContent = 'Completed';
    
    // Update the machine status
    const machine = button.closest('.weighing-machine');
    const status = machine.querySelector('.status span');
    status.textContent = 'Completed';
    status.className = 'completed';
    
    // Stop the weight cycle for this machine
    stopMachineAnimation(machine);
    
    // Increment the count of completed outlets
    outletsDone++;
    
    // Check if all outlets are done
    checkAllOutletsDone();
}

function stopMachineAnimation(machine) {
    // Set the display to 0
    const display = machine.querySelector('.display');
    display.textContent = '0.000';
}

function checkAllOutletsDone() {
    if (outletsDone === totalOutlets) {
        // All outlets are done, update output status
        const outputStatus = document.getElementById('output-status');
        outputStatus.textContent = 'Completed';
        outputStatus.className = 'indicator green';
        
        // Re-enable the start button
        const startButton = document.getElementById('start-button');
        startButton.disabled = false;
        
        // End the session
        endSession();
        
        // Reset button appearance
        startButton.textContent = 'Start';
        startButton.classList.remove('end');
        startButton.classList.add('start');
    }
}

function handleStartButtonClick() {
    const startButton = document.getElementById('start-button');
    
    if (!isSystemRunning) {
        // Show token input modal
        document.getElementById('token-modal').style.display = 'block';
        document.getElementById('token-input').focus();
    } else {
        // End the current session
        endSession();
        startButton.textContent = 'Start';
        startButton.classList.remove('end');
        startButton.classList.add('start');
    }
}

function handleTokenSubmit() {
    const tokenInput = document.getElementById('token-input');
    const token = tokenInput.value.trim();
    
    if (token) {
        // Hide modal
        document.getElementById('token-modal').style.display = 'none';
        
        // Start the system with the provided token
        startSystem(token);
        
        // Clear input for next time
        tokenInput.value = '';
    }
}

function startSystem(token) {
    // Set system as running
    isSystemRunning = true;
    currentToken = token;
    outletsDone = 0;
    
    // Update start button to be an end button
    const startButton = document.getElementById('start-button');
    startButton.textContent = 'End';
    startButton.classList.remove('start');
    startButton.classList.add('end');
    
    // Generate QR code with token
    generateTokenQRCode(token);
    
    // Update status indicators
    updateStatusIndicators(true);
    
    // Enable all done buttons immediately
    enableDoneButtons();
    
    // Start weighing machines after delay
    setTimeout(() => {
        if (isSystemRunning) {
            startWeighingMachines();
        }
    }, 10000); // 10 second delay
}

function enableDoneButtons() {
    const doneButtons = document.querySelectorAll('.done-button');
    
    // Force enable all buttons by directly setting the disabled property
    doneButtons.forEach(button => {
        // First remove the disabled attribute completely
        button.removeAttribute('disabled');
        
        // Then set the disabled property to false
        button.disabled = false;
        
        // Update classes and text
        button.classList.remove('completed');
        button.textContent = 'Done';
        
        // Make sure the button is visible and clickable
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
    });
    
    // Log to console for debugging
    console.log('Done buttons enabled:', doneButtons.length);
}

function endSession() {
    // Reset system state
    isSystemRunning = false;
    currentToken = '';
    machinesRunning = false;
    
    // Reset all displays
    resetAllDisplays();
    
    // Reset QR code
    document.getElementById('qrcode1').innerHTML = '';
    
    // Reset status indicators
    updateStatusIndicators(false);
    
    // Stop all weighing machine animations
    stopAllWeighingMachines();
    
    // Disable all done buttons
    disableDoneButtons();
}

function disableDoneButtons() {
    const doneButtons = document.querySelectorAll('.done-button');
    
    doneButtons.forEach(button => {
        // Set the disabled attribute
        button.setAttribute('disabled', 'disabled');
        
        // Also set the disabled property
        button.disabled = true;
        
        // Reset classes and text
        button.classList.remove('completed');
        button.textContent = 'Done';
        
        // Update styles
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
    });
    
    // Log to console for debugging
    console.log('Done buttons disabled:', doneButtons.length);
}

function resetAllDisplays() {
    const displays = document.querySelectorAll('.display');
    displays.forEach(display => {
        display.textContent = '0.000';
    });
    
    const statuses = document.querySelectorAll('.weighing-machine .status span');
    statuses.forEach(status => {
        status.textContent = 'In Progress';
        status.className = 'in-progress';
    });
    
    // Reset counters and total weights
    const countSpans = document.querySelectorAll('.count span');
    const totalWeightSpans = document.querySelectorAll('.total-weight span');
    
    countSpans.forEach(span => {
        span.textContent = '0';
    });
    
    totalWeightSpans.forEach(span => {
        span.textContent = '0.000';
    });
}

function updateStatusIndicators(isRunning) {
    const inputStatus = document.getElementById('input-status');
    const outputStatus = document.getElementById('output-status');
    
    if (isRunning) {
        // System is running
        inputStatus.textContent = 'Started';
        inputStatus.className = 'indicator red';
        
        outputStatus.textContent = 'In Progress';
        outputStatus.className = 'indicator red';
    } else {
        // System is not running
        inputStatus.textContent = 'Not Started';
        inputStatus.className = 'indicator green';
        
        outputStatus.textContent = 'Not Started';
        outputStatus.className = 'indicator green';
    }
}

function startWeighingMachines() {
    if (!isSystemRunning) return;
    
    machinesRunning = true;
    const machines = document.querySelectorAll('.weighing-machine');
    
    // Start each machine with a staggered delay
    machines.forEach((machine, index) => {
        setTimeout(() => {
            if (machinesRunning) {
                startWeightCycle(machine, index);
            }
        }, index * 1000);
    });
}

function stopAllWeighingMachines() {
    machinesRunning = false;
}

function startWeightCycle(machine, index) {
    if (!machinesRunning) return;
    
    // Check if this machine has been marked as done
    const doneButton = machine.querySelector('.done-button');
    if (doneButton.disabled && doneButton.classList.contains('completed')) {
        return; // Skip this machine if it's marked as done
    }
    
    const display = machine.querySelector('.display');
    const status = machine.querySelector('.status span');
    
    // Update status to "In Progress" when starting a new cycle
    status.textContent = 'In Progress';
    status.className = 'in-progress';
    
    // Step 1: Roll up from 0 to a random value
    const newWeight = (Math.random() * 30).toFixed(3);
    animateWeightUp(display, 0, parseFloat(newWeight));
    
    // Step 2: After rolling up, wait 10-15 seconds at the new value
    const displayTime = 5000 + Math.random() * 5000; // 10-15 seconds
    
    setTimeout(() => {
        if (!machinesRunning) return;
        
        // Check again if this machine has been marked as done
        if (doneButton.disabled && doneButton.classList.contains('completed')) {
            return; // Skip the rest of the cycle
        }
        
        // // Update status to "Completed" before rolling down
        // status.textContent = 'Completed';
        // status.className = 'completed';
        
        // Check if all machines are completed
        checkAllMachinesCompleted();
        
        // Step 3: Roll down to zero
        animateWeightDown(display, parseFloat(newWeight), 0, machine);
        
        // Step 4: Stay at zero for 5 seconds
        setTimeout(() => {
            if (machinesRunning) {
                // Check again if this machine has been marked as done
                if (doneButton.disabled && doneButton.classList.contains('completed')) {
                    return; // Skip starting a new cycle
                }
                
                // Repeat the cycle
                startWeightCycle(machine, index);
            }
        }, 5000); // 5 seconds at zero
    }, displayTime);
}

function checkAllMachinesCompleted() {
    const statuses = document.querySelectorAll('.weighing-machine .status span');
    let allCompleted = true;
    
    statuses.forEach(status => {
        if (status.textContent !== 'Completed') {
            allCompleted = false;
        }
    });
    
    if (allCompleted) {
        const outputStatus = document.getElementById('output-status');
        outputStatus.textContent = 'Completed';
        outputStatus.className = 'indicator green';
    }
}

function animateWeightUp(display, startWeight, endWeight) {
    let currentStep = 0;
    const totalSteps = 20;
    
    const interval = setInterval(() => {
        if (!machinesRunning) {
            clearInterval(interval);
            return;
        }
        
        currentStep++;
        const progress = currentStep / totalSteps;
        const currentValue = startWeight + (endWeight - startWeight) * progress;
        display.textContent = currentValue.toFixed(3);
        
        if (currentStep >= totalSteps) {
            clearInterval(interval);
            display.textContent = endWeight.toFixed(3);
        }
    }, 50);
}

function animateWeightDown(display, startWeight, endWeight, machine) {
    let currentStep = 0;
    const totalSteps = 10;
    
    const interval = setInterval(() => {
        if (!machinesRunning) {
            clearInterval(interval);
            return;
        }
        
        // Check if this machine has been marked as done
        const doneButton = machine.querySelector('.done-button');
        if (doneButton.disabled && doneButton.classList.contains('completed')) {
            clearInterval(interval);
            display.textContent = '0.000';
            return;
        }
        
        currentStep++;
        const progress = currentStep / totalSteps;
        const currentValue = startWeight + (endWeight - startWeight) * progress;
        display.textContent = currentValue.toFixed(3);
        
        if (currentStep >= totalSteps) {
            clearInterval(interval);
            display.textContent = endWeight.toFixed(3);
            
            // When weight reaches zero, increment counter and add to total weight
            updateCounterAndTotal(machine, startWeight);
        }
    }, 50);
}

function updateCounterAndTotal(machine, weight) {
    // Get the counter and total weight elements
    const countSpan = machine.querySelector('.count span');
    const totalWeightSpan = machine.querySelector('.total-weight span');
    
    // Increment the counter
    const currentCount = parseInt(countSpan.textContent);
    countSpan.textContent = (currentCount + 1).toString();
    
    // Add the weight to the total
    const currentTotal = parseFloat(totalWeightSpan.textContent);
    const newTotal = (currentTotal + parseFloat(weight)).toFixed(3);
    totalWeightSpan.textContent = newTotal;
}

// Add CSS for the visual feedback
document.head.insertAdjacentHTML('beforeend', `
<style>
    .updated {
        animation: flash 0.5s;
    }
    
    @keyframes flash {
        0% { background-color: #000; }
        50% { background-color: #300; }
        100% { background-color: #000; }
    }
</style>
`);
