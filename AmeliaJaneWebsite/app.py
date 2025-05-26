from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'your-secret-key'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/quote', methods=['POST'])
def quote():
    name = request.form.get('name')
    email = request.form.get('email')
    details = request.form.get('details')
    # TODO: send email or save to database
    flash(f'Thanks, {name}! Your quote request has been received.')
    return redirect(url_for('home') + '#quote')

if __name__ == '__main__':
    app.run(debug=True)