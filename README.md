To test locally, first run a local instance of RocketChat and build a bot by following this tutorial: 
https://www.freecodecamp.org/news/how-to-build-a-rocketchat-bot-with-typescript/

Create a .env file and add the following:

  `BOT_USERNAME=<Username of bot created>`
  
  `BOT_PASSWORD=<Password of bot created>`
  
  `MESSAGE_RECIPIENT=<Username of your account>`
  
Ensure your rocketchat instance is running on http://localhost:3000 or change the HOST in config.js

Run `npm install` in terminal to install packages in package.json

Run all tests in rocketChatClientTest.js
