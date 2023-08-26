const express = require('express');
const app = express();
const port = 2706;
const jsonParser = express.json();
const fs = require('fs');

app.use(express.static(__dirname + "/public"))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

// GET  __ /api/product         - ALL PRODUCTS
app.get('/api/product', (req, res) => {
    // повертаю масив в форматі json на клієнта
    fs.readFile('./database.json','utf-8',(err,data)=>{
        let jsonRes = JSON.parse(data);
        res.json(jsonRes)
    })
})

// GET  __ /api/product/:id     - one PRODUCT
app.get('/api/product/:id', (req, res) => {
    fs.readFile('./database.json','utf-8',(err,data)=>{
        const product = JSON.parse(data).find(p=>p.id == req.params.id);
        product?res.json(product):res.json({message: 'not found'})
    })
})

// POST __ /api/create          - add product
app.post('/api/create',jsonParser,(req,res)=>{
    let product;
    fs.readFile('./database.json','utf-8',(err,data)=>{
        let parseJsonProduct = JSON.parse(data),
        lastId = parseJsonProduct[parseJsonProduct.length - 1].id+1;
        product = {
            id: lastId,
            name: req.body.name,
            price: req.body.price
        };
        fs.readFile('./database.json', 'utf-8', (err, data) => {
            if (err) throw err;
            const products = JSON.parse(data);
            products.push(product);
            fs.writeFile('./database.json', JSON.stringify(products, null, 2), 'utf-8', (err) => {
                if (err) throw err;
                console.log('Updated!');
            });
            res.json(products);
        });
    })
})

// DELETE __ /api/delete/:id    - delete product
app.delete('/api/delete/:id',(req,res)=>{
    fs.readFile('./database.json','utf-8',(err,data)=>{
        let product = JSON.parse(data);
        let erro = product.find(p=>p.id == req.params.id);
        if(erro === undefined) {res.json({message:"error"})};
        product = product.filter((p)=>p.id != req.params.id);
        fs.writeFileSync('./database.json',JSON.stringify(product));
        res.json(product)
    })
})

// PUT __ /api/update/:id       - update product
app.put('/api/update/:id',jsonParser,(req,res)=>{
    fs.readFile('./database.json','utf-8',(err,data)=>{
        let product = JSON.parse(data);

        let erro = product.find(p=>p.id == req.params.id);
        if(erro === undefined) {res.json({message:"error"})};

        let updateIndex = product.findIndex(p=>p.id == req.params.id);
        product[updateIndex].name = req.body.name;
        product[updateIndex].price = req.body.price;
        fs.writeFileSync('./database.json',JSON.stringify(product));
        console.log(product);
        res.json(product)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})