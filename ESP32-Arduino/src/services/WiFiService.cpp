#include "WiFiService.h"

WiFiService::WiFiService() : server(80) {}

void WiFiService::connect() {
    preferences.begin("wifi-config", true);
    String ssid = preferences.getString("ssid", "");
    String pass = preferences.getString("pass", "");
    preferences.end();

    if (ssid == "") {
        Serial.println("Chưa có cấu hình WiFi. Chuyển sang chế độ Pair...");
        startConfigPortal();
        return;
    }

    Serial.printf("Đang kết nối WiFi: %s\n", ssid.c_str());
    WiFi.begin(ssid.c_str(), pass.c_str());

    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 20) {
        delay(500);
        Serial.print(".");
        retry++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
    } else {
        Serial.println("\nKết nối thất bại. Chuyển sang chế độ Pair...");
        startConfigPortal();
    }
}

void WiFiService::startConfigPortal() {
    configMode = true;
    uint64_t chipid = ESP.getEfuseMac();
    String apName = "ESP32_Setup_" + String((uint32_t)chipid, HEX);
    
    WiFi.softAP(apName.c_str(), "12345678"); // Pass mặc định của WiFi phát ra
    Serial.println("Đã phát WiFi: " + apName);
    Serial.print("Truy cập địa chỉ: ");
    Serial.println(WiFi.softAPIP());

    server.on("/", std::bind(&WiFiService::handleRoot, this));
    server.on("/save", std::bind(&WiFiService::handleSave, this));
    server.begin();
}

void WiFiService::handleRoot() {
    String html = R"rawliteral(
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESP32 WiFi Setup</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #2d3436;
        }
        .card {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            width: 100%;
            max-width: 360px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            margin-bottom: 25px;
            font-size: 24px;
            color: #4834d4;
            letter-spacing: -0.5px;
        }
        .input-group { margin-bottom: 18px; }
        label {
            display: block;
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 6px;
            color: #555;
            text-transform: uppercase;
        }
        input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #eee;
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
        }
        input:focus {
            border-color: #667eea;
            background-color: #fff;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(to right, #667eea, #764ba2);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 10px;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
        }
        button:active { transform: translateY(0); }
        .footer {
            text-align: center;
            font-size: 11px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Cài Đặt ESP32</h1>
        <form action="/save" method="POST">
            <div class="input-group">
                <label>WiFi SSID</label>
                <input type="text" name="ssid" placeholder="Tên WiFi" required>
            </div>

            <div class="input-group">
                <label>Mật khẩu</label>
                <input type="password" name="pass" placeholder="********">
            </div>

            <div class="input-group">
                <label>Mã Nhà (Home ID)</label>
                <input type="text" name="homeid" placeholder="VD: home_01" required>
            </div>

            <div class="input-group">
                <label>Mã Phòng (Room ID)</label>
                <input type="text" name="roomid" placeholder="VD: living_room" required>
            </div>

            <button type="submit">Lưu & Kết Nối</button>
        </form>
        <div class="footer">
            &copy; 2024 ESP32 Smart Home System
        </div>
    </div>
</body>
</html>
)rawliteral";

    server.send(200, "text/html", html);
}

void WiFiService::handleSave() {
    String s = server.arg("ssid");
    String p = server.arg("pass");
    String homeId = server.arg("homeid");
    String roomId = server.arg("roomid");

    if (s.length() > 0 && homeId.length() > 0 && roomId.length() > 0) {
        preferences.begin("wifi-config", false);
        preferences.putString("ssid", s);
        preferences.putString("pass", p);
        preferences.putString("homeId", homeId);
        preferences.putString("roomId", roomId);
        preferences.end();

        // Giao diện thông báo đồng bộ
        String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; justify-content: center; align-items: center;
            height: 100vh; margin: 0; color: #2d3436;
        }
        .card {
            background: white; padding: 40px; border-radius: 20px;
            text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            max-width: 300px; width: 90%;
        }
        .icon { font-size: 50px; color: #4cd137; margin-bottom: 20px; }
        h2 { margin: 0 0 10px 0; color: #4834d4; }
        p { color: #636e72; line-height: 1.5; }
        .loader {
            border: 4px solid #f3f3f3; border-top: 4px solid #764ba2;
            border-radius: 50%; width: 30px; height: 30px;
            animation: spin 1s linear infinite; margin: 20px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✔</div>
        <h2>Thành Công!</h2>
        <p>Cấu hình đã được lưu.</p>
        <p>Thiết bị sẽ khởi động lại trong <b id="countdown">3</b> giây...</p>
        <div class="loader"></div>
    </div>
    <script>
        var timeLeft = 3;
        var timer = setInterval(function(){
            timeLeft--;
            document.getElementById("countdown").textContent = timeLeft;
            if(timeLeft <= 0) clearInterval(timer);
        }, 1000);
    </script>
</body>
</html>
)rawliteral";

        server.send(200, "text/html", html);

        // Chờ một chút để web kịp gửi dữ liệu về trình duyệt trước khi Restart
        delay(3000); 
        ESP.restart();
    } else {
        server.send(400, "text/plain", "Lỗi: Thiếu thông tin bắt buộc!");
    }
}

String WiFiService::getHomeId() {
    preferences.begin("wifi-config", true); 
    String id = preferences.getString("homeId", "default_home");
    preferences.end();
    return id;
}

String WiFiService::getRoomId() {
    preferences.begin("wifi-config", true);
    String id = preferences.getString("roomId", "default_room");
    preferences.end();
    return id;
}

void WiFiService::loopConfig() {
    if (configMode) {
        server.handleClient();
    }
}

bool WiFiService::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

void WiFiService::resetSettings() {
    preferences.begin("wifi-config", false); 
    preferences.clear(); 
    preferences.end();
    Serial.println("Wifi settings cleared!");
}