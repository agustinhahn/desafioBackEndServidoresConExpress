import express from "express"
import ProductManager from "./products/product.manager.js"

const productManager = new ProductManager("./products.json")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get("/products", async(req,res)=>{
    try {
        let limit = req.query.limit ? parseInt(req.query.limit): 0
        const products = await productManager.getProducts(limit)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

app.get("/products/:id", async(req,res)=>{
    try {
        const {id} = req.params
        const productById= await productManager.getProductsById(id)
        if(!productById) res.status(404).json({msg:"product not found"})
        else res.status(200).json(productById)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

const PORT =8081
app.listen(PORT,()=>console.log(`server ok on port ${PORT}`))