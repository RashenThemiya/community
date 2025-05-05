// components/NewsWidget.jsx
import { Bell, Calendar, List, Megaphone, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";

const icons = {
  notice: <Megaphone className="w-4 h-4 text-yellow-500" />,
  announcement: <Bell className="w-4 h-4 text-green-500" />,
  news: <Newspaper className="w-4 h-4 text-blue-500" />,
  event: <Calendar className="w-4 h-4 text-purple-500" />,
  all: <List className="w-4 h-4 text-gray-500" />,
};

const NewsWidget = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/api/publications");
        setNews(res.data.slice(0, 5)); // Show latest 5 items
      } catch (err) {
        console.error("Failed to fetch widget news", err);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="text-sm">
      {news.length === 0 ? (
        <p className="text-gray-500">No recent news.</p>
      ) : (
        <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {news.map((item) => (
            <li key={item.id} className="flex items-start gap-3 border-b pb-2">
              {/* Thumbnail Image */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.topic}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}

              {/* Text and icon */}
              <div className="flex-1">
                <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
                  {icons[item.type] || icons["all"]}
                  <span className="capitalize font-medium">{item.type}</span>
                </div>
                <div className="font-medium text-gray-800 line-clamp-2 text-sm">{item.topic}</div>
                <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsWidget;
