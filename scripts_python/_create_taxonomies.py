import os
from os import listdir
from os.path import basename

contentFolder = os.path.realpath(os.path.join(os.getcwd(),'../content'))
collections = listdir(contentFolder)

toTransform = ["events", "kinds", "organizations", "persons", "thematiques"]

for collection in collections:
    if(collection in toTransform):
        collectionPath = os.path.join(contentFolder, collection)
        collectionFiles = listdir(collectionPath)
        for file in collectionFiles:
            if("index" in file):
                continue

            oldFilePath = os.path.join(collectionPath, file)

            filename, file_extension = os.path.splitext(oldFilePath)
            newFilename = "_index."+file_extension
            newFilePath = os.path.join(collectionPath, filename, newFilename)
            os.makedirs(os.path.join(collectionPath, filename))
            os.rename(oldFilePath, newFilePath)