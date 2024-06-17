from flask import Flask, render_template, session, copy_current_request_context,request,Response,jsonify
from flask_socketio import SocketIO, emit, disconnect
from threading import Lock
from qa import Conversation
import requests
import json
global_variables = {}
server_variables = {}
global_variables['client_num'] = 0


async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socket_ = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

socket_.init_app(app, cors_allowed_origins="*")
namespace = "/test"

@app.route('/')
def index():
    return render_template('index.html', async_mode=socket_.async_mode)

@app.route('/td_login', methods=['GET', 'POST'])
def proxy():
    try:
        # Get the requested URL from the query parameters
        token=requests.get("https://www.topdoctors.co.uk/ws/get_login/testuser/testuser").json()
        url = "https://www.topdoctors.co.uk/ws/apis/setPatientAndRedirect/"+token+"/"

        # Forward the request to the specified URL
        response = requests.request(
            method=request.method,
            url=url,
            data=request.json,
            allow_redirects=False  # You may adjust this based on your needs
        )

        # Create a Flask response from the response received from the external server
        flask_response = Response(
            response=response.content,
            status=response.status_code,
            headers=dict(response.headers)
        )

        for key, value in response.cookies.items():
            flask_response.set_cookie(key, value)

        return flask_response

    except Exception as e:
        return str(e)

def getUserRole(request):
    workfit_user_cookie = request.cookies.get('workfit_user')

    if workfit_user_cookie:
        # Assume 'workfit_user' cookie is in JSON format
        try:
            # Parse the cookie as JSON
            cookie_data = json.loads(workfit_user_cookie)

            # Access the 'role' field
            role = cookie_data.get('role')

            if role:
                return role
            else:
                return "Role field not found in the cookie."
        except json.JSONDecodeError:
            return "Invalid JSON format in 'workfit_user' cookie."
    else:
        return "'workfit_user' cookie not found in the request."

@socket_.on('connected', namespace)
def create_conversation(message):
    session['conversation'] = Conversation()
    session['receive_count'] = 1
    session['conversation'].origin=getUserRole(request)

    if request.sid not in server_variables.keys():
        server_variables[request.sid] = {'sid' : request.sid, 'stats' : 'connected','client_num' : global_variables['client_num']}
        global_variables['client_num'] = global_variables['client_num'] + 1
    
    emit(
        'my_response',
        {'data': message['data'], 'count': session['receive_count']},
        namespace="/test",
        to=server_variables[request.sid]["sid"]
    )


#Question Handler
@socket_.on('ask', namespace)
def ask(question):
    session['receive_count'] += 1
    emit(
        'my_response',
        {'data': session['conversation'].handleRequest(question["data"]), 'count': session['receive_count']},
        broadcast=True,
        namespace = "/test",
        to=server_variables[request.sid]["sid"]
    )


@socket_.on('disconnect_request', namespace)
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'Disconnected!', 'count': session['receive_count']},
         callback=can_disconnect,
         namespace = "/test",
        to=server_variables[request.sid]["sid"]
)


if __name__ == '__main__':
    socket_.run(app, debug=True) #remove ssl context to deploy

