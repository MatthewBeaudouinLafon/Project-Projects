var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
       if (slides[i] != null) {
        console.log("NOT NULL");
        slides[i].visibility = "hidden";
        slides[i].style.display = "none";
       }
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1;}    
    if (slides[slideIndex-1] != null) {
        console.log("VISIBLE");
        slides[slideIndex-1].visibility = "visible";
        slides[slideIndex-1].style.display = "block";
    }
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}