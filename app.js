var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
//App Config----------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/blogPost', { useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"))
//Mongoose/Model/Config-------------------------------------------------
var blogSchema=new mongoose.Schema({
   name:String,
   image:String,
   body:String,
   created:{type:Date, default:Date.now}
});

var blog=mongoose.model("blog", blogSchema);
/*
blog.create({
    name:"Chihuahua",
    image:"https://animalso.com/wp-content/uploads/2017/01/teacup-chihuahua_6.jpg",
    body:"Insight On the world's not so smallest dogs"

});
*/

app.get("/", function(req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
   blog.find({}, function(err, allBlogs){
      if(err){
          res.render("new.ejs");
      }else{
          res.render("index.ejs", {allBlogs:allBlogs});  
      }
   });
   
});

app.post("/blogs", function(req, res){
    var title=req.body.title;
    var image= req.body.image;
    var description=req.body.description;
    var freshBlog={name:title, image:image, body:description };
   blog.create(freshBlog, function(err, newBlog){
       if(err){
           console.log(err);
       }else{
           res.redirect("/blogs");
       }
   }); 
});

app.get("/blogs/new", function(req, res){
   res.render("new.ejs"); 
});

app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show.ejs", {foundBlog:foundBlog});
        }
    });
});    

app.get("/blogs/:id/edit", function(req, res){
   blog.findById(req.params.id,function(err, foundBlog){
       if(err){
           console.log(err);
       }else{
           res.render("edit.ejs",{foundBlog:foundBlog})
       }
   }) 
});

app.put("/blogs/:id", function(req, res){
    var name=req.body.title;
    var image=req.body.image;
    var body=req.body.description;
    var updatedBlog={name:name, image:image, body:body}
    blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, updatedBlog){
           if(err){
               res.redirect("/blogs");
           }else{
               res.redirect("/blogs/:updatedBlog._id");
           }
    });
});

app.delete("/blogs/:id", function(req, res){
    blog.findOneAndDelete(req.params.id, function(err, deleteBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("The Server has started");
});


