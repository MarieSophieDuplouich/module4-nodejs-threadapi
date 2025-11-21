import { loadSequelize } from "./database.mjs";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecretdefou";// Utilisez une clé secrète sécurisée dans une application réelle


// export JWT_SECRET="clé_secrete"
// node main.mjs

/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */

async function main() {
    try {

        const sequelize = await loadSequelize();
        const app = express();
        
        app.use(cors({
            origin: "http://localhost:3001",
            credentials: true
        }));

        app.use(express.json()); // Activer le parsing du JSON body pour qu'il fournisse req.body
        app.use(cookieParser()); // Activer cookie-parser pour qu'il fournissent les cookies dans req.cookies

        const UserModel = sequelize.models.User;
        const Post = sequelize.models.Post;

        app.post('/register', async (req, res) => {
            const { username, email, password, verifiedPassword } = req.body;


            if (!username || !email || !password || !verifiedPassword) {
                return res.status(400).json({ message: 'Username,Email, password and verifiedPassword are required' });
            }

            if (password !== verifiedPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            try {
                const newUser = await UserModel.create({ username, email, password });
                res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
            } catch (error) {
                res.status(500).json({ message: 'Error registering user', error: error.message });
            }
        });

        //register doit être un POST pas de protection // ça marche

        app.post('/login', async (req, res) => {
            console.log("LOGIN REQ BODY :", req.body)

            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            try {
                const user = await UserModel.findOne({ where: { email } });
                //variable user doit être testée tout de site après avoir 
                // initialiser si elle n'existe pas 
                // on sort de la fonction avec un return et le message d'erreur et après on fait me traitement s'il ya pas d'erreur conlusion : il avait raison
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                console.log("USER FOUND :", user);


                const isMatch = await bcrypt.compare(password, user.password);


                if (!isMatch || !user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }


                console.log("PASSWORD MATCH ?", isMatch); // <--- LOG #3


                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });


                res.cookie('token', token, { httpOnly: true });
                res.json({ message: 'Login successful' });
            } catch (error) {
                console.error("LOGIN ERROR :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error logging in', error: error.message });
            }
        }); // ça marche


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
               try {
            const Comment = sequelize.models.Comment;
            const comments = await Comment.findAll()
            res.json(comments);// ça marche

         


            } catch (error) {
                console.error("Comments aren't displayed :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error Comments not displayed', error: error.message });

            }
        })


        // /posts GET Récupération de tous les posts avec commentaires	pas de protection

        app.get("/posts", async (req, res) => {
              try {

            const Post = sequelize.models.Post;
            const posts = await Post.findAll()
            res.json(posts);// ça marche

          

            } catch (error) {
                console.error("posts aren't displayed :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error Posts not displayed', error: error.message });

            }
        })
        //Création d'un nouveau post /posts doit être un POST OUI pour la protection 

        app.post("/posts", isLoggedInJWT(UserModel), async (req, res) => {
            console.log(req.body);
            const newPostData = req.body;
            try {
                // +
                const newPost = await Post.create({
                    // title: newPostData.title,
                    // content: newPostData.content,
                    // userId: newPostData.userid, // ça marche !!
                    title: req.body.title,
                    content: req.body.content,
                    UserId: req.userId,
                    // PostId:req.postId
                });

                res.status(201).json(newPost)


            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Erreur lors de la création du post" });
            }
        });// ça marche


        app.get("/profile/:userid", isLoggedInJWT(UserModel), async (request, response) => {
            try {
                const { userid } = request.params;
                // Récupérer le profil de l'utilisateur connecté
                const user = await UserModel.findByPk(userid);
                if (!user) {
                    return response.status(404).json({ error: "Utilisateur non trouvé" });
                }
                response.json(user);



            }
            catch (error) {
                console.error("User's profile isn't displayed :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error User profile not displayed', error: error.message });
            }
        });


        // GET	/users/:userId/posts	Récupération des posts d'un utilisateur	pas de protection
        app.get("/users/:userId/posts", async (req, res) => {

            try{
            const User = sequelize.models.User;
            const Post = sequelize.models.Post;

            const user = await User.findByPk(req.params.userId, {
                include: Post
            });

            if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

            res.json(user.Posts);}
            catch (error) {
                console.error(" /users/:userId/posts isn't displayed :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error /users/:userId/posts not displayed', error: error.message });
            }

        }); // ça marche


        // POST	/posts/:postId/comments	Ajout d'un commentaire à un post	Oui protection

        app.post("/posts/:postId/comments", isLoggedInJWT(UserModel), async (req, res) => {
            try {
                const Comment = sequelize.models.Comment;
                // +
                const newComment = await Comment.create({
                    title: req.body.title,
                    content: req.body.content,
                    datetime: new Date(),
                    UserId: req.userId,
                    PostId: req.params.postId
                });

                res.json(newComment);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Erreur lors de la création du commentaire" });
            }
        });// ça marche


        // Auth ++++
        // DELETE	/posts/:postId	Suppression d'un post	Oui (auteur ou admin je choisis admin)
        app.delete("/posts/:postId", isLoggedInJWT(UserModel), async (req, res) => {
            const Post = sequelize.models.Post;

            try {
                const post = await Post.findByPk(req.params.postId);
                const deleted = await Post.destroy({
                    where: { id: req.params.postId }
                });

                if (!post) {
                    return res.status(404).json({ error: "Post not found" });
                } else { console.log("Post supprimé User connecté"); }

                if (post.UserId !== req.userId) {
                    return res.status(403).json({ error: "Unauthorized" });
                }


                res.json({ deleted });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Erreur lors de la suppression du post" });
            }
        });// ça marche


        // Auth auteur +++++++++++++++
        // DELETE	/comments/:commentId	Suppression d'un commentaire	Oui (auteur ou admin)
        app.delete("/comments/:commentId", isLoggedInJWT(UserModel), async (req, res) => {
        
            try {
                   const Comment = sequelize.models.Comment;
                const comment = await Comment.findByPk(req.params.commentId);

                const deleted = await Comment.destroy({
                    where: { id: req.params.commentId }
                });
                if (!comment) {
                    return res.status(404).json({ error: "Comment not found" });
                }

                if (comment.UserId !== req.userId) {
                    return res.status(403).json({ error: "Unauthorized" });
                }

                res.json({ deleted });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: "Erreur lors de la suppression du commentaire" });
            }
        });//ça marche


        //login doit être un POST pas de protection

        app.post("/logout", async (req, res) => {
            try {
            res.clearCookie('token');
            res.json({ message: 'Logout successful' });
             }
            catch (error) {
                console.error("logout doesn't work :", error);    // <--- LOG #4
                res.status(500).json({ message: 'Error Logout not work', error: error.message });

            }
        }) //ça marche

        //logout doit être un POST OUI pour la protection

        app.use((req, res, next) => {
            res.status(404).send("Sorry can't find that!")
        })



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











