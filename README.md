# APSEI Project 3: Twitter Trends
Repository for the 3rd APSEI project. It includes a report about Twitter trends, as well as a small tool for their analysis.

This tool is called APSEI: Twitter Trends, following the report title, and it is composed of two main pages. The first one, Count Tweets, allows the user to search for a keyword (whether that is a single word or an expression) and select a preferred language (optional) in order to obtain information about the number of tweets containing said expression in the last 7 days. This is, of course, useful for the detection and analysis of trend lifecycles.

The second one is called Sentiment Analysis and, again, given a keyword and a preferred language, it displays information about a random set of 100 tweets from the last 7 days relating to their sentiment. This means the tweets are analyzed for emotional intent and rated as Negative, Neutral or Positive.

Further details about the intricacies involved in the development of this tool and the conclusions taken from it are given in the project report.

# User Manual
This is a small usage manual for the tool I developed. This tool is available through the Web browser, altough it is not deployed. The reason for this will become clear soon. This manual is destined for whoever desires to run the tool locally and experiment with it.

Otherwise, you might simply want to take a look at the video demo: [link here]

## Step 1: Get access to the Twitter API

The tool I developed makes use of three different APIs, one of which is the official Twitter API. The usage of this API is restricted to 500.000 monthly requests for members with a Developer account, and the requests must bear the user's security token for the sake of authentication. This is the reason I decided not to deploy this Web tool - if I did, users would either have to use my personal authentication token in order for requests to work, and could quickly exaust it, or they would have to request their own, in which case the deployment's easy access aspect would be damaged anyway.

As such, the first step if you want to use this tool is to have a Twitter account and, after that, go through the process of registering yourself in Twitter's Developer Portal. This allows you access to the Twitter API. A more detailed walk-through of this process is available [here](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api).

Once you have your own Developer Portal dashboard, you must create a [project](https://developer.twitter.com/en/docs/projects/overview) and save the generated [Bearer Token](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens) in your environment variables under the name 'TWITTERTOKEN'. For Windows, find instructions on environment variables [here](https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html#GUID-DD6F9982-60D5-48F6-8270-A27EC53807D0).

## Step 2: Clone this repository

The next step is to have this project locally in your computer. For such, you only need to clone it or download the `.zip` folder for this repository.

## Step 3: Run the Flask server

This tool uses a Flask API built by myself, which establishes communication between the tool's ReactJS frontend and Python backend. As such, you need to run the Flask local server that supports it. In order to do this, first make sure you have Flask installed (run `pip install Flask`). Then, go into **backend** folder inside the main project folder and run the command `$env:FLASK_APP = "MyAPI"`, followed by `flask run`. Do **not** close this terminal until you are done using the application. The server should be running in http://localhost:5000, altough you won't see any information unless you go to the specific endpoints.

## Step 4: Run the frontend

Finally, you must run the frontend of the application. For this, go into the **frontend/twitter-stats** folder of the project and run `npm install`, which install the frontend's necessary dependencies. When that is done, run `npm start` and the tool should be running in your browser on http://localhost:3000 in just a few seconds.

If there are any problems, do not hesitate to contact me at *isabel.rosario@ua.pt*. Have fun!
