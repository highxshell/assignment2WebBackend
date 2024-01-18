## WeatherAPI Project by Artem Popov | SE-2205
1. Clone the repository:
   ```bash
   git clone https://github.com/highxshell/assignment2WebBackend.git
2. npm install express path axios node-fetch
3. change openWeatherApiKey and NASA APOD API key to your own, or use mine
4. node app.js to run the web application
5. go to http://localhost:3000
6. API's:
   1. REST Countries API - works well with OpenWeatherAPI because we can take Country Code and find specific information about city's country that you looking for.
   2. NASA APOD API - application use coordinates to display a map of the certain city, so I decided to add an astronomy picture of the day from NASA APOD API, to imagine how our planet looks from  the space, not just a map.
