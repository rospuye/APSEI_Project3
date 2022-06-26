from flask import Flask
import json
from os import path
from flask_cors import CORS
from flask import request
import FetchAPIData

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/keyword_7days")
def keyword_7days():
    # check if file exists
    if path.exists("keyword_7days.txt"):
        # read file and put contents in variable 'data'
        with open('keyword_7days.txt', 'r') as file:
            data = file.read()
            json_data = json.loads(data)
            return json_data
    # if there is no file, there is no data
    return {}

@app.route("/keyword_daysago")
def keyword_daysago():
    json_1daysago = {}
    json_2daysago = {}
    json_3daysago = {}
    there_is_data = False

    for i in range(1,4):
        if path.exists("keyword_" + str(i) + "daysago.txt"):
            there_is_data = True
            with open('keyword_' + str(i) + 'daysago.txt', 'r') as file:
                data = file.read()
                json_data = json.loads(data)
                if i==1:
                    json_1daysago = json_data
                elif i==2:
                    json_2daysago = json_data
                else:
                    json_3daysago = json_data

    if there_is_data:
        return {0: json_1daysago, 1: json_2daysago, 2: json_3daysago}

    return {}

@app.route("/sentiment")
def sentiment():
    if path.exists("sentiment_post.txt"):
        with open('sentiment_post.txt', 'r', encoding='utf8') as file:
            data = file.read()
            json_data = json.loads(data)
            return json_data
    return {}

@app.route('/new_search', methods=['POST'])
def new_search():
    if request.method == 'POST':
        keyword = request.get_json()["keyword"]
        language = request.get_json()["language"]
        FetchAPIData.keyword_7days(keyword, language)
        for i in range(1, 4):
            FetchAPIData.keyword_days(keyword, language, i)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route('/new_sentiment_search', methods=['POST'])
def new_sentiment_search():
    if request.method == 'POST':
        keyword = request.get_json()["keyword"]
        language = request.get_json()["language"]
        FetchAPIData.sentiment(keyword, language)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}