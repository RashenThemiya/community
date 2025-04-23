import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import {
  Megaphone,
  Newspaper,
  Bell,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../utils/axiosInstance";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icon mapping
const icons = {
  all: <List className="w-5 h-5" />,
  notice: <Megaphone className="w-5 h-5" />,
  announcement: <Bell className="w-5 h-5" />,
  news: <Newspaper className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
};

// Color mappings for border accents and background
const typeColors = {
  notice: "border-yellow-400 bg-yellow-50 text-yellow-800",
  announcement: "border-green-400 bg-green-50 text-green-800",
  news: "border-blue-400 bg-blue-50 text-blue-800",
  event: "border-purple-400 bg-purple-50 text-purple-800",
  default: "border-gray-300 bg-gray-50 text-gray-700",
};

const EconomicCenterNews = () => {
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const sliderRef = useRef(null);

  const getUniquePublications = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await api.get("/api/publications");
        const uniquePubs = getUniquePublications(res.data);
        setPublications(uniquePubs);
        setFiltered(uniquePubs);
      } catch (err) {
        console.error("Failed to fetch publications", err);
      }
    };

    fetchPublications();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFiltered(publications);
    } else {
      const filteredData = publications.filter((pub) => pub.type === activeTab);
      setFiltered(getUniquePublications(filteredData));
    }
  }, [activeTab, publications]);

  const sliderSettings = {
    dots: false,
    infinite: filtered.length > 3,
    speed: 500,
    slidesToShow: Math.min(filtered.length, 3),
    slidesToScroll: 1,
    autoplay: filtered.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const getCardClasses = (type) => {
    return typeColors[type] || typeColors.default;
  };

  const PostCard = ({ pub }) => (
    <div
      className={`rounded-xl p-5 border shadow-md h-[450px] w-full flex flex-col justify-between transition transform hover:scale-105 hover:shadow-xl hover:bg-gray-100 cursor-pointer duration-300 ${getCardClasses(pub.type)}`}
    >
      {pub.image && (
        <img
          src={pub.image}
          alt={pub.topic}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        {icons[pub.type] || icons["all"]}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{pub.topic}</h3>
      <p className="text-gray-700 text-sm line-clamp-3">{pub.description}</p>
    </div>
  );

  return (
    <section className="bg-gray-100 py-10 px-4 md:px-12">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-800">
        Economic Center News
      </h2>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        {["all", "notice", "announcement", "news", "event"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
              activeTab === type
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {icons[type]}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {filtered.length > 1 && (
        <div className="flex justify-end items-center mb-4 gap-2 pr-4">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-200"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Publications */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No publications found.</p>
      ) : filtered.length === 1 ? (
        <div className="flex justify-center">
          <div className="max-w-sm w-full">
            <PostCard pub={filtered[0]} />
          </div>
        </div>
      ) : (
        <Slider {...sliderSettings} ref={sliderRef}>
          {filtered.map((pub) => (
            <div key={pub.id} className="px-2">
              <PostCard pub={pub} />
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default EconomicCenterNews;
