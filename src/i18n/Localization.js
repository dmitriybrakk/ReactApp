import I18n from 'react-native-i18n'

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

I18n.translations = {
  en: {
    password: 'Password',
    email: 'Email',
    enterSymptoms: 'Enter your symptoms',
    gender: 'Gender',
    birthyear: 'Birthyear',
    male: 'Male',
    female: 'Female',
    search: 'Search',
    checkConnection: 'PLease check your Internet connection',
    emptySymptom: "Please enter at least one symptom",
    improperYear: 'Please enter proper birthyear',
    signIn: 'Sign in',
    noAccountYet: "Don't have an account?",
    signUp: 'Sign up',
    blank: "Please don't leave blank fields",
    invalidEmail: 'Please enter valid email',
    chooseLanguage: 'Choose language',
    chooseRegion: 'Choose region',
    english_en: 'English',
    german_de: 'Deutsch',
    germany: 'Germany',
    austria: 'Austria',
    usa: 'USA',
    logout: 'Logout'
  },
  de: {
    password: 'Passwort',
    email: 'Email',
    enterSymptoms: 'Symptome eingeben',
    gender: 'Geschlecht',
    birthyear: 'Geburtsjahr',
    male: 'Männlich',
    female: 'Weiblich',
    search: 'Suche',
    checkConnection: 'Bitte prüfen Sie Ihre Internetverbindung',
    emptySymptom: "Bitte geben Sie mindestens ein Symptom ein",
    improperYear: 'Bitte geben Sie das richtige Geburtsjahr ein',
    signIn: 'Einloggen',
    noAccountYet: 'Noch kein Konto?',
    signUp: 'Anmelden',
    blank: 'Please lassen Sie keine leeren Felder',
    invalidEmail: 'Bitte eine gültige Email eingeben',
    chooseLanguage: 'Sprache wählen',
    chooseRegion: 'Region wählen',
    germany: 'Deutschland',
    austria: 'Österreich',
    usa: 'USA',
    logout: 'Logout',
  }
}

export default I18n;