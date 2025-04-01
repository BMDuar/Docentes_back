const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Conectar ao MySQL
const db = mysql.createConnection({
    host: "localhost",  
    user: "root",       
    password: "1234",   
    database: "docentes"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

// Rota para obter todos os docentes
app.get("/docentes", (req, res) => {
    db.query("SELECT * FROM docentes", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

//Rota para procurar matrícula
app.get("/docentes/:matricula", (req, res) => {
    const { matricula } = req.params;
    db.query("SELECT * FROM docentes WHERE matricula = ?", [matricula], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar docente" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Docente não encontrado" });
      }
      res.json(results[0]);
    });
  });
  

// Rota para adicionar um docente
app.post("/docentes/criar", (req, res) => {
    const { matricula, nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso, status } = req.body;
    const sql = "INSERT INTO docentes (matricula_doc, nome_doc, email_doc, data_nasci_doc, data_adimissao_doc, situacao_doc, area_concurso_doc, status_doc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    console.log(status)
    

    db.query(sql, [matricula, nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso, status], (err, result) => {
        if (err) {
            console.error("Erro ao inserir no MySQL:", err.sqlMessage || err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, message: "Docente adicionado com sucesso!" });
        }
    });
});

//Rota para atualizar docentes
app.put("/docentes/editar/:matricula", (req, res) => {
    
    const { matricula,nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso, status } = req.body;
    console.log(status)
    console.log(req.body)
  
    const sql = "UPDATE docentes SET nome_doc=?, email_doc=?, data_nasci_doc=?, data_adimissao_doc=?, situacao_doc=?, area_concurso_doc=?, status_doc=? WHERE matricula_doc=?";
    db.query(sql, [nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso,status, matricula], (err) => {
      if (err) { 
        console.log(err)
        return res.status(500).json({ error: "Erro ao atualizar docente" });
      }
      res.json({ message: "Docente atualizado com sucesso!" });
    });
  });

  //Rota para excluir docentes
  app.delete("/docentes/excluir",(req, res) =>{
    const {matricula, nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso, status} = req.body
    const sql = "DELETE from docentes where matricula_doc = ?;";
    db.query(sql, [nome, email, dataNascimento, dataAdmissao, situacao, areaConcurso,status, matricula], (err) => {
      if (err) { 
        console.log(err)
        return res.status(500).json({ error: "Erro ao atualizar docente" });
      }
      res.json({ message: "Docente atualizado com sucesso!" });
    });
  })
  

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});