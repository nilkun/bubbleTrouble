// Very bare bone asset loader

export default class AssetManager {
    constructor() {
        this.image = {};
    }

    // Loads all images and then runs a callback function
    init(directory, imagePaths, callback) {

        this.images = [];

        let counter = 0;
        let image;
        let name;

        imagePaths.forEach(path => {            
            image = new Image();
            image.src = directory + path;

            // Extract filename
            name = path.substring(path.lastIndexOf("/") + 1, path.length - 4);
            this.image[name] = image;
            
            image.onload = () => { 
                counter++;
                if(counter >= imagePaths.length) {
                    callback();
                };
            }
        });
    }   
}