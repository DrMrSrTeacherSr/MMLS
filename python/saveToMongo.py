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
    data = json.loads(json_data, object_hook=remove_dollarsign)
    
    mongoClient = MongoClient()
    db = mongoClient['testerDb']
    
    collection = db['testerColl']
    posts = db.posts
    
    patientCount = 0;
    while patientCount < len(data):
#        singleData = data[patientCount]
#        keySet = singleData.keys()
#        for key in keySet:
#            if key.find('$') > -1:
#                key.replace('S', '')
        posts.insert_one(data[patientCount])
        patientCount += 1

def remove_dollarsign(obj):
    for key in obj.keys():
        new_key = key.replace('$','')
        if new_key!=key:
            obj[new_key] = obj[key]
            del obj[key]
    return obj
    
if __name__ == "__main__":
   main(sys.argv[1:])