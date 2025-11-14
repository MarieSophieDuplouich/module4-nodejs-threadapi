import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */
async function main() {
    try {
        const sequelize = await loadSequelize();
        const app = express();

       bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});



        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });


    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
main();


//// c'est quoi cors ?

https://aws.amazon.com/what-is/cross-origin-resource-sharing/#:~:text=Cross%2Dorigin%20resource%20sharing%20(CORS,resources%20in%20a%20different%20domain.

// Qu'est-ce que le partage des ressources entre origines multiples ?
// Le partage des ressources entre origines multiples (CORS) 
// est un mécanisme d'intégration des applications. 
// La spécification CORS permet aux applications 
// Web clientes chargées dans un domaine particulier
//  d'interagir avec les ressources d'un autre domaine. 
//  Cela est utile, car les applications complexes font 
//  souvent référence à des API et à des ressources
//   tierces dans leur code côté client. 
//   Par exemple, votre application peut utiliser 
//   votre navigateur pour extraire des vidéos 
//   d'une API de plateforme vidéo, utiliser des polices 
//   d'une bibliothèque de polices publique 
//   ou afficher des données météorologiques 
//   provenant d'une base de données météorologiques nationale. 
//   Le CORS permet au navigateur du client de vérifier 
//   auprès des serveurs tiers si la requête est autorisée avant tout transfert de données.
// app.use(cors())
 
// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })
 
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })
















