# -*- coding: utf-8 -*-
"""
Created on Sat Sep 05 04:16:12 2015

@author: Xiaomao
"""
import json
import sys
from pymongo import MongoClient

def main(argv):
    filename = sys.argv[1]
    json_data = open(filename).read()
    data = json.loads(json_data)
    
    mongoClient = MongoClient()
    db = mongoClient['testDb']
    
    collection = db['testColl']
    posts = db.posts
    
    patientCount = 0;
    while patientCount < 1:
        singleData = data[patientCount]
        keySet = singleData.keys()
        for key in keySet:
            if key.find('$') > -1:
                key.replace('S', '')
        posts.insert_one(data[patientCount])
        patientCount += 1
    
if __name__ == "__main__":
   main(sys.argv[1:])