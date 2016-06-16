import pymongo
import requests
from bson import json_util
import json
import settings

class MongoDBVoteHandler():
    def __init__(self):
        self.client = pymongo.MongoClient(settings.MONGO_URL)
        self.db = self.client['hackvote']
        self.projects = self.db['projects']
        self.secret_token = settings.CAPTCHA_SECRET

        if "projects" not in self.db.collection_names():
            self.db.create_collection("projects")


    def get_votes(self, protocol, data):
        data = json.loads(data)
        event = data["event_name"]
        projects = self.projects.find({"event":event})
        cleaned_projects = {}
        for project in projects:
            cleaned_projects[project["_id"]] = project["amount"] / project["votes"]
        cleaned_projects["event_name"] = event
        cleaned_projects["type"] = "votes"
        return cleaned_projects

    def save_votes(self, protocol, raw_data):
        data = json.loads(raw_data)
        if "captcha" in data and "event_name" in data:
            post_data = {"secret":self.secret_token, "response":data["captcha"]}
            captcha_verify_request = requests.post("https://www.google.com/recaptcha/api/siteverify", data=post_data)
            if captcha_verify_request.json()["success"]:
                event_name = data["event_name"]
                del data["event_name"]
                del data["captcha"]
                del data["action"]

                event_req = requests.get("https://hackdash.org/api/v2/{}/projects".format(event_name))
                valid_project_ids = [project['_id'] for project in event_req.json()]
                failed_votes = []

                for project in data:
                    num = data[project]
                    if data[project].isdigit() and project in valid_project_ids and 0 < int(num) and int(num) < 6:
                        num = int(num)
                        self.projects.update({"_id":project}, {"$inc":{"votes":1,"amount":num}, "$set":{"event":event_name}},upsert=True)
                    else:
                        failed_votes.append(project)

                protocol.factory.broadcast(json.dumps(self.get_votes(protocol, raw_data)))
                return {"succes":True, "failed_votes":failed_votes}
            else:
                return {"error":"invalid captcha"}
        else:
                return {"error":"no captcha or event"}