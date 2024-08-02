const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing CANDY...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('Whatsapp')) {
        window.open("https://web.whatsapp.com/", "_blank");
        const finalText = "Opening WhatsApp";
        speak(finalText);
    } else if (message.includes('X')) {
        window.open("https://x.com/home", "_blank");
        const finalText = "Opening X";
        speak(finalText);
    } else if (message.includes('joke')) {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                const joke = `${data.setup} ... ${data.punchline}`;
                speak(joke);
            });
    } else if (message.includes('weather')) {
        const apiKey = 'b17b62cb731514b71202c08acf3792c9'; // Replace with your actual API key
        const city = 'Hyderabad';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const weather = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${(data.main.temp - 273.15).toFixed(2)}°C.`;
                speak(weather);
            })
            .catch(error => {
                speak('Sorry, I am unable to fetch the weather details at the moment.');
                console.error('There has been a problem with your fetch operation:', error);
            });
    } else if (message.includes('news')) {
        fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=a7720420b78941a49b0bb3d978a35c63')
            .then(response => response.json())
            .then(data => {
                const news = `Here are some top headlines: ${data.articles[0].title}, ${data.articles[1].title}, ${data.articles[2].title}.`;
                speak(news);
            });
    } else if (message.includes('chat gpt')) {
        const query = message.replace('chatgpt', '').trim();
        if (query) {
            searchChatGPT(query);
        } else {
            speak('Please provide a question or topic to search.');
        }
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

async function searchChatGPT(query) {
    const apiKey = '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'; // Replace with your actual OpenAI API key

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: query,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        const chatgptResponse = data.choices[0].text.trim();
        speak(chatgptResponse);
    } catch (error) {
        speak('Sorry, I am unable to fetch the response from ChatGPT at the moment.');
        console.error('There has been a problem with your fetch operation:', error);
    }
}
