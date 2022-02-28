import subprocess
import os

#just the init part of the script, adding the run part soon...

print("Creating database")
os.chdir("backend/cmd/initdb")
os.system("go run main.go")
os.system("cp database.db ../server/database.db")

print("Installing node modules")
os.chdir("../../../frontend")
os.system("npm install")
os.chdir("..")


#run script part - in progress
#subprocess.Popen(r'cd frontend & npm start',shell=True,stdout=subprocess.PIPE)
#subprocess.Popen(r'cd backend/cmd/server & go run main.go',shell=True,stdout=subprocess.PIPE)



#add test part
