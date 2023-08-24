from flask import Flask
from flask import render_template, request, redirect, session, url_for
from config import conexion
from werkzeug.security import generate_password_hash, check_password_hash
import json


app = Flask(__name__)
app.secret_key = "anystringhere"

@app.route("/")
def login_inicio():
    return render_template("sitio/login.html")


@app.route("/autenticarse",  methods=['POST'])
def autenticarse():
    email = request.form["txtCorreoUsuario"]
    password = request.form["txtPassword"]
    seleccionar = conexion.cursor()
    resultado = seleccionar.execute(
        "select * from usuarios where correo_electronico='" + email+"'")
    usuario = resultado.fetchone()
    print(usuario)
    response = {}
    if usuario is not None:
        contra = usuario[5]
        check_pass = check_password_hash(contra, password)
        if check_pass:
            session['email1'] = email
            session['nombres'] = usuario[1]
            session['apellidos'] = usuario[2]
            entrando = "Bienvenido" + usuario[1]+" "+usuario[2]
            print(entrando)
            response = {'status': 200, 'estado': 1, 'mensaje': entrando}
           # return redirect(url_for("/dashboard"))
        else:
            # return render_template('index.html', message=" Las credenciales no son correctas!!")
            response = {'status': 400, 'estado': 0,
                        'mensaje': "Las credenciales no son correctas!!"}
    else:
        response = {'status': 400, 'estado': 0,
                    'mensaje': "Por favor llenas los campos"}

    return json.dumps(response)
    seleccionar.close()
    conexion.close()
    
    #El problema es el ajax, ya que espera una respuesta

@app.route("/dashboard")
def menu():
    return render_template("sitio/dashboard.html")


if __name__ == "__main__":
    app.run(debug=True)
