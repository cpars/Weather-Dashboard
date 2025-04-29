
# 🌦️ Weather Dashboard

A full-stack weather application that allows users to search for any city and view the **current weather** and a **5-day forecast**.
Built with **TypeScript**, **Express**, and **Vite** to deliver a fast, responsive user experience.

---

## 🚀 Live Demo

🔗 [View the Weather Dashboard Live on Render](https://weather-dashboard-0y15.onrender.com/)

---


## ✨ Features

- 🔍 **City Search:** Find weather conditions for any location worldwide.
- 🌡️ **Current Conditions:** View temperature, humidity, wind speed, and weather icons.
- 📅 **5-Day Forecast:** Detailed future weather with intuitive design.
- 🕶️ **Responsive Design:** Mobile-friendly and desktop-optimized layout.
- 🔥 **Real-Time Data:** Powered by the OpenWeatherMap API.
- ❌ **Error Handling:** Alerts user if a city is not found — no app crashes!

---

## 🛠️ Tech Stack

| Frontend | Backend | APIs | Hosting |
|:---|:---|:---|:---|
| Vite (TypeScript) | Express (Node.js) | OpenWeatherMap API | Render |
| Bootstrap 5 | | | |

---

## 🗂️ Project Structure

```
/client        # Frontend Vite + TypeScript
/server        # Backend Express API
/dist          # Compiled backend server
package.json   # Root project config
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root or server folder and include:

```env
API_KEY=your_openweather_api_key
API_BASE_URL=https://api.openweathermap.org
```

---

## 🧪 Local Development

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/weather-dashboard.git
    cd weather-dashboard
    ```

2. Install all dependencies:
    ```bash
    npm install
    ```

3. Start the app locally:
    ```bash
    npm run start:dev
    ```

4. Visit:
    ```
    http://localhost:3000
    ```

---

## 📬 API Endpoints

| Method | Route | Description |
|:---|:---|:---|
| `POST` | `/api/weather/` | Fetch weather by city name |
| `GET` | `/api/weather/history` | Fetch search history |
| `DELETE` | `/api/weather/history/:id` | Delete a city from search history |

---

## 📝 Future Enhancements

- 📍 Auto-detect user location on page load
- 🗺️ Map integration for searched cities
- 🛡️ Rate limiting to protect API
- 📈 Weather trend graphs (temperature vs days)

---

## ✍️ Author

**Corey Parsons**  
Full Stack Developer  
[GitHub](https://github.com/cpars) • [LinkedIn](https://linkedin.com/in/cpars)

---

## 🛡️ License

This project is licensed under the [MIT License](./LICENSE).
