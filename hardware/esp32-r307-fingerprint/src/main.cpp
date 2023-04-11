#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

HardwareSerial serialPort(2); // use UART2

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&serialPort);

uint8_t id = 1;
bool signup_complete = false;
bool login_complete = false;

bool login_request = false;
bool signup_request = false;

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

uint8_t getFingerprintID()
{
  uint8_t p = finger.getImage();
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image taken");
    break;
  case FINGERPRINT_NOFINGER:
    Serial.println("No finger detected");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_IMAGEFAIL:
    Serial.println("Imaging error");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    char buffer[180];
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Could not find fingerprint features",
        "fingerprint_failure",
        0);
    ws.textAll(buffer);
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK)
  {
    char buffer[100];
    Serial.println("Found a print match!");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Found a print match!",
        "fingerprint_match",
        0);
    ws.textAll(buffer);
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    return p;
  }
  else if (p == FINGERPRINT_NOTFOUND)
  {
    char buffer[100];
    Serial.println("Did not find a match");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Did not find a match",
        "fingerprint_failure",
        0);
    ws.textAll(buffer);
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.print(finger.confidence);

  char buffer[100];
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Login was successful",
      "login_successful",
      finger.fingerID);
  ws.textAll(buffer);
  login_complete = true;
  login_request = false;
  ws.textAll(buffer);
  return finger.fingerID;
}

void signupNotifier(int id)
{
  char buffer[100];
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Signup was successful",
      "signup_successful",
      id);
  ws.textAll(buffer);
}

uint8_t login()
{

  Serial.println(F("Reading sensor parameters"));
  finger.getParameters();
  Serial.print(F("Status: 0x"));
  Serial.println(finger.status_reg, HEX);
  Serial.print(F("Sys ID: 0x"));
  Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacity: "));
  Serial.println(finger.capacity);
  Serial.print(F("Security level: "));
  Serial.println(finger.security_level);
  Serial.print(F("Device address: "));
  Serial.println(finger.device_addr, HEX);
  Serial.print(F("Packet len: "));
  Serial.println(finger.packet_len);
  Serial.print(F("Baud rate: "));
  Serial.println(finger.baud_rate);

  finger.getTemplateCount();

  if (finger.templateCount == 0)
  {
    Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
    char buffer[180];
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Sensor doesn't contain any fingerprint data.",
        "login_failure",
        0);
    ws.textAll(buffer);
  }
  else
  {
    Serial.println("Waiting for valid finger...");
    Serial.print("Sensor contains ");
    Serial.print(finger.templateCount);
    Serial.println(" templates");
  }
  return getFingerprintID();
}

// See how to send arduino JSON within a socket
uint8_t signup()
{
  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #");
  Serial.println(id);
  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
    switch (p)
    {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      char buffer[100];
      sprintf(
          buffer,
          "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
          "Image taken",
          "sensor_ready",
          id);
      ws.textAll(buffer);
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  p = finger.image2Tz(1);
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    char buffer[100];
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Could not find fingerprint features",
        "fingerprint_failure",
        id);
    ws.textAll(buffer);
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  Serial.println("Remove finger");
  char buffer[100];
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Remove your finger",
      "sensor_ready",
      id);
  ws.textAll(buffer);
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER)
  {
    p = finger.getImage();
  }
  Serial.print("ID ");
  Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Place same finger again",
      "sensor_ready",
      id);
  ws.textAll(buffer);
  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
    switch (p)
    {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Could not find fingerprint features",
        "fingerprint_failure",
        id);
    ws.textAll(buffer);
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  // OK converted!
  Serial.print("Creating model for #");
  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK)
  {
    Serial.println("Prints matched!");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Fingerprints matched",
        "fingerprint_match",
        id);
    ws.textAll(buffer);
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    return p;
  }
  else if (p == FINGERPRINT_ENROLLMISMATCH)
  {
    Serial.println("Fingerprints did not match");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Fingerprints did not match",
        "fingerprint_failure",
        id);
    ws.textAll(buffer);
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID ");
  Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK)
  {
    Serial.println("Stored!");
    signupNotifier(id);
    id += 1;
    signup_complete = true;
    signup_request = false;
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    return p;
  }
  else if (p == FINGERPRINT_BADLOCATION)
  {
    Serial.println("Could not store in that location");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Could not store in that location",
        "fingerprint_failure",
        id);
    ws.textAll(buffer);
    return p;
  }
  else if (p == FINGERPRINT_FLASHERR)
  {
    Serial.println("Error writing to flash");
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }
  // ws.cleanupClients();
  return true;
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
  AwsFrameInfo *info = (AwsFrameInfo *)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT)
  {
    data[len] = 0;
    if (strcmp((char *)data, "login_request") == 0)
    {
      char buffer[100];
      sprintf(
          buffer,
          "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
          "Login is ready, place finger",
          "login_ready",
          0);
      login_request = true;
      ws.textAll(buffer);
    }
    else if (strcmp((char *)data, "signup_request") == 0)
    {
      char buffer[100];
      sprintf(
          buffer,
          "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
          "Signup is ready, place finger",
          "signup_ready",
          0);
      signup_request = true;
      ws.textAll(buffer);
    }
  }
}

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{

  if (type == WS_EVT_CONNECT)
  {

    Serial.println("Websocket client connection received");
    char buffer[100];
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Fingerprint is ready, place finger on the sensor",
        "sensor_ready",
        0);
    ws.textAll(buffer);
  }
  else if (type == WS_EVT_DISCONNECT)
  {

    Serial.println("Client disconnected");
  }
  else if (type == WS_EVT_DATA)
  {
    handleWebSocketMessage(arg, data, len);
  }
}

