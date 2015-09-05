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
    mongoClient.drop_database('testerDb')
    db = mongoClient['testerDb']
    
    collection = db['testerColl']
    posts = db.posts
    
    patientCount = 0;
    while patientCount < 0:
        posts.insert_one(data[patientCount])
        patientCount += 1
        
    formatDict = getFormatDict(data[0])
    formatColl = db['format']
    formatColl.insert_one(formatDict)
    

def remove_dollarsign(obj):
    for key in obj.keys():
        new_key = key.replace('$','')
        if new_key!=key:
            obj[new_key] = obj[key]
            del obj[key]
    return obj
    
def getFormatDict(jsonData):
    try:
        keys = jsonData.keys()
    except:
        return {}
    dictionary = dict((el, '') for el in keys)
    print('made dict')
    for key in keys:
        print('in for loop')
        try:
            jsonData[key].keys()
            dictionary[key] = getFormatDict(jsonData[key])
        except AttributeError:
            pass
    return dictionary
    
if __name__ == "__main__":
   main(sys.argv[1:])