import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaUserMd,
  FaStethoscope,
  FaHospitalAlt,
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDayCloudy,
  WiNa,
} from "react-icons/wi";

const TOMORROW_API_KEY = process.env.REACT_APP_TOMORROW_API_KEY;

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    income: "",
    dependents: "",
  });
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const weatherCodeDescriptions = {
    1000: "Clear",
    1001: "Cloudy",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    2000: "Fog",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    8000: "Thunderstorm",
  };

  const weatherIcons = {
    1000: <WiDaySunny className="text-4xl text-yellow-500" />,
    1001: <WiCloud className="text-4xl text-gray-400" />,
    1100: <WiDaySunny className="text-4xl text-yellow-400" />,
    1101: <WiDayCloudy className="text-4xl text-yellow-300" />,
    1102: <WiCloud className="text-4xl text-gray-400" />,
    2000: <WiFog className="text-4xl text-gray-500" />,
    4200: <WiRain className="text-4xl text-blue-400" />,
    4201: <WiRain className="text-4xl text-blue-700" />,
    5000: <WiSnow className="text-4xl text-cyan-300" />,
    8000: <WiThunderstorm className="text-4xl text-purple-500" />,
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setWeather(null);

    const income = parseFloat(form.income);
    const dependents = parseInt(form.dependents);
    const cover = Math.round(income * (1 + dependents * 0.3));
    const premium = Math.round(cover * 0.009);

    // ✅ Fetch weather using Tomorrow.io Timelines API
    try {
      const location = encodeURIComponent(form.city);
      const res = await fetch(
        `https://api.tomorrow.io/v4/timelines?location=${location}&fields=temperatureAvg,weatherCodeMax&timesteps=1d&units=metric&apikey=${TOMORROW_API_KEY}`

      );
      const data = await res.json();

      const intervals = data.data?.timelines?.[0]?.intervals;
      if (intervals && intervals.length > 0) {
        const daily = intervals[0].values;
        const temp = daily.temperatureAvg;
        const code = daily.weatherCodeMax;

        setWeather({
          temp,
          description: weatherCodeDescriptions[code] || `Code ${code}`,
          icon: weatherIcons[code] || <WiNa className="text-4xl text-gray-300" />,
        });
      } else {
        setWeather({ error: "Weather data not available." });
      }
    } catch (err) {
      console.error("❌ Weather API Error:", err);
      setWeather({ error: "Failed to fetch weather." });
    }

    // Save form data to backend
    try {
      await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cover,
          premium,
        }),
      });
    } catch (error) {
      console.error("❌ Failed to store form data:", error);
    }

    setTimeout(() => {
      setResult({ cover, premium });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#004E98] text-white p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 flex justify-center items-center pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <BsStars className="text-white/10 text-[300px]" />
      </motion.div>

      {/* Weather Card */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-6 right-6 z-20 hidden md:block"
        >
          <div className="w-64 bg-white text-black rounded-lg shadow p-4 space-y-2">
            <h3 className="font-bold text-lg">Weather in {form.city}</h3>
            {weather.error ? (
              <p className="text-red-500">{weather.error}</p>
            ) : (
              <div className="flex items-center gap-4">
                {weather.icon}
                <div>
                  <p className="font-medium">{weather.description}</p>
                  <p>Avg Temp: {weather.temp}°C</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 z-10"
      >
  <img
  src="/nicsan.png"
  alt="NICSAN Logo"
  className="mx-auto w-40 mb-4 drop-shadow"
/>

        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <FaUserMd className="text-[#D7263D] animate-bounce" />
          Get Your Smart Health Cover 💡
        </h1>
        <p className="text-sm flex justify-center items-center gap-2 mt-1">
          <FaStethoscope className="text-white/70" /> Powered by NICSAN{" "}
          <FaHospitalAlt className="text-white/70" />
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 z-10">
        {["name", "age", "city", "income", "dependents"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium capitalize mb-1"
            >
              {field === "income"
                ? "Annual Income (₹)"
                : field === "dependents"
                ? "Number of Dependents"
                : field}
            </label>
            <input
              required
              id={field}
              name={field}
              type={["age", "income", "dependents"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-[#D7263D] hover:bg-red-600 p-2 rounded font-semibold"
        >
          {loading ? "Calculating..." : "Get Recommendation"}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full max-w-sm z-10"
        >
          <div className="bg-white text-black rounded-lg shadow-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <FaHeartbeat className="text-[#D7263D] animate-pulse" />
              Recommended Health Cover
            </div>
            <p>Cover: ₹{result.cover.toLocaleString()}</p>
            <p>Monthly Premium (0.9% of cover): ₹{result.premium.toLocaleString()}</p>
            <button className="w-full bg-[#004E98] text-white hover:bg-blue-900 p-2 rounded">
              WhatsApp Quote
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}

export default App;
