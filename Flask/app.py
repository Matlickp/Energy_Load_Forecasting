from flask import Flask, render_template, url_for, flash, redirect, jsonify, Response, send_file
from flask_pymongo import PyMongo
import json
from bson import json_util
from bson.json_util import loads, dumps, CANONICAL_JSON_OPTIONS 
import datetime as dt
import sklearn
from sklearn import datasets
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn import metrics
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import pickle

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/energyDB'
mongo = PyMongo(app)


@app.route("/")
@app.route("/home")
def home():
    return render_template('index.html', title="HOME PAGE JUMBO TEXT HERE")

@app.route("/api/forecast/<date>")
def forecast(date):

    def date_to_dotw(datetime):
        switcher = {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 0
        }
        return switcher.get(datetime, "nothing")

    def calc_load(inputs):
        import_model = open("../Random_Forest_Model.pkl", "rb")
        model = pickle.load(import_model)
        time_list = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
                    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
        load_list = []
        for input in inputs:

            prediction = model.predict([input])
            print(prediction)
            load_list.append(prediction[0])

        print(load_list)
        load_dict = []
        for x in range(0, len(load_list)): 
            temp_dict = {'TIME': time_list[x], 'LOAD': load_list[x]}
            load_dict.append(temp_dict)

        print(load_dict)

        return load_dict






    forecast_data = mongo.db.forecastSDGE.find({'DATE': date}, {'_id': False})

    forecast_date_string = forecast_data[0]['DATE']
    print('date is ' + forecast_date_string)

    forecast_date = dt.datetime.strptime(forecast_date_string, '%Y-%m-%d').date().weekday()
    forecast_dotw = date_to_dotw(forecast_date)

    print(forecast_date)
    print(date_to_dotw(forecast_date))

    forecast_list_master = []
    for record in forecast_data:
        forecast_list = []
        forecast_list.append(record['TMP'])
        forecast_list.append(record['DPT'])
        forecast_list.append(record['HUM'])
        forecast_list.append(record['CC'])
        forecast_list.append(0)

        if forecast_dotw == 0:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 1:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 2:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 3:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 4:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 5:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        if forecast_dotw == 6:
            forecast_list.append(1)
        else:
            forecast_list.append(0)

        forecast_list.append(forecast_dotw)
        forecast_list.append(int(record['HOUR']))

        forecast_list_master.append(forecast_list)
    print(forecast_list_master)
    print(forecast_list_master[0])
    prediction_list = calc_load(forecast_list_master)





    return jsonify(projection_inputs = prediction_list, forecast_inputs = forecast_list_master)

@app.route("/api/forecast_dates")
def forecast_dates():

    forecast_data = mongo.db.forecastSDGEdates.find({}, {'_id': False})
    forecast_dates = []
    for date in forecast_data:

        forecast_dates.append({'DATE': date['DATE']})
    return jsonify(forecast_dates)

    # for record in forecast_data:
    #     forecast_dates.append(record['DATE'])

    # print(forecast_dates)

@app.route("/model")
def model():
    return render_template('model.html')

@app.route("/viz")
def viz():
    return render_template('viz.html')






if __name__ == "__main__":
    app.run(debug=True)