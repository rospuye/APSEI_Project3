# TODO setup user inputs from website

from copy import copy
import requests
import os
import json
import pandas as pd
import csv
import datetime
import dateutil.parser
import unicodedata
import time
from datetime import datetime, timedelta
from os import path
import copy


# DATES
def get_day(days_ago):
    today = datetime.today()
    day = today - timedelta(days=days_ago)
    formatted_day = datetime.strftime(day, '%Y-%m-%d')
    iso_format = formatted_day + "T00:00:00.000Z"
    return iso_format

# SETTING UP REQUESTS

def auth():
    return os.getenv('TWITTERTOKEN')

def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers

# check number of tweets over the last seven days
def general_count(keyword):
    search_url = "https://api.twitter.com/2/tweets/counts/recent"
    query_params = {'query': keyword,
                    'granularity': 'day'}
    return (search_url, query_params)

# check number of tweets in each hour  over each of the last three days
def day_count(keyword, start_date, end_date):
    search_url = "https://api.twitter.com/2/tweets/counts/recent"
    query_params = {'query': keyword,
                    'granularity': 'hour',
                    'start_time': start_date,
                    'end_time': end_date}
    return (search_url, query_params)

def general_tweets(keyword):
    search_url = "https://api.twitter.com/2/tweets/search/recent" # TODO change here
    query_params = {'query': keyword, 'max_results': 100}
    return (search_url, query_params)


def connect_to_endpoint(url, headers, params, next_token = None):
    params['next_token'] = next_token
    response = requests.request("GET", url, headers = headers, params = params)
    print("Endpoint Response Code: " + str(response.status_code))
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()


# MAKING THE REQUESTS

def keyword_7days(keyword, language): # language: en/pt

    bearer_token = auth()
    headers = create_headers(bearer_token)
    if language!="none":
        keyword = keyword + " lang:" + language

    url = general_count(keyword)
    json_response = connect_to_endpoint(url[0], headers, url[1])
    keyword_7days = json.dumps(json_response, indent=4, sort_keys=True)

    f = open("keyword_7days.txt", "w")
    f.write(keyword_7days)
    f.close()

def keyword_days(keyword, language, days_ago):

    bearer_token = auth()
    headers = create_headers(bearer_token)
    if language!="none":
        keyword = keyword + " lang:" + language

    start_time = get_day(days_ago)
    end_time = get_day(days_ago-1)

    url = day_count(keyword, start_time,end_time)
    json_response = connect_to_endpoint(url[0], headers, url[1])
    keyword_daysago = json.dumps(json_response, indent=4, sort_keys=True)

    f = open("keyword_" + str(days_ago) + "daysago.txt", "w")
    f.write(keyword_daysago)
    f.close()

def batch_sentiment(keyword, language):
    if path.exists("sentiment_tweets.txt"):
        with open('sentiment_tweets.txt', 'r') as file:
            data = file.read()
            json_data = json.loads(data)

            sentiment_format = copy.deepcopy(json_data)
            sentiment_format.pop('meta', None)
            sentiment_format["language"] = language
            for tweet in sentiment_format["data"]:
                tweet["query"] = keyword

            # making call to sentiment API
            sentiment_post = json.dumps(sentiment_format, indent=4, sort_keys=True)
            r = requests.post(url="http://www.sentiment140.com/api/bulkClassifyJson?isabel.rosario@ua.pt", data=sentiment_post)
            response = r.text

            f = open("sentiment_post.txt", "wb")
            f.write(response.encode().decode('utf-8','ignore').encode("utf-8"))
            f.close()

def sentiment(keyword, language):
    bearer_token = auth()
    headers = create_headers(bearer_token)
    if language!="none":
        keyword = keyword + " lang:" + language

    url = general_tweets(keyword)
    json_response = connect_to_endpoint(url[0], headers, url[1])
    sentiment_tweets = json.dumps(json_response, indent=4, sort_keys=True)

    f = open("sentiment_tweets.txt", "w")
    f.write(sentiment_tweets)
    f.close()
    batch_sentiment(keyword, language)


# sentiment("abortion", "en")
# batch_sentiment("abortion", "en")
