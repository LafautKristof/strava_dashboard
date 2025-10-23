import L from "leaflet";
export const finishIcon = new L.Icon({
    iconUrl:
        "data:image/svg+xml;base64," +
        btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <circle cx="10" cy="10" r="8" fill="url(#pattern)" stroke="white" stroke-width="2"/>
        <defs>
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="2" height="2" fill="#000"/>
            <rect x="2" y="2" width="2" height="2" fill="#000"/>
          </pattern>
        </defs>
      </svg>`),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});
