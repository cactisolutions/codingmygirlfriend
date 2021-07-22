window.onload = () => {

    function addData(){
        var btn = document.getElementById("addItemBtn");
        btn.addEventListener("click",()=>{
            const titleJava = document.getElementById("titleAdd").val();
            const usernameJava = document.getElementById("usernameItemAdd").val();
            const descriptionJava = document.getElementById("descriptionAdd").val();
            const imageJava = document.getElementById("imageAdd").val();
            const priceJava = document.getElementById("priceAdd").val();
            const statusJava = document.getElementById("statusAdd").val();
            let alterData = {
                image:imageJava,
                status:statusJava,
                title:titleJava,
                description:descriptionJava,
                price:priceJava,
                username:usernameJava,
            }
            alterData= JSON.stringify(alterData);
            $.ajax({
                url: '/add/item/USERNAME',
                data:{product: alterData},
                method:'POST',
                success: function( result ) {
                }
            });
    
        });
        btn.addEventListener("click",()=>{
            const additionalUsername = document.getElementById("usernameAdd").val();
            const additionalPassword =  document.getElementById("passwordAdd").val();
            let additionalUser = {
                listings:[],
                purchases:[],
                password: additionalPassword,
                username: additionalUsername,
            }
            additionalUser = JSON.stringify(additionalUser);
    
            $.ajax({
                url: '/add/user/',
                data:{person: additionalUser},
                method:'POST',
                success: function( result ) {
                }
            });
          
        });
    }
    addData();
}

