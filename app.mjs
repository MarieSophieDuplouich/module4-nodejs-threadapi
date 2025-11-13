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





        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });


    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
main();



//////code cours Massi ci-dessous


import { Sequelize, DataTypes } from "sequelize";

async function main() {
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
        const Task = sequelize.define("Task", {
            title: DataTypes.TEXT,
            content: DataTypes.TEXT
        });

        User.hasMany(Task);
        Task.belongsTo(User);



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

        // Création d'une tâche de façon traditionnelle
        const otherTask = await Task.create({
            title: "Faire les courses",
            content: "Du savon, des frites et une Xbox 360",
            UserId : userById.id
        });


        // ---- 4. Les méthodes mixins pour créer et accéder aux données lors d'une relation `OneToMany`.-----------//
        // Création de plusieurs tâches à partir d'un utilisateur
        await userById.createTask({ title: "Chien", content: "Sortir le chien" });
        await userById.createTask({ title: "le chat", content: "nourrir le chat" });


        // SELECT toutes les tâches d'un utilisateur
        const allUserTasks = await userById.getTasks();

        console.log(allUserTasks.map(task=>task.content))
        // SELECT toutes les tâches
        console.log((await Task.findAll()).map(task=>task.content));




    } catch (error) {
        console.log(error);
        throw new Error("Impossible de se connecter à la base de données");

    }
}
main()