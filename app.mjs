// import { loadSequelize } from "./database.mjs";
// import express from "express";
// import cors from "cors";
// import bcrypt from "bcrypt";
// import { format } from "mysql2";

// /**
//  * Point d'entrée de l'application
//  * Vous déclarer ici les routes de votre API REST
//  */


// // POST/task -> Insert Into
// // GET/tasks -> select from 
// // Get/task/:id -> select from where id
// // POST/login select
// // Post/register insert into !!!!!!!!!!!!!!!!!!!!!!!


// async function main() {
//     try {
//         const sequelize = await loadSequelize();
//         const app = express();

//         app.get("/",(req,res)=>{


//             res.json({message:"Hello api, le vrai projet"})
//         })

//         app.get("/posts",async (req,res)=>{
//             const Post = sequelize.models.Post;
//             const posts = await Post.findAll()
//             res.json(posts);
//         })

//            app.get("/comments",async (req,res)=>{
//             const Comment = sequelize.models.Comment;
//             const comments = await Comment.findAll()
//             res.json(comments);
//         })

       

//         app.listen(3000, () => {
//             console.log("Serveur démarré sur http://localhost:3000");
//         });


//     } catch (error) {
//         console.error("Error de chargement de Sequelize:", error);
//     }
// }
// main(); //ancien code


//// c'est quoi cors ?

// https://aws.amazon.com/what-is/cross-origin-resource-sharing/#:~:text=Cross%2Dorigin%20resource%20sharing%20(CORS,resources%20in%20a%20different%20domain.

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


import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */

// GET /goodbye : affiche <p>Goodbye World</p>
// GET /status : affiche <p>Server is running</p>
// GET /date : affiche la date et l'heure actuelle au format ISO (utilisez new Date().toISOString())
// GET /random : affiche un nombre aléatoire entre 0 et 1 (utilisez Math.random())
// GET /random10 : affiche un nombre aléatoire entre 0 et 10 (utilisez Math.random())
async function main() {
    try {
        const sequelize = await loadSequelize();
        const app = express();

        app.get("/", (req, res) => {


            res.json({ message: "Hello api 7 le vrai projet" })
        })

        app.get("/tasks", async (req, res) => {
            const Task = sequelize.models.Task;
            const tasks = await Task.findAll()
            res.json(tasks);
        })

        app.get("/users", async (req, res) => {
            const User = sequelize.models.User;
            const users = await User.findAll()
            res.json(users);
        })


        //Postman je suis GET /user/:id get user id postman fini"
        app.get("/user/:id", async (req, res) => {
            console.log(req.params);
            const User = sequelize.models.User;
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            res.json(user)

        })


       
        app.get("/goodbye", async (req, res) => {
            res.send("<p>Goodbye World</p>");
        })

        app.get("/status", async (req, res) => {
            res.send("<p>Server is running</p>");
        })

        app.get("/date", async (req, res) => {
            res.send(new Date().toISOString());
        })

        app.get("/random", async (req, res) => {
            res.send(Math.random());
        })

        app.get("/random10", async (req, res) => {
            res.send(Math.random() * 10);
        })



                app.get("/posts",async (req,res)=>{
            const Post = sequelize.models.Post;
            const posts = await Post.findAll()
            res.json(posts);
        })

           app.get("/comments",async (req,res)=>{
            const Comment = sequelize.models.Comment;
            const comments = await Comment.findAll()
            res.json(comments);
        })


        app.listen(3001, () => {
            console.log("Serveur démarré sur http://localhost:3001/");
        });


    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}

main();


/// l'autre code du cours apicours










