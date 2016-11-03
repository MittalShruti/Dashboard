# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
import json


data_path = './input/'

app = Flask(__name__)

def get_running_slot(hours):
    if 10>hours>=6 :
        return "6-10"
    elif 14>hours>=10:
        return "10-14"
    elif 18>hours>=14:
        return "14-18"
    elif 22>hours>=18:
        return "18-22"
    elif hours>=22 or hours<2:
        return "22-2"
    else:
        return "2-6"
 
@app.route("/")
def third():
    return render_template("third.html")


@app.route("/data")
def get_data_js():
    

    dt = pd.read_csv(data_path + 'sample_runs_11102016.csv')
    dt["date_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[0])
    dt["time_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[1].split('-')[0])
    dt["timestamp"] = dt["date_of_run"]+' '+dt["time_of_run"]
    dt["date_of_joining"] = dt["date_joined"].apply(lambda date: date.split(' ')[0]) +' '+ dt["date_joined"].apply(lambda date: date.split(' ')[1].split('-')[0].split('.')[0])

    dt["hr"]=dt["time_of_run"].apply(lambda d: d.split(':')[0]).astype(int)    
    dt["running_slot"] = dt["hr"].apply(lambda hours: get_running_slot(hours))
   
    dt["userid"] = dt["user_id"]
    cols_to_keep = ['run_id', 'start_time', 'avg_speed', 'distance',
       'run_amount', 'no_of_steps', 'user_id',
       'first_name', 'last_name', 'date_joined','running_slot',
       'cause_id', 'cause_title', 'date_of_run', 'time_of_run',
       'timestamp','userid', 'date_of_joining']
    dt_clean = dt[cols_to_keep].dropna()

    return dt_clean.to_json(orient='records')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5050,debug=True)

