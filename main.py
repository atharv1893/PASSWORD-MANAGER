from flask import Flask, render_template, request, redirect, url_for, flash, session
from pymongo import MongoClient
import hashlib
from bs4 import BeautifulSoup
import requests
import os

secretkey = os.urandom(24)
app = Flask(__name__, static_url_path='/static')
app.secret_key = secretkey
# Connect to MongoDB
client = MongoClient('mongodb+srv://atharvd1893:Atharv2003@p-manager.6v9vbrl.mongodb.net/?retryWrites=true&w=majority&appName=P-Manager')
db = client['User_Data']  # Choose your database
collection = db['Register']

@app.route('/')
def home():
    return render_template('index.html')


collection_login = db['Login']
@app.route('/login',methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        hashed_password = hashlib.sha1(password.encode()).hexdigest()

        # Check if user exists in the database
        user = collection.find_one({'email': email})

        if user:
            # Check if password matches
            if user['password'] == hashed_password:
                # Insert data into MongoDB
                user_data = {'email': email}
                collection_login.insert_one(user_data)
                return redirect(url_for('homepage'))  # Redirect to the 'location' route
            else:
                # Password is incorrect, send alert message to the user
                flash('Incorrect password. Please try again.', 'error')
                return render_template('login.html')
        else:
            # User not found, send alert message to the user
            return render_template('popup_login.html') 
    else:
        return render_template('login.html')


@app.route('/register',methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Get form data
        username = request.form['username']
        email = request.form['email']
        mobile_number = request.form['number']
        password = request.form['password']
        hashed_password = hashlib.sha1(password.encode()).hexdigest()
        # Check if email already exists in the database
        if collection.find_one({'email': email}):
            return render_template('popup.html')  # Render a template with popup message
        else:
            # Insert data into MongoDB
            user_data = {
                'username': username,
                'email': email,
                'mobile_number': mobile_number,
                'password': hashed_password,
                'code': 0
            }

            collection.insert_one(user_data)
            return redirect(url_for('login'))  # Redirect to login page after successful registration
    else:
        return render_template('register.html')

collection = db['Register']
collection_login = db['Login']

collection_password = db['Password']
collection_logo = db['Logos']

@app.route('/fetch_logo/<company>')
def fetch_logo(company):
    
    company_lower = company.lower()

   
    existing_entry = collection_logo.find_one({'company': company_lower})
    if existing_entry:
       
        return existing_entry['logo_url']
    
    url = 'https://1000logos.net/{}-logo/'.format(company)
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        img_tag = soup.find('img', class_=lambda x: x and 'aligncenter' in x.split())
        if img_tag:
            img_src = img_tag.get('data-src')
            
            collection_logo.insert_one({'company': company_lower, 'logo_url': img_src})
            return img_src
    return ''  


@app.route('/home', methods=['POST'])
def add_entry():
    application_name = request.form['ApplicationName']
    password = request.form['password']
    username = request.form['Username']

    
    application_lower = application_name.lower()

    
    existing_entry = collection_password.find_one({'applicationNameLower': application_lower})
    print(existing_entry)
    if existing_entry:
        
        flash('Application name already exists. Please choose a different one.', 'error')
        return redirect(url_for('homepage'))  
    else:
        # Insert new entry into MongoDB
        new_entry = {
            'applicationName': application_name,
            'applicationNameLower': application_lower,  
            'username': username,
            'password': password
            
        }
        collection_password.insert_one(new_entry)
        return redirect(url_for('homepage'))



@app.route('/home')
def homepage():
    # Retrieve entries from the Password table
    password_entries = list(collection_password.find({}, {'_id': 0, 'applicationName': 1, 'username': 1, 'password': 1}))

    # Retrieve image URLs from the Logos table
    logo_entries = {}
    for entry in password_entries:
        company_name = entry['applicationName']
        logo_url = fetch_logo(company_name)
        logo_entries[company_name] = logo_url
    print(password_entries)
    print(logo_entries)
    return render_template('homepage.html', entries=password_entries, logos=logo_entries)


if __name__ == '__main__':
    app.run(debug=True)
