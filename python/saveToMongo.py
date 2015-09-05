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
            collection.insert_one(data[key])
        else:
            collection.insert_one(data)
            
    try:
        if isinstance(data[key], dict):
            formatDict = getFormatDict(data[key])
        else:
            formatDict = getFormatDict(data)
        print(formatDict)
        # Make all necessary formatting edits here
        formatDict = legalDict(data, formatDict)
        db.drop_collection(sys.argv[2]+'format')
        formatColl = db[sys.argv[2]+'format']
        formatColl.insert_one(formatDict)
    except KeyError:
        # Maybe send empty string to DB
        pass
    
    print(formatDict)

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

def legalDict(data, formattedDict):
    acceptedDict = dict(formattedDict)
    for key in formattedDict:
        acceptedDict = legalDictInner(data, key, acceptedDict)
    return acceptedDict
                
def legalDictInner(data, key, acceptedDict):
    possibleSize = 0
    for points in data:
        try:
            acceptedDict[key].keys()
            acceptedDict[key] = legalDict(data[key], acceptedDict[key])
        except:
            pass
        if key == '_id':
           del acceptedDict[key]
           return acceptedDict
        if isinstance(data[key], list):
           del acceptedDict[key]
           return acceptedDict
        else:
            possibleSize += 1
    
    if len(data)/possibleSize < 5:
        del acceptedDict[key]

    acceptedDict[key] = possibleSize      
    return acceptedDict
        
if __name__ == "__main__":
   main(sys.argv[1:])