import L from "leaflet";
export const startIcon = new L.Icon({
    iconUrl:
        "data:image/svg+xml;base64," +
        btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <circle cx="10" cy="10" r="8" fill="#16a34a" stroke="white" stroke-width="2" />
      </svg>`),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});
