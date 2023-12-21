//importing other libraries and configurations
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./Models/bookmodel.js";
const app = express();  //initializing express to app
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        msg: "welcome to the book store"
    })
}
)
//Route for getting all books present in the store
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({})
        res.status(200).json({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})
//Route for getting one book by Id
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Book.findById(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})
//Route for updating a book
app.put('/books/:id', async (req, res) => {
    try {
        if (!req.body.title ||
            !req.body.author ||
            !req.body.publishyear) {
            return res.status(501).send({ message: 'send all book inputs' });
        }

        const { id } = req.params;
        const result = await Book.findByIdAndUpdate(id, req.body);
        if (!result) {
            return res.status(400).json({ message: "book not found" })
        }
        return res.status(200).json({
            message: "book updated successfullyy"
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })
    }
})
//Route for deleting a book by id
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }
        return res.status(200).send({ message: "Book deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
})
//Route for creating a new book in the store
app.post('/books', async (req, res) => {
    try {
        if (!req.body.title ||
            !req.body.author ||
            !req.body.publishyear) {
            res.status(501).send({ message: 'send all book inputs' });
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishyear: req.body.publishyear
        }
        const book = await Book.create(newBook);
        return res.status(200).send(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})
//connecting mongodb
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("database connection successful");
        app.listen(PORT, () => {
            console.log(`port is listening to ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })
