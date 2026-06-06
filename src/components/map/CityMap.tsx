import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDashboard } from '../../context/DashboardContext';
import type { ComputedCity } from '../../types';
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '../../data/coordinates';
import { sriColor, markerRadius } from '../../utils/colors';
import { fmt, pct, scr } from '../../utils/formatters';

// Map Controller for synchronized panning
const MapController: React.FC<{
  selectedCityId: string | null;
  cities: ComputedCity[];
}> = ({ selectedCityId, cities }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedCityId) {
      const city = cities.find(c => c.id === selectedCityId);
      if (city) {
        map.flyTo([city.coords.lat, city.coords.lng], 10, {
          animate: true,
          duration: 1.5
        });
      }
    } else {
      map.flyTo(MAP_CENTER, MAP_DEFAULT_ZOOM, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedCityId, map, cities]);

  return null;
};

// Component to handle dynamic zoom level
const MapZoomHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
  useMapEvents({
    zoom: (e) => {
      onZoomChange(e.target.getZoom());
    }
  });
  return null;
};

export const CityMap: React.FC<{ cities: ComputedCity[] }> = ({ cities }) => {
  const { state, dispatch } = useDashboard();
  const [zoomLevel, setZoomLevel] = useState(MAP_DEFAULT_ZOOM);
  
  const allDeaths = state.cities.map(c => c.ncrb.died);
  const maxDeaths = Math.max(...allDeaths);
  const minDeaths = Math.min(...allDeaths);

  // Calculate a zoom multiplier so markers scale up as we zoom in.
  // At default zoom (5), multiplier is 1. At zoom 10, multiplier is larger.
  const zoomMultiplier = Math.max(0.5, zoomLevel / MAP_DEFAULT_ZOOM);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapController selectedCityId={state.selectedCityId} cities={state.cities} />
      <MapZoomHandler onZoomChange={setZoomLevel} />

      {cities.map((city) => {
        const baseRadius = markerRadius(city.ncrb.died, minDeaths, maxDeaths);
        // Apply zoom multiplier so the circle grows when zooming in
        const radius = baseRadius * zoomMultiplier;
        const color = sriColor(city.sri);
        const isSelected = state.selectedCityId === city.id;

        return (
          <CircleMarker
            key={city.id}
            center={[city.coords.lat, city.coords.lng]}
            radius={isSelected ? radius * 1.2 : radius}
            pathOptions={{
              color: isSelected ? '#FFFFFF' : color,
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.6,
              weight: isSelected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => dispatch({ type: 'SELECT_CITY', cityId: city.id }),
              popupclose: () => dispatch({ type: 'SELECT_CITY', cityId: null }),
            }}
          >
            <Popup className="neural-popup">
              <div className="min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-base m-0 leading-tight">{city.displayName}</h4>
                  {city.hasDataAnomaly && (
                    <span className="badge badge-anomaly ml-2">Anomaly</span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-raised p-2 rounded">
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">NC Score</div>
                    <div className="font-semibold text-sm">{scr(city.ncScore)} <span className="text-text-secondary text-xs font-normal">(#{city.ncRankMatched})</span></div>
                  </div>
                  <div className="bg-raised p-2 rounded">
                    <div className="text-[10px] text-text-muted uppercase tracking-wide">SRI Score</div>
                    <div className="font-semibold text-sm" style={{ color }}>{scr(city.sri)} <span className="text-text-secondary text-xs font-normal">(#{city.sriRank ?? '-'})</span></div>
                  </div>
                </div>

                <div className="border-t border-border pt-2">
                  <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">NCRB 2023 Outcomes</div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Fatalities:</span>
                    <span className="font-bold text-accent-red">{fmt(city.ncrb.died)}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Total Cases:</span>
                    <span className="font-medium">{fmt(city.ncrb.cases)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Fatality Rate:</span>
                    <span className="font-medium">{pct(city.fatalityRate)}</span>
                  </div>
                </div>

                {city.hasDataAnomaly && (
                  <div className="mt-2 text-[10px] text-accent-purple italic leading-tight border-t border-[rgba(139,92,246,0.3)] pt-2">
                    {city.anomalyNote}
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};
