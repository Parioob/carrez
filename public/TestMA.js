//Ensemble des packages nécessaire à notre application.
var fs = require('fs');
var cheerio = require('cheerio');
var json = require('./maschema.json');

//On entre dans la fonction getMA qui permet la récupération des informations via notre fichier enregistré en local (MAlocal.html) contenant un exemple d'une page du site "www.meilleursagents.com"
function getMA(jsonLBC, res)
{
	//On charge et on lit notre fichier enregistré en local.
	var file = fs.readFileSync('./MAlocal.html', 'utf8'); 
	var $ = cheerio.load(file);

	var pr = $('.small-4.medium-2.columns.prices-summary__cell--median');

	//On récupère nos valeurs et on les stocks dans des variables.
	var average_flat_price = pr[0].children[0].data;
	var average_house_price = pr[1].children[0].data;
	var average_rent_price = pr[2].children[0].data;

	//On se focalise désormais uniquement sur les nombres mis à notre dispositions dans le site (Dans notre cas notre page local.)
	average_flat_price = average_flat_price.match(/[0-9,]/g).join("").replace(",", ".");
	average_house_price = average_house_price.match(/[0-9,]/g).join("").replace(",", ".");
	average_rent_price = average_rent_price.match(/[0-9,]/g).join("").replace(",", ".");

	//On insère nos valeurs récupérées dans notre fichier json "maschema.json")
	json.properties.average_flat_price = average_flat_price;
	json.properties.average_house_price = average_house_price;
	json.properties.average_rent_price = average_rent_price;

	//Comparaison entre nos deux sites
	var priceMeter = jsonLBC.properties.price/jsonLBC.properties.Area;
	var type = jsonLBC.properties.property_type;
	var priceMA;
	
	switch(type)
	{
		case "Appartement":
			priceMA = json.properties.average_flat_price;
		break;
		
		case "Maison":
			priceMA = json.properties.average_house_price;
		break;
		
		
	}
	//Itération afin de définir si nous sommes en présence d'un bondeal ou d'un mauvaisdeal en comparant le prix du mètre² du boncoin "priceMeter" et celui de meilleursagents "priceMA"
	if(priceMeter > priceMA)
	{
		json.properties.good_deal = false;		
	}
	else
	{
		json.properties.good_deal = true;
	}
	
	
	
	if(json.properties.good_deal == true)
	{		
		
		
		console.log("Bonne Affaire / Good Deal");
	}
	else
	{
		
		console.log("Mauvaise Affaire / Bad Deal");

	}
}
//On exporte les résultats de notre fonction pour qu'il puisse être utilisé dans d'autre page.js
exports.getMA = getMA;
