
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
            title: {
                type: DataTypes.STRING,
                allowNull: false,

                validate: {
                    len: [3, 300]
                },

            },
            content: {
                type: DataTypes.TEXT,

                validate: {
                    len: [3, 300],

                },
            },

            datetime: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,

                validate: {
                    isAfter: "2011-11-05"

                }

            },
            UserId: {
                type: DataTypes.INTEGER,
                allowNull: false,

            }

        });

        const Post = sequelize.define("Post", {
            title: {
                type: DataTypes.STRING,
                allowNull: false,

                validate: {
                    len: [3, 300]
                },
            },


            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [3, 300]
                },
            },

            datetime: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,

                validate: {
                    isAfter: "2011-11-05"

                }


            }



        });

        const User = sequelize.define("User", {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,



            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,

                validate: {
                    isEmail: true,

                },
            },


            password: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    len: [10],
                    // is: /^[a-z]+$/i,
                       is : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{10,}$/,
                },

                set(val) {
                    this.setDataValue('password', bcrypt.hashSync(val, 10))
                    //le 10 c'est hashé dix fois
                }
            }
        });


        // les relations les define avant le sync les .create après

        User.hasMany(Comment, {
            foreignKey: {
                allowNull: false
            }
        });//ligne ajoute foreign key
        Comment.belongsTo(User);

        User.hasMany(Post, {
            foreignKey: {
                allowNull: false
            }
        });
        Post.belongsTo(User);

        Post.hasMany(Comment, {
            foreignKey: {
                allowNull: false
            }
        });
        Comment.belongsTo(Post);

        // CREER LES TABLES AVANT LA FONCTION sync !
        // -----------------------------------------//
        await sequelize.sync({ force: true });
        // ----  2. Insertion de lignes ---- 
        // INSERT INTO User
        const newUser = await User.create({
            username: "massinissa",
            email: "massi@mail.com",
            password: "1234hcfshfgufrLLOLIH__"
        });
        // INSERT INTO User
        const newUser2 = await User.create({
            username: "billy",
            email: "billy@mail.com",
            password: "1234hcfshfgufrLLOLIH__"
        });

        // INSERT INTO User
        const newUser3 = await User.create({
            username: "billyetboule",
            email: "billyboule@mail.com",
            password: "1234hcfshfgufrLLOLIH__"
        });

        // INSERT INTO User
        const newUser4 = await User.create({
            username: "legrandcactus",
            email: "legrandcactus@mail.com",
            password: "1234hcfshfgufrLLOLIH__"
        });

        // DELETE User
        // await User.destroy({
        //     where: {
        //         username: "massinissa"
        //     }
        // })



        // Je récupère un utilisateur en fonction de son id
        const userById = await User.findByPk(1);
        console.log(userById);



        // Création d'un post
        const newPost = await Post.create({
            title: "acheter chips",
            content: "pour anniversaire Amaury",
            datetime: new Date(),
            UserId: userById.id
        });

        //création commentaires/comments

        // const newComment = await Comment.create({
        //     content: "mes commentaires",
        //     datetime: new Date(Date.now()),
        //     userId: userById.id,
        //     postId: newPost.id
        // });


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
        const p1 = await userById.createPost({ title: "Chien", content: "Sortir le chien", datetime: new Date() });
        const p2 = await userById.createPost({ title: "le chat", content: "nourrir le chat", datetime: new Date() });

        await userById.createComment({ title: "Merveilleux", content: "Il faut acheter les Merveilleux chocolats.Allez-y", datetime: new Date(), PostId: p1.id });
        await userById.createComment({ title: "le chien", content: "Cet spa est merveilleux", datetime: new Date(), PostId: p2.id });


        console.log("Connexion à la BDD effectuée")


        return sequelize;
    } catch (error) {
        console.error(error);
        throw Error("Échec du chargement de Sequelize");
    }



}