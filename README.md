# EscapeNLP

![Game Board](https://github.com/MariaVolpe/EscapeNLP/blob/development/client/src/images/game_board.jpeg "EscapeNLP")

A text-based escape room web application for up to five player.
It uses natural language processing to interpret player inputs to understand their intentions (put chat messages into actions on the game board)

To play the game, join a lobby or create a lobby, then have every player inside the lobby press the ready button.

Once every player pressed the ready button and the game has started, players can now start doing actions by switching the chat mode to 'action' or by typing the delimiter '*' in front of every chat message when the chat mode is on 'chat'.

# How to Install EscapeNLP
### Installing the Environment
EscapeNLP uses Node.js, so go ahead click this [link](https://nodejs.org/en/) which will take you to the Node.js home page. Once you are there, click on the download tab and follow the appropriate steps for your operating system. In the next section you will need to use 'npm' for multiple commands, 'npm' is automatically installed when you download Node.js so no need to do any extra work.

### Installing EscapeNLP
First, go ahead and clone this repository to your local machine by using the command 
```
git clone https://github.com/MariaVolpe/EscapeNLP.git
```

Once it has finished cloning to your local machine, go into the EscapeNLP directory by using the command
```
cd EscapeNLP/
```

Now that you are in the EscapeNLP, use the command 
```
npm install
```

Now you'll have to make a minor change to the node modules. Use the command
```
cat ./nlp-classifier/nlp-classifier.js > ./node_modules/node-nlp/lib/nlp/nlp-classifier.js
```
This extends Node NLP's functionality to allow some more magic for EscapeNLP.

Go into the client directory by using the command
```
cd client/
```

Now that you are in the EscapeNLP/client/, use the command 
```
npm install
```

Once that is finished, go back to the main EscapeNLP directory:
```
cd ..
```

let's start up EscapeNLP by using the command 
```
npm run dev
```

Lastly... ENJOY THE GAME!


---------
Created by:  
Nicky Cen  
Brian Campbell  
Maria Volpe  
Ismail Kheir  
John Genere  
