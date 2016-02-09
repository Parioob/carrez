//Ensemble des packages nécessaire à notre application.
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var json = require('./lbcschema.json');

//On entre dans la fonction getLBC qui permet la récupération des informations via notre url sur le site LeBonCoin
function getLBC(url, page, callback)
{	
	request(url, function(error, response, html)
	{
		//Itération de vérification
		if(!error)
		{
			var $ = cheerio.load(html);

			//Déclarations de nos variables
			var price, city, zip_code , Area , rooms , property_type ;
		
			price =  $("[itemprop='price']").text();
			city =   $("[itemprop='addressLocality']").text();
			zip_code = $("[itemprop='postalCode']").text();
			var datas = $("[class = 'lbcParams criterias']>table > tr > td");
		
			property_type = datas[0].children[0].data;
			rooms = datas[1].children[0].data;
			Area = datas[2].children[0].data;
			
			price = price.match(/[0-9,]/g).join("");
			Area = Area.match(/[0-9,]/g).join("");
			 
			//Transfert des valeurs récupérées dans notre document json : "lbcschema.json"
			json.properties.price = price;
			json.properties.city = city;
			json.properties.Area = Area;
			json.properties.zip_code = zip_code;
			json.properties.rooms = rooms;
			json.properties.property_type = property_type;   
			
			callback(json, page);
		}
		/*//Remplissage et création (si il n'a pas été préalablement créé) d'un document json contenant nos variables récupérées.)
		fs.writeFile('outputLBC.json', JSON.stringify(json, null, 4), function(err){
			console.log('Leboncoin scrape went good.'); //Message de vérification */
	});

	
}

exports.getLBC = getLBC;
/*
//Version de test en rentrant une adresse http en dur : 
getLBC('http://www.leboncoin.fr/ventes_immobilieres/922257510.htm?ca=12_s'); //On entre l'URL à la main pour effectuer des test dans un premier temps.

//Version de récupération sans utiliser les modules.
app.get('/scrape', getLBC) ;
//On lance l'application sur le port 8081 afin de pouvoir récupérer les résultats de notre json.
app.listen('8081')
console.log('Ready on port 8081');
*/