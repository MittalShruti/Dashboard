# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
import json


data_path = './input/'
n_samples = 30000


app = Flask(__name__)

def get_running_slot(hours):
    if 10>hours>=6 :
        return '6-10'
    elif 14>hours>=10:
        return '10-14'
    elif 18>hours>=14:
        return '14-18'
    elif 22>hours>=18:
        return '18-22'
    elif hours>22 or hours<2:
        return '22-2'
    elif 6>hours>=2:
        return '2-6'
    else: 
        return "NAN"

@app.route("/")
def index():
    return render_template("index.html")

    
@app.route("/angular")
def angu():
    return render_template("nvd.html") 

@app.route("/first")
def first():
    return render_template("first.html")  

@app.route("/second")
def second():
    return render_template("second.html")  



@app.route("/second_loop")
def second_loop():
    return render_template("second_loop.html")      

@app.route("/five")
def third():
    return render_template("third.html")

@app.route("/four")
def four():
    return render_template("four.html")    

@app.route("/data")
def get_data():
    dt = pd.read_csv(data_path + 'sample_runs_11102016.csv')

    cols_to_keep = ['start_time']
    df_clean = dt[cols_to_keep].dropna()

    return df_clean.to_json(orient='records')


@app.route("/data2")
def get_data_nvd():
    

    dt = pd.read_csv(data_path + 'sample_runs_11102016.csv')
    dt["date_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[0])
    dt["time_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[1].split('-')[0])
    dt["timestamp"] = dt["date_of_run"]+' '+dt["time_of_run"]
    dt["date_of_joining"] = dt["date_joined"].apply(lambda date: date.split(' ')[0]) +' '+ dt["date_joined"].apply(lambda date: date.split(' ')[1].split('-')[0].split('.')[0])

    dt["hr"]=dt["time_of_run"].apply(lambda d: d.split(':')[0]).astype(int)    
    dt["running_slot"] = dt["hr"].apply(lambda hours: get_running_slot(hours))
    #df['age_segment'] = df['age'].apply(lambda age: get_age_segment(age))

    #dt["date_of_joining"] = dt["date_joined"].apply(lambda date: date.split(' ')[0])     
    dt['runners'] = dt.groupby('date_of_run')['date_of_run'].transform('count')
    df = dt.groupby(['date_of_run']).apply(lambda s:len(s['user_id'].unique()))
    f = pd.DataFrame({'date_of_run':df.index, 'uniq_runners':df.values})
    dt = dt.merge(f, how='left', on='date_of_run')
    dt["userid"] = dt["user_id"]
    cols_to_keep = ['run_id', 'start_time', 'avg_speed', 'distance', 'user_id_id',
       'run_amount', 'no_of_steps', 'user_id',
       'first_name', 'last_name', 'date_joined','running_slot',
       'cause_id', 'cause_title', 'date_of_run', 'time_of_run',
       'timestamp','userid', 'date_of_joining', 'runners', 'uniq_runners']
    dt_clean = dt[cols_to_keep].dropna()

    return dt_clean.to_json(orient='records')

@app.route("/data3")
def unique_runners():
    dt = pd.read_csv(data_path + 'sample_runs_11102016.csv')
    dt["date_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[0])
    dt["time_of_run"]=dt["start_time"].apply(lambda date: date.split(' ')[1].split('-')[0])
    dt["timestamp"] = dt["date_of_run"]+' '+dt["time_of_run"]    
    dt = dt.drop_duplicates(['date_of_run','user_id'])

    cols_to_keep = ['timestamp']
    dt_clean = dt[cols_to_keep].dropna()
    return dt_clean.to_json(orient='records')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5014,debug=True)
    # from gevent.wsgi import WSGIServer
    # http_server = WSGIServer(('', 8080), app)
    # http_server.serve_forever()
