import { Sequelize, DataTypes } from "sequelize";

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
        const User = sequelize.define("User", {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
        });

        const Comment = sequelize.define("Comment", {
            content: DataTypes.TEXT,
            datetime: DataTypes.DATE,
            userId: DataTypes.ID.FOREIGNKEY,
            postId: DataTypes.ID.FOREIGNKEY

        });

        const Post = sequelize.define("Post", {
            title: DataTypes.TEXT,
            content: DataTypes.TEXT,
            datetime: DataTypes.DATE,
            userId: DataTypes.ID.FOREIGNKEY

        });


        //comment s'appelle cette partie ?
        User.hasMany(Comment);
        Comment.belongsTo(User);

        User.hasMany(Post);
        Post.belongsTo(User);

        Post.hasMany(Comment);
        Comment.belongsTo(Post);

         


        // Création d'un post
        const otherPost = await Post.create({
            title: "Faire les courses",
            content: "Du savon, des frites et une Xbox 360",
            userId : userById.id
        });

                 // ---- 4. Les méthodes mixins pour créer et accéder aux données lors d'une relation `OneToMany`.-----------//
        // Création de plusieurs tâches à partir d'un utilisateur
        await userById.createPost({ title: "Chien", content: "Sortir le chien" });
        await userById.createPost({ title: "le chat", content: "nourrir le chat" });


        
        //création commentaires/comments

        const otherComment  = await Comment.create({
            content: "mes commentaires",
            datetime: "16/11/2024",
            userId : userById.id,
            postId: otherPost.id
        });





        

               // CREER LES TABLES AVANT LA FONCTION sync !
        // -----------------------------------------//
        await sequelize.sync({ force: true });
        console.log("Connexion à la BDD effectuée")
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

        // DELETE User
        await User.destroy({
            where: {
                username: "massinissa"
            }
        })

      
        // ---- 3. Sélection de lignes (SELECT) ---- 
        // SELECT * FROM User après ajout des deux users 
        let allUsers = await User.findAll();

        // J'affiche l'email de chaque utilisateur
        allUsers.forEach(user => {
            console.log(user.email)
        });

        // Je récupère un utilisateur en fonction de son id
        const userById = await User.findByPk(2);
        console.log(userById);



        // SELECT toutes les tâches d'un utilisateur
        const allUserPosts = await userById.getPosts();

        console.log(allUserPosts.map(post=>post.content))
        // SELECT toutes les tâches
        console.log((await Post.findAll()).map(post=>post.content));


  
        return sequelize;
    } catch (error) {
        console.error(error);
        throw Error("Échec du chargement de Sequelize");
    }

    // ...

}