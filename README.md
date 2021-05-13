# jumper-heroku
Demo en phaser de mini-juego con personaje que salta en plataformas.
Usa la flechas de dirección para controlar al personaje saltador.
Escrito usando phaser v2.0.5  


### Demo original
El código orignal muestra a un personaje que debe ir subiendo por diferentes plataformas que se generan aleatoriamente en cada intento.
Tras cada salto el personaje debe de alcanzar la plataforma del siguiente nivel. Si falla en su intento volverá al inicio al nivel más inferior.

Codigo fuente original de [Jack Rugile](https://codepen.io/jackrugile) 
Demostración del fuente original: https://codepen.io/jackrugile/pen/fqHtn


### Cambios efectuados
  * Se añade un contador de numero de plataformas alcanzado
  * Se guarda el contador en una base de datos
  

### Que necesitas para usar Heroku y desarrollar en local

* Instalar en local:
	- Git https://git-scm.com/downloads
	- GitHub Desktop (para los comodones) https://desktop.github.com/
	- php https://www.php.net/downloads.php (o xampp https://www.apachefriends.org/es/download.html en su defecto)
	- Composer https://getcomposer.org/download/
	- Heroku Cli https://devcenter.heroku.com/articles/heroku-cli#download-and-install
	- DBeaver https://dbeaver.io/download/
	- VSCodium https://vscodium.com/
	
* Sigue la guia para crear un proyecto demo php en Heroku por primera vez y entender la mecánica de funcionamiento. https://devcenter.heroku.com/articles/getting-started-with-php

### Ficheros clave en Proyecto

* .gitignore (añadir todos los ficheros y carpetas que no se deben de subir a Heroku y Git)

		vendor/
		.env

* app.json (Definir nombre aplicación, descripción, etc...)

		{
		  "name": "Jumper PHP",
		  "description": "Demo Jumper Game",
		  "repository": "https://github.com/gmartiifp/jumper-heroku",
		  "addons": []
		}
	
* composer.json (Definir datos sobre autores, requerimientos, etc...)

		{
			"authors": [
					{
						"name": "G Marti",
						"email": "gmarti@campus.ifp.es",
						"role": "Developer"
					}
				], 
			"require": {
				"php": ">=7.2.0"
			},
			"require-dev": {
				"heroku/heroku-buildpack-php": "*"
			}
		}
		
* composer.lock (se genera con el siguiente comando:)

		composer install
		
* Procfile ( debe tener el siguiente contenido:)

		web: vendor/bin/heroku-php-apache2 web/


# ¿Donde va el proyecto?

Todo el código debe de situarse dentro de la carpeta "web" tal y como se indica en el Procfile.

Dentro de la carpeta web, en la raiz, se colocarán los archivos principales del juego, normalmente el game.js, index.html y style.css.

Después se crearan las diferentes carpetas de assets, data, u otras necesarias.

Y para separar esto de la lógica del código php que se usará para comunicar con la base de datos, este último se pondrá dentro de una carpeta php. Con lo que tendremos una estructrua similar a esta:

		 web
		 │   game.js
		 │   index.html
		 │   style.css
		 │
		 ├───assets
		 │      dude.png
		 │      pixel_1.png
		 │      star.png
		 │
		 ├───data
		 │
		 └───php
		        cargarinventario.php
		        index.php
		        login.php
		        newuser.php
		        test.php
		        testbbdd.php


