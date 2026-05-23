'use client';

import { useEffect, useState } from 'react';
import { Article, SourceStat } from '@/lib/api';
import ArticleCard from './ArticleCard';
import { sourceColor } from '@/lib/utils';

interface Props {
  trending: Article[];
  sourceStats: SourceStat[];
}

interface WeatherDay {
  label: string;
  temp: number;
  icon: string;
}

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  forecast: WeatherDay[];
}

export default function Sidebar({ trending, sourceStats }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Placeholder weather — in production wire to OpenWeatherMap/wttr.in
    setWeather({
      city: 'Thiruvananthapuram',
      temp: 31,
      condition: 'Partly Cloudy',
      icon: '⛅',
      forecast: [
        { label: 'Mon', temp: 31, icon: '⛅' },
        { label: 'Tue', temp: 30, icon: '🌧' },
        { label: 'Wed', temp: 29, icon: '🌦' },
        { label: 'Thu', temp: 32, icon: '☀️' },
        { label: 'Fri', temp: 30, icon: '🌧' },
      ],
    });
  }, []);

  const top5Trending = trending.slice(0, 5);
  const topSources = sourceStats.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Weather widget */}
      {weather && (
        <div className="rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 text-white p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-0.5">
                {weather.city}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black leading-none">{weather.temp}°</span>
                <span className="text-3xl leading-none">{weather.icon}</span>
              </div>
              <p className="text-sm opacity-80 mt-1">{weather.condition}</p>
            </div>
          </div>
          {/* 5-day forecast */}
          <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-white/20">
            {weather.forecast.map(day => (
              <div key={day.label} className="text-center">
                <p className="text-[10px] font-semibold uppercase opacity-70">{day.label}</p>
                <p className="text-base">{day.icon}</p>
                <p className="text-xs font-bold">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Trending
          </h3>
          <div className="flex-1 h-px bg-[#e7e5e4] dark:bg-[#2a2927]" />
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        <div>
          {top5Trending.map((article, i) => (
            <ArticleCard key={article.id} article={article} variant="compact" rank={i + 1} />
          ))}
        </div>
      </div>

      {/* Sources */}
      {topSources.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Sources Today
            </h3>
            <div className="flex-1 h-px bg-[#e7e5e4] dark:bg-[#2a2927]" />
          </div>
          <ul className="space-y-1">
            {topSources.map(s => (
              <li
                key={s.source_name}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1c1b1a] transition-colors cursor-default"
              >
                <div
                  className={`w-7 h-7 rounded-full ${sourceColor(s.source_name)} flex items-center justify-center text-white text-xs font-black shrink-0`}
                >
                  {s.source_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {s.source_name}
                  </p>
                  <p className="text-[11px] text-gray-400">{s.count} articles today</p>
                </div>
                <ChevronIcon />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Notice */}
      <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
            AI Summaries
          </span>
          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">AI</span>
        </div>
        <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
          Articles marked <span className="font-bold">AI</span> include AI-generated summaries. Always read the full story from the original source.
        </p>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600 shrink-0">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
