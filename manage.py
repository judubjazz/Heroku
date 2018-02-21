# manage.py

from flask_script import Manager

from index import app

manager = Manager(app)

@manager.command
def hello():
    print ('hello')

if __name__ == "__main__":
    manager.run()
