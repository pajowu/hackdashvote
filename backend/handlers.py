import pymongo
import requests
from bson import json_util
import json


class MongoDBVoteHandler():
    def __init__(self):
        self.client = pymongo.MongoClient()
        self.db = self.client['hackvote']
        self.votes = self.db['votes']
        if "votes" not in self.db.collection_names():
            self.db.create_collection("votes")


    def get_votes(self, protocol, data):
        data = json.loads(data)
        event = data["event_name"]
        result = list(self.votes.find({"event":event}))
        return json.dumps(result, default=json_util.default)

    def save_votes(self, protocol, data):
        data = json.loads(data)
        if "captcha" in data and "event_name" in data:
            post_data = {"secret":"6LcasSITAAAAAJHQlLNZ4XbChxodmCPv1s1fM0L7", "response":data["captcha"]}
            verify_request = requests.post("https://www.google.com/recaptcha/api/siteverify", data=post_data)
            if verify_request.json()["success"]:
                del data["captcha"]
                del data["action"]
                for project in data:
                    if data[project].isdigit():
                        num = int(data[project])
                        if 0 < num and num < 6:
                            self.votes.update_one({"id":project}, {"$inc":{"votes":1,"amount":num}},upsert=True)
                return {}
            else:
                return {"error":"invalid captcha"}
        else:
                return {"error":"no captcha or event"}


"""
        result = db.restaurants.insert_one(
    {
        "address": {
            "street": "2 Avenue",
            "zipcode": "10075",
            "building": "1480",
            "coord": [-73.9557413, 40.7720266]
        },
        "borough": "Manhattan",
        "cuisine": "Italian",
        "grades": [
            {
                "date": datetime.strptime("2014-10-01", "%Y-%m-%d"),
                "grade": "A",
                "score": 11
            },
            {
                "date": datetime.strptime("2014-01-16", "%Y-%m-%d"),
                "grade": "B",
                "score": 17
            }
        ],
        "name": "Vella",
        "restaurant_id": "41704620"
    }
)"""