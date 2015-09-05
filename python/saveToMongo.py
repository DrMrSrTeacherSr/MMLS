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
    db = mongoClient['MasterDB']
    db.drop_collection(sys.argv[2])
    collection = db[sys.argv[2]]
    
    patientCount = 0;
    while patientCount < 0:
        collection.insert_one(data[patientCount])
        patientCount += 1
        
    try:
        formatDict = getFormatDict(data[0])
        formatColl = db[sys.argv[2]+'format']
        formatColl.insert_one(formatDict)
    except KeyError:
        # Maybe send empty string to DB
        pass
    

def remove_dollarsign(obj):
    for key in obj.keys():
        new_key = key.replace('$','')
        if new_key!=key:
            obj[new_key] = obj[key]
            del obj[key]
    return obj
    
def getFormatDict(jsonData):
    keys = jsonData.keys()
    dictionary = dict((el, '') for el in keys)
    for key in keys:
        try:
            jsonData[key].keys()
            dictionary[key] = getFormatDict(jsonData[key])
        except AttributeError:
            pass
    return dictionary
    
if __name__ == "__main__":
   main(sys.argv[1:])