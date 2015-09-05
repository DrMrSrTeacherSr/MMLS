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
    
#    patientCount = 0;
#    while patientCount < len(data):
#        if len(data) > 1:
#            collection.insert_one(data[patientCount])
#        else :
#            collection.insert_one(data)
#        patientCount += 1
    for key in data.keys():
        if isinstance(data[key], dict):
            getFormatDict(data[key])
        else:
            getFormatDict(data)
            
    try:
        if isinstance(data[key], dict):
            collection.insert_one(data[key])
        else:
            collection.insert_one(data)
        # Make all necessary formatting edits here
                
        
        
        formatColl = db[sys.argv[2]+'format']
        formatColl.insert_one(formatDict)
    except KeyError:
        # Maybe send empty string to DB
        pass
    
    print(collection.find({'colorName':'red'}))

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

#def legalDict(data, formattedDict):
#    for keys in formattedDict:
        

if __name__ == "__main__":
   main(sys.argv[1:])