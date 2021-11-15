from flask import Flask, request
import sys
import os
import pyrebase
from functools import wraps
from firebase_admin import storage as admin_storage, credentials, auth
import firebase_admin 
import json
from decouple import config



CONFIG = json.loads(os.getenv('CONFIG'))

app = Flask(__name__)



pb = pyrebase.initialize_app(CONFIG)

pbauth = pb.auth()
db = pb.database()
storage = pb.storage()
cred = credentials.Certificate('fbAdminConfig.json')


firebase = firebase_admin.initialize_app(cred)

app.config["IMAGE_UPLOADS"]="/home/benjamin/Desktop/reactprojects/chasqui/api/imagenesSubidas/"

def check_token(f):
    @wraps(f)
    def wrap(*args,**kwargs):
        if not request.headers.get('authorization'):
            return {'message': 'acceso restringido'},400
        try:
            user = auth.verify_id_token(request.headers['authorization'])
            request.user = user
        except Exception as e:
            print(e, file = sys.stdout)
            return {'message':"token invalida"},400
        return f(*args, **kwargs)
    return wrap





from mod import publicRoutes
from mod import userRoutes
from  mod import pymeRoutes