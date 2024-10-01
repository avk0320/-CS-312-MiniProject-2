const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

router.get('/', (req, res) => {
    res.render('index',{
        city: null,
        des: null,
        icon: null,
        temp: null,
        error: null
    }); 
});

router.post('/', async (req, res) => {
    const { city } = req.body; 
    const url_api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=69c9e45201f902f557997e08357b4d47&units=metric`;

    try {
        const response = await fetch(url_api);
        const data = await response.json();

        if (data.cod === '404') {
            return res.render('index', {
                city: null,
                des: null,
                icon: null,
                temp: null,
                error: 'city not found'
            });
        }

        res.render('index', {
            city: data.name,
            des: data.weather[0].description,
            icon: data.weather[0].icon,
            temp: data.main.temp,
            error: null

        });
    } catch (error) {
        console.error(error);
        res.render('index', { 
            city: null,
            des: null,
            icon: null,
            temp: null,
            error: 'Could not fetch weather data.'
        });
    }
});

app.use('/', router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});