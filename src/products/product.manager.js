import fs from "fs";

export default class ProductManager {

    constructor(path) {
        this.path = path
    }

    async addProduct(obj) {
        try {
            const product = {
                ...obj
            };
            const productsFile = await this.getProducts();
            const productExists = productsFile.find((p) => p.title === product.title);
            if (productExists) return "este producto ya existe"
            productsFile.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile)) //aca guarda en formato json
            return productsFile
        }
        catch (error) {
            console.error(error)
        }
    }

    async getProducts(limit) {
        try {
            if (fs.existsSync(this.path)) { //verifica si existe el archivo
                const productsFile = await fs.promises.readFile(this.path, "utf-8") //lee el archivo que esta como cadena de texto
                const products = JSON.parse(productsFile) //pasamos a js
                if(limit>0){
                    return products.slice(0, limit);
                }
                return products;
            }
            else {
                return []
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async getProductsById(id) {
        try {
            const productsFile = await this.getProducts();
            const productId = productsFile.find((p) => p.id === id)
            if (productId) {
                return productId
            }
            else return null
        } catch (error) {
            console.error(error)
        }


    }

    async deleteProduct(id) {
        try {
            const productsFile = await this.getProducts();
            const productExist = await this.getProductsById(id)
            if (productExist) {
                const newArray = productsFile.filter((u) => u.id !== id)
                await fs.promises.writeFile(this.path, JSON.stringify(newArray))
                return productExist
            }
        } catch (error) {
            console.error(error)
        }
    }

    async updateProduct(obj, id) {
        try {
            const products = await this.getProducts()
            let productExist = await this.getProductsById(id)
            if (!productExist) return null
            productExist = { ...productExist, ...obj }
            const newArray = products.filter((p) => p.id !== id)
            newArray.push(productExist)
            await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            return productExist
        } catch (error) {
            console.error(error)
        }
    }
}
