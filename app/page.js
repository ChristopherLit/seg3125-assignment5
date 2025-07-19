'use client';

import { useState } from 'react';

// Synthetic data for coffee consumption
const coffeeData = {
  cityA: [120, 135, 145, 160, 155, 170], // January to June
  cityB: [100, 115, 125, 140, 135, 150]
};

const months = ['January', 'February', 'March', 'April', 'May', 'June'];
const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

const translations = {
  en: {
    title: 'Monthly Coffee Consumption Dashboard',
    subtitle: 'Coffee Consumption in Two Cities',
    barChartTitle: 'Coffee Consumption Comparison (City A vs City B)',
    lineChartTitle: 'Coffee Consumption Trends Over 6 Months',
    cityA: 'City A',
    cityB: 'City B',
    selectCity: 'Select City:',
    allCities: 'All Cities',
    disclaimer: 'synthetic data generated for educational purposes',
    consumptionUnit: 'cups per person',
    language: 'Language'
  },
  fr: {
    title: 'Tableau de Bord de Consommation de Café Mensuelle',
    subtitle: 'Consommation de Café dans Deux Villes',
    barChartTitle: 'Comparaison de Consommation de Café (Ville A vs Ville B)',
    lineChartTitle: 'Tendances de Consommation de Café sur 6 Mois',
    cityA: 'Ville A',
    cityB: 'Ville B',
    selectCity: 'Sélectionner Ville:',
    allCities: 'Toutes les Villes',
    disclaimer: 'Ce tableau de bord utilise des données synthétiques générées à des fins éducatives.',
    consumptionUnit: 'tasses par personne',
    language: 'Langue'
  }
};

export default function Dashboard() {
  const [language, setLanguage] = useState('en');
  const [selectedCity, setSelectedCity] = useState('cityA');
  
  const t = translations[language];
  const currentMonths = language === 'en' ? months : monthsFr;

  // Bar Chart Component using SVG
  const BarChart = () => {
    const maxValue = Math.max(...coffeeData.cityA, ...coffeeData.cityB);
    const chartHeight = 300;
    const chartWidth = 500;
    const barWidth = 60;
    const spacing = 80;

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">{t.barChartTitle}</h3>
        <svg width={chartWidth} height={chartHeight + 80} className="mx-auto">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="50"
              y1={50 + (i * chartHeight / 4)}
              x2={chartWidth - 20}
              y2={50 + (i * chartHeight / 4)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="40"
              y={55 + (i * chartHeight / 4)}
              textAnchor="end"
              className="text-sm fill-gray-600"
            >
              {Math.round(maxValue - (i * maxValue / 4))}
            </text>
          ))}

          {/* Bars for each month */}
          {currentMonths.map((month, index) => {
            const cityAHeight = (coffeeData.cityA[index] / maxValue) * chartHeight;
            const cityBHeight = (coffeeData.cityB[index] / maxValue) * chartHeight;
            const xPos = 60 + index * spacing;

            return (
              <g key={month}>
                {/* City A bar */}
                <rect
                  x={xPos}
                  y={50 + chartHeight - cityAHeight}
                  width={barWidth / 2}
                  height={cityAHeight}
                  fill="#3b82f6"
                />
                {/* City B bar */}
                <rect
                  x={xPos + barWidth / 2}
                  y={50 + chartHeight - cityBHeight}
                  width={barWidth / 2}
                  height={cityBHeight}
                  fill="#ef4444"
                />
                {/* Month label */}
                <text
                  x={xPos + barWidth / 2}
                  y={chartHeight + 70}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {month.substring(0, 3)}
                </text>
                {/* Values on top of bars */}
                <text
                  x={xPos + barWidth / 4}
                  y={45 + chartHeight - cityAHeight}
                  textAnchor="middle"
                  className="text-xs fill-white font-semibold"
                >
                  {coffeeData.cityA[index]}
                </text>
                <text
                  x={xPos + 3 * barWidth / 4}
                  y={45 + chartHeight - cityBHeight}
                  textAnchor="middle"
                  className="text-xs fill-white font-semibold"
                >
                  {coffeeData.cityB[index]}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <rect x="60" y="20" width="15" height="15" fill="#3b82f6" />
          <text x="80" y="32" className="text-sm fill-gray-700">{t.cityA}</text>
          <rect x="150" y="20" width="15" height="15" fill="#ef4444" />
          <text x="170" y="32" className="text-sm fill-gray-700">{t.cityB}</text>
        </svg>
        <p className="text-center text-sm text-gray-500 mt-2">
          {t.consumptionUnit}
        </p>
      </div>
    );
  };

  // Line Chart Component using SVG
  const LineChart = () => {
    const data = selectedCity === 'cityA' ? coffeeData.cityA : coffeeData.cityB;
    const maxValue = Math.max(...data);
    const chartHeight = 300;
    const chartWidth = 500;
    const pointSpacing = (chartWidth - 100) / (data.length - 1);

    const points = data.map((value, index) => ({
      x: 60 + index * pointSpacing,
      y: 50 + chartHeight - (value / maxValue) * chartHeight
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">{t.lineChartTitle}</h3>
        
        {/* City Filter Dropdown */}
        <div className="mb-4 flex justify-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">{t.selectCity}</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cityA">{t.cityA}</option>
              <option value="cityB">{t.cityB}</option>
            </select>
          </div>
        </div>

        <svg width={chartWidth} height={chartHeight + 80} className="mx-auto">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="50"
              y1={50 + (i * chartHeight / 4)}
              x2={chartWidth - 20}
              y2={50 + (i * chartHeight / 4)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="40"
              y={55 + (i * chartHeight / 4)}
              textAnchor="end"
              className="text-sm fill-gray-600"
            >
              {Math.round(maxValue - (i * maxValue / 4))}
            </text>
          ))}

          {/* Line */}
          <path
            d={pathData}
            stroke={selectedCity === 'cityA' ? '#3b82f6' : '#ef4444'}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={selectedCity === 'cityA' ? '#3b82f6' : '#ef4444'}
              />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-semibold"
              >
                {data[index]}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {currentMonths.map((month, index) => (
            <text
              key={month}
              x={60 + index * pointSpacing}
              y={chartHeight + 70}
              textAnchor="middle"
              className="text-sm fill-gray-600"
            >
              {month.substring(0, 3)}
            </text>
          ))}
        </svg>
        <p className="text-center text-sm text-gray-500 mt-2">
          {selectedCity === 'cityA' ? t.cityA : t.cityB} - {t.consumptionUnit}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">{t.language}:</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'fr' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Français
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{t.subtitle}</p>
          
          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Notice:</span> {t.disclaimer}
            </p>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BarChart />
          <LineChart />
        </div>

        {/* Data Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Data Summary</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(coffeeData.cityA.reduce((a, b) => a + b, 0) / coffeeData.cityA.length)}
              </div>
              <div className="text-sm text-gray-600">{t.cityA} Avg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Math.round(coffeeData.cityB.reduce((a, b) => a + b, 0) / coffeeData.cityB.length)}
              </div>
              <div className="text-sm text-gray-600">{t.cityB} Avg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
