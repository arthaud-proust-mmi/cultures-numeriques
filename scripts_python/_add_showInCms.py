from os import listdir
from os.path import basename

files = listdir('.')

propertyToAdd = 'visibleInCms'
valueToSet = 'true'

lineToAdd = '{0}: {1}\n'.format(propertyToAdd, valueToSet)

noDuplicateProperty = True
forceValue = False


for file in files:
    if(file != basename(__file__)):
    # if(file == '_a_test.md'):
    # if(False):
        lines = []
        continu = True

        with open(file, mode="r", encoding="utf-8") as f:
            lines = f.readlines()

        if(noDuplicateProperty):
            for i in range(len(lines)):
                if lines[i].startswith(propertyToAdd): 
                    if(forceValue):
                        lines[i] = lineToAdd
                    else :
                        continu = False
                        break

        if(continu):
            lines.insert(1, lineToAdd)
            with open(file, mode="w", encoding="utf-8") as f:
                f.writelines(lines)
            