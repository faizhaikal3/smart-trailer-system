#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <HardwareSerial.h>

// --- Pin Definitions ---
#define TFT_CS    15
#define TFT_DC     2
#define TFT_RST    4
#define TFT_BL    32
#define LIDAR_RX   16  
#define LIDAR_MOTEN 21 

// --- J&T Express Light Mode Palette ---
#define JT_RED       0xD800  
#define JT_WHITE     0xFFFF  
#define JT_GREY      0xBDF7  
#define JT_TEXT_DARK 0x0000  
#define JT_DARK      0x3186  
#define JT_GLASS     0x7BEF  

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

struct Zone {
  const char* label;
  int minAngle, maxAngle;
  int minDist, maxDist; 
  int x, y, w, h;
  bool detected;
  bool lastState;
  unsigned long firstSeen;
  unsigned long lastSeen;
};

// --- UPDATED NARROW FRONT/BEHIND CONFIGURATION ---
Zone leftZones[2] = {
  {"BEHIND",  165, 195, 0,  48,   117, 138,  85, 28, false, false, 0, 0}, 
  {"LEFT",    195, 345, 0,  31,     5,  37,  85, 98, false, false, 0, 0}  
};

Zone rightZones[2] = {
  {"FRONT",   345,  15, 0,  48,   117,   6,  85, 28, false, false, 0, 0}, 
  {"RIGHT",    15, 165, 0,  31,   230,  37,  85, 98, false, false, 0, 0}  
};

volatile int countsLeft[2] = {0};
volatile int countsRight[2] = {0};

bool angleInRange(int a, int start, int end) {
  if (start > end) return (a >= start || a <= end);
  return (a >= start && a <= end);
}

void drawZoneHUD(Zone &z) {
  uint16_t boxColor = z.detected ? JT_RED : JT_WHITE;
  uint16_t borderColor = z.detected ? JT_RED : JT_GREY;
  uint16_t textColor = z.detected ? JT_WHITE : JT_TEXT_DARK;

  tft.fillRect(z.x, z.y, z.w, z.h, boxColor);
  tft.drawRect(z.x, z.y, z.w, z.h, borderColor);
  
  tft.setTextColor(textColor);
  tft.setTextSize(1);
  int labelX = z.x + (z.w - (strlen(z.label) * 6)) / 2;
  int labelY = z.y + (z.h / 2) - 4; 
  tft.setCursor(labelX, labelY);
  tft.print(z.label);
}

void drawTrailerHUD() {
  tft.fillRect(93, 35, 134, 102, JT_WHITE);

  const int T_WIDTH = 38;            
  const int T_X = 160 - (T_WIDTH/2); 
  const int START_Y = 38; 
  
  tft.drawRect(T_X, START_Y, T_WIDTH, 25, JT_DARK); 
  tft.fillRect(T_X + 1, START_Y + 1, T_WIDTH - 2, 23, 0xE71C); 
  tft.fillRect(T_X + 2, START_Y + 1, T_WIDTH - 4, 6, JT_GLASS); 
  
  tft.fillRect(T_X - 2, START_Y + 5, 4, 8, JT_DARK); 
  tft.fillRect(T_X + T_WIDTH - 2, START_Y + 5, 4, 8, JT_DARK); 

  tft.fillRect(158, START_Y + 25, 4, 5, JT_DARK);

  int cargoY = START_Y + 30;
  int cargoH = 68; 
  tft.drawRect(T_X, cargoY, T_WIDTH, cargoH, JT_DARK); 
  tft.fillRect(T_X + 1, cargoY + 1, T_WIDTH - 2, cargoH - 2, JT_RED); 
  tft.drawFastHLine(T_X + 5, cargoY + 5, T_WIDTH - 10, JT_WHITE);

  tft.fillRect(T_X - 3, cargoY + 10, 5, 10, JT_DARK); 
  tft.fillRect(T_X + T_WIDTH - 2, cargoY + 10, 5, 10, JT_DARK); 
  tft.fillRect(T_X - 3, cargoY + 45, 5, 10, JT_DARK); 
  tft.fillRect(T_X + T_WIDTH - 2, cargoY + 45, 5, 10, JT_DARK); 
  tft.fillRect(T_X - 3, cargoY + 56, 5, 10, JT_DARK); 
  tft.fillRect(T_X + T_WIDTH - 2, cargoY + 56, 5, 10, JT_DARK); 

  tft.fillCircle(160, 85, 3, JT_WHITE);
  tft.drawCircle(160, 85, 3, JT_DARK);

  tft.setTextColor(JT_WHITE);
  tft.setCursor(T_X + 10, cargoY + (cargoH/2) - 4);
  tft.print("J&T");
}

void lidarTask(void* pvParameters) {
  Serial1.begin(115200, SERIAL_8N1, LIDAR_RX, -1);
  uint8_t buf[22];
  while (1) {
    if (Serial1.available() >= 22) {
      if (Serial1.read() == 0xFA) {
        Serial1.readBytes(&buf[1], 21);
        int index = buf[1];
        for (int i = 0; i < 4; i++) {
          int raw = buf[4 + i*4] | (buf[5 + i*4] << 8);
          int distCm = raw / 10;
          int angle = (index - 0xA0) * 4 + i;
          if (angle < 0) angle += 360;

          for (int z = 0; z < 2; z++) {
            if (angleInRange(angle, leftZones[z].minAngle, leftZones[z].maxAngle) && 
                distCm >= leftZones[z].minDist && distCm <= leftZones[z].maxDist) {
              countsLeft[z]++;
            }
          }

          for (int z = 0; z < 2; z++) {
            if (angleInRange(angle, rightZones[z].minAngle, rightZones[z].maxAngle) && 
                distCm >= rightZones[z].minDist && distCm <= rightZones[z].maxDist) {
              countsRight[z]++;
            }
          }
        }
      }
    }
    vTaskDelay(1);
  }
}

void setup() {
  pinMode(LIDAR_MOTEN, OUTPUT);
  digitalWrite(LIDAR_MOTEN, HIGH);

  pinMode(TFT_BL, OUTPUT);
  digitalWrite(TFT_BL, HIGH);
  tft.init(170, 320);
  tft.setRotation(1); 
  tft.fillScreen(JT_WHITE); 

  drawTrailerHUD();
  for(int i=0; i<2; i++) {
    drawZoneHUD(leftZones[i]);
    drawZoneHUD(rightZones[i]);
  }

  xTaskCreatePinnedToCore(lidarTask, "LidarTask", 4096, NULL, 1, NULL, 0);
}

void loop() {
  unsigned long now = millis();
  auto updateSet = [&](Zone zones[], volatile int counts[]) {
    for (int i = 0; i < 2; i++) {
      int hits = counts[i];
      counts[i] = 0; 
      if (hits >= 3) {
        if (zones[i].firstSeen == 0) zones[i].firstSeen = now;
        zones[i].lastSeen = now;
      }
      if (zones[i].firstSeen != 0 && (now - zones[i].firstSeen >= 100)) {
        zones[i].detected = true;
      }
      if (now - zones[i].lastSeen > 400) {
        zones[i].detected = false;
        zones[i].firstSeen = 0;
      }
      if (zones[i].detected != zones[i].lastState) {
        drawZoneHUD(zones[i]);
        drawTrailerHUD(); 
        zones[i].lastState = zones[i].detected;
      }
    }
  };
  updateSet(leftZones, (int*)countsLeft);
  updateSet(rightZones, (int*)countsRight);
  delay(50);
}