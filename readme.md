# Face Shield
#### Aplikacja zapobiegająca dotykaniu twarzy
![banner](https://raw.githubusercontent.com/doteq/faceshield/master/public/banner.png)
### Pomysł
W związku z aktualną sytuacją na świecie, zastanawialiśmy się nad tym, jak zapobiegać rozprzestrzenianiu koronawirusa. Aplikacja faceshield dzięki danym z kamerki internetowej lub sensora Kinect wykrywa dotykanie twarzy, oraz informuje o tym użytkownika sygnałem dźwiękowym oraz informacją na ekranie. Celem aplikacji jest oduczenie od ciągłego dotykania twarzy, co powinno znacznie zmniejszyć ryzyko zakażenia.
![detection](https://github.com/doteq/faceshield/raw/master/public/screenshots/detection.png)
### Technologie
Główny moduł został napisany w języku javascript, z użyciem [Electron](https://github.com/electron/electron), [Vue](https://github.com/vuejs/vue) oraz [Vuetify](https://github.com/vuetifyjs/vuetify).
Aplikacja faceshield może korzystać z dwóch źródeł danych
##### Kamerka internetowa

##### Sensor Kinect
Kinect posiada sensor głębi i nie korzysta ze sztucznej inteligencji, co znacznie zmniejsza użycie zasobów komputera. Sam moduł został napisany w języku C# i komunikuje się z frontendem za pomocą WebSocketów. Aplikacja - ze względu na dostępne materiały - pozwala na tą chwilę jedynie na korzystanie z Sensora Kinect wersji pierwszej (Xbox 360). Planujemy dodanie wsparcia dla Kinecta wersji drugiej (Xbox ONE), gdy będziemy posiadali odpowiedni zestaw deweloperski.

Do działania kinecta z systemem Windows wymagany jest sterownik, którego można pobrać [tutaj](https://www.microsoft.com/en-us/download/details.aspx?id=40277).

### Prezentacja 
![screen](https://github.com/doteq/faceshield/raw/master/public/screenshots/dashboard_chart.png)
![screen](https://github.com/doteq/faceshield/raw/master/public/screenshots/dashboard_tiles.png)
![screen](https://github.com/doteq/faceshield/raw/master/public/screenshots/dashboard_settings.png)
![screen](https://github.com/doteq/faceshield/raw/master/public/screenshots/dashboard_gallery.png)

