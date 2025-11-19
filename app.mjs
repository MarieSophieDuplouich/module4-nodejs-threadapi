import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */



async function main() {
    try {

        const sequelize = await loadSequelize();
        const app = express();

        //fin de cours avec express sur post
        app.use(express.json());
        //fin de cours avec express sur post


        app.use(express.json()); // Activer le parsing du JSON body pour qu'il fournisse req.body
        app.use(cookieParser()); // Activer cookie-parser pour qu'il fournissent les cookies dans req.cookies
        const UserModel = sequelize.models.User;
        const JWT_SECRET = 'votre_cle_secrete_pour_jwt'; // Utilisez une clé secrète sécurisée dans une application réelle

        app.post('/register', async (req, res) => {
            const { email, password, verifiedPassword } = req.body;

            if (!email || !password || !verifiedPassword) {
                return res.status(400).json({ message: 'Email, password and verifiedPassword are required' });
            }

            if (password !== verifiedPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            try {
                const newUser = await UserModel.create({ email, password });
                res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
            } catch (error) {
                res.status(500).json({ message: 'Error registering user', error: error.message });
            }
        });

        //register doit être un POST pas de protection

           app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            try {
                const user = await UserModel.findOne({ where: { email, password } });
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true });
                res.json({ message: 'Login successful' });
            } catch (error) {
                res.status(500).json({ message: 'Error logging in', error: error.message });
            }
        });
         

                //Middleware isLoggedInJWT


        function isLoggedInJWT(UserModel) {
            return async (req, res, next) => {
                const token = req.cookies.token;
                if (!token) {
                    return res.status(401).json({ message: 'Unauthorized: No token provided' });
                }
                try {
                    const decoded = jwt.verify(token, JWT_SECRET);
                    req.userId = decoded.userId;

                    // ++++++++++
                    // Récupérer l'utilisateur connecté
                    req.user = await UserModel.findByPk(req.userId);
                    if (!req.user) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                    // ++++++++++

                    next();
                } catch (error) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
            }
        }





        app.get("/", (req, res) => {


            res.json({ message: "Hello api 7 le vrai projet" })
        })

        app.get("/comments", async (req, res) => {
            const Comment = sequelize.models.Comment;
            const comments = await Comment.findAll()
            res.json(comments);
        })


        // /posts GET Récupération de tous les posts avec commentaires	pas de protection

        app.get("/posts", async (req, res) => {
            const Post = sequelize.models.Post;
            const posts = await Post.findAll()
            res.json(posts);
        })
        ///// attention !!!
        //Création d'un nouveau post /posts doit être un POST OUI pour la protection 


        app.post("/posts", async (req, res) => {
            console.log(req.body);
            const newPostData = req.body;
            try {
                // +
                const newPost = await Post.create({
                    title: newPostData.title,
                    content: newPostData.content,
                    userId: 3

                });
                res.json(newPost);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Erreur lors de la création du post" });
            }
        });





        app.get("/users", async (req, res) => {
            const User = sequelize.models.User;
            const users = await User.findAll()
            res.json(users);
        })


        //GET /user/:id get user id "
        app.get("/user/:id", async (req, res) => {
            console.log(req.params);
            const User = sequelize.models.User;
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            res.json(user)

        })

        // GET	/users/:userId/posts	Récupération des posts d'un utilisateur	pas de protection
        //    app.get("/:userId/posts", async (req, res) => {
        //     console.log(req.params);
        //     const User = sequelize.models.User;
        //     const userId = req.params.id;
        //     const user = await User.findByPk(userId);
        //     res.json(user)

        // })

        // POST	/posts/:postId/comments	Ajout d'un commentaire à un post	Oui protection


        // DELETE	/posts/:postId	Suppression d'un post	Oui (auteur ou admin)


        // DELETE	/comments/:commentId	Suppression d'un commentaire	Oui (auteur ou admin)



        // app.get("/register", async (req, res) => {
        //     res.send("<p>Inscription d'un nouvel utilisateur</p>");
        // })






        // app.post("/login", async (req, res) => {
        //     res.send("<p>Connexion d'un utilisateur</p>");
        // })

   

     

        //login doit être un POST pas de protection

        app.get("/logout", async (req, res) => {
            res.send("<p>utilisateur déconnecté</p>");
        })

        //logout doit être un POST OUI pour la protection


   

        app.listen(3001, () => {
            console.log("Serveur démarré sur http://localhost:3001/");
        });


    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}

main();


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











