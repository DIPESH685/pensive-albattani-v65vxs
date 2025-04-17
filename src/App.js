import React, { useState, useEffect } from "react";
import "./styles.css";

const goals = {
  blender: 180, // minutes
  study: 180, // minutes
  book: 2, // pages
  journaling: 15, // minutes
  exercise: 8, // minutes
};

const getColor = (percentage) => {
  if (percentage >= 80) return "green-box";
  if (percentage >= 40) return "orange-box";
  return "red-box";
};

const App = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [progressData, setProgressData] = useState(() => {
    const stored = localStorage.getItem("progressData");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("progressData", JSON.stringify(progressData));
  }, [progressData]);

  const handleChange = (field, value) => {
    const updatedDay = {
      ...progressData[selectedDay],
      [field]: Number(value),
    };
    setProgressData({
      ...progressData,
      [selectedDay]: updatedDay,
    });
  };

  const calculatePercentage = (field) => {
    const value = progressData[selectedDay]?.[field] || 0;
    return Math.min((value / goals[field]) * 100, 100).toFixed(0);
  };

  return (
    <div className="container">
      <h1>30 Day Progress Tracker</h1>
      <div className="day-grid">
        {[...Array(30)].map((_, index) => {
          const day = `Day ${index + 1}`;
          const totalPercentage = Object.keys(goals).reduce((acc, field) => {
            const val = progressData[day]?.[field] || 0;
            const percent = Math.min((val / goals[field]) * 100, 100);
            return acc + percent;
          }, 0);
          const avg = totalPercentage / Object.keys(goals).length;
          const boxColor = getColor(avg);
          return (
            <button
              key={day}
              className={`day-button ${boxColor}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="entry-form">
          <h3>{selectedDay}</h3>

          {Object.keys(goals).map((field) => (
            <div key={field}>
              <label>
                {field} ({goals[field]} {field === "book" ? "pages" : "min"}):{" "}
              </label>
              <input
                type="number"
                value={progressData[selectedDay]?.[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
              />
              <p>Progress: {calculatePercentage(field)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
