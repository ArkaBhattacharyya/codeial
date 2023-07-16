{
    // method to submit the form data for new post usgin ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success : function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: data.message,
                        timeout: 3000 // Display for 3 seconds
                      }).show();
                    deletePost($(' .delete-post-button', newPost));
                   
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    // create a post in DOM 

    let newPostDom = function(post){
       return $(`<li id="post-${post._id}">

       <p>
           
               <small>
                   <a class="delete-post-button" href="/posts/destroy/${ post._id }">x</a>
               </small>
             
               ${ post.content }
                       <small>
                       ${ post.user.name }
                       </small>
       </p>
       <div class="post-comments">
      
   
               <form action="/comments/create" method="post">
                   <input type="text" name="content" placeholder="Type here to add comment..">
                   <input type="hidden" name="post" value="${ post._id  }">
                   <input type="submit" value="add comment">
               </form>
   
              
                   <div class="post-comments-list">
                       <ul id="post-comments-${ post._id }">
                       </ul>
                   </div>
       </div>
   </li>`)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: data.message,
                        timeout: 3000 // Display for 3 seconds
                      }).show();
                   $(`#post-${data.data.post_id}`).remove();
                  
                }, error: function(err){
                    console.log(err.responseText);
                }


            });
        })
    }

    createPost();
}