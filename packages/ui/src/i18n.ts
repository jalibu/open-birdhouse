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
      PAGES: {
        CAMERAS: "Cameras",
      },
      CAMS: {
        LOADING: "Loading cameras..."
      },
      STATS: {
        TITLE: "Statistics",
        VISITORS_TODAY: "Visitors today",
        VISITORS_YESTERDAY: "Visitors yesterday",
      },
      CONTROLS: {
        TITLE: "Controls",
        ON: "on",
        OFF: "off",
        OUTDOOR_LIGHT: "Outdoor light",
        INDOOR_LIGHT: "Indoor light",
        INDOOR_LIGHT_COLOR: "Indoor light color",
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
      PAGES: {
        CAMERAS: "Kameras",
      },
      CAMS: {
        LOADING: "Lade Kameras..."
      },
      STATS: {
        TITLE: "Statistik",
        VISITORS_TODAY: "Besucher heute",
        VISITORS_YESTERDAY: "Besucher gestern",
      },
      CONTROLS: {
        TITLE: "Steuerung",
        ON: "an",
        OFF: "aus",
        OUTDOOR_LIGHT: "Außenlicht",
        INDOOR_LIGHT: "Innenlicht",
        INDOOR_LIGHT_COLOR: "Innenlicht Farbe",
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
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