void setup()
{
  Serial.begin(9600);
  while (!Serial)
    ;
  delay(100);
  Serial.println("\n\nAdafruit Fingerprint sensor enrollment");

  // Include WIFI SSID and Password
  WiFi.begin("bruce", "takura1998");
  uint32_t notConnectedCounter = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.println("Wifi connecting...");
    notConnectedCounter++;
    if (notConnectedCounter > 50)
    {
      Serial.println("Resetting due to Wifi not connecting...");
      ESP.restart();
    }
  }
  Serial.print("Wifi connected, IP address: ");
  Serial.println(WiFi.localIP());

  finger.begin(57600);

  if (finger.verifyPassword())
  {
    Serial.println("Found fingerprint sensor!");
  }
  else
  {
    Serial.println("Did not find fingerprint sensor :(");
    while (1)
    {
      delay(1);
    }
  }

  Serial.println(F("Reading sensor parameters"));
  finger.getParameters();
  Serial.print(F("Status: 0x"));
  Serial.println(finger.status_reg, HEX);
  Serial.print(F("Sys ID: 0x"));
  Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacity: "));
  Serial.println(finger.capacity);
  Serial.print(F("Security level: "));
  Serial.println(finger.security_level);
  Serial.print(F("Device address: "));
  Serial.println(finger.device_addr, HEX);
  Serial.print(F("Packet len: "));
  Serial.println(finger.packet_len);
  Serial.print(F("Baud rate: "));
  Serial.println(finger.baud_rate);

  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.begin();
}

uint8_t readnumber(void)
{
  uint8_t num = 0;

  while (num == 0)
  {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
  }
  return num;
}

void loop()
{
  if (id == 0)
  {
    return;
  }
  Serial.print("Enrolling ID #");
  Serial.println(id);

  Serial.println("Waiting");
  if (login_request)
  {
    login();
  }

  if (signup_request)
  {
    signup();
  }

}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez()
{
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)
    return -1;

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);
  return finger.fingerID;
}

uint8_t getFingerprintEnroll()
{

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #");
  Serial.println(id);
  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
    switch (p)
    {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  p = finger.image2Tz(1);
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  Serial.println("Remove finger");
  char buffer[100];
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Remove the finger",
      "sensor_ready",
      0);
  ws.textAll(buffer);
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER)
  {
    p = finger.getImage();
  }
  Serial.print("ID ");
  Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  sprintf(
      buffer,
      "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
      "Place same finger again",
      "sensor_ready",
      0);
  ws.textAll(buffer);
  while (p != FINGERPRINT_OK)
  {
    p = finger.getImage();
    switch (p)
    {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    return p;
  default:
    Serial.println("Unknown error");
    return p;
  }

  // OK converted!
  Serial.print("Creating model for #");
  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK)
  {
    Serial.println("Prints matched!");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Fingerprints matched",
        "match_found",
        0);
    ws.textAll(buffer);
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    return p;
  }
  else if (p == FINGERPRINT_ENROLLMISMATCH)
  {
    Serial.println("Fingerprints did not match");
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID ");
  Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK)
  {
    Serial.println("Stored!");
    sprintf(
        buffer,
        "{\"message\":\"%s\",\"status\":\"%s\",\"id\":\"%d\"}",
        "Fingerprints have been stored",
        "fingerprints_stored",
        0);
    ws.textAll(buffer);
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    return p;
  }
  else if (p == FINGERPRINT_BADLOCATION)
  {
    Serial.println("Could not store in that location");
    return p;
  }
  else if (p == FINGERPRINT_FLASHERR)
  {
    Serial.println("Error writing to flash");
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }

  ws.cleanupClients();

  return true;
}
