import os
from os import listdir


toTransform = "events"

contentFolder = os.path.realpath(os.path.join(os.getcwd(),'../content', toTransform))
imagesFolder = os.path.realpath(os.path.join(os.getcwd(),'../static/images', toTransform))

contentFiles = listdir(contentFolder)


for file in contentFiles:
    if("index" in file):
        continue

    filePath = os.path.join(contentFolder, file)
    file_name, file_extension = os.path.splitext(filePath)
    file_name = file_name.split('\\')[-1]

    with open(filePath, mode="r", encoding="utf-8") as f:
        lines = f.readlines()
    
    for i in range(len(lines)):
        if lines[i].startswith('image:'):
            image = lines[i].replace('\n', '').split('/')[-1]
            image_name, image_extension = os.path.splitext(image)

            lines[i] = 'image: /images/events/'+file_name+image_extension+'\n'
            print(lines[i])
            break

    oldImagePath = os.path.join(imagesFolder, image_name+image_extension)
    newImagePath = os.path.join(imagesFolder, file_name+image_extension)

    os.rename(oldImagePath, newImagePath)

    with open(filePath, mode="w", encoding="utf-8") as f:
        f.writelines(lines)
