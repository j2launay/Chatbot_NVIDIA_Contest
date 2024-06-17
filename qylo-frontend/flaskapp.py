from flask import Flask, jsonify,request,render_template
from flask_cors import CORS, cross_origin

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,DateField,SelectField,TextAreaField,TimeField,HiddenField
from wtforms.validators import DataRequired
import os 

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class CreatePDFForm(FlaskForm):
    uuid = TextAreaField('uuid', validators=[DataRequired()])
    phone_number = TextAreaField('phone_number', validators=[DataRequired()])
    problem = TextAreaField('problem', validators=[DataRequired()])
    clinical = TextAreaField('clinical', validators=[DataRequired()])
    related_to_work = SelectField('related_to_work',choices=["Yes","No"] ,validators=[DataRequired()])

    #country_code = data.get("country_code")
    last_date_before_sickness =  DateField('last_date_before_sickness', validators=[DataRequired()])
    time_before_sickness =  TimeField('time_before_sickness' ,validators=[DataRequired()])

    date_sikness_begin = DateField('date_sikness_begin', validators=[DataRequired()])
    know_resolution_date = SelectField('know_resolution_date',choices=["Yes","No"], validators=[DataRequired()])
    resolution_date = DateField('resolution_date')
    signature =  HiddenField(validators=[DataRequired()])

    submit = SubmitField('Create PDF')



@app.route('/',methods = ['GET'])
@cross_origin()
def index():
    create_pdf_form = CreatePDFForm()
    return render_template('index.html',form=create_pdf_form)
