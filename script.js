document.addEventListener('DOMContentLoaded', function() {
    // Generate QR codes
    generateQRCodes();
    
    // Initialize weighing machine displays
    initWeighingMachines();
    
    // Initialize status indicators
    updateStatusIndicators();
});

function generateQRCodes() {
    // QR Code 1 - Machine Information
    const qrcode1 = qrcode(0, 'M');
    qrcode1.addData('C-134');
    qrcode1.make();
    document.getElementById('qrcode1').innerHTML = qrcode1.createImgTag(5);
    
    // QR Code 2 - Maintenance Details
    const qrcode2 = qrcode(0, 'M');
    qrcode2.addData('MID-27839');
    qrcode2.make();
    document.getElementById('qrcode2').innerHTML = qrcode2.createImgTag(5);
}

function initWeighingMachines() {
    const machines = document.querySelectorAll('.weighing-machine');
    
    // Initialize each machine with zero
    machines.forEach((machine, index) => {
        const display = machine.querySelector('.display');
        display.textContent = "0.000";
        
        // Set initial status
        const status = machine.querySelector('.status span');
        status.textContent = 'In Progress';
        status.className = 'in-progress';
        
        // Start the cycle for each machine with a slight delay between them
        setTimeout(() => {
            startWeightCycle(machine, index);
        }, index * 1000); // Stagger the start times
    });
}

// Global variables to track overall system state
let activeMachines = 0;
let completedMachines = 0;
let totalMachines = 8;

function updateStatusIndicators() {
    const inputStatus = document.getElementById('input-status');
    const outputStatus = document.getElementById('output-status');
    
    // Initially both are red
    inputStatus.className = 'indicator red';
    inputStatus.textContent = 'Started';
    
    outputStatus.className = 'indicator red';
    outputStatus.textContent = 'In Progress';
    
    // Check status every second
    setInterval(() => {
        // Count machines in each state
        const machines = document.querySelectorAll('.weighing-machine');
        activeMachines = 0;
        completedMachines = 0;
        
        machines.forEach(machine => {
            const status = machine.querySelector('.status span');
            if (status.textContent === 'In Progress') {
                activeMachines++;
            } else if (status.textContent === 'Completed') {
                completedMachines++;
            }
        });
        
        // Update input status (based on if all machines have started at least once)
        if (activeMachines > 0 || completedMachines > 0) {
            inputStatus.className = 'indicator red';
            inputStatus.textContent = 'Started';
            
            // If all machines have completed at least once
            if (completedMachines === totalMachines) {
                setTimeout(() => {
                    inputStatus.className = 'indicator green';
                    inputStatus.textContent = 'Completed';
                }, 2000);
            }
        }
        
        // Update output status (based on if all machines are completed)
        if (activeMachines > 0) {
            outputStatus.className = 'indicator red';
            outputStatus.textContent = 'In Progress';
        } else if (completedMachines === totalMachines) {
            outputStatus.className = 'indicator green';
            outputStatus.textContent = 'Completed';
        }
    }, 1000);
}

function startWeightCycle(machine, index) {
    const display = machine.querySelector('.display');
    const status = machine.querySelector('.status span');
    
    // Update status to "In Progress" when starting a new cycle
    status.textContent = 'In Progress';
    status.className = 'in-progress';
    
    // Step 1: Roll up from 0 to a random value
    const newWeight = (Math.random() * 30).toFixed(3);
    animateWeightUp(display, 0, parseFloat(newWeight));
    
    // Step 2: After rolling up, wait 5-10 seconds at the new value
    const displayTime = 10000 + Math.random() * 5000; // 10-15 seconds
    
    setTimeout(() => {
        // Update status to "Completed" before rolling down
        status.textContent = 'Completed';
        status.className = 'completed';
        
        // Step 3: Roll down to zero
        animateWeightDown(display, parseFloat(newWeight), 0);
        
        // Step 4: Stay at zero for 10 seconds
        setTimeout(() => {
            // Repeat the cycle
            startWeightCycle(machine, index);
        }, 10000); // 10 seconds at zero
    }, displayTime);
}

function animateWeightUp(display, startWeight, endWeight) {
    let currentStep = 0;
    const totalSteps = 20;
    
    const interval = setInterval(() => {
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

function animateWeightDown(display, startWeight, endWeight) {
    let currentStep = 0;
    const totalSteps = 10;
    
    const interval = setInterval(() => {
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
