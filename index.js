const express = require("express")
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 

const url = "mongodb://localhost:27017/mydb"

MongoClient.connect(url, (err, client) => {
    if (err) {
        throw err
    }

    app.get("/", (req, res) => {
        let db = client.db("announcementDB")
        db.collection("announcement").deleteMany( {name : "dddddddddddddddddd"} )

        res.send("OK")
    })

    app.get("/getAnnouncementsList", (req, res) => {
        let limit = req.query.limit
        let sortBy = req.query.sortBy
        let page = req.query.page

        let sortingRequirements;

        if (sortBy) {
            if (sortBy == "price-asc") {
                sortingRequirements = {price : 1}
            } else if (sortBy == "price-desc") {
                sortingRequirements = {price : -1}
            } else if (sortBy == "date-asc") {
                sortingRequirements = {date : -1}
            } else {
                sortingRequirements = {date : 1}
            }
        }
        
        let db = client.db("announcementDB")
        db.collection("announcement").find({}).sort(sortingRequirements).skip(parseInt(page) * parseInt(limit)).limit(parseInt(limit)).toArray((err, result) => {
            if (err) {
                throw err
            }

            let listOfAnnouncements = []
            for (let i = 0; i < result.length; i++) {
                let announcement = {}
                announcement.name = result[i].name
                announcement.image = result[i].images[0]
                announcement.price = result[i].price

                listOfAnnouncements[i] = announcement
            }

            res.send(result)
        })
    })

    app.get("/getAnnouncement", (req, res) => {
        let id = req.query.id
        let fields = req.query.fields

        let db = client.db("announcementDB")
        db.collection("announcement").findOne( {_id : new ObjectId(id)} , (err, result) =>{
            if (err) {
                res.send({status: err.code, message: err.message})
                throw err
            } else if (!result) {
                res.send({status: 400, message: "Bad request"})
            }

            let announcement = {}
            announcement.name = result.name
            announcement.price = result.price
            announcement.images = result.images[0]

            if (fields == "1") {
                announcement.description = result.description
                announcement.images = result.images
            }

            res.send(announcement)
        })
    })

    app.get("/createAnnouncement", (req, res) => {
        let html = `
            <form action='/create'>
                <input placeholder='Name' name='name'>
                <input placeholder='Description' name='description'>
                <input placeholder='Image 1' name='image1'>
                <input placeholder='Image 2' name='image2'>
                <input placeholder='Image 3' name='image3'>
                <input placeholder='Price' name='price'>
                <input type='submit'>
            </form>
        `

        res.send(html)
    })

    app.get("/create", (req, res) => {
        let date = Date.now()
        let name = req.query.name
        let description = req.query.description
        let image1 = req.query.image1
        let image2 = req.query.image2
        let image3 = req.query.image3
        let price = parseInt(req.query.price)

        if (name.length > 200) {
            res.send({status : 400, message : "Name must be no more than 200 characters"})
        } else if (!name.length > 0) {
            res.send({status : 400, message: "Write the name of your announcement"})
        } else if (description.length > 1000) {
            res.send({status : 400, message : "Description must be no more than 200 characters"})
        } else if (!description > 0) {
            res.send({status : 400, message: "Write the description of your announcement"})
        } else if (image1 == "" && image2 == "" && image3 == "") {
            res.send({status : 400, message : "Add at least one image"})
        } else if (Number.isNaN(price)) {
            res.send({status: 400, message : "Indicate the price"})
        } else {

            let image = [image1, image2, image3]
            let images = []
            let j = 0;
            for (let i = 0; i < image.length; i++) {
                if (image[i] != "") {
                    images[j] = image[i]
                    j++
                }
            }

            let announcement = {
                name,
                description,
                images,
                date,
                price
            }

            let db = client.db("announcementDB")
            let collection = db.collection("announcement")
            collection.insertOne(announcement, (err, result) => {
                if (err) 
                    res.send("Error ", err.code)

                res.send("ID: " + result.insertedId + ", Success, Code: 200")
            })
        }
    })
})

app.listen(3000);