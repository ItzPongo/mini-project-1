const express = require('express');
const os = require('os');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let posts = [];
let postId = 1;

// Home page - show all posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Form to create a new post
app.get('/new', (req, res) => {
  res.render('new');
});

// Create a new post
app.post('/create', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send('All fields are required.');
  }
  posts.push({
    id: postId++,
    title,
    content,
    author,
    timestamp: new Date().toLocaleString()
  });
  res.redirect('/');
});

// View a single post
app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

// Form to edit a post
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  res.render('edit', { post });
});

// Update a post
app.post('/update/:id', (req, res) => {
  const { title, content, author } = req.body;
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  post.title = title || post.title;
  post.content = content || post.content;
  post.author = author || post.author;
  post.timestamp = new Date().toLocaleString();
  res.redirect('/');
});

// Delete a post
app.post('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id !== Number(req.params.id));
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  Object.entries(interfaces).forEach(([name, iface]) => {
    iface.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`Accessible at http://${details.address}:${PORT}`);
      }
    });
  });
  console.log(`Server running at http://localhost:${PORT}`);
});