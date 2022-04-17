import os
from os import listdir


toTransform = "persons"

contentFolder = os.path.realpath(os.path.join(os.getcwd(),'../content', toTransform))
imagesFolder = os.path.realpath(os.path.join(os.getcwd(),'../static/images', toTransform))

contentFiles = listdir(contentFolder)


for folder in contentFiles:
    if("index" in folder):
        continue


    filePath = os.path.join(contentFolder, folder, '_index.md')
    file_name, file_extension = os.path.splitext(filePath)

    with open(filePath, mode="r", encoding="utf-8") as f:
        lines = f.readlines()

    
    for i in range(len(lines)):
        if lines[i].startswith('image:'):
            image = lines[i].replace('\n', '').split('/')[-1]
            image_name, image_extension = os.path.splitext(image)

            lines[i] = 'image: /images/persons/'+folder+image_extension+'\n'
            print(lines[i])
            break
    

    oldImagePath = os.path.join(imagesFolder, image_name+image_extension)
    newImagePath = os.path.join(imagesFolder, folder+image_extension)

    os.rename(oldImagePath, newImagePath)

    with open(filePath, mode="w", encoding="utf-8") as f:
        f.writelines(lines)
