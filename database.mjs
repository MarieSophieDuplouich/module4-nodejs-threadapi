
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
/**
 * 
 * @returns {Promise<Sequelize>}
 */
export async function loadSequelize() {
    try {
        const login = {
            database: "app-database",
            username: "root",
            password: "root"
        };
        // ----  0. Connexion au serveur mysql ---- 
        // Connexion à la BDD
        const sequelize = new Sequelize(login.database, login.username, login.password, {
            host: '127.0.0.1',
            dialect: 'mysql'
        });

        // ----  1. Création de tables via les models ---- 
        // Création des models (tables) -------------//

        const Comment = sequelize.define("Comment", {
            content: DataTypes.TEXT,
            datetime: DataTypes.DATE


        });

        const Post = sequelize.define("Post", {
            title: DataTypes.TEXT,
            content: DataTypes.TEXT,
            datetime: DataTypes.DATE


        });

        const User = sequelize.define("User", {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: {
                type: DataTypes.STRING,
                set(val) {
                    this.setDataValue('password', bcrypt.hashSync(val, 10))
                }
            }
        });
         //
        //         const User = sequelize.define("User", {
        //     username: DataTypes.STRING,
        //     email: DataTypes.STRING,
        //     password: {
        //         type: DataTypes.STRING,
        //         // Hook pour chiffrer le mot de passe avant de le sauvegarder
        //         // +
        //         set(clearPassword) {
        //             const hashedPassword = bcrypt.hashSync(clearPassword, 10);
        //             this.setDataValue('password', hashedPassword);
        //         }
        //     }
        // });


        // les relations les define avant le sync les .create après


        User.hasMany(Comment);//ligne ajoute foreign key
        Comment.belongsTo(User);

        User.hasMany(Post);
        Post.belongsTo(User);

        Post.hasMany(Comment);
        Comment.belongsTo(Post);

        // CREER LES TABLES AVANT LA FONCTION sync !
        // -----------------------------------------//
        await sequelize.sync({ force: true });
        // ----  2. Insertion de lignes ---- 
        // INSERT INTO User
        const newUser = await User.create({
            username: "massinissa",
            email: "massi@mail.com",
            password: "1234"
        });
        // INSERT INTO User
        const newUser2 = await User.create({
            username: "billy",
            email: "billy@mail.com",
            password: "1234"
        });

        // INSERT INTO User
        const newUser3 = await User.create({
            username: "billyetboule",
            email: "billyboule@mail.com",
            password: "1234"
        });

        // INSERT INTO User
        const newUser4 = await User.create({
            username: "legrandcactus",
            email: "legrandcactus@mail.com",
            password: "1234"
        });

        // DELETE User
        // await User.destroy({
        //     where: {
        //         username: "massinissa"
        //     }
        // })



        // Je récupère un utilisateur en fonction de son id
        const userById = await User.findByPk(2);
        console.log(userById);



        // Création d'un post
        const newPost = await Post.create({
            title: "acheter chips",
            content: "pour anniversaire Amaury",
        });

        //création commentaires/comments

        const NewComment = await Comment.create({
            content: "mes commentaires",
            datetime: new Date(Date.now()),
            userId: userById.id,
            postId: newPost.id
        });


        // ---- 3. Sélection de lignes (SELECT) ---- 
        // SELECT * FROM User après ajout des deux users 
        let allUsers = await User.findAll();

        // J'affiche l'email de chaque utilisateur
        allUsers.forEach(user => {
            console.log(user.email)
        });

        // SELECT toutes les tâches d'un utilisateur
        const allUserPosts = await userById.getPosts();
        console.log(allUserPosts.map(post => post.content))
        // SELECT toutes les tâches
        console.log((await Post.findAll()).map(post => post.content));


        // ---- 4. Les méthodes mixins pour créer et accéder aux données lors d'une relation `OneToMany`.-----------//
        // Création de plusieurs tâches à partir d'un utilisateur
        await userById.createPost({ title: "Chien", content: "Sortir le chien" });
        await userById.createPost({ title: "le chat", content: "nourrir le chat" });

        await userById.createComment({ title: "Merveilleux", content: "Il faut acheter les Merveilleux chocolats.Allez-y", datetime : new Date()});
        await userById.createComment({ title: "le chien", content: "Cet spa est merveilleux", datetime : new Date()});




        console.log("Connexion à la BDD effectuée")





        return sequelize;
    } catch (error) {
        console.error(error);
        throw Error("Échec du chargement de Sequelize");
    }

    // ...

}