export const FILTER_DATA = {
  categories: [
    "Aluminum Fishing Boat",
    "Bass Boat",
    "Jon Boat",
    "Pontoon Boat",
    "Bay Boat",
    "Center Console Boat",
    "Flats Boat",
    "Skiff",
    "Dual Console Boat",
    "Jet Boat",
    "Yacht",
    "Sailboat",
    "Other"
  ],

  brands: [
    "Sea Ray",
    "Viking",
    "Azimut",
    "Invincible",
    "MTI",
    "Freeman",
    "Nor-Tech",
    "Grady White"
  ],

  engineTypes: [
    "Outboard",
    "Inboard",
    "Inboard/Outboard",
    "Jet Drive",
    "Electric",
    "Sail",
    "Pod Drive",
    "Diesel",
    "Gas",
    "Twin Outboard",
    "Triple Outboard"
  ],

  usStates: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ],

  years: Array.from({ length: 30 }, (_, i) => String(2026 - i))
};
