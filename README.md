# Adaptive Smart Trailer Safety System (The Zero Blind Spot)

[![Shell SSSVC 2026](https://img.shields.io/badge/Shell%20SSSVC-Top%2020%20Finalist-brightgreen)](https://github.com/faizhaikal3/smart-trailer-system)
[![Award](https://img.shields.io/badge/Infineon%20Week%202026-2nd%20Runner--Up%20(Prototype)-orange)](https://github.com/faizhaikal3/smart-trailer-system)

An advanced, real-time blind spot monitoring and safety solution purpose-built for cargo trailers. By utilizing a centralized 360-degree LiDAR configuration and an intuitive web-based dashboard, this system effectively eliminates traditional heavy vehicle blind spots and enhances road safety.

---

## 🚀 Key Features

* **Centralized 360° LiDAR Architecture:** Uses a single, strategically positioned 360-degree rotating LiDAR sensor at the center of the trailer prototype to scan and monitor surrounding traffic dynamically.
* **4-Zone Directional Detection:** Divides proximity detection into four distinct quadrants to give drivers precise situational awareness.
* **Real-Time Visual Interface:** A clean, responsive dashboard (`main.html`, `style.css`, `script.js`) providing immediate visual feedback for each zone:
  * **Solid White:** Clear lane / Safe.
  * **Solid Red:** Object/Vehicle detected in blind spot / Danger.
* **Purpose-Built for Cargo Trailers:** Designed to mitigate jackknifing risks and severe blind spots inherent in long towing setups.

---

## 🧭 Detection Zone Specifications

The system maps the surrounding environment into four distinct angular parameters relative to the trailer:

| Zone | Angle Range | Description |
| :--- | :--- | :--- |
| **Front** | 330° – 30° | Monitors traffic leading directly ahead of the towing configuration. |
| **Right** | 30° – 150° | Tracks vehicles traveling alongside the right flank. |
| **Behind** | 150° – 210° | Covers the critical tailing blind spot directly behind the cargo trailer. |
| **Left** | 210° – 330° | Tracks vehicles traveling alongside the left flank. |

---

## 🛠️ Tech Stack

* **Frontend Dashboard:** HTML5, CSS3, JavaScript (`main.html`, `style.css`, `script.js`)
* **Hardware & Prototyping:** Microcontrollers (ESP32/Arduino DevKits), 360° Rotating LiDAR Sensor
* **Communication:** Real-time data transmission between hardware modules and the user interface

---

## 📁 Project Structure

```text
smart-trailer-system/
│
├── main.html       # Main dashboard user interface
├── style.css       # Styling rules (including white/red zone alert states)
└── script.js       # Dynamic zone updating and sensor data handling