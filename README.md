# Adaptive Smart Trailer Safety System (The Zero Blind Spot)

[![Shell SSSVC 2026](https://img.shields.io/badge/Shell%20SSSVC-Top%2020%20Finalist-brightgreen)](https://github.com/faizhaikal3/smart-trailer-system)
[![Award](https://img.shields.io/badge/Infineon%20Week%202026-2nd%20Runner--Up%20(Prototype)-orange)](https://github.com/faizhaikal3/smart-trailer-system)
[![Live Demo](https://img.shields.io/badge/Website-Live%20Preview-blue?style=for-the-badge&logo=netlify)](https://adaptivesmarttrailersafetysystem.netlify.app/)

An advanced, real-time blind spot monitoring and safety solution purpose-built for cargo trailers. By combining a centralized 360-degree LiDAR architecture with a dedicated **1.9" TFT HUD Display**, this system effectively eliminates traditional heavy vehicle blind spots and enhances road safety.

> **🌐 Live Project Website:** [https://adaptivesmarttrailersafetysystem.netlify.app/](https://adaptivesmarttrailersafetysystem.netlify.app/)

---

## 🚀 Key Features

* **Centralized 360° LiDAR Architecture:** Uses a single, strategically positioned 360-degree rotating LiDAR sensor at the center of the trailer prototype to scan and monitor surrounding traffic dynamically.
* **1.9" TFT HUD Display:** Delivers real-time, high-visibility visual feedback directly to the driver via dedicated zone indicators:
  * **Solid White:** Clear lane / Safe.
  * **Solid Red:** Object/Vehicle detected in blind spot / Danger.
* **4-Zone Directional Detection:** Maps proximity detection into four distinct directional quadrants for precise situational awareness.
* **Purpose-Built for Cargo Trailers:** Designed to mitigate jackknifing risks and severe blind spots inherent in long towing setups.

---

## 🧭 Detection Zone Specifications

The system monitors the surrounding environment across four angular parameters relative to the trailer:

| Zone | Angle Range | Description |
| :--- | :--- | :--- |
| **Front** | 330° – 30° | Monitors traffic leading directly ahead of the towing configuration. |
| **Right** | 30° – 150° | Tracks vehicles traveling alongside the right flank. |
| **Behind** | 150° – 210° | Covers the critical tailing blind spot directly behind the cargo trailer. |
| **Left** | 210° – 330° | Tracks vehicles traveling alongside the left flank. |

---

## 🛠️ Tech Stack

* **Hardware & Prototyping:** Microcontrollers (ESP32 / Arduino DevKits), 360° Rotating LiDAR Sensor, 1.9" TFT HUD Display Module
* **Project Information Portal:** HTML5, CSS3, JavaScript (`main.html`, `style.css`, `script.js` used for documentation and online showcase)

---

## 📁 Project Structure

```text
smart-trailer-system/
│
├── main.html       # Project information & showcase website
├── style.css       # Styling rules for the web portal
└── script.js       # Interactivity for the web showcase