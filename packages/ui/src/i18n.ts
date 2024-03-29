import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      TITLE_BIRDHOUSE: "Open Birdhouse",
      MAINTENANCE_TITLE: "Maintenance mode",
      MAINTENANCE_TEXT:
        "We're working on some improvents. We are back in a few minutes.",
      LOADING: "Loading",
      PAGES: {
        DASHBOARD: "Dashboard",
      },
      CAMERAS: {
        IMG_ALT: "Live feed was interrupted. Please try to reload the page.",
        TITLE: "Cameras",
        LIVE_FEED: "live feed",
      },
      GALLERY: {
        TITLE: "Gallery",
        TAGS: "These tags were automatically created by AI with object recognition",
        RECORDING: "Recording",
        PAGINATION: {
          BACKWARD: "Previous page",
          FORWARD: "Next page",
          ITEMS: "Items per page:",
          PAGE_NUMBER: "Page Number",
        },
      },
      STATS: {
        TITLE: "Statistics",
        VISITORS_TODAY: "Page visits today",
        VISITORS_YESTERDAY: "Page visits yesterday",
        BIRDS_TODAY: "Birds today",
        BIRDS_YESTERDAY: "Birds yesterday",
      },
      WEATHER: {
        TITLE: "Weather",
      },
      CONTROLS: {
        TITLE: "Controls",
        ON: "on",
        OFF: "off",
        OUTDOOR_LIGHT: "Outdoor light",
        ROOM_LIGHT: "Indoor light",
        NIGHTVISION: "Nightvision",
        ROOM_LIGHT_COLOR: "Indoor light color",
        COLORS: {
          WHITE: "white",
          RED: "red",
          GREEN: "green",
          BLUE: "blue",
          CYAN: "cyan",
          MAGENTA: "magenta",
        },
      },
    },
  },
  de: {
    translation: {
      TITLE_BIRDHOUSE: "Vogelhaus",
      MAINTENANCE_TITLE: "Wartungs-Modus",
      MAINTENANCE_TEXT:
        "Wir bauen hier gerade ein bisschen was um. Es geht in Kürze weiter.",
      LOADING: "Lade",
      PAGES: {
        DASHBOARD: "Dashboard",
      },
      CAMERAS: {
        IMG_ALT:
          "Live Übertragung wurde unterbrochen. Bitte lade die Seite neu.",
        TITLE: "Kameras",
        LIVE_FEED: "live Übertragung",
      },
      GALLERY: {
        TITLE: "Galerie",
        TAGS: "Diese Tags wurden automatisch durch KI unterstütze Bilderkennung ermittelt",
        RECORDING: "Aufzeichnung",
        PAGINATION: {
          BACKWARD: "Vorherige Seite",
          FORWARD: "Nächste Seite",
          ITEMS: "Videos pro Seite",
          PAGE_NUMBER: "Seite",
        },
      },
      STATS: {
        TITLE: "Statistik",
        VISITORS_TODAY: "Seitenaufrufe heute",
        VISITORS_YESTERDAY: "Seitenaufrufe gestern",
        BIRDS_TODAY: "Tiere heute",
        BIRDS_YESTERDAY: "Tiere gestern",
      },
      CONTROLS: {
        TITLE: "Steuerung",
        ON: "an",
        OFF: "aus",
        OUTDOOR_LIGHT: "Außenlicht",
        ROOM_LIGHT: "Innenlicht",
        NIGHTVISION: "Nachtsicht",
        ROOM_LIGHT_COLOR: "Innenlicht Farbe",
        COLORS: {
          WHITE: "Weiß",
          RED: "Rot",
          GREEN: "Grün",
          BLUE: "Blau",
          CYAN: "Cyan",
          MAGENTA: "Magenta",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    //lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    nonExplicitSupportedLngs: true,
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
