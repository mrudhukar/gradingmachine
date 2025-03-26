# QR Codes and Weighing Machines Dashboard

This is a simple HTML dashboard that displays:
- 2 QR codes (for machine information and maintenance details)
- Output displays for 8 weighing machines

## Features

- Responsive design that works on desktop and mobile devices
- Simulated real-time data updates for weighing machines
- Visual feedback when weight values change
- Status indicators for each machine (online/offline)
- QR codes that can be scanned with a mobile device

## How to Use

1. Open the `index.html` file in a web browser
2. The page will automatically generate QR codes and start simulating weighing machine data
3. The weighing machine displays will update every 3 seconds with new random values

## Files

- `index.html` - The main HTML structure
- `styles.css` - CSS styling for the dashboard
- `script.js` - JavaScript for generating QR codes and simulating weighing machine data

## Dependencies

- QR Code Generator (loaded from CDN)

## Customization

You can customize this dashboard by:
- Changing the QR code data in the `generateQRCodes()` function in `script.js`
- Modifying the update frequency in the `initWeighingMachines()` function
- Adjusting the styling in `styles.css`
