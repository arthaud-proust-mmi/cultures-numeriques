import "./bootstrap.js";
import "masonry-layout";
import imagesLoaded from "imagesloaded";



const grids = document.querySelectorAll('.grid-masonry');



grids.forEach(grid=>{
    let msnry = new Masonry( grid, {
        // itemSelector: '.grid-item',
        // columnWidth: '.grid-sizer',
        percentPosition: true
    });

    imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });
})