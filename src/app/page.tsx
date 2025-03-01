"use client";
import { useState, useEffect, useRef, useMemo } from "react";

export default function Home() {
  const [activity, setActivity] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("exercise");
  const [checked, setChecked] = useState(false);
  const [slider, setSlider] = useState(50);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [activities, setActivities] = useState<
    {
      activity: string;
      price: number;
      type: string;
      completed: boolean;
      progress: number;
    }[]
  >([]);

  const activityTypes = [
    "Education",
    "Recreational",
    "Social",
    "DIY",
    "Charity",
    "Cooking",
    "Relaxation",
    "Music",
    "Busywork",
  ];  

  // Fetch activities saved in the local storage
  useEffect(() => {
    const savedActivities = localStorage.getItem("activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  // Add activity to the list
  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    setActivities([
      ...activities,
      { activity, price, type, completed: checked, progress: slider },
    ]);

    // Reset form fields
    setActivity("");
    setPrice(0);
    setType("exercise");
    setChecked(false);
    setSlider(50);
  };

  //Delete activity
  const handleDelete = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  //
  const handleSliderChange = () => {
    if (sliderRef.current) {
      setSlider(Number(sliderRef.current.value));
    }
  };

  const activityCount = useMemo(() => activities.length, [activities]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-4">
      {/* Form Section */}
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Activity Form</h2>

        {/* Activity Input */}
        <div>
          <label className="text-gray-900 block font-medium">Activity</label>
          <input
            type="text"
            className="text-black w-full border p-2 rounded mt-1"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="text-gray-900 block font-medium">Price</label>
          <div className="flex items-center border p-2 rounded mt-1 bg-white">
            <span className="text-gray-600 mr-2">RM</span>
            <input
              type="number"
              className="text-black w-full outline-none"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Type Select */}
        <div>
          <label className="text-gray-900 block font-medium">Type</label>
          <select
            className="text-black w-full border p-2 rounded mt-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {activityTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 mr-2"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label className="text-black font-medium">Booking required</label>
        </div>

        {/* Slider */}
        <div>
          <label className="text-black block font-medium">
            Accessibility: {slider}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full mt-1"
            defaultValue={slider}
            ref={sliderRef}
            onMouseUp={handleSliderChange} // Update state only after user stops moving
          />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={addActivity}
        >
          Submit
        </button>
      </form>

      {/* Table Section */}
      <div className="w-full max-w-2xl ml-6">
        {/* Badge for Count */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900">Activity List</h2>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {activityCount} Items
          </span>
        </div>

        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-gray-900 border border-gray-300 p-2">
                Activity
              </th>
              <th className="text-gray-900 border border-gray-300 p-2">
                Price
              </th>
              <th className="text-gray-900 border border-gray-300 p-2">Type</th>
              <th className="text-gray-900 border border-gray-300 p-2">
                Booking Required
              </th>
              <th className="text-gray-900 border border-gray-300 p-2">
                Accessibility
              </th>
              <th className="text-gray-900 border border-gray-300 p-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((item, index) => (
                <tr key={index} className="text-center text-gray-900">
                  <td className="border border-gray-300 p-2">
                    {item.activity}
                  </td>
                  <td className="border border-gray-300 p-2">RM{item.price}</td>
                  <td className="border border-gray-300 p-2">{item.type}</td>
                  <td className="border border-gray-300 p-2">
                    {item.completed ? "✅" : "❌"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.progress}%
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td
                  colSpan={5}
                  className="border border-gray-300 p-4 text-gray-500"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
