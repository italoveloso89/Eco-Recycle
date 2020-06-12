const express = require("express")
const server = express()

//get database
const db = require("./database/db")

server.use(express.static("public"))

//enable req.body
server.use(express.urlencoded({ extended: true }))

//template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server, 
    noCache: true
})


//initial page
server.get("/", (req, res) =>{
   return res.render("index.html", { title: "Um Titulo"})
})

server.get("/create-point", (req, res) =>{

   

   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

       const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)


   
})

server.get("/search", (req, res) =>{


    const search = req.query.search

    if(search == ""){
        // empty search result
        return res.sender("search-results.html", {total: 0})
    }

   //get data from database
   db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
      if(err){
          return console.log(err)
       }

      console.log("Aqui estão seus registros: ")
      console.log(rows)
      const total = rows.length
      // shoow html page with data from database
      return res.render("search-results.html", { places: rows, total:total })
    }) 
 })

//turn on server
server.listen(3000)