# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__,template_folder= 'templates')
app.secret_key = 'dbms12!'
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create', methods=['POST'])
def create():
    try:
        data = request.json
        # 전달 받을 데이터 무엇?
        #{'dbms_type': 'mysql', 'instance_name': 'test-name', 'volume': '1GB', 'root_password': '', 'instance_user': 'a', 'instance_password': 'a', 'dbms_user': '', 'dbms_password': '', 'create_validator': True}
        #{'dbms_type': 'opencsd', 'instance_name': 'ketidb', 'volume': '100GB', 'csd_count': '4', 'instance_user': 'a', 'instance_password': 'a','create_validator': True}

        print(data)

        # Send GUI Assistant API Server Request
        if data['dbms_type'] == "mysql":
            param = {"dbname":data['instance_name']}
            response = requests.get('http://10.0.4.87:30010/mysql/create', params=param)
        else:
            param = {"dbname":data['instance_name']}
            response = requests.get('http://10.0.4.87:30010/opencsd/create', params=param)              

        if response.status_code == 200:
            # 응답 처리
            return "ok"
        else:
            # 에러 처리
            return "error"
    except:
        # 예외 처리
        return {}
        
if __name__ == '__main__':
    app.run(host="10.0.4.87", port=9097, debug=True)
