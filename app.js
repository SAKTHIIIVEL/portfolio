const express = require('express');
const app = express();
const body_praser = require('body-parser');
const path = require('path');
const router = express.Router();
const mysql = require('mysql2');
const { render } = require('pug');
const { log } = require('console');

app.use(body_praser.urlencoded(extended=false));
// for database connection
const conn = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'portfolio',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});
//this enables promising based queries
const promisePool = conn.promise();

app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','pug')

const projects = [
    {
      id:1,  
      title: 'Expense Tracker using Python',
      description: 'A GUI-based Expense Tracker using Python Tkinter Module and SQLite3 Database.',
      image: '/assets/project1/project1.png',
      link: '#',
      img_prj:['/assets/project1/project1.png','/assets/project1/structure.png','/assets/project1/databse.png','/assets/project1/adding.png','/assets/project1/saved.png','/assets/project1/selected.png','/assets/project1/UPDATED.png','/assets/project1/total.png'],
      features:['This can Track Your Daily Expenses','You can check your balance amount from your salary','We can Update,Delete,Read and Insert the expenses made by you'],
      technologies:['Python is Used for logic','TKINTER in python is used for Design','Sqlite3 is used to store the data securely'],
      challenges:['Making databse to them securely store the data of user'],
      outcomes:['Making a Impressive GUI of Expense Tracker']

    },
    { id:2,
      title: 'KFC Website Clone',
      description: 'A clone website of KFC built using Bubble.io. Includes home, menu, cart, and menu details pages.',
      image: '/assets/project2/project2.png',
      link:  '#',
      img_prj:['/assets/project2/project2.png','/assets/project2/project2_login.png','/assets/project2/project2_signup.png','/assets/project2/project2_menu.png','/assets/project2/project2_menu_detail.png','/assets/project2/project2_success.png'],
      features:['This website got some responsive designs','The user can login as admin as well as customer','Securely storing the user\'s Data'],
      technologies:['Bubble.io is a platform used to create web application','Live databases are used'],
      challenges:['Making them Responsive for all screens'],
      outcomes:['The clone of the famous KFC website has been created']
    },
    { id:3,
      title: 'Ecommerce Website',
      description: 'A basic ecommerce website with responsive design built using HTML, CSS, and JavaScript.',
      image: '/assets/project3/project3.png',
      img_prj:['/assets/project3/project3.png','/assets/project3/project3_collection.png','/assets/project3/project3_contact.png'],
      link: 'https://sakthiecommerce.netlify.app/',
      features:['A online platform to purchase','A responsive navbar is given ','User can fill the contact form'],
      technologies:['HTML for th ewebsite structuring','CSS for designing aspects','javascript for the responsive navbar'],
      challenges:['Making them responsive with max-width'],
      outcomes:['Making a Impressive Creation of Static Ecommerce Website']
    }
  ];
  
  var admin = false;
router.get('/',(req,res)=>{
    res.status(200).render('index',{
        page:"home",projects,admin
    })
})

// for Admin login

router.get('/login',(req,res)=>{ 
    res.status(200).render('login',{
        page:"contacts",admin
    })
})

router.post('/login',(req,res)=>{
    console.log(req.body)
    const{username,password}= req.body;
    if(username == 'admin' && password == '12345'){
        admin = true
        res.redirect('/');
    }
    else{
        res.status(200).render('login',{
            page:"contacts",info:'User name and password invalid'
        })

    }   
})


router.get('/projects/:id',(req,res)=>{
    const pid=parseInt(req.params.id);
    const project = projects.find((p)=>p.id == pid); 
    if(project){
    res.render('project1',{
        page:'projects',project,admin
    })
}
})


// this inserted the data
router.post('/contact',async(req,res)=>{
    try{
    console.log(req.body);
    const {name , email,message}=req.body;
    const validName = name || null; // If name is undefined or empty, set it to null
    const validEmail = email || null; // If email is undefined or empty, set it to null
    const validMessage = message || null;
    
        const[rows] = await promisePool.execute(
            'INSERT INTO contacts (name, email,msg) VALUES (?, ?,?)',[validName, validEmail, validMessage]
        );
    
    res.status(200).render('contact_success',{
        name, email,page:'contact'
    })
}catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Internal Server Error');
}
});

//to display the data
router.get('/contacts', async(req,res)=>{
    try {
        const [rows] = await promisePool.execute('SELECT * FROM contacts');
        res.status(200).render('contacts',{
            contacts:rows,page:'contacts'
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }

});



router.use((req,res)=>{
    res.status(404).render('404')
})

app.use(router);

app.listen(4050);