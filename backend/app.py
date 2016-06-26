#!flask/bin/python
from flask import Flask, jsonify, abort, request, make_response
from flask_cors import CORS, cross_origin
import pymongo
import settings
import requests


app = Flask(__name__)
CORS(app)


def get_project_db():
    client = pymongo.MongoClient(settings.MONGO_URL)
    db = client['hackvote']
    projects = db['projects']
    return projects


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found ' + request.url}), 404)


@app.route('/hackvote/api/v1.0/votes/<event_name>', methods=['GET'])
def get_votes(event_name):
    project_db = get_project_db()
    projects = project_db.find({"event":event_name})
    cleaned_projects = []
    for project in projects:
        cleaned_projects.append({"id": project["_id"], "vote": project["votes"]})
    if len(cleaned_projects) == 0:
        abort(404)
    return jsonify(cleaned_projects)


@app.route('/hackvote/api/v1.0/vote/<event_name>', methods=['POST'])
def vote(event_name):
    project_db = get_project_db()

    required_fields = ["captcha"]
    if not request.json or not all(field in request.json for field in required_fields):
        abort(400)

    post_data = {"secret":settings.CAPTCHA_SECRET, "response":request.json["captcha"]}
    captcha_verify_request = requests.post("https://www.google.com/recaptcha/api/siteverify", data=post_data)
    if captcha_verify_request.json()["success"]:

        event_req = requests.get("https://hackdash.org/api/v2/{}/projects".format(event_name))
        valid_project_ids = [project['_id'] for project in event_req.json()]
        failed_votes = []

        if request.json["vote"] in valid_project_ids:
            project_db.update({"_id":request.json["vote"]}, {"$inc":{"votes":1}, "$set":{"event":event_name}},upsert=True)
        else:
            return make_response(jsonify({"error":"project id invalid"}), 400)

        return jsonify({"succes":True, "failed_votes":failed_votes})
    else:
        return make_response(jsonify({"error":"invalid captcha"}), 403)


if __name__ == '__main__':
    app.run(debug=True)