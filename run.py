import os
import sys
from threading import Thread

def startFrontend():
    os.chdir("frontend")
    os.system("npm start")
    
def startBackend():
    os.chdir("backend/cmd/server")
    os.system("go run main.go")

def init():
    print("Creating database")
    os.chdir("backend/cmd/initdb")
    if os.path.isfile("./database.db"):
        os.system("rm database.db")
    os.system("go run main.go")
    os.system("cp database.db ../server/database.db")

    print("Installing node modules")
    os.chdir("../../../frontend")
    os.system("npm install")
    os.chdir("..")
    
def initdb():
    print("Creating database")
    os.chdir("backend/cmd/initdb")
    if os.path.isfile("./database.db"):
        os.system("rm database.db")
    os.system("go run main.go")
    os.system("cp database.db ../server/database.db")
    
def run():
    Thread(target = startFrontend).start()
    Thread(target = startBackend).start()
    
def test():
    print("Option not implimented yet")

def main():
    if(not len(sys.argv) == 2):
        print("Invalid number of arguments. Should be `python3 run.py [init/run/test/initdb]`")
        return
    if(sys.argv[1].lower() == "init"):
        init()
    elif(sys.argv[1].lower() == "run"):
        run()
    elif(sys.argv[1].lower() == "test"):
        test()
    elif(sys.argv[1].lower() == "initdb"):
        initdb()
    else:
        print("Unknown argument " + sys.argv[1] + ". Should be `python3 run.py [init/run/test/initdb]`")
    
if __name__=="__main__":
    main()