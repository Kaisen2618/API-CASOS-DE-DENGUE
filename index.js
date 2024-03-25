const express = require('express');
const mysql = require('mysql')

const app = express()
const port = 3333;

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'casos_dengue'
})

// Conectar ao banco de dados
db.connect((err) => {
    if (err){
        console.error('Erro ao conectar ao banco de dados:', err); 
    } else {
        console.log('Conectado ao banco de dados MySQL'); 
    }
})

// Rota para obter todos os usuários
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if(err){
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        } else {
            res.json(result);
        }
    })
})


// Middleware para lidar com JSON
app.use(express.json());

// Rota para salvar um novo usuário
app.post('/users', (req, res) => {
    const { nome } = req.body;

    // Executar a consulta SQL para inserir o usuário
    const sql = 'INSERT INTO users (nome) VALUES (?)';
    db.query(sql, [nome], (err, results) => {
      if (err) {
        console.error('Erro ao inserir usuário no banco de dados:', err);
        res.status(500).json({ error: 'Erro ao salvar usuário' });
      } else {
        console.log('Usuário salvo com sucesso!');
        res.status(201).json({ message: 'Usuário salvo com sucesso' });
      }
    });
  });

    // Rota para atualizar um usuário
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, email } = req.body;
  
    if (!nome && !email) {
      return res.status(400).json({ mensagem: 'Nenhum dado fornecido para atualização' });
    }
  
    const updateUser = {};
    if (nome) updateUser.nome = nome;
    if (email) updateUser.email = email;
  
    const query = 'UPDATE users SET ? WHERE id = ?';
    
    db.query(query, [updateUser, userId], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário: ' + err.stack);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }
  
      return res.json({ mensagem: 'Usuário atualizado com sucesso' });
    });
  });

  // Rota para excluir um usuário
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
  
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Erro ao excluir usuário: ' + err.stack);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }
  
      return res.json({ mensagem: 'Usuário excluído com sucesso' });
    });
  });

  // Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`)
})