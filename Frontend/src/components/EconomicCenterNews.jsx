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

const icons = {
  all: <List className="w-5 h-5" />,
  notice: <Megaphone className="w-5 h-5" />,
  announcement: <Bell className="w-5 h-5" />,
  news: <Newspaper className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
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
    infinite: filtered.length > 2,
    speed: 500,
    slidesToShow: Math.min(filtered.length, 2),
    slidesToScroll: 1,
    autoplay: filtered.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-gray-100 py-10 px-4 md:px-12">
      <h2 className="text-3xl font-bold text-center mb-6">Economic Center News</h2>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        {["all", "notice", "announcement", "news", "event"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
              activeTab === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {icons[type]}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      {filtered.length > 1 && (
        <div className="flex justify-end items-center mb-2 gap-2 pr-4">
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

      {/* News Section */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No publications found.</p>
      ) : filtered.length === 1 ? (
        // Center single item without using Slider
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-md p-4 max-w-md w-full">
            {filtered[0].image && (
              <img
                src={filtered[0].image}
                alt={filtered[0].topic}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-semibold mb-1">{filtered[0].topic}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {filtered[0].description}
            </p>
          </div>
        </div>
      ) : (
        <Slider {...sliderSettings} ref={sliderRef}>
          {filtered.map((pub) => (
            <div key={pub.id} className="px-3">
              <div className="bg-white rounded-xl shadow-md p-4 h-full">
                {pub.image && (
                  <img
                    src={pub.image}
                    alt={pub.topic}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold mb-1">{pub.topic}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {pub.description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default EconomicCenterNews;
